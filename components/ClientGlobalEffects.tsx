"use client";

import nextDynamic from 'next/dynamic';

const Toaster = nextDynamic(() => import('sonner').then(mod => mod.Toaster), { ssr: false });
const SessionTimeoutGuard = nextDynamic(() => import('./SessionTimeoutGuard').then(mod => mod.SessionTimeoutGuard), { ssr: false });
const PwaInstallPrompt = nextDynamic(() => import('./PwaInstallPrompt').then(mod => mod.PwaInstallPrompt), { ssr: false });

export function ClientGlobalEffects() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <SessionTimeoutGuard />
      <PwaInstallPrompt />
    </>
  );
}
