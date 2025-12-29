import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { requireAdmin } from "./authz";

// A function to export user data
export const exportUsers = functions.https.onCall(async (data, context) => {
  await requireAdmin(context);

  const users = await admin.auth().listUsers();
  const csv = users.users.map(user => `${user.uid},${user.email},${user.disabled}`).join("\n");

  const bucket = admin.storage().bucket();
  const file = bucket.file(`exports/users_${Date.now()}.csv`);
  await file.save(csv);

  const [url] = await file.getSignedUrl({ action: "read", expires: Date.now() + 1000 * 60 * 60 });

  return { downloadUrl: url };
});
