export interface BluetoothPrinterInfo {
  device: BluetoothDevice;
  name: string;
  id: string;
  rssi?: number;
}

let cachedPrinter: BluetoothPrinterInfo | null = null;

export async function requestBluetoothPrinter(): Promise<BluetoothPrinterInfo | null> {
  if (!navigator.bluetooth) {
    throw new Error('Web Bluetooth API tidak didukung browser ini. Gunakan Chrome/Edge di Android/Windows.');
  }

  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [
        { services: ['000018f0-0000-1000-8000-00805f9b34fb'] }, // Generic thermal printer service
        { namePrefix: 'POS' },
        { namePrefix: 'Printer' },
        { namePrefix: 'Thermal' },
        { namePrefix: 'BT' },
        { namePrefix: 'RPP' },
        { namePrefix: 'Xprinter' },
        { namePrefix: 'Munbyn' },
        { namePrefix: 'Phomemo' },
      ],
      optionalServices: [
        '000018f0-0000-1000-8000-00805f9b34fb',
        '49535343-fe7d-4ae5-8fa9-9fafd205e455', // iOS/Star Micronics
      ],
    });

    const info: BluetoothPrinterInfo = {
      device,
      name: device.name || `Unknown (${device.id})`,
      id: device.id,
    };

    cachedPrinter = info;
    localStorage.setItem('kasir_bt_printer_id', device.id);
    localStorage.setItem('kasir_bt_printer_name', device.name || '');

    return info;
  } catch (err: any) {
    if (err.name === 'NotFoundError') {
      throw new Error('Tidak ada printer Bluetooth ditemukan. Pastikan printer menyala & mode pairing.');
    }
    throw err;
  }
}

export async function getCachedPrinter(): Promise<BluetoothPrinterInfo | null> {
  if (cachedPrinter) return cachedPrinter;

  const savedId = localStorage.getItem('kasir_bt_printer_id');
  const savedName = localStorage.getItem('kasir_bt_printer_name');

  if (savedId && savedName && navigator.bluetooth) {
    // Return cached info without prompting - actual connection happens at print time
    cachedPrinter = { 
      device: {} as BluetoothDevice, // placeholder, actual device fetched at connect time
      name: savedName, 
      id: savedId 
    };
    return cachedPrinter;
  }
  return null;
}

export function clearCachedPrinter() {
  cachedPrinter = null;
  localStorage.removeItem('kasir_bt_printer_id');
  localStorage.removeItem('kasir_bt_printer_name');
}

export function isBluetoothSupported(): boolean {
  return 'bluetooth' in navigator;
}

// ---------- THERMAL PRINT COMMANDS ----------
// ESC/POS commands untuk printer thermal umum (58mm/80mm)

export const ESC_POS = {
  INIT: new Uint8Array([0x1b, 0x40]),           // ESC @ - Initialize
  BOLD_ON: new Uint8Array([0x1b, 0x45, 0x01]),  // ESC E 1
  BOLD_OFF: new Uint8Array([0x1b, 0x45, 0x00]), // ESC E 0
  ALIGN_CENTER: new Uint8Array([0x1b, 0x61, 0x01]),
  ALIGN_LEFT: new Uint8Array([0x1b, 0x61, 0x00]),
  ALIGN_RIGHT: new Uint8Array([0x1b, 0x61, 0x02]),
  CUT_PAPER: new Uint8Array([0x1d, 0x56, 0x00]), // GS V 0
  FEED_LINE: new Uint8Array([0x1b, 0x64, 0x03]), // ESC d n
  DOUBLE_HEIGHT: new Uint8Array([0x1b, 0x21, 0x10]),
  DOUBLE_WIDTH: new Uint8Array([0x1b, 0x21, 0x20]),
  NORMAL_SIZE: new Uint8Array([0x1b, 0x21, 0x00]),
  UNDERLINE_ON: new Uint8Array([0x1b, 0x2d, 0x01]),
  UNDERLINE_OFF: new Uint8Array([0x1b, 0x2d, 0x00]),
};

export function encodeText(text: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(text);
}

export function buildTestReceipt(printerName: string): Uint8Array {
  const parts: Uint8Array[] = [
    ESC_POS.INIT,
    ESC_POS.ALIGN_CENTER,
    ESC_POS.DOUBLE_HEIGHT,
    ESC_POS.DOUBLE_WIDTH,
    encodeText('TEST PRINT\n'),
    ESC_POS.NORMAL_SIZE,
    encodeText('================\n'),
    ESC_POS.ALIGN_LEFT,
    encodeText(`Printer: ${printerName}\n`),
    encodeText(`Waktu: ${new Date().toLocaleString('id-ID')}\n`),
    encodeText('================\n'),
    ESC_POS.ALIGN_CENTER,
    ESC_POS.BOLD_ON,
    encodeText('KONEKSI BERHASIL ✓\n'),
    ESC_POS.BOLD_OFF,
    encodeText('Kasir UMKM siap pakai\n'),
    ESC_POS.FEED_LINE,
    ESC_POS.FEED_LINE,
    ESC_POS.CUT_PAPER,
  ];

  const totalLength = parts.reduce((sum, p) => sum + p.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const p of parts) {
    result.set(p, offset);
    offset += p.length;
  }
  return result;
}

// ---------- KIRIM KE PRINTER ----------
export async function sendToBluetoothPrinter(device: BluetoothDevice, data: Uint8Array): Promise<void> {
  const server = await device.gatt?.connect();
  if (!server) throw new Error('Gagal konek ke GATT server');

  // Cari service thermal printer (biasanya 0x18f0 atau 0x18f1)
  let service: BluetoothRemoteGATTService | null = null;
  try {
    service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
  } catch {
    // Fallback: ambil service pertama yang punya write characteristic
    const services = await server.getPrimaryServices();
    for (const s of services) {
      const chars = await s.getCharacteristics();
      const writable = chars.find(c => c.properties.write || c.properties.writeWithoutResponse);
      if (writable) {
        service = s;
        break;
      }
    }
  }

  if (!service) throw new Error('Tidak ditemukan service printer yang kompatibel');

  const characteristics = await service.getCharacteristics();
  const writableChar = characteristics.find(
    c => c.properties.write || c.properties.writeWithoutResponse
  );

  if (!writableChar) throw new Error('Tidak ditemukan characteristic writable');

  // Kirim per chunk (max 20 bytes per packet untuk BLE)
  const chunkSize = 20;
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    await writableChar.writeValue(chunk);
    // Small delay biar printer tidak kelewat buffer
    await new Promise(r => setTimeout(r, 10));
  }
}

export async function testPrintBluetooth(printer?: BluetoothPrinterInfo): Promise<{ success: boolean; message: string }> {
  try {
    let target = printer || await getCachedPrinter();
    if (!target) {
      return { success: false, message: 'Belum ada printer tersimpan. Pilih printer dulu.' };
    }

    // If device is placeholder, request it again
    let device = target.device;
    if (!device.gatt) {
      device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['000018f0-0000-1000-8000-00805f9b34fb'] }],
        optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb', '49535343-fe7d-4ae5-8fa9-9fafd205e455'],
      });
      // Update cache
      localStorage.setItem('kasir_bt_printer_id', device.id);
      localStorage.setItem('kasir_bt_printer_name', device.name || '');
      cachedPrinter = { ...target, device, id: device.id };
    }

    if (device.gatt?.connected === false) {
      await device.gatt?.connect();
    }

    const testData = buildTestReceipt(target.name);
    await sendToBluetoothPrinter(device, testData);

    return { success: true, message: `Test print ke "${target.name}" berhasil!` };
  } catch (err: any) {
    return { success: false, message: err.message || 'Test print gagal' };
  }
}