"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

const TIMEOUT_MS = 24 * 60 * 60 * 1000; // 24 hours
const CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const THROTTLE_MS = 60 * 1000; // 1 minute

export function SessionTimeoutGuard({ children }: { children: React.ReactNode }) {
  const { isSignedIn, signOut, userId } = useAuth();
  const router = useRouter();
  const lastUpdateRef = useRef<number>(0);
  const { mutate } = useSWRConfig();
  const prevUserIdRef = useRef<string | null | undefined>(userId);

  useEffect(() => {
    if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
      // User changed or logged out
      localStorage.clear();
      sessionStorage.clear();
      mutate(() => true, undefined, { revalidate: false });
      window.location.href = "/";
    }
  }, [userId]);

  useEffect(() => {
    if (!isSignedIn) return;

    // Inisialisasi lastActivity jika belum ada
    if (!localStorage.getItem("lastActivity")) {
      localStorage.setItem("lastActivity", Date.now().toString());
    }

    const updateActivity = () => {
      const now = Date.now();
      // Throttle updates to local storage (max 1 per minute)
      if (now - lastUpdateRef.current > THROTTLE_MS) {
        localStorage.setItem("lastActivity", now.toString());
        lastUpdateRef.current = now;
      }
    };

    const handleActivity = () => {
      updateActivity();
    };

    // Attach event listeners
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Check expiration periodically
    const interval = setInterval(() => {
      const lastActivityStr = localStorage.getItem("lastActivity");
      if (lastActivityStr) {
        const lastActivity = parseInt(lastActivityStr, 10);
        if (Date.now() - lastActivity > TIMEOUT_MS) {
          // Waktu habis, eksekusi auto-logout
          localStorage.removeItem("lastActivity");
          toast.error("Sesi telah berakhir karena tidak ada aktivitas selama 24 jam.");
          signOut(() => {
            window.location.href = "/sign-in";
          });
        }
      }
    }, CHECK_INTERVAL_MS);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(interval);
    };
  }, [isSignedIn, signOut, router]);

  return <>{children}</>;
}
