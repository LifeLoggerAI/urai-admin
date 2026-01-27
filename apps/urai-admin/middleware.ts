
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, getApps } from "firebase-admin/app";

// Initialize Firebase Admin SDK
if (getApps().length === 0) {
  initializeApp();
}

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session");

  // If no session cookie, redirect to login
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Verify the session cookie and get the user's claims
  try {
    const decodedClaims = await getAuth().verifySessionCookie(session.value, true);
    const isAdmin = decodedClaims.admin;

    // If the user is not an admin, redirect to not-authorized page
    if (!isAdmin && request.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/not-authorized", request.url));
    }
  } catch (error) {
    // If the session cookie is invalid, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
