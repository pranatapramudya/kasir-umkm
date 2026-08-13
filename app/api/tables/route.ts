import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (sessionClaims?.metadata as any)?.role;
    const tenantId = (sessionClaims?.metadata as any)?.tenantId;
    const targetUserId = role === 'CASHIER' ? tenantId : userId;

    const tables = await prisma.diningTable.findMany({
      where: { userId: targetUserId },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(tables);
  } catch (error) {
    console.error("GET Tables error:", error);
    return NextResponse.json({ error: "Gagal mengambil data meja" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (sessionClaims?.metadata as any)?.role;
    const tenantId = (sessionClaims?.metadata as any)?.tenantId;
    const targetUserId = role === 'CASHIER' ? tenantId : userId;

    const body = await request.json();
    const { name, capacity } = body;

    if (!name) {
      return NextResponse.json({ error: "Nama Meja wajib diisi" }, { status: 400 });
    }

    const newTable = await prisma.diningTable.create({
      data: {
        userId: targetUserId,
        name,
        capacity: Number(capacity) || 4,
        status: "Tersedia"
      }
    });

    return NextResponse.json({ success: true, data: newTable }, { status: 201 });
  } catch (error: any) {
    console.error("POST Table error:", error);
    return NextResponse.json({ error: "Gagal menyimpan meja", details: error.message }, { status: 500 });
  }
}
