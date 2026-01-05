
"use client";

import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { app } from "@/lib/firebase";

type Me = { uid: string; email?: string | null };

export default function DashboardClient() {
  const [me, setMe] = useState<Me | null>(null);
  const [idToken, setIdToken] = useState<string>("");

  useEffect(() => {
    const auth = getAuth(app);
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (!u) {
        setMe(null);
        setIdToken("");
        return;
      }
      setMe({ uid: u.uid, email: u.email });
      const t = await u.getIdToken();
      setIdToken(t);
    });
    return () => unsub();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>URAI Admin</h1>
      {!me ? (
        <p>Not signed in.</p>
      ) : (
        <>
          <p>Signed in as: {me.email || me.uid}</p>
          <p style={{ wordBreak: "break-all" }}>
            <b>ID Token:</b> {idToken ? "✅ ready" : "…"}
          </p>
        </>
      )}
    </div>
  );
}
