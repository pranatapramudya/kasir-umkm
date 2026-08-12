/**
 * lib/bluetooth-printer.ts
 * Utilitas pencetakan struk nirkabel via Web Bluetooth API (ESC/POS)
 * Compatible dengan printer thermal Bluetooth standar (e.g. POS-58, POS-80)
 */

import { toast } from "sonner";

// --- TIPE DATA ---

export interface ReceiptItem {
  name: string;
  qty: number;
  price: number; // harga per unit
}

export interface ReceiptData {
  storeName: string;
  storeCategory?: string;
  date: string;
  time: string;
  transactionId: string;
  customerName: string;
  tableId?: string;
  items: ReceiptItem[];
  total: number;
  method: string;
  cashGiven?: number;
}

// --- KONSTANTA ESC/POS ---

const ESC = 0x1b;
const GS = 0x1d;

const CMD = {
  INIT: [ESC, 0x40],           // Reset printer
  ALIGN_LEFT: [ESC, 0x61, 0x00],     // Rata kiri
  ALIGN_CENTER: [ESC, 0x61, 0x01],     // Rata tengah
  ALIGN_RIGHT: [ESC, 0x61, 0x02],     // Rata kanan
  BOLD_ON: [ESC, 0x45, 0x01],     // Bold ON
  BOLD_OFF: [ESC, 0x45, 0x00],     // Bold OFF
  DOUBLE_SIZE: [GS, 0x21, 0x11],     // Double width & height
  NORMAL_SIZE: [GS, 0x21, 0x00],     // Normal size
  LINE_FEED: [0x0a],                 // New line
  CUT_PAPER: [GS, 0x56, 0x00],     // Full cut
};

// UUID Bluetooth standar untuk printer thermal (Serial Port Profile)
const PRINTER_SERVICE_UUID = "000018f0-0000-1000-8000-00805f9b34fb";
const PRINTER_CHAR_UUID = "00002af1-0000-1000-8000-00805f9b34fb";

// UUID fallback (beberapa printer menggunakan UUID alternatif)
const FALLBACK_SERVICE_UUID = "49535343-fe7d-4ae5-8fa9-9fafd205e455";
const FALLBACK_CHAR_UUID = "49535343-8841-43f4-a8d4-ecbe34729bb3";

// --- HELPER FUNCTIONS ---

/** Encode string ke array byte (Latin-1 / ASCII) */
function encodeText(text: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < text.length; i++) {
    bytes.push(text.charCodeAt(i) & 0xff);
  }
  return bytes;
}

/** Buat baris teks dengan padding kiri & kanan */
function paddedLine(left: string, right: string, width = 32): string {
  const maxLeft = width - right.length - 1;
  const truncLeft = left.length > maxLeft ? left.slice(0, maxLeft - 1) + "." : left;
  return truncLeft.padEnd(width - right.length) + right;
}

/** Gabungkan beberapa byte arrays */
function concat(...arrays: number[][]): number[] {
  return arrays.flat();
}

/** Format rupiah sederhana untuk ESC/POS */
function fmtRp(n: number): string {
  return "Rp" + n.toLocaleString("id-ID");
}

/** Garis putus-putus */
function dashedLine(width = 32): string {
  return "-".repeat(width);
}

// --- FUNGSI UTAMA ---

/**
 * connectPrinter()
 * Meminta akses ke printer Bluetooth terdekat dan mengembalikan
 * GATT Characteristic yang bisa digunakan untuk menulis data.
 */
export async function connectPrinter(): Promise<BluetoothRemoteGATTCharacteristic> {
  if (!("bluetooth" in navigator)) {
    throw new Error("Web Bluetooth API tidak didukung oleh browser ini.");
  }

  const device = await navigator.bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: [PRINTER_SERVICE_UUID, FALLBACK_SERVICE_UUID],
  });

  if (!device.gatt) {
    throw new Error("Perangkat tidak memiliki server GATT.");
  }

  const server = await device.gatt.connect();

  let characteristic: BluetoothRemoteGATTCharacteristic | undefined;

  // Coba service utama dulu
  try {
    const service = await server.getPrimaryService(PRINTER_SERVICE_UUID);
    characteristic = await service.getCharacteristic(PRINTER_CHAR_UUID);
  } catch {
    // Coba service fallback
    try {
      const service = await server.getPrimaryService(FALLBACK_SERVICE_UUID);
      characteristic = await service.getCharacteristic(FALLBACK_CHAR_UUID);
    } catch {
      // Cari semua service dan ambil characteristic writable pertama
      const services = await server.getPrimaryServices();
      outer: for (const svc of services) {
        try {
          const chars = await svc.getCharacteristics();
          for (const ch of chars) {
            if (ch.properties.write || ch.properties.writeWithoutResponse) {
              characteristic = ch;
              break outer;
            }
          }
        } catch { /* skip */ }
      }
    }
  }

  if (!characteristic) {
    throw new Error("Tidak ditemukan characteristic printer yang mendukung write.");
  }

  return characteristic;
}

/**
 * buildReceiptBytes()
 * Mengonversi data struk menjadi byte array ESC/POS.
 * Lebar kertas: 32 karakter (58mm) atau 42 karakter (80mm).
 */
export function buildReceiptBytes(data: ReceiptData, paperWidth = 32): Uint8Array {
  const bytes: number[] = [];
  const nl = CMD.LINE_FEED;

  const push = (...b: number[][]) => bytes.push(...concat(...b));

  // --- HEADER ---
  push(CMD.INIT);
  push(CMD.ALIGN_CENTER);
  push(CMD.BOLD_ON, CMD.DOUBLE_SIZE);
  push(encodeText(data.storeName.toUpperCase().slice(0, paperWidth)), nl);
  push(CMD.NORMAL_SIZE, CMD.BOLD_OFF);

  if (data.storeCategory) {
    push(encodeText(data.storeCategory.toUpperCase()), nl);
  }

  push(CMD.ALIGN_LEFT);
  push(encodeText(dashedLine(paperWidth)), nl);

  // --- INFO TRANSAKSI ---
  push(encodeText(`Waktu    : ${data.date} ${data.time}`), nl);
  push(encodeText(`Pelanggan: ${data.customerName}`), nl);
  if (data.tableId) {
    push(encodeText(`No. Meja : ${data.tableId}`), nl);
  }
  push(encodeText(`ID Trx   : ${data.transactionId}`), nl);
  push(encodeText(dashedLine(paperWidth)), nl);

  // --- HEADER TABEL ---
  push(CMD.BOLD_ON);
  push(encodeText(paddedLine("Item", "Total", paperWidth)), nl);
  push(CMD.BOLD_OFF);
  push(encodeText(dashedLine(paperWidth)), nl);

  // --- ITEM LIST ---
  for (const item of data.items) {
    const lineTotal = item.qty * item.price;
    push(encodeText(item.name.slice(0, paperWidth)), nl);
    const qtyLine = `  ${item.qty} x ${fmtRp(item.price)}`;
    push(encodeText(paddedLine(qtyLine, fmtRp(lineTotal), paperWidth)), nl);
  }

  push(encodeText(dashedLine(paperWidth)), nl);

  // --- TOTAL ---
  push(CMD.BOLD_ON);
  push(encodeText(paddedLine("TOTAL", fmtRp(data.total), paperWidth)), nl);
  push(CMD.BOLD_OFF);

  push(encodeText(paddedLine("Metode", data.method.toUpperCase(), paperWidth)), nl);

  if (data.method === "cash" && data.cashGiven !== undefined) {
    push(encodeText(paddedLine("Tunai", fmtRp(data.cashGiven), paperWidth)), nl);
    const change = Math.max(0, data.cashGiven - data.total);
    push(CMD.BOLD_ON);
    push(encodeText(paddedLine("Kembalian", fmtRp(change), paperWidth)), nl);
    push(CMD.BOLD_OFF);
  }

  push(encodeText(dashedLine(paperWidth)), nl);

  // --- FOOTER ---
  push(CMD.ALIGN_CENTER);
  push(encodeText("Terima Kasih!"), nl);
  push(encodeText("Silakan berkunjung kembali"), nl);
  push(nl, nl);
  push(encodeText("Powered by PJTECH"), nl);

  // Jeda sebelum potong kertas
  push(nl, nl, nl);
  push(CMD.CUT_PAPER);

  return new Uint8Array(bytes);
}

/**
 * printBluetoothReceipt()
 * Fungsi utama: connect -> build bytes -> kirim ke printer.
 * Menampilkan sonner toast untuk setiap tahapan.
 */
export async function printBluetoothReceipt(data: ReceiptData): Promise<void> {
  const toastId = toast.loading("Menghubungkan ke printer...");
  try {
    const characteristic = await connectPrinter();
    toast.loading("Printer terhubung. Mencetak...", { id: toastId });

    const bytes = buildReceiptBytes(data);

    // Kirim dalam chunk (batas MTU printer ~512 bytes)
    const CHUNK_SIZE = 512;
    for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
      const chunk = bytes.slice(i, i + CHUNK_SIZE);
      if (characteristic.properties.writeWithoutResponse) {
        await characteristic.writeValueWithoutResponse(chunk);
      } else {
        await characteristic.writeValue(chunk);
      }
      // Jeda antar chunk agar printer tidak kewalahan
      await new Promise((r) => setTimeout(r, 50));
    }

    toast.success("Struk berhasil dicetak!", { id: toastId });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal mencetak struk";
    if (msg.includes("User cancelled") || msg.includes("chooser was cancelled")) {
      toast.dismiss(toastId);
    } else {
      toast.error(`Gagal mencetak: ${msg}`, { id: toastId });
    }
  }
}

/** Cek apakah browser mendukung Web Bluetooth API */
export function isBluetoothSupported(): boolean {
  return typeof navigator !== "undefined" && "bluetooth" in navigator;
}
