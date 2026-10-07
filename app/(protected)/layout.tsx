import { SWRProvider } from "@/components/SWRProvider";
import { BottomNav } from "@/components/BottomNav";
import { ClientGlobalEffects } from "@/components/ClientGlobalEffects";
import { OfflineProvider, OfflineIndicator } from "@/components/OfflineProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <OfflineProvider>
      <SWRProvider>
        {children}
        <BottomNav />
      </SWRProvider>
      <ClientGlobalEffects />
      <OfflineIndicator />
      <Analytics />
      <SpeedInsights />
    </OfflineProvider>
  );
}
