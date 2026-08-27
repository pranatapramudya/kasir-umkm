"use client";

import { SWRConfig } from "swr";

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig 
      value={{ 
        refreshInterval: 0,
        revalidateOnFocus: false,
        revalidateIfStale: false,
        dedupingInterval: 60000,
        fetcher: (url: string) => fetch(url).then((res) => res.json())
      }}
    >
      {children}
    </SWRConfig>
  );
}
