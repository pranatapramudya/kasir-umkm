"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getNavigationMenu } from "@/lib/navigation";
import { Store, HelpCircle } from "lucide-react";
import { BukuPanduanModal } from "./BukuPanduanModal";
import { usePendingBookingCount } from "@/hooks/usePendingBookingCount";

interface SidebarClientProps {
  role: string | undefined;
  plan: string;
  endsAt: string | undefined;
  kategoriUsaha: string;
}

export function SidebarClient({ role, plan, endsAt, kategoriUsaha: rawKategoriUsaha }: SidebarClientProps) {
  const kategoriUsaha = rawKategoriUsaha || 'Retail';
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isBukuPanduanOpen, setIsBukuPanduanOpen] = useState(false);
  const [optimisticHref, setOptimisticHref] = useState<string | null>(null);

  // Sync optimistic indicator with confirmed pathname
  useEffect(() => {
    setOptimisticHref(null);
  }, [pathname]);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    const handleClose = () => setIsOpen(false);
    
    window.addEventListener('toggleSidebar', handleToggle);
    window.addEventListener('closeSidebar', handleClose);
    
    // Auto close on route change (mobile)
    setIsOpen(false);
    
    return () => {
      window.removeEventListener('toggleSidebar', handleToggle);
      window.removeEventListener('closeSidebar', handleClose);
    };
  }, [pathname]);

  const filteredMenuGroups = getNavigationMenu(kategoriUsaha, role);

  // Proactive Cache Warming: Preload all sidebar routes
  useEffect(() => {
    filteredMenuGroups.forEach(group => {
      group.items.forEach(item => {
        try {
          router.prefetch(item.href);
        } catch {}
      });
    });
  }, [router, filteredMenuGroups]);

  // SWR Polling & Real-time Chime Alert
  const { pendingCount } = usePendingBookingCount(role);

  const handleLinkClick = (href: string) => {
    setOptimisticHref(href);
    setIsOpen(false);
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(10);
      }
    } catch {}
  };

  const activePath = optimisticHref || pathname;

  return (
    <>
      {/* Overlay Backdrop untuk Mobile/Tablet Portrait */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r shadow-[4px_0_24px_-10px_rgba(0,0,0,0.05)] z-50 flex flex-col shrink-0 select-none
        transition-transform duration-200 ease-in-out print:hidden
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
      <div className="p-6 border-b border-slate-100">
        <div className="flex flex-col">
          <h2 className="text-xl font-black flex items-center gap-2 text-slate-800 tracking-tight">
            <Store className="w-6 h-6 text-blue-600" />
            KASIR POS
          </h2>
          <span className="text-[10px] text-blue-600 font-bold ml-8 uppercase tracking-wider relative top-[-4px]">by PJTECH</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-6 flex flex-col justify-between">
        <nav className="space-y-6">
          <div className="px-4 -mt-2 mb-2">
            <button
              onClick={() => setIsBukuPanduanOpen(true)}
              className="flex items-center justify-between px-4 py-3 w-full rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-150 group"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-blue-100 rounded-lg group-hover:bg-blue-600 transition-colors">
                  <HelpCircle className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-bold text-sm text-blue-900">Pusat Bantuan</span>
                  <span className="text-[10px] font-medium text-blue-600">Panduan & SOP</span>
                </div>
              </div>
            </button>
          </div>

          {filteredMenuGroups.map((group) => (
            <div key={group.group}>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4">
                {group.group}
              </h3>
              <div className="space-y-1.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePath === item.href;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      prefetch={true}
                      onClick={() => handleLinkClick(item.href)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-75 font-semibold text-sm touch-manipulation active:scale-[0.97] ${isActive
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent active:bg-slate-100"
                        }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 transition-colors duration-75 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                          {item.name}
                        </div>
                        {(item.name === "Pesanan Online" || item.href === "/admin/orders" || item.href === "/admin/rental-calendar") && pendingCount > 0 && (
                          <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center animate-in zoom-in duration-200">
                            {pendingCount > 99 ? "99+" : pendingCount}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
      
      <BukuPanduanModal 
        isOpen={isBukuPanduanOpen} 
        onClose={() => setIsBukuPanduanOpen(false)} 
        category={kategoriUsaha} 
      />
    </aside>
    </>
  );
}
