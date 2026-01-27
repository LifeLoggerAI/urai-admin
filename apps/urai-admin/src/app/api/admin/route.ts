
import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, getApps } from "firebase-admin/app";
import {
  adminSetMaintenanceMode,
  adminToggleJobsPaused,
  adminToggleExportsPaused,
  adminInvalidateFoundationConfigCache,
} from "./actions";

// Initialize Firebase Admin SDK
if (getApps().length === 0) {
  initializeApp();
}

export async function POST(request: Request) {
  const { action, payload } = await request.json();
  const session = request.headers.get("Authorization")?.split("Bearer ")[1];

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decodedClaims = await getAuth().verifySessionCookie(session, true);
    const isAdmin = decodedClaims.admin;

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    switch (action) {
      case "adminSetMaintenanceMode":
        adminSetMaintenanceMode(payload);
        break;
      case "adminToggleJobsPaused":
        adminToggleJobsPaused(payload);
        break;
      case "adminToggleExportsPaused":
        adminToggleExportsPaused(payload);
        break;
      case "adminInvalidateFoundationConfigCache":
        adminInvalidateFoundationConfigCache();
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
