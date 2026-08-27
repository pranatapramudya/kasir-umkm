import { auth, currentUser } from '@clerk/nextjs/server';
import { getAnalyticsData } from '@/lib/analytics-service';
import AdminDashboardClient from './AdminDashboardClient';
import { redirect } from 'next/navigation';

export default async function AdminDashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();
  
  if (!userId || !user) {
    redirect('/sign-in');
  }

  const role = user.publicMetadata?.role;
  // By default, cashiers see 'hari_ini', admins see 'bulan_ini'
  const initialFilter = role === 'CASHIER' ? 'hari_ini' : 'bulan_ini';

  // Fetch initial data on the server to ensure fast LCP (Speed Insights optimization)
  // getAnalyticsData already serializes all Date objects to ISO strings, preventing hydration mismatches.
  const initialData = await getAnalyticsData(userId, initialFilter);

  return (
    <AdminDashboardClient 
      initialData={initialData} 
      initialFilter={initialFilter} 
    />
  );
}
