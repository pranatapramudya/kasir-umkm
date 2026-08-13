import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    let targetUserId = userId;

    const employeeInfo = await prisma.employee.findUnique({
      where: { clerkUserId: userId },
      select: { tenantId: true }
    });

    if (employeeInfo) {
      targetUserId = employeeInfo.tenantId;
    }

    const employees = await prisma.employee.findMany({
      where: {
        tenantId: targetUserId
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({ success: true, employees });
  } catch (error: any) {
    console.error("Gagal mengambil data employee:", error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan internal' }, { status: 500 });
  }
}
