import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const userDoc = await adminDb.doc(`users/${decoded.uid}`).get();

    if (!userDoc.exists || userDoc.data()?.disabled) {
        return NextResponse.json({ error: "Forbidden: User is disabled or does not exist" }, { status: 403 });
    }

    // Check for admin role (assumption: role is stored in Firestore)
    // This should be adapted based on the final RBAC model (e.g., custom claims)
    const memberSnap = await adminDb.collectionGroup('members').where('uid', '==', decoded.uid).get();
    const roles = memberSnap.docs.map(doc => doc.data().role);

    if (!roles.includes('admin') && !roles.includes('owner')) {
         return NextResponse.json({ error: "Forbidden: User lacks admin role" }, { status: 403 });
    }

    return NextResponse.json({ uid: decoded.uid, email: decoded.email, roles: roles });

  } catch (error: any) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
  }
}
