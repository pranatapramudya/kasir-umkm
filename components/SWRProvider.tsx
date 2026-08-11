"use client";

import { SWRConfig } from "swr";

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig 
      value={{ 
        refreshInterval: 60000,
        fetcher: (url: string) => fetch(url).then((res) => res.json())
      }}
    >
      {children}
    </SWRConfig>
  );
}
