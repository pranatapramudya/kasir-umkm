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
    const tenantId = (sessionClaims?.metadata as any)?.tenantId;
    const targetUserId = role === 'CASHIER' ? tenantId : userId;

    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const whereClause: any = { userId: targetUserId };

    if (from || to) {
      whereClause.date = {};
      if (from) whereClause.date.gte = new Date(`${from}T00:00:00+07:00`);
      if (to) whereClause.date.lte = new Date(`${to}T23:59:59.999+07:00`);
    }

    const expenses = await prisma.expense.findMany({
      where: whereClause,
      orderBy: { date: 'desc' }
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error("GET Expenses error:", error);
    return NextResponse.json({ error: "Gagal mengambil data pengeluaran" }, { status: 500 });
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
    const tenantId = (sessionClaims?.metadata as any)?.tenantId;
    const targetUserId = role === 'CASHIER' ? tenantId : userId;

    const body = await request.json();
    const { title, amount, category, date } = body;

    if (!title || amount === undefined || !category) {
      revalidatePath('/', 'layout');
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newExpense = await prisma.expense.create({
      data: {
        userId: targetUserId,
        title,
        amount: Number(amount),
        category,
        date: date ? new Date(date) : new Date(),
      }
    });

    revalidatePath('/', 'layout');
    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error("POST Expense error:", error);
    revalidatePath('/', 'layout');
    return NextResponse.json({ error: "Gagal menyimpan pengeluaran" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      revalidatePath('/', 'layout');
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (sessionClaims?.metadata as any)?.role;
    if (role === 'CASHIER') {
      revalidatePath('/', 'layout');
    return NextResponse.json({ error: "Akses ditolak. Hanya Pemilik/Admin yang bisa menghapus pengeluaran." }, { status: 403 });
    }

    const tenantId = (sessionClaims?.metadata as any)?.tenantId;
    const targetUserId = role === 'CASHIER' ? tenantId : userId;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      revalidatePath('/', 'layout');
    return NextResponse.json({ error: "ID pengeluaran diperlukan" }, { status: 400 });
    }

    // Verify ownership
    const expense = await prisma.expense.findUnique({
      where: { id }
    });

    if (!expense || expense.userId !== targetUserId) {
      revalidatePath('/', 'layout');
    return NextResponse.json({ error: "Pengeluaran tidak ditemukan atau akses ditolak" }, { status: 404 });
    }

    await prisma.expense.delete({
      where: { id }
    });

    revalidatePath('/', 'layout');
    return NextResponse.json({ message: "Berhasil menghapus pengeluaran" });
  } catch (error) {
    console.error("DELETE Expense error:", error);
    revalidatePath('/', 'layout');
    return NextResponse.json({ error: "Gagal menghapus pengeluaran" }, { status: 500 });
  }
}
