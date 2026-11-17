#!/usr/bin/env python3
"""ONE URAI read-only Mission Control pilot. No secrets, deploys, GPU jobs or private data.

This is a review-only bridge to the existing urai-admin institutional control plane.
It is NOT a second production approval authority. Python 3.11+ standard library.
SQLite WAL is local-only for this pilot: never share its database over NFS/multi-host mounts.
The real coordinator requires the existing Admin RBAC and transactional Firestore authority.
"""
import argparse
import datetime as dt
import hashlib
import math
import json
import os
import sqlite3
import sys
import urllib.error
import urllib.request
import uuid
from pathlib import Path

SCHEMA_VERSION = 1
WORKFLOW = ("DISCOVERED", "TRIAGED", "READY", "CLAIMED", "RUNNING", "VERIFYING", "ACCEPTED", "INTEGRATED", "CLOSED")
EXCEPTIONAL = ("BLOCKED", "FAILED", "SUPERSEDED", "CANCELLED", "NEEDS_APPROVAL")
RELEASE_HOLD = True
PRIVATE_WRITES_ENABLED = False
PUBLIC_PR_URL = "https://api.github.com/repos/LifeLoggerAI/urai-spatial/pulls/2118"

def utcnow():
    return dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")

def connect(path):
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(p, timeout=8, isolation_level=None)
    db.execute("PRAGMA journal_mode=WAL")
    db.execute("PRAGMA busy_timeout=8000")
    db.execute("CREATE TABLE IF NOT EXISTS schema_meta(version INTEGER NOT NULL)")
    version = db.execute("SELECT version FROM schema_meta").fetchone()
    if version and version[0] != SCHEMA_VERSION:
        raise RuntimeError("unsupported database schema; fail closed")
    if not version:
        db.execute("INSERT INTO schema_meta(version) VALUES (?)", (SCHEMA_VERSION,))
    db.execute("""CREATE TABLE IF NOT EXISTS tasks(
        id TEXT PRIMARY KEY, dedupe_key TEXT UNIQUE NOT NULL,
        source TEXT NOT NULL, source_sha TEXT NOT NULL, title TEXT NOT NULL,
        state TEXT NOT NULL, priority TEXT NOT NULL DEFAULT 'P0',
        lease_owner TEXT, lease_until TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
        evidence_url TEXT NOT NULL, private_write_allowed INTEGER NOT NULL DEFAULT 0)""")
    db.execute("""CREATE TABLE IF NOT EXISTS events(
        id TEXT PRIMARY KEY, dedupe_key TEXT UNIQUE NOT NULL, task_id TEXT NOT NULL,
        event_type TEXT NOT NULL, source_revision TEXT NOT NULL,
        occurred_at TEXT NOT NULL, evidence_url TEXT NOT NULL, payload_hash TEXT NOT NULL)""")
    db.execute("""CREATE TABLE IF NOT EXISTS attempts(
        id TEXT PRIMARY KEY, task_id TEXT NOT NULL, recorded_at TEXT NOT NULL,
        outcome TEXT NOT NULL, detail TEXT NOT NULL)""")
    return db

def ingest_pr(db, data):
    if not isinstance(data, dict) or data.get("number") != 2118:
        raise ValueError("only canonical Spatial PR #2118 is admitted by this pilot")
    sha = data.get("head", {}).get("sha")
    url = data.get("html_url")
    title = data.get("title")
    if not isinstance(sha, str) or len(sha) != 40 or not all(c in "0123456789abcdef" for c in sha):
        raise ValueError("invalid exact PR head sha")
    if url != "https://github.com/LifeLoggerAI/urai-spatial/pull/2118":
        raise ValueError("unrecognized source URL")
    if not isinstance(title, str) or not title.strip():
        raise ValueError("invalid title")
    state = "BLOCKED" if data.get("draft") or data.get("state") != "open" else "DISCOVERED"
    task_id = "genesis-spatial-pr-2118"
    event_key = "github:urai-spatial:pr:2118:" + sha + ":" + str(data.get("updated_at", ""))
    payload = json.dumps({"sha": sha, "draft": data.get("draft"), "state": data.get("state")}, sort_keys=True)
    stamp = utcnow()
    db.execute("BEGIN IMMEDIATE")
    try:
        db.execute("""INSERT INTO tasks(id,dedupe_key,source,source_sha,title,state,created_at,updated_at,evidence_url)
            VALUES(?,?,?,?,?,?,?,?,?)
            ON CONFLICT(dedupe_key) DO UPDATE SET
            source_sha=excluded.source_sha,title=excluded.title,
            state=CASE WHEN tasks.source_sha<>excluded.source_sha THEN 'BLOCKED' ELSE tasks.state END,
            lease_owner=CASE WHEN tasks.source_sha<>excluded.source_sha THEN NULL ELSE tasks.lease_owner END,
            lease_until=CASE WHEN tasks.source_sha<>excluded.source_sha THEN NULL ELSE tasks.lease_until END,
            updated_at=excluded.updated_at""",
            (task_id, "github:urai-spatial:pr:2118", "GitHub", sha, title[:500], state, stamp, stamp, url))
        before = db.total_changes
        db.execute("""INSERT OR IGNORE INTO events(
            id,dedupe_key,task_id,event_type,source_revision,occurred_at,evidence_url,payload_hash)
            VALUES(?,?,?,?,?,?,?,?)""",
            (str(uuid.uuid4()), event_key, task_id, "github.pr.observed.v1", sha, stamp, url,
             hashlib.sha256(payload.encode()).hexdigest()))
        inserted = db.total_changes > before
        db.execute("COMMIT")
    except Exception:
        db.execute("ROLLBACK")
        raise
    return {"task_id": task_id, "head_sha": sha, "state": state, "new_event": inserted}

def fetch_public_pr():
    request = urllib.request.Request(PUBLIC_PR_URL, headers={
        "User-Agent": "urai-mission-control-readonly-pilot/0.1",
        "Accept": "application/vnd.github+json"})
    with urllib.request.urlopen(request, timeout=12) as response:
        if response.status != 200:
            raise RuntimeError("GitHub source fetch failed closed")
        return json.load(response)

def claim(db, task_id, owner, lease_seconds=60):
    if not isinstance(owner, str) or not owner.strip() or len(owner) > 128 or any(ord(c) < 32 for c in owner) or not isinstance(lease_seconds, int) or not 1 <= lease_seconds <= 300:
        raise ValueError("invalid owner or unbounded lease")
    stamp = utcnow()
    until = (dt.datetime.now(dt.timezone.utc) +
             dt.timedelta(seconds=lease_seconds)).isoformat(timespec="seconds")
    db.execute("BEGIN IMMEDIATE")
    try:
        changed = db.execute("""UPDATE tasks SET lease_owner=?,lease_until=?,state='CLAIMED',updated_at=?
            WHERE id=? AND state='READY' AND (lease_until IS NULL OR lease_until<?)""",
            (owner, until, stamp, task_id, stamp)).rowcount
        db.execute("COMMIT")
        return changed == 1
    except Exception:
        db.execute("ROLLBACK")
        raise

def budget_gate(spent_usd, expected_increment_usd, reported_at, ceiling=400):
    if spent_usd is None or expected_increment_usd is None or reported_at is None:
        return "DENY_MISSING_BILLING_EVIDENCE"
    try:
        amounts = (spent_usd, expected_increment_usd, ceiling)
        if any(not isinstance(v, (int, float)) or isinstance(v, bool) or not math.isfinite(v) for v in amounts):
            return "DENY_INVALID_COST"
        if spent_usd < 0 or expected_increment_usd < 0 or ceiling <= 0:
            return "DENY_INVALID_COST"
        stamp = dt.datetime.fromisoformat(reported_at.replace("Z", "+00:00"))
        now = dt.datetime.now(dt.timezone.utc)
        if stamp.tzinfo is None or stamp > now + dt.timedelta(minutes=5) or now - stamp > dt.timedelta(hours=1):
            return "DENY_STALE_BILLING_EVIDENCE"
        if spent_usd + expected_increment_usd > ceiling:
            return "DENY_BUDGET"
        # Arithmetic check only. No provider authority or permission to create billable workloads.
        return "ALLOW_BUDGET_ONLY"
    except (ValueError, TypeError, OverflowError, AttributeError):
        return "DENY_INVALID_BILLING_EVIDENCE"

def summary(db):
    rows = db.execute("SELECT state,COUNT(*) FROM tasks GROUP BY state").fetchall()
    return {"timestamp": utcnow(), "mode": "READ_ONLY_REVIEW_PILOT",
            "production": "HOLD", "private_memory_writes": "DISABLED",
            "task_states": dict(rows),
            "events": db.execute("SELECT COUNT(*) FROM events").fetchone()[0],
            "attempts": db.execute("SELECT COUNT(*) FROM attempts").fetchone()[0]}

def selftest(db):
    fixture = {"number": 2118, "html_url": "https://github.com/LifeLoggerAI/urai-spatial/pull/2118",
               "head": {"sha": "a" * 40}, "title": "Synthetic review-only sample",
               "draft": True, "state": "open", "updated_at": "2026-11-17T00:00:00Z"}
    first = ingest_pr(db, fixture)
    assert first["new_event"] and first["state"] == "BLOCKED"
    second = ingest_pr(db, fixture)
    assert not second["new_event"]
    assert not claim(db, first["task_id"], "worker-a")
    assert budget_gate(None, 1, None).startswith("DENY")
    assert budget_gate(390, 20, utcnow()) == "DENY_BUDGET"
    assert budget_gate(77, 1, utcnow()) == "ALLOW_BUDGET_ONLY"
    assert budget_gate(float("nan"), 1, utcnow()) == "DENY_INVALID_COST"
    assert budget_gate(1, float("inf"), utcnow()) == "DENY_INVALID_COST"
    assert budget_gate(1, 1, (dt.datetime.now(dt.timezone.utc) + dt.timedelta(hours=2)).isoformat()) == "DENY_STALE_BILLING_EVIDENCE"
    assert summary(db)["private_memory_writes"] == "DISABLED"
    print(json.dumps({"result": "PASS", "checks": 10, "summary": summary(db)}, sort_keys=True))

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=["selftest", "ingest-pr", "status", "budget-check"])
    parser.add_argument("--db", default=os.environ.get("URAI_MISSION_DB", "/tmp/urai-mission-control-review/pilot.sqlite3"))
    parser.add_argument("--spent", type=float)
    parser.add_argument("--increment", type=float)
    parser.add_argument("--reported-at")
    args = parser.parse_args()
    if args.action == "budget-check":
        print(json.dumps({"decision": budget_gate(args.spent, args.increment, args.reported_at)}))
        return
    # Synthetic tests MUST NOT mutate an operational task registry.
    db = connect(":memory:" if args.action == "selftest" else args.db)
    try:
        if args.action == "selftest":
            selftest(db)
        elif args.action == "ingest-pr":
            result = ingest_pr(db, fetch_public_pr())
            print(json.dumps(result, sort_keys=True))
        else:
            print(json.dumps(summary(db), sort_keys=True))
    finally:
        db.close()

if __name__ == "__main__":
    main()
