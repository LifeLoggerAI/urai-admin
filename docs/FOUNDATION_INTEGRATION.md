# URAI Foundation Integration

URAI Admin uses URAI Foundation as the governance, escalation, decision-record, and public-accountability anchor for operator workflows.

## Canonical references

- Foundation repository: `LifeLoggerAI/urai-foundation`
- Public domain target: `https://uraifoundation.org/`
- Governance charter: `https://uraifoundation.org/docs/governance-charter.md`
- Ethical AI principles: `https://uraifoundation.org/docs/ethical-ai-principles.md`
- Transparency framework: `https://uraifoundation.org/docs/transparency-framework.md`
- Risk review process: `https://uraifoundation.org/docs/risk-review-process.md`
- System-of-systems contract: `https://uraifoundation.org/docs/system-of-systems-integration.md`

## Admin alignment requirements

Admin changes should reference Foundation standards when they affect:

- operator review queues;
- moderation, escalation, or approval workflows;
- partner status or compliance decisions;
- audit events or decision logs;
- access-control changes involving high-risk operational authority;
- public accountability, transparency, or release decisions.

## Decision records

Material governance decisions should use the Foundation decision-record template. High-risk AI, privacy, safety, accessibility, or public-interest changes should use the Foundation risk-review template.

## Release gate

Run the admin repo checks defined by this repository. If the change affects Foundation commitments, also verify the Foundation repository:

```bash
git pull origin main
python3 -m unittest discover -s tests
python3 scripts/validate-docs.py
```

## Live-domain caveat

Do not treat `uraifoundation.org` as live on GitHub Pages until DNS no longer resolves to Squarespace and `/sitemap.xml` returns `200`.
