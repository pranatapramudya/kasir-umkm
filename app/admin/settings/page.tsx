import { UserProfile } from "@clerk/nextjs";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" />
          Pengaturan Toko
        </h1>
        <p className="text-slate-500 text-sm">Kelola profil, keamanan, dan pengaturan akun Anda.</p>
      </div>

      <div className="flex justify-center md:justify-start w-full max-w-full overflow-x-hidden">
        <UserProfile
          routing="hash"
          appearance={{
            elements: {
              rootBox: "w-full max-w-full",
              card: "w-full max-w-full rounded-2xl shadow-sm border border-slate-200",
              navbar: "hidden md:flex",
              navbarMobileMenuButton: "flex md:hidden",
            },
          }}
        />
      </div>
    </div>
  );
}
