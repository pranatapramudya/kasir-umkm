"use client";

import { SWRConfig } from "swr";

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig 
      value={{ 
        refreshInterval: 0,
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: false,
        dedupingInterval: 60000,
        keepPreviousData: true,
        fetcher: (url: string) => fetch(url).then((res) => res.json())
      }}
    >
      {children}
    </SWRConfig>
  );
}
