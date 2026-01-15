'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseClient";

type GateState =
  | { status: "loading" }
  | { status: "not_logged_in" }
  | { status: "not_admin"; email?: string | null }
  | { status: "ok"; email?: string | null };

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<GateState>({ status: "loading" });

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (!u) {
        setState({ status: "not_logged_in" });
        router.replace("/login");
        return;
      }
      const token = await u.getIdTokenResult(true);
      const isAdmin = Boolean((token.claims as any)?.admin);
      if (!isAdmin) {
        setState({ status: "not_admin", email: u.email });
        return;
      }
      setState({ status: "ok", email: u.email });
    });

    return () => unsub();
  }, [router]);

  if (state.status === "loading") return <p style={{ padding: 24 }}>Loading…</p>;
  if (state.status === "not_admin") {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Forbidden</h1>
        <p>{state.email ? `Signed in as ${state.email}` : "Signed in"}</p>
        <p>You do not have the <code>admin: true</code> claim.</p>
        <p>Ask an existing admin to grant it.</p>
      </main>
    );
  }
  if (state.status !== "ok") return null;

  return <>{children}</>;
}
