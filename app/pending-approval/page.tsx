import { checkSubscriptionStatus } from "@/lib/subscription";
import { redirect } from "next/navigation";
import PendingApprovalClient from "./PendingApprovalClient";
import { auth } from "@clerk/nextjs/server";

export default async function PendingApprovalPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const { status, plan } = await checkSubscriptionStatus();

  // Jika status bukan PENDING (misal ACTIVE, EXPIRED, atau FREE), kembalikan ke /admin
  if (status !== 'PENDING') {
    redirect('/admin');
  }

  return <PendingApprovalClient plan={plan} />;
}
