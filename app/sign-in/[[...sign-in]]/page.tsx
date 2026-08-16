import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      {/* Komponen bawaan Clerk untuk form Login secara eksplisit jika user memaksa buka /sign-in */}
      <SignIn routing="path" path="/sign-in" fallbackRedirectUrl="/auth-callback" forceRedirectUrl="/auth-callback" />
    </div>
  );
}
