import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

export function useRBAC() {
  const { user } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      user.getIdTokenResult().then((idTokenResult) => {
        setRole(idTokenResult.claims.role as string);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  return { role, loading };
}
