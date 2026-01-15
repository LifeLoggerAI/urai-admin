/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
"use client";

import AdminGate from "@/components/AdminGate";
import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions, auth } from "@/lib/firebaseClient";

type Result = { ok: boolean; data?: any; error?: any };

export default function AdminActionsPage() {
  const [uid, setUid] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "user">("admin");
  const [out, setOut] = useState<Result | null>(null);

  async function call(name: string, payload: any) {
    setOut(null);
    try {
      // Force refresh claims so newly-granted admin works instantly
      await auth.currentUser?.getIdToken(true);

      const fn = httpsCallable(functions, name);
      const res = await fn(payload);
      setOut({ ok: true, data: res.data });
    } catch (e: any) {
      setOut({ ok: false, error: { message: e?.message, code: e?.code, details: e?.details } });
    }
  }

  return (
    <AdminGate>
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>/admin-actions</h1>

        <section style={{ display: "grid", gap: 12, maxWidth: 720 }}>
          <label>
            UID:
            <input value={uid} onChange={(e) => setUid(e.target.value)} style={{ width: "100%" }} />
          </label>

          <label>
            Email (for lookup):
            <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%" }} />
          </label>

          <label>
            Role:
            <select value={role} onChange={(e) => setRole(e.target.value as any)}>
              <option value="admin">admin</option>
              <option value="user">user</option>
            </select>
          </label>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => call("adminUserLookup", uid ? { uid } : { email })}> 
              adminUserLookup
            </button>
            <button onClick={() => call("adminSetRole", { uid, role })} disabled={!uid}>
              adminSetRole
            </button>
            <button onClick={() => call("adminDeactivateUser", { uid })} disabled={!uid}>
              adminDeactivateUser
            </button>
            <button onClick={() => call("adminExportUserData", { uid })} disabled={!uid}>
              adminExportUserData
            </button>
          </div>

          {out && (
            <pre style={{ background: "#111", color: "#0f0", padding: 16, borderRadius: 8, overflowX: "auto" }}>
{JSON.stringify(out, null, 2)}
            </pre>
          )}
        </section>
      </main>
    </AdminGate>
  );
}
