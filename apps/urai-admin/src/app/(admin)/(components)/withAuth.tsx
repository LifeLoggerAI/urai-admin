'use client'

import { useAuth } from "@/hooks/useAuth";
import { useRBAC } from "@/hooks/useRBAC";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function WithAuth(props: P) {
    const { user, loading: authLoading } = useAuth();
    const { role, loading: rbacLoading } = useRBAC();
    const router = useRouter();

    useEffect(() => {
      if (!authLoading && !user) {
        router.push("/login");
      } else if (!rbacLoading && user && !role) {
        router.push("/request-access");
      }
    }, [user, authLoading, role, rbacLoading, router]);

    const loading = authLoading || rbacLoading;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user || !role) {
      return null;
    }

    return <Component {...props} />;
  };
}
