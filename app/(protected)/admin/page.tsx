export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { auth, currentUser } from '@clerk/nextjs/server';
import { getAnalyticsData } from '@/lib/analytics-service';
import AdminDashboardClient from './AdminDashboardClient';
import { redirect } from 'next/navigation';

export default async function AdminDashboardPage() {
  const { userId } = await auth();
  let user = null;
  try {
    user = await currentUser();
  } catch (err) {
    console.warn("Failed to fetch currentUser:", err);
    redirect('/sign-in');
  }
  
  if (!userId || !user) {
    redirect('/sign-in');
  }

  const role = user.publicMetadata?.role;
  // By default, cashiers see 'hari_ini', admins see 'bulan_ini'
  const initialFilter = role === 'CASHIER' ? 'hari_ini' : 'bulan_ini';

  // Fetch all standard analytics periods in parallel on server for 0ms instant client filter switching
  const [dataHariIni, dataBulanIni, dataTahunIni] = await Promise.all([
    getAnalyticsData(userId, 'hari_ini'),
    getAnalyticsData(userId, 'bulan_ini'),
    getAnalyticsData(userId, 'tahun_ini'),
  ]);

  const preloadedData = {
    'hari_ini': dataHariIni,
    'bulan_ini': dataBulanIni,
    'tahun_ini': dataTahunIni,
  };

  const initialData = preloadedData[initialFilter] || dataBulanIni;

  return (
    <AdminDashboardClient 
      initialData={initialData} 
      initialFilter={initialFilter} 
      preloadedData={preloadedData}
    />
  );
}
