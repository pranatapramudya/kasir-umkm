"use client";

import { useEffect } from "react";

export function ClientCachePurger() {
  useEffect(() => {
    // Purge all local and session storage to prevent stale data leaks
    // Clerk uses cookies and memory for its main session, so this is safe for app data.
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  return null;
}
