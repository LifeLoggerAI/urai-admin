# Positive institutional receipt verification

The generic institutional decision store at donor parent `5cbccf19f3234291b65116c2ff625a2e90057101` accepted a persisted receipt whose `verificationResult` was `FAIL` when entering `RECEIPT_PERSISTED`. Existence and decision binding alone did not prove the postcondition was accepted. The transition now requires an explicit `PASS` before writing the next state. Failed or other unaccepted receipts remain available as evidence without authorizing task closure.

The added regression executes the actual TypeScript store with an explicit transactional Firestore transport double. Against the parent source, eight tests passed and the new failed-receipt case failed because no rejection occurred. With the repair, all nine behavioral tests pass. Existing positive receipt coverage still reaches `CLOSED` for two distinct reviewers and a separate executor. The failed receipt case rejects with no partial writes and cannot close the task.

This child donor preserves the distinct-principal repair in #94 and leaves release controller #85 untouched, including its independent visual successor `62e3156cc8d01557582e6978d2009aa729a98797`. The parent donor earned native Verify URAI Admin run `37743589698`; that is ancestor evidence, not certification of this changed child head. Exact child native tests and applicable controller review, runtime, deployment and parity gates must be earned separately.

No deployed institutional task, legal signature, financial operation, public communication, independent approval, release-controller integration or production deployment is certified by this local regression.
