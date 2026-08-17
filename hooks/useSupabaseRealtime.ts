"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useSWRConfig } from "swr";

export function useSupabaseRealtime(tenantId: string | null | undefined) {
  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (!tenantId || !process.env.NEXT_PUBLIC_SUPABASE_URL) return;

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
          mutate("/api/booking/calendar");
          mutate("/api/booking/today");
          mutate("/api/booking/pending-count");
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
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(bookingChannel);
      supabase.removeChannel(transactionChannel);
    };
  }, [tenantId, mutate]);
}
