"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();

      // Cek localStorage, jika ditolak, jangan munculkan UI (tapi event tetap ditangkap)
      if (typeof window !== "undefined" && window.localStorage.getItem("pwa_prompt_dismissed") === "true") {
        return;
      }

      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Update UI notify the user they can install the PWA (jeda 1.5 detik agar smooth)
      setTimeout(() => {
        setShowPrompt(true);
      }, 1500);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("pwa_prompt_dismissed", "true");
    }
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:bottom-8 md:left-auto md:right-8 md:w-96">
      <div className="bg-white/70 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-4 flex flex-col gap-4 dark:bg-slate-900/70 dark:border-slate-800/50">
        <div className="flex items-start gap-4">
          <Image
            src="/icon-192x192.png"
            alt="PJTECH Logo"
            width={48}
            height={48}
            className="rounded-xl shadow-md"
          />
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Install PJTECH KASIR
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
              Akses aplikasi lebih cepat tanpa browser.
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleDismiss}
            className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Nanti Saja
          </button>
          <button
            onClick={handleInstallClick}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-lg shadow-blue-500/30"
          >
            Install Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
