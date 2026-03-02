import { onCall } from "firebase-functions/v2/https"
import { getFirestore, Timestamp } from "firebase-admin/firestore"
import { assertAdminRole } from "./auth"

export const logAdminAction = onCall(async (req) => {
  const { auth, data } = req
  assertAdminRole(auth, ["FOUNDER", "COUNCIL", "ADMIN"])

  const db = getFirestore()

  await db.collection("admin_action_log").add({
    actorUid: auth!.uid,
    actorRole: auth!.token.role,
    action: data.action,
    target: data.target ?? null,
    metadata: data.metadata ?? {},
    timestamp: Timestamp.now(),
  })

  return { ok: true }
})
