"use client";

import { UserButton } from "@clerk/nextjs";

export function CustomUserButton() {
  return (
    <div className="flex items-center gap-3">
      <UserButton />
    </div>
  );
}
