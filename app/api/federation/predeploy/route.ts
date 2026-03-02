import { NextResponse } from "next/server";
import { verifyNodeRequest } from "@/security/verifyNode";
import { db } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  verifyNodeRequest();

  const body = await req.json();
  const { governanceVersion, governanceHash } = body;

  const authority = await db.doc("system_state/global").get();
  const state = authority.data()!;

  if (
    governanceVersion !== state.governanceVersion ||
    governanceHash !== state.governanceHash ||
    state.freezeState === "NUCLEAR_LOCK"
  ) {
    return NextResponse.json(
      { error: "Predeploy validation failed" },
      { status: 403 }
    );
  }

  return NextResponse.json({ status: "APPROVED" });
}
