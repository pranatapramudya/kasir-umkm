"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useSWRConfig } from "swr";

export function useSupabaseRealtime(tenantId: string | null | undefined) {
  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (!tenantId || !process.env.NEXT_PUBLIC_SUPABASE_URL) return;

    const isCalendarKey = (key: any) =>
      typeof key === "string"
        ? key.startsWith("/api/booking/calendar")
        : Array.isArray(key) && key[0] === "/api/booking/calendar";

    const isPendingKey = (key: any) =>
      typeof key === "string"
        ? key.startsWith("/api/booking/pending-count")
        : Array.isArray(key) && key[0] === "/api/booking/pending-count";

    const isAnalyticsKey = (key: any) =>
      typeof key === "string"
        ? key.startsWith("/api/analytics")
        : Array.isArray(key) && typeof key[0] === "string" && key[0].startsWith("/api/analytics");

    // We subscribe to the 'public' schema, listening for INSERT and UPDATE on 'Booking' and 'Transaction'
    // Filtered by userId = tenantId
    const bookingChannel = supabase
      .channel(`realtime:booking:${tenantId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Booking',
          filter: `userId=eq.${tenantId}`
        },
        (payload) => {
          console.log("Realtime Booking Update received:", payload);
          mutate(isCalendarKey);
          mutate("/api/booking/today");
          mutate(isPendingKey);
          mutate("/api/booking/availability");
        }
      )
      .subscribe();

    const transactionChannel = supabase
      .channel(`realtime:transaction:${tenantId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Transaction',
          filter: `userId=eq.${tenantId}`
        },
        (payload) => {
          console.log("Realtime Transaction Update received:", payload);
          mutate("/api/transactions");
          mutate("/api/booking/today");
          mutate(isCalendarKey);
          mutate(isAnalyticsKey);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(bookingChannel);
      supabase.removeChannel(transactionChannel);
    };
  }, [tenantId, mutate]);
}
