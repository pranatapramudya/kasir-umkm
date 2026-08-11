import { UserButton, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { ShieldAlert, LogOut } from "lucide-react";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-xl tracking-tight text-slate-900">
                PJTECH SUPER ADMIN <span className="text-indigo-600">Command Center</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <SignOutButton redirectUrl="/">
                <button className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-red-600 transition-colors">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </SignOutButton>
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
