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
          console.log("Realtime Booking Update:", payload);
          // When a booking changes, we revalidate paths/queries related to bookings or just trigger a global router.refresh
          // In this case, we use SWR's global mutate with a filter or specific keys if known.
          // For now, we can mutate generic endpoints that we know are used for bookings.
          mutate((key) => typeof key === 'string' && key.startsWith('/api/booking'));
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
          console.log("Realtime Transaction Update:", payload);
          mutate((key) => typeof key === 'string' && key.startsWith('/api/booking'));
          mutate((key) => typeof key === 'string' && key.startsWith('/api/transactions'));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(bookingChannel);
      supabase.removeChannel(transactionChannel);
    };
  }, [tenantId, mutate]);
}
