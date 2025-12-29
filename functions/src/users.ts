import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { requireAdmin } from "./authz";

export const listUsers = functions.https.onCall(async (data, context) => {
  await requireAdmin(context);
  const users = await admin.auth().listUsers();
  return { users: users.users.map(user => ({ uid: user.uid, email: user.email, disabled: user.disabled })) };
});
