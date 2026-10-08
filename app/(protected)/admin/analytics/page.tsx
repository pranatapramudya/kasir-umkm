import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getAnalyticsData } from './actions';
import AnalyticsClient from './AnalyticsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Analytics | PJTech Kasir',
  description: 'Laporan dan analisis bisnis',
};

const getLocalDateString = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default async function AnalyticsPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  // Default range: First day of current month to today (WIB UTC+7)
  const now = new Date();
  const wibDateStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(now);
  const [year, month] = wibDateStr.split('-');
  
  const fromStr = `${year}-${month}-01`;
  const toStr = wibDateStr;

  // Ambil data langsung dari Database via Server Action
  const initialData = await getAnalyticsData(fromStr, toStr);

  return (
    <AnalyticsClient 
      initialData={initialData} 
      initialDateRange={{ from: fromStr, to: toStr }}
    />
  );
}