"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { PageSkeleton } from "@/components/ui/Skeleton";

/**
 * Waits for AuthProvider to resolve before rendering protected content.
 * Avoids logged-out flash for authenticated users.
 */
export function RequireAuth({ children, fallback = null }) {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      const next = encodeURIComponent(pathname || "/");
      router.replace(`/login?next=${next}`);
    }
  }, [loading, isAuthenticated, router, pathname]);

  if (loading) {
    return fallback || <PageSkeleton />;
  }

  if (!isAuthenticated) {
    return fallback || <PageSkeleton />;
  }

  return children;
}
