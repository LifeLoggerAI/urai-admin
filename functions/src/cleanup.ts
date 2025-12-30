import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";

const db = admin.firestore();

/**
 * Deletes old, read admin notifications to keep the collection clean.
 * Runs every 24 hours.
 */
export const cleanupOldNotifications = onSchedule("every 24 hours", async () => {
  const thirtyDaysAgo = admin.firestore.Timestamp.fromMillis(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const oldNotificationsQuery = db.collection("adminNotifications")
    .where("read", "==", true)
    .where("createdAt", "<", thirtyDaysAgo);

  const snapshot = await oldNotificationsQuery.get();

  if (snapshot.empty) {
    console.log("No old notifications to delete.");
    return null;
  }

  const batch = db.batch();
  snapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });

  await batch.commit();

  console.log(`Deleted ${snapshot.size} old admin notifications.`);
  return null;
});
