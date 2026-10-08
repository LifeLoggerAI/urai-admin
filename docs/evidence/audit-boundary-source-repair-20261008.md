# Admin audit boundary source repair

Prepared 2026-10-08 against the admitted Admin owner source
`7e28faf52400ea6f24b874577c144caa766dab4b`. This is a source repair and
test preparation receipt, not production, privacy, independent-review or
recovery acceptance. The existing owner and release controllers are preserved.

The protected audit POST now applies the canonical mutation-origin/session
guard, validates an object payload and nonempty action/target identifiers,
derives the actor from the verified session, removes arbitrary target fields,
and minimizes metadata before calling the existing required durable audit
writer. A failed durable write returns 500 rather than success. Invalid JSON
and invalid shapes return 400; responses use no-store. Error logging contains
only a fixed description.

The protected audit GET returns actual Firestore document identifiers and an
explicit operational field set. Legacy raw payloads, arbitrary metadata and
sensitive credentials/transcripts are removed or redacted. It preserves safe
role/session/mutation identifiers and before/after evidence. It does not mutate
stored historical records, erase audits or weaken legal-hold/retention gates.
It uses no-store and reports an unavailable datastore as 500 without logging
the raw error.

All three immutable client audit/event collections now require the authenticated
actor UID, an action string and matching actor email when supplied, alongside
the existing active canonical owner/admin and timestamp checks. Existing
immutable update/delete denials remain. Admin SDK writes retain their existing
server authority.

The same 15 behavior cases run against the original source and this repair on
Node 22.23.3. Original: 5 passed, 10 failed. Repair: 15 passed, 0 failed.
The tests load the actual TypeScript route handlers and Firebase audit library
with explicit synthetic SDK/session adapters. They cover session/role denial,
cross-origin rejection, durable-write failure, invalid payload/JSON, verified
actor attribution, recursive private-field removal, actual document identity,
datastore failure and content-free error behavior. They are not live provider
or cloud lifecycle tests. The helper passes a standalone strict TypeScript
check; the actual emulator runner passes JavaScript syntax checking.

The existing native Auth/Firestore/Next runtime emulator runner adds actual
positive/foreign-actor/forged-email create cases in each immutable collection,
plus same-origin audit creation, cross-origin rejection, durable persisted actor
readback and a minimized legacy audit GET. The repository app test command runs
the 15 behavior cases. Exact candidate native CI must prove these cases using
the repository's declared dependencies and real emulators before source
admission. No native result is claimed by this preparation note.

Actual authenticated cloud audit journeys, retention/export/restore, installed
monitoring and alert acknowledgement, intended deployed revision and eligible
independent release review remain separate acceptance gates. No production
deploy, provider call, message, new spend or store operation was performed.
