import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const webhookSecret = process.env.MAYAR_WEBHOOK_SECRET;
    if (webhookSecret) {
      const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
      // Mayar mengirim webhook secret di header Authorization (Bearer token)
      if (!authHeader || (authHeader !== `Bearer ${webhookSecret}` && authHeader !== webhookSecret)) {
        console.error('Invalid Webhook Secret');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const body = await req.json();

    if (body.event === 'testing') {
      return NextResponse.json({ message: "Webhook URL is working perfectly" }, { status: 200 });
    }

    if (body.event === 'payment.success' || body.event === 'payment.received') {
      const email = body.data?.customer?.email;
      const amount = Number(body.data?.amount || 0);

      if (email && amount > 0) {
        let durationMonths = 0;
        let plan = '';

        if (amount >= 990000) {
          durationMonths = 12;
          plan = 'PRO_1Y';
        } else if (amount >= 594000) {
          durationMonths = 6;
          plan = 'PRO_6M';
        } else if (amount >= 129000) {
          durationMonths = 1;
          plan = 'PRO_1M';
        }

        if (durationMonths > 0) {
          // Mencari Employee berdasarkan email untuk mendapatkan tenantId
          const employee = await prisma.employee.findFirst({
            where: { email },
          });

          if (!employee) {
            return NextResponse.json({ message: 'User not found' }, { status: 200 });
          }

          // Menghitung tanggal kadaluarsa: Tanggal saat ini + durasi bulan
          const subscriptionEndsAt = new Date();
          subscriptionEndsAt.setMonth(subscriptionEndsAt.getMonth() + durationMonths);

          // Update status berlangganan pada model Tenant
          await prisma.tenant.update({
            where: { id: employee.tenantId },
            data: {
              subscriptionPlan: plan,
              subscriptionStatus: 'ACTIVE',
              subscriptionEndsAt: subscriptionEndsAt,
            },
          });
        }
      }
    }

    return NextResponse.json({ message: 'OK' }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
