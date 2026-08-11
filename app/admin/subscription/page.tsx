import { checkSubscriptionStatus } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SubscriptionClient from "./SubscriptionClient";

export const dynamic = 'force-dynamic';

export default async function SubscriptionPage() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const role = (sessionClaims?.metadata as any)?.role;
  
  if (role === 'CASHIER') {
    redirect("/"); // Cashier cannot access billing
  }

  const subscriptionStatus = await checkSubscriptionStatus();

  return <SubscriptionClient initialStatus={subscriptionStatus} />;
}
