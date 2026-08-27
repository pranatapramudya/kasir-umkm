"use client";

import nextDynamic from 'next/dynamic';

const LandingShowcase = nextDynamic(() => import('./LandingShowcase'), { ssr: false });

export function ClientShowcaseWrapper() {
  return <LandingShowcase />;
}
