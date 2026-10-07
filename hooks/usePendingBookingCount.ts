"use client";

import useSWR from "swr";
import { useEffect, useRef } from "react";
import { playNotificationChime } from "@/lib/audio";

const fetcher = (args: string | [string, string]) => {
  const url = Array.isArray(args) ? args[0] : args;
  return fetch(url).then((res) => res.json());
};

/**
 * Hook to poll and track incoming pending online bookings/orders.
 * Provides real-time badge count and triggers an in-app audio chime
 * when a new order arrives.
 *
 * Takes tenantId directly without relying on Clerk's client useUser hook,
 * eliminating any runtime error during sign-out / logout.
 */
export function usePendingBookingCount(tenantId?: string) {
  const { data, mutate, error } = useSWR<{ count: number }>(
    tenantId ? ["/api/booking/pending-count", tenantId] : null,
    fetcher,
    {
      refreshInterval: 10000, // Poll every 10 seconds for real-time responsiveness
      revalidateOnFocus: true,
    }
  );

  const pendingCount = data?.count || 0;
  const isInitialLoadRef = useRef(true);
  const prevCountRef = useRef<number>(0);

  useEffect(() => {
    if (data === undefined) return;

    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      prevCountRef.current = data.count || 0;
      return;
    }

    const currentCount = data.count || 0;
    if (currentCount > prevCountRef.current) {
      playNotificationChime();
    }
    prevCountRef.current = currentCount;
  }, [data]);

  return {
    pendingCount,
    data,
    mutate,
    error,
  };
}
