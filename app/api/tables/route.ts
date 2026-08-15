import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
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
    const metaTenantId = (sessionClaims?.metadata as any)?.tenantId;

    let targetUserId = userId;
    if (role === 'CASHIER' && metaTenantId) {
      targetUserId = metaTenantId;
    }
    const employee = await prisma.employee.findUnique({ where: { clerkUserId: userId } });
    if (employee) {
      targetUserId = employee.tenantId;
    }

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
      revalidatePath('/', 'layout');
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (sessionClaims?.metadata as any)?.role;
    const metaTenantId = (sessionClaims?.metadata as any)?.tenantId;

    let targetUserId = userId;
    if (role === 'CASHIER' && metaTenantId) {
      targetUserId = metaTenantId;
    }
    const employee = await prisma.employee.findUnique({ where: { clerkUserId: userId } });
    if (employee) {
      targetUserId = employee.tenantId;
    }

    const body = await request.json();
    const { name, capacity } = body;

    if (!name) {
      revalidatePath('/', 'layout');
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

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, data: newTable }, { status: 201 });
  } catch (error: any) {
    console.error("POST Table error:", error);
    revalidatePath('/', 'layout');
    return NextResponse.json({ error: "Gagal menyimpan meja", details: error.message }, { status: 500 });
  }
}
