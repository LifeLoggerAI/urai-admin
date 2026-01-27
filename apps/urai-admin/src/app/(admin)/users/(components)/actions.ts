
"use client";

import { getFunctions, httpsCallable } from "firebase/functions";

export async function setUserAdmin(uid: string, admin: boolean) {
  const functions = getFunctions();
  const setAdminClaim = httpsCallable(functions, "setAdminClaim");

  try {
    await setAdminClaim({ uid, admin });
    console.log(`Successfully set admin claim to ${admin} for user ${uid}`);
  } catch (error) {
    console.error("Error setting admin claim:", error);
    throw new Error("Error setting admin claim");
  }
}
