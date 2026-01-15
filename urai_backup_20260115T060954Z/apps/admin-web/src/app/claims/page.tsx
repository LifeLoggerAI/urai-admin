/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AdminGate from "@/components/AdminGate";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebaseClient";

export default function ClaimsPage() {
  const [claims, setClaims] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const u = auth.currentUser;
      if (!u) return;
      const token = await u.getIdTokenResult(true);
      setClaims(token.claims);
    })();
  }, []);

  return (
    <AdminGate>
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>/claims</h1>
        <pre style={{ background: "#111", color: "#0f0", padding: 16, borderRadius: 8 }}>
{JSON.stringify(claims, null, 2)}
        </pre>
      </main>
    </AdminGate>
  );
}
