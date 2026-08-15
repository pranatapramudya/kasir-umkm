import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (sessionClaims?.metadata as any)?.role;
    const tenantId = (sessionClaims?.metadata as any)?.tenantId;
    const targetUserId = role === 'CASHIER' ? tenantId : userId;

    const categories = await prisma.product.findMany({
      where: { userId: targetUserId, isArchived: false },
      select: { category: true },
      distinct: ['category']
    });
    
    const uniqueCategories = categories.map(c => c.category).filter(Boolean);
    return NextResponse.json(uniqueCategories);
  } catch (error) {
    console.error("GET Categories error:", error);
    return NextResponse.json({ error: "Gagal mengambil data kategori" }, { status: 500 });
  }
}
