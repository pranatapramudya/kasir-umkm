import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pin } = body;

    // Ambil PIN rahasia dari environment variable (fallback ke '123456' untuk keamanan jika lupa di set)
    const validPin = process.env.OWNER_PIN || "123456";

    if (pin === validPin) {
      // Jika PIN cocok, kita akan mengatur HTTP-only cookie
      // Cookie ini diset dari sisi server, aman dari akses JavaScript (XSS)
      const cookieStore = await cookies();
      cookieStore.set({
        name: 'auth_token',
        value: 'owner_authenticated_session', 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 // Masa aktif 1 hari
      });

      return NextResponse.json({ success: true, message: "Akses Diberikan" }, { status: 200 });
    } else {
      // Jika PIN salah, kembalikan status 401 Unauthorized
      return NextResponse.json({ success: false, message: "PIN Salah" }, { status: 401 });
    }
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
