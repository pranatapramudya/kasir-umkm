"use client";

import { useEffect, useState } from 'react';
import nextDynamic from 'next/dynamic';

const LandingShowcase = nextDynamic(() => import('./LandingShowcase'), { ssr: false });

export function ClientShowcaseWrapper() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    // Check initially
    checkDesktop();
    
    // Listen for resize
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  if (!isDesktop) return null;

  return <LandingShowcase />;
}
