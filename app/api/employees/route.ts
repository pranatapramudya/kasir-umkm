import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const role = (sessionClaims?.metadata as any)?.role;
    const tenantId = (sessionClaims?.metadata as any)?.tenantId;
    
    // Jika yang request adalah CASHIER, maka tenant-nya adalah parent (tenantId)
    // Jika yang request adalah OWNER, maka tenant-nya adalah userId dia sendiri
    const targetUserId = role === 'CASHIER' ? tenantId : userId;

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
