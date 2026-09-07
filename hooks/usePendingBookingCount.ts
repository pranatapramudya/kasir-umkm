"use client";

import useSWR from "swr";
import { useUser } from "@clerk/nextjs";
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
 */
export function usePendingBookingCount(role?: string) {
  const { user } = useUser();
  const currentTenantId = role === "CASHIER" ? user?.publicMetadata?.tenantId : user?.id;

  const { data, mutate, error } = useSWR<{ count: number }>(
    currentTenantId ? ["/api/booking/pending-count", currentTenantId as string] : null,
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
    // Only process once data has been loaded from the API
    if (data === undefined) return;

    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      prevCountRef.current = data.count || 0;
      return;
    }

    const currentCount = data.count || 0;
    // If pending count increased compared to previous state, ring the notification chime
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
