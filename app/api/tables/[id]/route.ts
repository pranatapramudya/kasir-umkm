import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    const { name, capacity, status } = body;

    const { sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as any)?.role;
    const tenantId = (sessionClaims?.metadata as any)?.tenantId;
    const targetUserId = role === 'CASHIER' ? tenantId : userId;

    const dataToUpdate: any = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (capacity !== undefined) dataToUpdate.capacity = Number(capacity);
    if (status !== undefined) dataToUpdate.status = status;

    const result = await prisma.diningTable.updateMany({
      where: { id, userId: targetUserId },
      data: dataToUpdate
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Meja tidak ditemukan atau akses ditolak" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Meja diperbarui" });
  } catch (error: any) {
    console.error("PUT Table error:", error);
    return NextResponse.json({ error: "Gagal memperbarui meja", details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    const { sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as any)?.role;
    const tenantId = (sessionClaims?.metadata as any)?.tenantId;
    const targetUserId = role === 'CASHIER' ? tenantId : userId;

    const result = await prisma.diningTable.deleteMany({
      where: { id, userId: targetUserId }
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Meja tidak ditemukan atau akses ditolak" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE Table error:", error);
    return NextResponse.json({ error: "Gagal menghapus meja", details: error.message }, { status: 500 });
  }
}
