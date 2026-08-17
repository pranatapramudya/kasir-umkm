"use client";

import { useEffect } from "react";

import { useSWRConfig } from "swr";

export function ClientCachePurger() {
  const { mutate } = useSWRConfig();

  useEffect(() => {
    // Purge all local and session storage to prevent stale data leaks
    // Clerk uses cookies and memory for its main session, so this is safe for app data.
    localStorage.clear();
    sessionStorage.clear();
    mutate(() => true, undefined, { revalidate: false });
  }, [mutate]);

  return null;
}
