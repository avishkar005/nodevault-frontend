"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
      <div className="flex flex-col items-center gap-3">
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: "var(--foreground)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "var(--background)", fontSize: 18, fontFamily: "var(--font-display)" }}>N</span>
        </div>
        <p style={{ color: "var(--muted-foreground)", fontSize: 13 }}>Loading…</p>
      </div>
    </div>
  );
}
