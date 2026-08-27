import { UserButton } from "@clerk/nextjs";
import { ShieldAlert } from "lucide-react";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between w-full h-16">
            {/* Logo + Judul */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="bg-indigo-600 p-2 rounded-lg shrink-0">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-base md:text-xl leading-tight tracking-tight text-slate-900 truncate">
                PJTECH SUPER ADMIN{" "}
                <span className="text-indigo-600 hidden sm:inline">
                  Command Center
                </span>
              </span>
            </div>
            {/* Profile — UserButton sudah include tombol Sign Out bawaan Clerk */}
            <div className="shrink-0 ml-4">
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
