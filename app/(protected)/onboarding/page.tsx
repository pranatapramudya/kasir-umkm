import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import OnboardingClient from './OnboardingClient';

export const metadata = {
  title: 'Onboarding | PJTech Kasir',
  description: 'Persiapkan sistem kasir Anda',
};

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  return <OnboardingClient />;
}