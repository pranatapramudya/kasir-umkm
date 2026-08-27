import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getAnalyticsData } from '@/lib/analytics-service';

export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'bulan_ini';
    const customDate = searchParams.get('customDate');

    const data = await getAnalyticsData(userId, filter, customDate);

    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Analytics Error:', error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}
