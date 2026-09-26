"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingCart, Plus, Minus, Store, User, Search, Trash2, CheckCircle, Pencil, Loader2, X, Check, Filter, Menu, Car, FileText, Bed, Barcode, Printer, FileSpreadsheet, ChefHat, Package
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { toast } from 'sonner';
import { useAuth, SignInButton, UserButton, useUser } from '@clerk/nextjs';

import { CustomUserButton } from '@/components/CustomUserButton';
import { CopyBookingLinkButton } from '@/components/CopyBookingLinkButton';
import { Pagination } from '@/components/Pagination';
import { printBluetoothReceipt, isBluetoothSupported } from '@/lib/bluetooth-printer';
import { isRentalTravelCategory, isPureServiceCategory, detectRentalItemType, getTenantRentalType } from '@/lib/business-category';
import { resolveRentalNiche, RENTAL_NICHE_CONFIG } from '@/lib/rental-filter';
import { isFnBCategory } from '@/lib/navigation';
import { humanizeError } from '@/lib/error-mapper';
import { routeOrderItems, isBarItem } from '@/lib/printer-routing';
import { useOffline } from '@/components/OfflineProvider';
import nextDynamic from 'next/dynamic';

const PrinterHelpModal = nextDynamic(() => import('@/components/PrinterHelpModal'), {
  ssr: false,
});
const FnbModifierModal = nextDynamic(() => import('@/components/FnbModifierModal'), {
  ssr: false,
});
const TutorialOverlay = nextDynamic(() => import('@/components/TutorialOverlay'), {
  ssr: false,
});
const TableGridModal = nextDynamic(() => import('@/components/TableGridModal'), {
  ssr: false,
});
const SplitBillModal = nextDynamic(() => import('@/components/SplitBillModal'), {
  ssr: false,
});
const PrinterSetupModal = nextDynamic(() => import('@/components/PrinterSetupModal'), {
  ssr: false,
});
const TaxExportModal = nextDynamic(() => import('@/components/TaxExportModal'), {
  ssr: false,
});
const OnboardingWizard = nextDynamic(() => import('@/components/OnboardingWizard'), {
  ssr: false,
});
import InvoiceRentalA4 from '@/components/InvoiceRentalA4';

export const dynamic = 'force-dynamic';

// --- TIPE DATA ---
type Product = {
  id: number;
  name: string;
  hargaJual: number;
  category: string;
  image: string;
  stock: number;
  discount: number;
  kodeBarang?: string | null;
  minStockThreshold?: number | null;
  employeeCommission?: number | null;
  isService?: boolean;
  description?: string | null;
};

type CartItem = Product & { cartItemId: string; qty: number; note?: string; workerId?: string; serviceDuration?: number; };
type OrderStatus = 'pending' | 'cooking' | 'ready' | 'completed';

type Employee = {
  id: string;
  name: string;
  email: string;
};

type Transaction = {
  id: string;
  date: string;
  time: string;
  timestamp: number;
  customerName: string;
  items: CartItem[];
  total: number;
  method: 'cash' | 'qris';
  status: OrderStatus;
  tableId?: string;
  cashierId?: string;
  discount?: number;
  // Rental & Travel fields
  rentalMode?: 'property' | 'vehicle' | 'equipment';
  driverName?: string;
  licensePlate?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
  serviceDate?: string;
  guarantee?: string;
  downPayment?: number;
  remainingBalance?: number;
  bookingId?: string | null;
};


function QueueModal({ isOpen, onClose, onProcess, isRental }: { isOpen: boolean, onClose: () => void, onProcess: (b: any) => void, isRental?: boolean }) {
  const [selectedQueueDate, setSelectedQueueDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  const fetcher = (args: string | [string, string]) => fetch(Array.isArray(args) ? args[0] : args).then(r => r.json());
  const { user } = useUser();
  const currentTenantId = user?.publicMetadata?.role === 'CASHIER' ? user?.publicMetadata?.tenantId : user?.id;
  const { data, error, isLoading } = useSWR(
    isOpen && currentTenantId ? [`/api/booking/today?date=${selectedQueueDate}`, currentTenantId as string] : null,
    fetcher,
    {
      keepPreviousData: true,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-900 truncate pr-4 flex items-center gap-2">
            📋 {isRental ? "Tarik Pesanan Online" : "Tarik Antrean Online"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-50 rounded-full shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 pt-4 pb-2 bg-slate-50 border-b border-gray-100">
          <input
            type="date"
            value={selectedQueueDate}
            onChange={(e) => setSelectedQueueDate(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
          />
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto bg-slate-50">
          {(!data && !error) && (
            <div className="flex justify-center p-8">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          )}
          {error && (
            <div className="text-center p-8 text-red-500 font-medium">Gagal memuat antrean.</div>
          )}
          {data && data.length === 0 && (
            <div className="text-center p-8 text-slate-500 font-medium">Belum ada antrean untuk tanggal yang dipilih.</div>
          )}
          {data && data.length > 0 && (
            <div className="space-y-3">
              {data.map((booking: any) => {
                const isPending = booking.status === 'PENDING';
                const isInProgress = booking.status === 'IN_PROGRESS';
                const isFinished = booking.status === 'FINISHED' || booking.status === 'COMPLETED';

                const statusLabel = isInProgress ? '⚙️ Sedang Dikerjakan' : (isFinished ? '✅ Selesai' : '⏳ Menunggu');
                const statusBadgeBg = isInProgress ? 'bg-purple-50 text-purple-700 border-purple-200' : (isFinished ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200');

                return (
                  <div key={booking.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-slate-800">{booking.customerName}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBadgeBg}`}>
                          {statusLabel}
                        </span>
                      </div>
                      <span className="text-sm text-slate-600 flex items-center gap-1">
                        {booking.product ? booking.product.name : 'Layanan Custom'}
                      </span>
                      <span className="text-xs text-slate-500 mt-1">
                        Jam: {new Date(booking.bookingDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                      </span>
                    </div>
                    <button
                      onClick={() => onProcess(booking)}
                      className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-bold rounded-lg transition-colors shadow-sm text-sm"
                    >
                      {isFinished ? 'Bayar' : 'Proses'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function POSApp({ sidebar, isExpired = false, initialData, tenantName, tenantCategory, tenantPhone, tenantSlug }: { sidebar: React.ReactNode; isExpired?: boolean; initialData?: { products: Product[], totalPages: number }, tenantName?: string, tenantCategory?: string, tenantPhone?: string, tenantSlug?: string | null }) {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const currentTenantId = user?.publicMetadata?.role === 'CASHIER' ? user?.publicMetadata?.tenantId : user?.id;
  const [isClient, setIsClient] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  // --- STATE DATA DARI DATABASE ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [search, setSearch] = useState("");
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
    const [selectedFilterTab, setSelectedFilterTab] = useState("ALL");
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris'>('cash');
  const [tableId, setTableId] = useState("");
    const isFNB = isFnBCategory(tenantCategory || '');
        const isRental = isRentalTravelCategory(tenantCategory);
        const isPureJasa = isPureServiceCategory(tenantCategory);
    const { isOnline, saveTransaction, forceSync, pendingCount } = useOffline();
    const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [printType, setPrintType] = useState<'customer' | 'kitchen' | 'bar'>('customer');
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false); // State untuk keranjang mobile
  const [cashGiven, setCashGiven] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState("");
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const isSubmittingRef = React.useRef(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
    const [isSplitBillOpen, setIsSplitBillOpen] = useState(false);

    // State Tutorial Overlay (Retail First-Time User)
    const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  // State Edukasi & Modifiers
  const [isPrinterHelpOpen, setIsPrinterHelpOpen] = useState(false);
  const [isPrinterSetupOpen, setIsPrinterSetupOpen] = useState(false);
    const [printerName, setPrinterName] = useState<string>('');
    const [isTaxExportOpen, setIsTaxExportOpen] = useState(false);
      const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
      const [fnbSelectedProduct, setFnbSelectedProduct] = useState<Product | null>(null);
  const [fnbModifierNote, setFnbModifierNote] = useState('');

  // Tutorial steps for retail users
    const retailTutorialSteps = [
      { target: 'product-grid', title: 'Pilih Produk', text: 'Tap pada produk yang dibeli pelanggan. Produk akan masuk ke keranjang di sisi kanan.' },
      { target: 'cart-panel', title: 'Keranjang Belanja', text: 'Di sini daftar belanjaan pelanggan. Bisa ubah jumlah (+/-) atau hapus.' },
      { target: 'checkout-btn', title: 'Bayar Sekarang', text: 'Tekan tombol ini setelah selesai input pembayaran. Bisa pilih Tunai atau QRIS.' },
      { target: 'barcode-input', title: 'Scan Barcode Cepat', text: 'Ketik atau scan SKU/Barcode di sini lalu tekan Enter. Lebih cepat dari cari manual.' },
    ];

    // Tutorial steps for F&B users
    const fnbTutorialSteps = [
      { target: 'table-select', title: 'Pilih Meja', text: 'Pilih nomor meja pelanggan. Untuk bungkus pilih "Takeaway / Bungkus".' },
      { target: 'product-grid', title: 'Pilih Menu', text: 'Tap menu yang dipesan. Untuk catatan (less sugar, extra shot) klik item di keranjang lalu ikon pensil.' },
      { target: 'cart-panel', title: 'Keranjang & Split Bill', text: 'Cek pesanan. Bisa bagi tagih per orang (Split Bill) di sini.' },
      { target: 'checkout-btn', title: 'Bayar Sekarang', text: 'Tekan tombol bayar. Pilih Tunai atau QRIS. Struk dapur otomatis tercetak.' },
    ];

  const [tables, setTables] = useState<any[]>([]);

  useEffect(() => {
    if (isFNB) {
      fetch('/api/tables')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setTables(data);
        })
        .catch(err => console.error("Gagal load tables:", err));
    }
  }, [isFNB]);

  const getTableName = (id: string) => {
    const t = tables.find(x => x.id === id);
    return t ? t.name : id;
  };

  // State Ukuran Kertas Cetak
  const [documentPaperSize, setDocumentPaperSize] = useState<'A4' | 'A5'>('A4');
  const [thermalPaperSize, setThermalPaperSize] = useState<'58mm' | '80mm'>('58mm');
  const [rentalPrintFormat, setRentalPrintFormat] = useState<'document' | 'thermal'>('document');
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);

  useEffect(() => {
    const savedDocSize = localStorage.getItem('kasir_doc_paper_size') as 'A4' | 'A5';
    if (savedDocSize && (savedDocSize === 'A4' || savedDocSize === 'A5')) {
      setDocumentPaperSize(savedDocSize);
    }
    const savedThermalSize = localStorage.getItem('kasir_thermal_paper_size') as '58mm' | '80mm';
    if (savedThermalSize && (savedThermalSize === '58mm' || savedThermalSize === '80mm')) {
      setThermalPaperSize(savedThermalSize);
    }
    const savedRentalFormat = localStorage.getItem('kasir_rental_print_format') as 'document' | 'thermal';
    if (savedRentalFormat && (savedRentalFormat === 'document' || savedRentalFormat === 'thermal')) {
      setRentalPrintFormat(savedRentalFormat);
    }
  }, []);

  // State Rental & Travel
      const [isRentalFormModalOpen, setIsRentalFormModalOpen] = useState(false);
      const [rentalMode, setRentalMode] = useState<'property' | 'vehicle' | 'equipment'>('vehicle');
      const [rentalInfo, setRentalInfo] = useState({
          driverName: '',
          licensePlate: '',
          pickupLocation: '',
          dropoffLocation: '',
          startDate: '',
          endDate: '',
          guarantee: '',
          returnTime: '',
          deposit: 0,
          conditionNotes: '',
          pickupTime: '08:00',
        });

  // State Jasa
  const [serviceDate, setServiceDate] = useState("");

  // State DP
  const [isDownPayment, setIsDownPayment] = useState(false);
  const [downPaymentInput, setDownPaymentInput] = useState("");


  // --- MANTRA AMBIL DATA DARI NEON (SWR Auto-Refresh) ---
  const fetcher = async (args: string | [string, string]) => {
    const url = Array.isArray(args) ? args[0] : args;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      if (res.status === 401) return { products: [], totalPages: 1 };
      throw new Error("Gagal mengambil data");
    }
    return res.json();
  };

  const queryUrl = `/api/products?page=${currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(search)}&category=${encodeURIComponent(isRental || isPureJasa || isFNB ? "" : (selectedFilterTab === "ALL" ? "" : selectedFilterTab))}`;
  const { data: swrResponse, error, mutate } = useSWR<{ products: Product[], totalPages: number }>(
    queryUrl && currentTenantId ? [queryUrl, currentTenantId as string] : null,
    fetcher,
    {
      fallbackData: initialData,
      keepPreviousData: true,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  const rawProducts = swrResponse?.products || [];
        const totalPages = swrResponse?.totalPages || 1;

        // Resolve rental niche from tenant category / catalog / tenant name
        const niche = useMemo(() => resolveRentalNiche(tenantCategory, tenantName, rawProducts), [tenantCategory, tenantName, rawProducts]);
        const config = niche ? RENTAL_NICHE_CONFIG[niche] : null;

        // Filter tabs from niche config (always 3 tabs: Semua, Unit, Addon) - only for rental
                const filterTabs = useMemo(() => {
                  if (!isRental || !config) return [];
                  return [
                    { value: "ALL", label: "Semua" },
                    { value: "UNIT", label: config.unitLabel },
                    { value: "ADDON", label: config.addonLabel },
                  ];
                }, [isRental, config]);

                // Filter tabs for jasa/servis (3 tabs: Semua, Jasa/Servis, Produk/Barang)
                        const jasaFilterTabs = useMemo(() => {
                          if (!isPureJasa) return [];
                          return [
                            { value: "ALL", label: "Semua" },
                            { value: "Jasa / Servis", label: "Jasa / Servis" },
                            { value: "Produk / Barang", label: "Produk / Barang" },
                          ];
                        }, [isPureJasa]);

                        // Filter tabs for FNB (static categories from template)
                        const fnbFilterTabs = useMemo(() => {
                          if (!isFNB) return [];
                          return [
                            { value: "ALL", label: "Semua" },
                            { value: "Makanan", label: "Makanan" },
                            { value: "Minuman", label: "Minuman" },
                            { value: "Snack", label: "Snack" },
                            { value: "Paket", label: "Paket" },
                          ];
                        }, [isFNB]);

                // Instant Client-side Filter untuk Respons 0ms (Filter Tab + Pencarian)
                        const filteredProducts = useMemo(() => {
                          if (!rawProducts || rawProducts.length === 0) return [];

                          let result = rawProducts;

                          // Filter by tab (only for rental)
                          if (selectedFilterTab !== "ALL") {
                            if (isRental && config) {
                              // Try config tabs first (values: "UNIT", "ADDON")
                              if (selectedFilterTab === "UNIT") {
                                result = result.filter(p => !p.isService);
                              } else if (selectedFilterTab === "ADDON") {
                                result = result.filter(p => p.isService);
                              }
                            }
                            // Fallback: handle legacy string values even when config exists (state persistence)
                                                        if (result.length === rawProducts.length) { // no filter applied yet
                                                          const catLower = selectedFilterTab.toLowerCase().trim();
                                                          if (isRental) {
                                                            if (selectedFilterTab === "Unit Sewa" || catLower === "unit sewa" || catLower === "unit" || selectedFilterTab === "UNIT") {
                                                              result = result.filter(p => !p.isService);
                                                            } else if (selectedFilterTab === "Layanan & Add-on" || catLower.includes("layanan") || catLower.includes("add-on") || catLower.includes("tambahan") || selectedFilterTab === "ADDON") {
                                                              result = result.filter(p => p.isService || (p.category || "").toLowerCase().includes("layanan") || (p.category || "").toLowerCase().includes("tambahan"));
                                                            } else {
                                                              result = result.filter(p => (p.category || "").toLowerCase().trim() === catLower);
                                                            }
                                                          } else if (isPureJasa) {
                                                                                                                      // Jasa/servis: filter by "Jasa / Servis" vs "Produk / Barang"
                                                                                                                      if (selectedFilterTab === "Jasa / Servis" || catLower === "jasa / servis" || catLower === "jasa" || catLower === "servis") {
                                                                                                                        result = result.filter(p => p.isService || (p.category || "").toLowerCase().includes("jasa") || (p.category || "").toLowerCase().includes("servis"));
                                                                                                                      } else if (selectedFilterTab === "Produk / Barang" || catLower === "produk / barang" || catLower.includes("produk") || catLower.includes("barang")) {
                                                                                                                        result = result.filter(p => !p.isService && !(p.category || "").toLowerCase().includes("jasa") && !(p.category || "").toLowerCase().includes("servis"));
                                                                                                                      } else {
                                                                                                                        result = result.filter(p => (p.category || "").toLowerCase().trim() === catLower);
                                                                                                                      }
                                                                                                                    } else if (isFNB) {
                                                                                                                      // FNB: filter by category (Makanan, Minuman, Snack, Paket)
                                                                                                                      if (["Makanan", "Minuman", "Snack", "Paket"].includes(selectedFilterTab)) {
                                                                                                                        result = result.filter(p => (p.category || "").toLowerCase().trim() === selectedFilterTab.toLowerCase().trim());
                                                                                                                      } else {
                                                                                                                        result = result.filter(p => (p.category || "").toLowerCase().trim() === catLower);
                                                                                                                      }
                                                                                                                    } else if (catLower.includes("jasa") || catLower.includes("servis")) {
                                                            result = result.filter(p => {
                                                              const c = (p.category || "").toLowerCase().trim();
                                                              return c.includes("jasa") || c.includes("servis") || p.isService;
                                                            });
                                                          } else if (catLower.includes("produk") || catLower.includes("barang")) {
                                                            result = result.filter(p => {
                                                              const c = (p.category || "").toLowerCase().trim();
                                                              return c.includes("produk") || c.includes("barang") || c.includes("sparepart") || (!c.includes("jasa") && !c.includes("servis") && !p.isService);
                                                            });
                                                          } else {
                                                            result = result.filter(p => (p.category || "").toLowerCase().trim() === catLower);
                                                          }
                                                        }
                                                      }

                        // Filter pencarian (search)
                        if (search && search.trim() !== "") {
                          const searchLower = search.toLowerCase().trim();
                          result = result.filter(p =>
                            p.name.toLowerCase().includes(searchLower) ||
                            (p.kodeBarang && p.kodeBarang.toLowerCase().includes(searchLower))
                          );
                        }

                        return result;
                      }, [rawProducts, selectedFilterTab, search, config, isRental]);

      const products = filteredProducts;

      // Detect available rental types from actual catalog (physical units only, like admin CRUD & booking link)
      const availableRentalTypes = useMemo(() => {
        if (!isRental) return [] as ("property" | "vehicle" | "equipment")[];
        const types = new Set<"property" | "vehicle" | "equipment">();
        rawProducts.forEach(p => {
          if (p.isService) return; // only physical units
          const type = detectRentalItemType(p.name, p.description, p.category);
          if (type !== "unknown") types.add(type);
        });
        return Array.from(types);
      }, [isRental, rawProducts]);
          // Fallback to tenant category if catalog empty
          const tenantRentalType = useMemo(() => getTenantRentalType(tenantCategory), [tenantCategory]);
          const effectiveRentalTypes = availableRentalTypes.length > 0 ? availableRentalTypes : (tenantRentalType ? [tenantRentalType] : (["vehicle"] as const));
          // Lock rentalMode to first available type
          const lockedRentalType = effectiveRentalTypes[0] as "property" | "vehicle" | "equipment";

        // Auto-set rental mode from catalog/tenant when modal opens
        useEffect(() => {
          if (isRentalFormModalOpen) {
            setRentalMode(lockedRentalType);
          }
        }, [isRentalFormModalOpen, lockedRentalType]);

    // Fetch data karyawan (khusus untuk Jasa murni)
    const { data: employeesData } = useSWR<{ success: boolean, employees: Employee[] }>(
      isPureJasa && currentTenantId ? ['/api/employees', currentTenantId as string] : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      keepPreviousData: true
    }
  );
  const employees = employeesData?.employees || [];

  if (error) {
    console.error("Gagal tarik data:", error);
  }

  useEffect(() => {
      setIsClient(true);

      const savedCart = localStorage.getItem('pos_cart');
      const savedTrans = localStorage.getItem('pos_transactions');
            if (savedCart) setCart(JSON.parse(savedCart));
            if (savedTrans) setTransactions(JSON.parse(savedTrans));

            setIsInitialized(true);
   
                  // Show onboarding wizard on very first visit for Jasa business only
                                    const tenantOnboardingKey = currentTenantId ? `onboarding_completed_${currentTenantId}` : 'onboarding_completed';
                                    const onboardingCompleted = localStorage.getItem(tenantOnboardingKey) || localStorage.getItem('onboarding_completed');
                                    if (isPureJasa && !onboardingCompleted) {
                    setTimeout(() => {
                      setIsOnboardingOpen(true);
                    }, 300);
                  }

                  // Show tutorial for retail users on first visit
                              if (!isPureJasa && !isRental && !isFNB) {
        const tutorialSeen = localStorage.getItem('pos_tutorial_seen');
        if (!tutorialSeen) {
          setTimeout(() => {
            setShowTutorial(true);
            setTutorialStep(0);
          }, 500);
        }
      }

      // Show tutorial for F&B users on first visit
      if (isFNB) {
        const tutorialSeen = localStorage.getItem('pos_fnb_tutorial_seen');
        if (!tutorialSeen) {
          setTimeout(() => {
            setShowTutorial(true);
            setTutorialStep(0);
          }, 500);
        }
      }
    }, []);

  // --- LOGIC LAINNYA ---
  useEffect(() => {
    if (isClient && isInitialized) {
      localStorage.setItem('pos_cart', JSON.stringify(cart));
      localStorage.setItem('pos_transactions', JSON.stringify(transactions));
    }
  }, [cart, transactions, isClient, isInitialized]);

  // --- HELPER KALKULASI STOK ---
    const getRemainingStock = (product: Product) => {
      // Rental & Jasa Murni: tidak pakai stok kuantitas, pakai ketersediaan kalender/jadwal
      if (isRental || isPureJasa) return 999999;
      const qtyInCart = cart.filter(item => item.id === product.id).reduce((acc, curr) => acc + curr.qty, 0);
      return product.stock - qtyInCart;
    };

  const addToCart = (product: Product, note?: string) => {
    const remaining = getRemainingStock(product);
    if (remaining <= 0) {
      toast.error(`Stok ${product.name} telah habis!`, { id: 'stock-error' });
      return;
    }

    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(8);
      }
    } catch {}

    const finalPrice = (product.discount && product.discount > 0) ? product.hargaJual - product.discount : product.hargaJual;
    const cartProduct = { ...product, hargaJual: finalPrice };

    setCart((prev) => {
          const defaultWorkerId = isPureJasa ? (employees.length === 0 ? "admin_owner" : (employees.length === 1 ? employees[0].id : undefined)) : undefined;
          const cleanNote = note ? note.trim() : undefined;

          // Cari apakah item yang sama persis sudah ada di keranjang
          const existingIndex = prev.findIndex((item) => {
            const sameProduct = item.id === cartProduct.id;
            const sameNote = (item.note || "") === (cleanNote || "");
            const sameWorker = !isPureJasa || item.workerId === defaultWorkerId;
            return sameProduct && sameNote && sameWorker;
          });

          if (existingIndex !== -1) {
            return prev.map((item, idx) =>
              idx === existingIndex ? { ...item, qty: item.qty + 1 } : item
            );
          }

          return [
            ...prev,
            {
              ...cartProduct,
              cartItemId: crypto.randomUUID(),
              qty: 1,
              note: cleanNote,
              ...(isPureJasa ? { workerId: defaultWorkerId } : {}),
            },
          ];
        });
    toast.success(`+1 ${product.name}`, { id: 'cart-add-toast', duration: 1000 });
  };

  // --- AUDIO FEEDBACK & BARCODE SCANNER LOGIC ---
  const playBeep = (success: boolean) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (success) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(280, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {
      // Audio context blocked or unsupported
    }
  };

  const [barcodeInput, setBarcodeInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const processBarcodeScan = async (rawCode: string) => {
    const code = rawCode.trim();
    if (!code) return;

    setIsScanning(true);
    try {
      const cleanCode = code.toLowerCase();
      // 1. Cek di daftar produk lokal saat ini
      let matched = products.find(p => p.kodeBarang && p.kodeBarang.toLowerCase() === cleanCode);

      // 2. Jika tidak ada di halaman saat ini, cari via API
      if (!matched) {
        const res = await fetch(`/api/products?search=${encodeURIComponent(code)}&limit=10`);
        if (res.ok) {
          const resData = await res.json();
          const apiProducts: Product[] = resData.products || [];
          matched = apiProducts.find(p => p.kodeBarang && p.kodeBarang.toLowerCase() === cleanCode)
            || apiProducts.find(p => p.kodeBarang && p.kodeBarang.toLowerCase().includes(cleanCode))
            || apiProducts[0];
        }
      }

      if (matched) {
        const remaining = getRemainingStock(matched);
        if (remaining <= 0) {
          toast.error(`Stok ${matched.name} telah habis!`);
          playBeep(false);
          return;
        }
        addToCart(matched);
        playBeep(true);
      } else {
        toast.error(`SKU / Barcode "${code}" tidak ditemukan!`);
        playBeep(false);
      }
    } catch (err) {
      console.error("Barcode scan error:", err);
      toast.error(`Gagal memproses barcode "${code}"`);
      playBeep(false);
    } finally {
      setIsScanning(false);
      setBarcodeInput("");
    }
  };

  // Hardware Barcode Scanner Listener (Retail & F&B Only)
    useEffect(() => {
      if (isPureJasa || isRental) return;

    let buffer = '';
    let lastKeyTime = Date.now();
    let isRapidStreak = false;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const now = Date.now();
      const diff = now - lastKeyTime;
      lastKeyTime = now;

      // Jika pengguna sedang mengetik di input manual barcode, biarkan handler onKeyDown lokal input yang memproses
      const activeEl = document.activeElement;
      if (activeEl && (activeEl as HTMLElement).id === 'manual-barcode-input') {
        return;
      }

      // Scanner hardware biasanya mengetik sangat cepat (10ms - 50ms).
      // Jika jeda antar karakter > 70ms, reset buffer karena kemungkinan ketikan manual manusia
      if (diff > 70) {
        buffer = '';
        isRapidStreak = false;
      } else {
        isRapidStreak = true;
      }

      if (e.key === 'Enter') {
        if (buffer.length >= 2 && isRapidStreak) {
          e.preventDefault();
          const codeToProcess = buffer.trim();
          buffer = '';
          isRapidStreak = false;
          processBarcodeScan(codeToProcess);
        } else {
          buffer = '';
          isRapidStreak = false;
        }
        return;
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        buffer += e.key;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isPureJasa, isRental, products]);

  const openFnbModal = (product: Product) => {
    setFnbSelectedProduct(product);
    setFnbModifierNote('');
  };

  const submitFnbModifier = (e: React.FormEvent) => {
    e.preventDefault();
    if (fnbSelectedProduct) {
      addToCart(fnbSelectedProduct, fnbModifierNote.trim());
      setFnbSelectedProduct(null);
      setFnbModifierNote('');
    }
  };

  const updateQty = (cartItemId: string, delta: number) => {
    const cartItem = cart.find(item => item.cartItemId === cartItemId);
    if (delta > 0 && cartItem) {
      const remaining = cartItem.stock - cart.filter(i => i.id === cartItem.id).reduce((acc, curr) => acc + curr.qty, 0);
      if (remaining <= 0) {
        toast.error(`Stok ${cartItem.name} tidak mencukupi!`, { id: 'stock-error' });
        return;
      }
    }
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(6);
      }
    } catch {}
    setCart((prev) => prev.map((item) => item.cartItemId === cartItemId ? { ...item, qty: Math.max(0, item.qty + delta) } : item).filter((item) => item.qty > 0));
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    if (confirm("Apakah Anda yakin ingin mengosongkan keranjang?")) {
      setCart([]);
      setCustomerName("");
      setTableId("");
      setCashGiven("");
      toast.info("Keranjang dikosongkan");
    }
  };

  const saveNote = (cartItemId: string) => {
    setCart(prev => prev.map(item => item.cartItemId === cartItemId ? { ...item, note: tempNote } : item));
    setEditingNoteId(null);
    toast.success("Catatan disimpan");
  };

  // --- KALKULASI TOTAL ---
  const subTotal = cart.reduce((acc, item) => acc + item.hargaJual * item.qty, 0);
  const grandTotal = subTotal;

  const parsedDownPayment = parseInt(downPaymentInput.replace(/[^0-9]/g, '') || "0");
  const currentTotalToPay = isDownPayment ? parsedDownPayment : grandTotal;
  const remainingBalance = isDownPayment ? Math.max(0, grandTotal - parsedDownPayment) : 0;

  const parsedCashGiven = parseInt(cashGiven.replace(/[^0-9]/g, '') || "0");
  const isCashInsufficient = paymentMethod === 'cash' && cart.length > 0 && parsedCashGiven < currentTotalToPay;

  // --- OFFLINE SYNC LOGIC ---
  const syncOfflineTransactions = async () => {
    if (!navigator.onLine) return;
    const offlineTxsStr = localStorage.getItem('offline_transactions');
    if (!offlineTxsStr) return;

    const offlineTxs: Transaction[] = JSON.parse(offlineTxsStr);
    if (offlineTxs.length === 0) return;

    let successCount = 0;
    for (const tx of offlineTxs) {
      try {
        const res = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tx)
        });
        if (res.ok) {
          successCount++;
        }
      } catch (err) {
        console.error("Failed to sync offline transaction:", err);
        break; // Stop syncing if internet drops again
      }
    }

    // Remove successful ones
    if (successCount > 0) {
      const remainingTxs = offlineTxs.slice(successCount);
      localStorage.setItem('offline_transactions', JSON.stringify(remainingTxs));
      toast.success(`${successCount} transaksi offline berhasil disinkronisasi ke server!`);
      mutate();
    }
  };

  useEffect(() => {
    window.addEventListener('online', syncOfflineTransactions);
    // Attempt to sync on mount if online
    if (navigator.onLine) {
      syncOfflineTransactions();
    }
    return () => window.removeEventListener('online', syncOfflineTransactions);
  }, []);

  const handleCheckout = async () => {
      if (isSubmittingRef.current || isCheckoutLoading) return;
      if (!customerName.trim()) return toast.error("Isi Nama Pelanggan!");
      if (isFNB && !tableId) return toast.error("Pilih Meja atau Takeaway!");
      if (cart.length === 0) return toast.error("Keranjang masih kosong!");
      if (isCashInsufficient) return toast.error("Uang diterima kurang dari total belanja!");
      if (isPureJasa && cart.some(item => !item.workerId)) return toast.error("Pastikan semua layanan telah memilih Staf / Teknisi / Kapster!");
      // Validasi Rental
      if (isRental && rentalMode === 'property' && !rentalInfo.driverName.trim()) return toast.error("Isi No. WhatsApp / Kontak Tamu untuk transaksi sewa!");
      if (isRental && rentalMode === 'property' && !rentalInfo.licensePlate.trim()) return toast.error("Isi No. Kamar / Kode Unit untuk transaksi sewa!");
      if (isRental && rentalMode === 'vehicle' && !rentalInfo.driverName.trim()) return toast.error("Isi Operator / Driver / Supir untuk transaksi sewa!");
      if (isRental && rentalMode === 'vehicle' && !rentalInfo.licensePlate.trim()) return toast.error("Isi No. Seri / Kode Unit / Plat Nomor untuk transaksi sewa!");
      if (isRental && rentalMode === 'equipment' && !rentalInfo.driverName.trim()) return toast.error("Isi No. WhatsApp / Kontak Penyewa untuk transaksi sewa alat!");
      if (isRental && rentalMode === 'equipment' && !rentalInfo.licensePlate.trim()) return toast.error("Isi Kode Unit / Nama Alat untuk transaksi sewa alat!");
      if (isRental && rentalMode === 'equipment' && !rentalInfo.returnTime) return toast.error("Isi Jam Kembali untuk transaksi sewa alat!");

    isSubmittingRef.current = true;
    setIsCheckoutLoading(true);
    const now = new Date();
    const newTransaction: Transaction = {
      id: `#${Math.floor(1000 + Math.random() * 9000)}`,
      date: now.toLocaleDateString('en-GB'),
      time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      timestamp: now.getTime(),
      customerName: customerName.trim(),
      items: [...cart],
      total: Math.round(grandTotal),
      method: paymentMethod,
      cashierId: userId || undefined,
            status: isFNB ? 'pending' : (remainingBalance > 0 ? 'pending' : 'completed'), // F&B: pending for KDS, Non-F&B: pending if remainingBalance else completed
            ...(isFNB && { tableId: (tableId === 'takeaway' || tableId === 'TAKEAWAY') ? undefined : tableId }),
      ...(isPureJasa && { serviceDate: serviceDate || undefined }),
      // Sertakan data rental jika mode Rental
            ...(isRental && {
              rentalMode,
              driverName: rentalInfo.driverName.trim() || undefined,
              licensePlate: rentalInfo.licensePlate.trim() || undefined,
              pickupLocation: rentalInfo.pickupLocation?.trim() || undefined,
              dropoffLocation: rentalInfo.dropoffLocation?.trim() || undefined,
              startDate: rentalInfo.startDate || undefined,
              endDate: rentalInfo.endDate || undefined,
              guarantee: rentalInfo.guarantee.trim() || undefined,
              returnTime: rentalInfo.returnTime || undefined,
              deposit: rentalInfo.deposit || 0,
              conditionNotes: rentalInfo.conditionNotes?.trim() || undefined,
              pickupTime: rentalInfo.pickupTime || undefined,
            }),
      downPayment: isDownPayment ? parsedDownPayment : 0,
      remainingBalance: remainingBalance,
      bookingId: activeBookingId,
    };

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction)
      });

      if (!res.ok) {
        let errorMsg = "Gagal menyimpan transaksi";
        try {
          const errorData = await res.json();
          errorMsg = errorData.message || errorData.error || errorMsg;
        } catch (parseErr) {
          errorMsg = await res.text();
        }
        throw new Error(errorMsg);
      }

      setTransactions([newTransaction, ...transactions]);
      setLastTransaction(newTransaction);
      setIsModalOpen(true); // Tampilkan modal sukses

      // Optimistic UI: Kurangi stok lokal secara instan (<50ms)
      mutate(
        (current) => {
          if (!current) return current;
          const cartItemMap = new Map<number, number>();
          cart.forEach(item => {
            cartItemMap.set(item.id, (cartItemMap.get(item.id) || 0) + item.qty);
          });
          return {
                      ...current,
                      products: current.products.map(p => {
                        const boughtQty = cartItemMap.get(p.id) || 0;
                                      if (boughtQty > 0 && !isPureJasa && !isRental) {
                                        return { ...p, stock: Math.max(0, p.stock - boughtQty) };
                                      }
                        return p;
                      })
                    };
        },
        { revalidate: true }
      );

    } catch (err: any) {
          if (!isOnline || err.message === 'Failed to fetch' || err.name === 'TypeError') {
            // OFFLINE MODE: Save to IndexedDB via OfflineProvider
            await saveTransaction(newTransaction);

            setTransactions([newTransaction, ...transactions]);
            setLastTransaction(newTransaction);
            setIsModalOpen(true);
            toast.success("Mode Offline: Transaksi disimpan. Akan disinkronisasi otomatis saat online.");
          } else {
            toast.error(humanizeError(err));
            console.error("Checkout Error:", err);
      }
    } finally {
      setIsCheckoutLoading(false);
      isSubmittingRef.current = false;
    }
  };

  const closeCheckoutModal = () => {
    setIsModalOpen(false);
    setIsMobileCartOpen(false); // Tutup juga modal keranjang mobile jika sedang terbuka
    setCart([]);
    setCustomerName("");
        setTableId("");
        setCashGiven("");
        setServiceDate("");
        setIsDownPayment(false);
        setDownPaymentInput("");
        setRentalInfo({ driverName: '', licensePlate: '', pickupLocation: '', dropoffLocation: '', startDate: '', endDate: '', guarantee: '', returnTime: '', deposit: 0, conditionNotes: '', pickupTime: '08:00' });
        setPrintType('customer');
  };

  const sendWhatsAppReceipt = () => {
    if (!lastTransaction) return;

    const storeName = tenantName || "PJTECH KASIR POS";
    let text = `*STRUK PEMBELIAN*\n*${storeName}*\n`;
    text += `--------------------------------\n`;
    text += `Waktu : ${lastTransaction.date} ${lastTransaction.time}\n`;
    text += `Kasir : ${user?.fullName || user?.firstName || 'Admin'}\n`;
    text += `Pelanggan : ${lastTransaction.customerName}\n`;
    if (lastTransaction.tableId) text += `Nomor Meja: ${getTableName(lastTransaction.tableId)}\n`;
    // Data Jasa
    if (lastTransaction.serviceDate) {
      text += `Waktu Layanan: ${new Date(lastTransaction.serviceDate).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}\n`;
    }
    // Data rental
    if (lastTransaction.pickupLocation) text += `Titik Jemput: ${lastTransaction.pickupLocation}\n`;
    if (lastTransaction.dropoffLocation) text += `Titik Tujuan: ${lastTransaction.dropoffLocation}\n`;
    if (lastTransaction.startDate || lastTransaction.endDate)
      text += `Tgl Sewa  : ${lastTransaction.startDate ?? '?'} s/d ${lastTransaction.endDate ?? '?'}\n`;
    if (lastTransaction.driverName) {
      const driverLabel = lastTransaction.rentalMode === 'property' || lastTransaction.rentalMode === 'equipment' ? 'No. Kontak' : 'Supir     ';
      text += `${driverLabel}: ${lastTransaction.driverName}\n`;
    }
    if (lastTransaction.licensePlate) {
      const plateLabel = lastTransaction.rentalMode === 'property' ? 'No. Kamar ' : lastTransaction.rentalMode === 'equipment' ? 'Kode Unit ' : 'Plat Kend ';
      text += `${plateLabel}: ${lastTransaction.licensePlate}\n`;
    }
    if (lastTransaction.guarantee) text += `Jaminan   : ${lastTransaction.guarantee}\n`;
    text += `ID Transaksi: ${lastTransaction.id}\n`;
    text += `--------------------------------\n`;

    lastTransaction.items.forEach(item => {
      text += `${item.name}\n`;
      text += `${item.qty} x ${formatRupiah(item.hargaJual)} = ${formatRupiah(item.qty * item.hargaJual)}\n`;
      if (item.note) text += `Catatan: ${item.note}\n`;
    });

    text += `--------------------------------\n`;
    text += `--------------------------------\n`;
    text += `*Total Belanja : ${formatRupiah(lastTransaction.total)}*\n`;

    if (lastTransaction.downPayment && lastTransaction.downPayment > 0) {
      text += `Uang Muka (DP) : ${formatRupiah(lastTransaction.downPayment)}\n`;
      text += `Sisa Tagihan   : ${formatRupiah(lastTransaction.remainingBalance || 0)}\n`;
    }

    text += `Metode    : ${lastTransaction.method.toUpperCase()}\n`;

    if (lastTransaction.method === 'cash') {
      const cash = parseInt(cashGiven.replace(/[^0-9]/g, '') || "0");
      text += `Tunai     : ${formatRupiah(cash)}\n`;
      const expectedTotal = lastTransaction.downPayment ? lastTransaction.downPayment : lastTransaction.total;
      text += `Kembalian : ${formatRupiah(cash - expectedTotal)}\n`;
    }

    text += `--------------------------------\n`;
    text += `Terima kasih atas kunjungan Anda!\n`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  const printReceipt = (type: 'customer' | 'kitchen' | 'bar' = 'customer') => {
      setPrintType(type);
      setTimeout(() => {
        window.print();
      }, 150);
    };

  const handleBluetoothPrint = async () => {
    if (!lastTransaction) return;
    const parsedCash = parseInt(cashGiven.replace(/[^0-9]/g, '') || '0');
    const bWidth = thermalPaperSize === '80mm' ? 42 : 32;
    await printBluetoothReceipt({
      storeName: tenantName || 'PJTECH KASIR POS',
      storeCategory: tenantCategory,
      date: lastTransaction.date,
      time: lastTransaction.time,
      transactionId: lastTransaction.id,
      customerName: lastTransaction.customerName,
      tableId: lastTransaction.tableId ? getTableName(lastTransaction.tableId) : undefined,
      // Data rental & Jasa
      pickupLocation: lastTransaction.pickupLocation,
      dropoffLocation: lastTransaction.dropoffLocation,
      startDate: lastTransaction.startDate,
      endDate: lastTransaction.endDate,
      driverName: lastTransaction.driverName,
      licensePlate: lastTransaction.licensePlate,
      serviceDate: lastTransaction.serviceDate,
      guarantee: lastTransaction.guarantee,
      downPayment: lastTransaction.downPayment,
      remainingBalance: lastTransaction.remainingBalance,
      items: lastTransaction.items.map(i => ({
        name: i.name,
        qty: i.qty,
        price: i.hargaJual,
      })),
      total: lastTransaction.total,
      method: lastTransaction.method,
      cashGiven: lastTransaction.method === 'cash' ? parsedCash : undefined,
    }, bWidth);
  };

  const handleDownloadImage = async () => {
    if (!lastTransaction) return;
    setIsDownloadingImage(true);
    const toastId = toast.loading("Menyiapkan berkas gambar HD...");
    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const isDocument = (isRental || isPureJasa) && rentalPrintFormat === 'document';
      const targetId = isDocument ? 'invoice-a4-print-target' : 'receipt-thermal-print-target';
      const element = document.getElementById(targetId);
      if (!element) {
        toast.error("Template cetak tidak ditemukan.", { id: toastId });
        return;
      }

      // Buat offscreen capture container di area positif koordinat layar
      const captureContainer = document.createElement('div');
      captureContainer.style.position = 'fixed';
      captureContainer.style.left = '0';
      captureContainer.style.top = '0';
      captureContainer.style.zIndex = '-99999';
      captureContainer.style.pointerEvents = 'none';
      captureContainer.style.opacity = '1';
      captureContainer.style.background = '#ffffff';
      captureContainer.style.overflow = 'visible';

      // Kloning elemen target agar tidak mengganggu DOM aktif
      const clone = element.cloneNode(true) as HTMLElement;
      clone.id = 'active-image-capture-clone';
      clone.classList.remove('hidden', 'print:hidden', 'print:block');
      clone.style.display = 'block';
      clone.style.visibility = 'visible';
      clone.style.opacity = '1';

      if (isDocument) {
        const w = documentPaperSize === 'A5' ? 559 : 794;
        clone.style.width = `${w}px`;
        clone.style.minWidth = `${w}px`;
        clone.style.maxWidth = `${w}px`;
        clone.style.padding = documentPaperSize === 'A5' ? '25px 30px' : '40px 48px';
      } else {
        const w = thermalPaperSize === '80mm' ? 360 : 280;
        clone.style.width = `${w}px`;
        clone.style.minWidth = `${w}px`;
        clone.style.maxWidth = `${w}px`;
        clone.style.padding = '12px 14px';
      }

      captureContainer.appendChild(clone);
      document.body.appendChild(captureContainer);

      // Tunggu 1 frame agar browser menyelesaikan kalkulasi tata letak dan font
      await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 150)));

      const canvas = await html2canvas(clone, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: clone.offsetWidth,
        height: clone.offsetHeight,
      });

      document.body.removeChild(captureContainer);

      // Konversi canvas ke Blob
      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast.error("Gagal memproses gambar berkas.", { id: toastId });
          return;
        }

        const filename = `${isDocument ? 'Invoice' : 'Struk'}-${lastTransaction.id}.png`;
        const file = new File([blob], filename, { type: 'image/png' });

        // 1. Dukungan Web Share API untuk perangkat mobile (Android & iOS)
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: filename,
              text: `Bukti Transaksi #${lastTransaction.id} - ${tenantName || 'PJTECH UMKM'}`,
            });
            toast.success("Berhasil dibagikan!", { id: toastId });
            return;
          } catch (shareErr: any) {
            if (shareErr.name === 'AbortError') {
              toast.dismiss(toastId);
              return;
            }
            console.warn("Share sheet dibatalkan/gagal, beralih ke unduh langsung:", shareErr);
          }
        }

        // 2. Download via Object URL (Desktop & fallback mobile)
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 10000);
        toast.success(`Berhasil mengunduh ${filename}!`, { id: toastId });
      }, 'image/png');
    } catch (err) {
      console.error("Gagal mengunduh gambar:", err);
      toast.error("Gagal membuat gambar berkas.", { id: toastId });
    } finally {
      setIsDownloadingImage(false);
    }
  };

  const handleProcessQueue = (booking: any) => {
    setCustomerName(booking.customerName);
    setActiveBookingId(booking.id);

    if (isPureJasa && booking.bookingDate) {
      const d = new Date(booking.bookingDate);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const date = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      setServiceDate(`${year}-${month}-${date}T${hours}:${minutes}`);
    }

    setCart([]);
    if (booking.product) {
      addToCart(booking.product, booking.notes);
    }

    if (isRental) {
      setRentalInfo(prev => ({
        ...prev,
        pickupLocation: booking.pickupLocation || '',
        dropoffLocation: booking.dropoffLocation || '',
        startDate: booking.startDate ? booking.startDate.split('T')[0] : '',
        endDate: booking.endDate ? booking.endDate.split('T')[0] : '',
      }));
    }

    setIsQueueModalOpen(false);
    toast.success("Data antrean berhasil ditarik ke keranjang");
  };

  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  if (!isClient) return null;

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-center p-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        {/* Dekorasi Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>

        {/* Sisi Kiri: Value Proposition */}
        <div className="hidden lg:flex flex-1 flex-col justify-center p-8 lg:p-20 z-10 order-2 lg:order-1">
          <div className="max-w-xl mx-auto lg:mx-0">
            <div className="flex items-center gap-2 mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm shadow-blue-600/30">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight leading-tight">{tenantName || "PJTECH KASIR POS"}</h2>
                <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"></span> POS Mode
                </p>
              </div>
            </div>

            <h1 className="text-3xl lg:text-5xl font-black text-slate-900 leading-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              Kelola Usaha Lebih Cerdas dengan <br className="hidden lg:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">PJTECH KASIR</span>
            </h1>

            <p className="text-lg text-slate-600 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              Tinggalkan cara manual. Mulai transformasi digital bisnis Anda dengan platform kasir cerdas yang dirancang untuk mempercepat transaksi dan memantau performa secara real-time.
            </p>

            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              {[
                "Fleksibel untuk UMKM Retail, F&B (Kafe/Resto), & Jasa / Servis",
                "Fitur Adaptif: Manajemen Meja, Barcode Stok, & Pencatatan Layanan",
                "Arsitektur Multi-tenant Terisolasi (Aman untuk Multi-Cabang)",
                "Laporan Keuangan & Tren Penjualan Real-time Akurat"
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-slate-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sisi Kanan: Action Area (Auth Card) */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-20 z-10 animate-in fade-in zoom-in-95 duration-700 delay-200 order-1 lg:order-2">
          <div className="bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 lg:p-10 max-w-md w-full relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(59,130,246,0.1)] transition-shadow duration-500">
            {/* Soft inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 pointer-events-none"></div>

            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
                <Store className="w-8 h-8 text-white" />
              </div>
              <Link href="/superadmin" className="cursor-default" tabIndex={-1}>
                <h3 className="text-sm font-bold text-blue-600 tracking-widest uppercase mb-1 hover:text-blue-600">PJTECH KASIR UMKM</h3>
              </Link>
              <h2 className="text-2xl font-black text-slate-800 mb-2">Selamat Datang</h2>
              <p className="text-slate-500 mb-8 text-sm">Masuk ke dashboard untuk melanjutkan pengelolaan bisnis Anda.</p>

              <div className="w-full space-y-3">
                <SignInButton mode="modal">
                  <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-2xl font-bold text-lg shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 active:shadow-blue-600/20 transition-all duration-200 flex items-center justify-center gap-2">
                    Masuk (Owner)
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </button>
                </SignInButton>

                <div>
                  <SignInButton mode="modal">
                    <button className="w-full bg-transparent text-slate-500 hover:text-slate-700 border-2 border-slate-200 hover:border-slate-300 py-3.5 rounded-2xl font-bold text-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2">
                      Login sebagai Karyawan
                    </button>
                  </SignInButton>
                  <p className="text-xs text-slate-500 text-center mt-2">
                    *Gunakan email & password yang diberikan oleh atasan Anda.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1 text-sm font-medium">
                <span className="text-slate-500">Pemilik Bisnis Baru?</span>
                <Link href="/sign-up" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">Daftar Toko di sini</Link>
              </div>

              <div className="mt-6 text-xs text-slate-400">
                Dengan masuk, Anda menyetujui Syarat dan Ketentuan layanan kami.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- KOMPONEN KERANJANG (Bisa digunakan di Desktop & Mobile) ---
  const renderCartContent = (isMobile = false) => (
    <>
      <div className="p-4 border-b flex justify-between items-center bg-white shadow-sm z-10 relative">
        <div className="font-bold flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-gray-700" />
                  <div className="flex items-center gap-2">
                    <span>{isPureJasa ? 'Detail Layanan' : isRental && config ? config.documentTitle : 'Keranjang'}</span>
            {cart.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-sm">
                {cart.reduce((acc, item) => acc + item.qty, 0)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {cart.length > 0 && (
            <button onClick={clearCart} className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1 bg-red-50 px-2 py-1 rounded-md">
              <Trash2 className="w-3 h-3" /> Kosongkan
            </button>
          )}
          {/* Tombol Tutup Khusus Mobile */}
          {isMobile && (
            <button onClick={() => setIsMobileCartOpen(false)} className="p-1.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col bg-slate-50 touch-pan-y [-webkit-overflow-scrolling:touch]">
              {(isPureJasa || isRental) && (
                <div className="p-3 bg-blue-50 border-b border-blue-100 flex items-center justify-between shadow-inner">
            <span className="text-sm font-medium text-blue-800">Ada pesanan online?</span>
            <button
              onClick={() => setIsQueueModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
            >
              📋 Tarik Pesanan Online
            </button>
          </div>
        )}
        <div className="p-4 space-y-3 flex-1">
          {/* Empty State Keranjang */}
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              {!isRental && <ShoppingCart className="w-16 h-16 opacity-30" />}
              <p className="text-sm font-medium text-center px-4">{isRental ? "Belum ada armada dipilih. Silakan pilih armada atau tarik pesanan online." : `Keranjang masih kosong, silakan pilih ${isPureJasa ? 'layanan' : isFNB ? 'menu' : 'produk'}`}</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.cartItemId || item.id} className="flex flex-col overflow-hidden bg-white border p-3 rounded-xl shadow-sm group hover:border-blue-200 transition-colors">
                <div className="flex flex-row justify-between items-start mb-2 gap-2">
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-bold text-sm text-gray-800 leading-tight truncate">{item.name}</span>
                    {isRental ? (
                      <div className="mt-1 flex items-center">
                        <span className="text-xs text-gray-500 font-bold mr-1">Rp</span>
                        <input
                          type="number"
                          className="text-xs p-1 border border-gray-300 rounded w-24 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          value={item.hargaJual === 0 ? '' : item.hargaJual}
                          onChange={(e) => {
                            const newPrice = parseInt(e.target.value) || 0;
                            setCart(prev => prev.map(cartItem => cartItem.cartItemId === item.cartItemId ? { ...cartItem, hargaJual: newPrice } : cartItem));
                          }}
                        />
                      </div>
                    ) : (
                      <span className="text-gray-500 font-medium text-xs mt-0.5">{formatRupiah(item.hargaJual)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => { setEditingNoteId(item.cartItemId); setTempNote(item.note || ""); }} className="text-gray-400 hover:text-blue-500 transition-colors bg-gray-50 p-1.5 rounded-md" title="+ Catatan">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => removeFromCart(item.cartItemId)} className="text-gray-400 hover:text-red-500 transition-colors bg-red-50 p-1.5 rounded-md">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Pilihan Pekerja (Khusus Jasa Murni) */}
                                {isPureJasa && (
                  <div className="mb-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Dikerjakan oleh: *</label>
                    <select
                      className="w-full text-xs p-1.5 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      value={item.workerId || (employees.length === 0 ? "admin_owner" : "")}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCart(prev => prev.map(cartItem => cartItem.cartItemId === item.cartItemId ? { ...cartItem, workerId: val } : cartItem));
                      }}
                    >
                      <option value="" disabled>-- Pilih Staf / Teknisi / Kapster --</option>
                      <option value="admin_owner">Dikerjakan oleh Admin/Pemilik</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                      ))}
                    </select>
                    {employees.length === 0 && (
                      <p className="text-[10px] text-amber-600 mt-1">
                        💡 Belum ada data staf terdaftar. Menggunakan Admin/Pemilik secara otomatis.
                      </p>
                    )}
                  </div>
                )}

                {/* Edit Catatan (Notes) */}
                {isFNB && editingNoteId === item.cartItemId ? (
                  <div className="flex gap-2 mb-3 bg-blue-50 p-2 rounded-lg border border-blue-100 items-center">
                    <input
                      type="text"
                      value={tempNote}
                      onChange={(e) => setTempNote(e.target.value)}
                      placeholder="Catatan pesanan..."
                      className="w-full text-xs p-1.5 border border-blue-200 rounded-md outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && saveNote(item.cartItemId)}
                    />
                    <button onClick={() => setEditingNoteId(null)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-4 h-4" />
                    </button>
                    <button onClick={() => saveNote(item.cartItemId)} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm border-0 transition-all duration-200 ease-in-out px-2 py-1 rounded-md text-xs font-bold">OK</button>
                  </div>
                ) : isFNB && item.note ? (
                  <p className="text-xs text-gray-500 italic mb-2">Catatan: {item.note}</p>
                ) : null}

                <div className="flex flex-row flex-wrap justify-between items-center mt-2 border-t pt-2 border-dashed border-gray-100 gap-2">
                  <p className="text-sm font-black text-blue-600">{formatRupiah(item.hargaJual * item.qty)}</p>
                  <div className="flex items-center gap-2 shrink-0 select-none">
                    <button onClick={() => updateQty(item.cartItemId, -1)} className="p-1.5 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 active:scale-90 transition-transform duration-75 text-gray-600 touch-manipulation"><Minus className="w-3 h-3" /></button>
                    <span className="font-bold w-6 text-center text-sm">{item.qty}</span>
                    <button onClick={() => updateQty(item.cartItemId, 1)} disabled={item.qty >= item.stock} className="p-1.5 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 active:scale-90 transition-transform duration-75 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Form Inputs (Scrollable along with cart) */}
        <div className="p-4 space-y-4 border-t bg-white mt-auto">

          {/* Input Nomor Meja (Khusus F&B) */}
                    {isFNB && (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold text-gray-500 block">Meja / Antrean *</label>
                          <button
                            type="button"
                            onClick={() => setIsTableModalOpen(true)}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            🪑 Buka Denah Meja
                          </button>
                        </div>

                        {/* Tombol Visual Meja Terpilih */}
                        <button
                          id="table-select"
                          type="button"
                          onClick={() => setIsTableModalOpen(true)}
                          className={`w-full p-2.5 rounded-lg border-2 text-left font-bold text-sm flex items-center justify-between transition-all ${
                            tableId === 'takeaway'
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : tableId
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                              : 'border-dashed border-gray-300 bg-gray-50 text-gray-500 hover:border-blue-400'
                          }`}
                        >
                          <span>
                            {tableId === 'takeaway'
                              ? '🛍️ Bungkus / Takeaway'
                              : tableId
                              ? `🍽️ ${getTableName(tableId)}`
                              : '👉 Klik Disini untuk Pilih Meja'}
                          </span>
                          <span className="text-xs text-blue-600 font-semibold underline">Ganti</span>
                        </button>
                      </div>
                    )}

          {/* Retail: Konter / Tunai Langsung (non-FNB, non-Pure Jasa, non-Rental) */}
                    {!isFNB && !isPureJasa && !isRental && (
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Tipe Transaksi *</label>
              <select
                value={tableId}
                onChange={(e) => setTableId(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 rounded-lg text-sm transition-all"
              >
                <option value="" disabled>-- Pilih Tipe --</option>
                <option value="counter" className="font-bold text-green-700">🛒 [Konter / Tunai Langsung]</option>
                <option value="delivery" className="font-bold text-purple-700">🚚 [Delivery / Antar]</option>
              </select>
            </div>
          )}

          {/* Form Jasa Waktu Layanan (Khursus Jasa Murni) */}
                    {isPureJasa && (
            <div className="space-y-2.5 bg-blue-50 border border-blue-200 rounded-xl p-3">
              <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
                🗓️ Jadwal Layanan
              </p>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Waktu Layanan *</label>
                <input
                  type="datetime-local"
                  min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                  className="w-full p-2.5 bg-white border border-blue-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-400 rounded-lg text-sm transition-all"
                />
              </div>
            </div>
          )}

          {/* Tombol Lengkapi Data Sewa Khusus Rental */}
          {isRental && (
            <div className="mb-2">
              <button
                onClick={() => setIsRentalFormModalOpen(true)}
                className={`w-full py-2.5 rounded-xl border-2 font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${rentalInfo.driverName && rentalInfo.licensePlate && rentalInfo.guarantee
                  ? "bg-emerald-50 text-emerald-700 border-emerald-400 hover:bg-emerald-100"
                  : "bg-amber-50 text-amber-700 border-amber-400 hover:bg-amber-100 animate-pulse"
                  }`}
              >
                <FileText className="w-5 h-5" />
                {rentalInfo.driverName && rentalInfo.licensePlate && rentalInfo.guarantee
                  ? "Data Sewa Terisi (Ubah)"
                  : "📝 Lengkapi Data Sewa / Check-in *"}
              </button>
            </div>
          )}

          {/* Input Nama Pelanggan */}
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Nama Pelanggan</label>
            <input type="text" placeholder="Masukkan nama..." className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg text-sm transition-all" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          </div>

          {/* Metode Pembayaran */}
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Metode Pembayaran</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`py-2 text-sm font-bold rounded-lg border transition-all ${paymentMethod === 'cash' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
              >
                Tunai
              </button>
              <button
                onClick={() => setPaymentMethod('qris')}
                className={`py-2 text-sm font-bold rounded-lg border transition-all ${paymentMethod === 'qris' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
              >
                QRIS
              </button>
            </div>
          </div>

          {/* Input Kembalian Jika Tunai */}
                    {paymentMethod === 'cash' && cart.length > 0 && (
                      <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Uang Diterima</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-bold">Rp</span>
                          <input
                            type="text"
                            placeholder="0"
                            className="w-full pl-9 pr-3 p-2.5 bg-white border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg text-sm font-bold text-gray-900 placeholder-gray-400 transition-all"
                            value={cashGiven}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, '');
                              setCashGiven(val ? parseInt(val).toLocaleString('id-ID') : "");
                            }}
                          />
                        </div>
                      </div>
                    )}

          {/* DP System */}
          {(isRental) && cart.length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input type="checkbox" checked={isDownPayment} onChange={(e) => setIsDownPayment(e.target.checked)} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                <span className="text-sm font-bold text-gray-700">Bayar Uang Muka (DP)</span>
              </label>
              {isDownPayment && (
                              <div className="ml-6 space-y-2">
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-bold">Rp</span>
                                  <input
                                    type="text"
                                    placeholder="Nominal DP"
                                    className="w-full pl-9 pr-3 p-2 bg-white border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-gray-900 placeholder-gray-400 transition-all"
                                    value={downPaymentInput}
                                    onChange={(e) => {
                                      const val = e.target.value.replace(/[^0-9]/g, '');
                                      setDownPaymentInput(val ? parseInt(val).toLocaleString('id-ID') : "");
                                    }}
                                  />
                                </div>
                  <div className="flex justify-between text-xs font-medium text-gray-500 bg-gray-50 p-2 rounded">
                    <span>Sisa Tagihan:</span>
                    <span className="text-red-500 font-bold">{formatRupiah(remainingBalance)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Bagian Bawah Keranjang (Checkout Total & Tombol Bayar) */}
      <div className="shrink-0 p-4 border-t bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10 relative">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-semibold text-gray-700">{formatRupiah(subTotal)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-bold text-gray-700">Total Belanja</span>
                      <span className="font-black text-xl text-blue-600">{formatRupiah(grandTotal)}</span>
                    </div>

                    {/* Tombol Split Bill (Khusus F&B saat ada isi keranjang) */}
                    {isFNB && cart.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setIsSplitBillOpen(true)}
                        className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-slate-200"
                      >
                        👥 Hitung Bagi Rata (Split Bill)
                      </button>
                    )}

          {/* Kembalian */}
          {paymentMethod === 'cash' && cart.length > 0 && (
            <div className={`flex justify-between items-center pt-2 border-t border-dashed ${isCashInsufficient ? 'text-red-500' : 'text-green-600'}`}>
              <span className="font-bold text-sm">Kembalian</span>
              <span className="font-black text-lg">
                {parsedCashGiven >= currentTotalToPay ? formatRupiah(parsedCashGiven - currentTotalToPay) : '-'}
              </span>
            </div>
          )}

          <button
                      id="checkout-btn"
                      onClick={handleCheckout}
                      disabled={cart.length === 0 || isCashInsufficient || isCheckoutLoading || isExpired || (isFNB && !tableId) || (isRental && (!rentalInfo.driverName.trim() || !rentalInfo.licensePlate.trim())) || (isPureJasa && employees.length > 0 && cart.some(item => !item.workerId))}
                      className={`w-full py-3.5 rounded-xl font-bold shadow-sm transition-all duration-200 ease-in-out flex items-center justify-center gap-2 ${(cart.length === 0 || isCashInsufficient || isCheckoutLoading || isExpired || (isFNB && !tableId) || (isRental && (!rentalInfo.driverName.trim() || !rentalInfo.licensePlate.trim())) || (isPureJasa && employees.length > 0 && cart.some(item => !item.workerId))) ? 'bg-gray-300 text-gray-500 shadow-none cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-blue-600/30 active:scale-[0.98]'}`}
                    >
            {isCheckoutLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isExpired ? 'PAKET KEDALUWARSA' : isCheckoutLoading ? 'MEMPROSES...' :
              (isRental && isDownPayment && (parseInt(downPaymentInput.replace(/[^0-9]/g, '')) || 0) > 0 && remainingBalance > 0) ? 'SIMPAN & TAHAN JAMINAN' :
                (isRental) ? 'LUNAS & SELESAI' :
                  'BAYAR SEKARANG'}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="flex flex-col flex-1 h-full min-h-0 bg-gray-50 overflow-hidden text-slate-900 print:hidden">
        {sidebar}
        {/* MAIN AREA */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {isExpired && (
            <div className="bg-red-600 text-white p-2 text-center text-sm font-bold shadow-sm z-50">
              ⚠️ Masa aktif paket berlangganan Anda telah berakhir. Harap perpanjang paket untuk dapat menggunakan fitur Kasir POS.
            </div>
          )}
          <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              <div className="bg-white border-b p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl font-black flex items-center gap-2">
                      <Store className="w-6 h-6 text-blue-600" />
                      <span className="hidden sm:inline">{isRental ? "Form Transaksi Sewa" : "PJTECH KASIR POS"}</span>
                      <span className="sm:hidden">{isRental ? "Transaksi Sewa" : "KASIR POS"}</span>
                    </h1>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                                      {(isPureJasa || isRental) && <CopyBookingLinkButton initialSlug={tenantSlug} />}
                                      {isFNB && (
                                                                              <Link
                                                                                href="/admin/kitchen"
                                                                                className="px-3 py-2 border rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 font-bold text-sm"
                                                                                title="Buka Layar Dapur (KDS)"
                                                                              >
                                                                                <ChefHat className="w-4 h-4 text-orange-600" />
                                                                                <span className="hidden sm:inline">Layar Dapur</span>
                                                                              </Link>
                                                                            )}
                                      <button
                                        onClick={() => setIsTaxExportOpen(true)}
                                        className="px-3 py-2 border rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                        title="Export Laporan Pajak (CSV/Jurnal)"
                                      >
                                        <FileSpreadsheet className="w-4 h-4" />
                                        <span className="hidden sm:inline">Laporan Pajak</span>
                                      </button>
                                      <CustomUserButton />
                                    </div>
                </div>

                {/* Search Bar & Kategori */}
                <div className="flex flex-row items-center gap-2 mb-2">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                                            placeholder={isPureJasa ? "Cari layanan atau kode..." : isFNB ? "Cari menu atau SKU..." : isRental && config ? config.searchPlaceholder : "Cari produk atau barcode..."}
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                          />
                                        </div>
                                        <div className="relative shrink-0">
                                                                                                    <button
                                                                                                      onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                                                                                                      onBlur={() => setIsCategoryMenuOpen(false)}
                                                                                                      className={`px-3 py-2 border rounded-lg flex items-center justify-center gap-2 transition-colors relative shadow-sm ${selectedFilterTab === "ALL"
                                                                                                        ? "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                                                                                                        : "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                                                                                                        }`}
                                                                                                      title="Filter Kategori"
                                                                                                    >
                                                                                                      <Filter className={`w-4 h-4 ${selectedFilterTab === "ALL" ? "text-gray-500" : "text-blue-600"}`} />
                                                                                                                                            <span className={`text-sm max-w-[120px] truncate ${selectedFilterTab !== "ALL" && "font-semibold"}`}>
                                                                                                                                                                                    {isRental && filterTabs.length > 0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ? (selectedFilterTab === "ALL"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          ? "Semua"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          : filterTabs.find(t => t.value === selectedFilterTab)?.label)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      : isPureJasa && jasaFilterTabs.length > 0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ? (selectedFilterTab === "ALL"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          ? "Semua"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          : jasaFilterTabs.find(t => t.value === selectedFilterTab)?.label)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      : isFNB && fnbFilterTabs.length > 0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ? (selectedFilterTab === "ALL"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          ? "Semua"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          : fnbFilterTabs.find(t => t.value === selectedFilterTab)?.label)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      : (selectedFilterTab === "ALL"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          ? "Semua Produk"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          : selectedFilterTab)}
                                                                                                      </span>
                                                                                                    </button>

                                                                                  {isCategoryMenuOpen && (
                                                                                                                                                                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                                                                                                                                                                        <ul className="py-1 max-h-60 overflow-y-auto">
                                                                                                                                                                          {isRental && filterTabs.length > 0 ? (
                                                                                                                                                                            filterTabs.map(cat => (
                                                                                                                                                                              <li key={cat.value}>
                                                                                                                                                                                <button
                                                                                                                                                                                  onMouseDown={(e) => {
                                                                                                                                                                                    e.preventDefault();
                                                                                                                                                                                    setSelectedFilterTab(cat.value);
                                                                                                                                                                                    setIsCategoryMenuOpen(false);
                                                                                                                                                                                  }}
                                                                                                                                                                                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${selectedFilterTab === cat.value ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                                                                                                                                                                                >
                                                                                                                                                                                  {cat.label}
                                                                                                                                                                                  {selectedFilterTab === cat.value && <Check className="w-4 h-4" />}
                                                                                                                                                                                </button>
                                                                                                                                                                              </li>
                                                                                                                                                                            ))
                                                                                                                                                                          ) : isPureJasa && jasaFilterTabs.length > 0 ? (
                                                                                                                                                                                                                                                                                      jasaFilterTabs.map(cat => (
                                                                                                                                                                                                                                                                                        <li key={cat.value}>
                                                                                                                                                                                                                                                                                          <button
                                                                                                                                                                                                                                                                                            onMouseDown={(e) => {
                                                                                                                                                                                                                                                                                              e.preventDefault();
                                                                                                                                                                                                                                                                                              setSelectedFilterTab(cat.value);
                                                                                                                                                                                                                                                                                              setIsCategoryMenuOpen(false);
                                                                                                                                                                                                                                                                                            }}
                                                                                                                                                                                                                                                                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${selectedFilterTab === cat.value ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                                                                                                                                                                                                                                                                                          >
                                                                                                                                                                                                                                                                                            {cat.label}
                                                                                                                                                                                                                                                                                            {selectedFilterTab === cat.value && <Check className="w-4 h-4" />}
                                                                                                                                                                                                                                                                                          </button>
                                                                                                                                                                                                                                                                                        </li>
                                                                                                                                                                                                                                                                                      ))
                                                                                                                                                                                                                                                                                    ) : isFNB && fnbFilterTabs.length > 0 ? (
                                                                                                                                                                                                                                                                                      fnbFilterTabs.map(cat => (
                                                                                                                                                                                                                                                                                        <li key={cat.value}>
                                                                                                                                                                                                                                                                                          <button
                                                                                                                                                                                                                                                                                            onMouseDown={(e) => {
                                                                                                                                                                                                                                                                                              e.preventDefault();
                                                                                                                                                                                                                                                                                              setSelectedFilterTab(cat.value);
                                                                                                                                                                                                                                                                                              setIsCategoryMenuOpen(false);
                                                                                                                                                                                                                                                                                            }}
                                                                                                                                                                                                                                                                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${selectedFilterTab === cat.value ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                                                                                                                                                                                                                                                                                          >
                                                                                                                                                                                                                                                                                            {cat.label}
                                                                                                                                                                                                                                                                                            {selectedFilterTab === cat.value && <Check className="w-4 h-4" />}
                                                                                                                                                                                                                                                                                          </button>
                                                                                                                                                                                                                                                                                        </li>
                                                                                                                                                                                                                                                                                      ))
                                                                                                                                                                                                                                                                                    ) : (
                                                                                                                                                                                                                                                                    <>
                                                                                                                                                                                                                                                                      <li>
                                                                                                                                                                                                                                                                                                                                                                    <button
                                                                                                                                                                                                                                                                                                                                                                      onMouseDown={(e) => {
                                                                                                                                                                                                                                                                                                                                                                        e.preventDefault();
                                                                                                                                                                                                                                                                                                                                                                        setSelectedFilterTab("Semua");
                                                                                                                                                                                                                                                                                                                                                                        setIsCategoryMenuOpen(false);
                                                                                                                                                                                                                                                                                                                                                                      }}
                                                                                                                                                                                                                                                                                                                                                                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${selectedFilterTab === "Semua" ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                                                                                                                                                                                                                                                                                                                                                                    >
                                                                                                                                                                                                                                                                                                                                                                      {isFNB ? "Makanan & Minuman" : "Semua Produk"}
                                                                                                                                                                                                                                                                                                                                                                      {selectedFilterTab === "Semua" && <Check className="w-4 h-4" />}
                                                                                                                                                                                                                                                                                                                                                                    </button>
                                                                                                                                                                                                                                                                                                                                                                  </li>
                                                                                                                                                                                                                                                                      {isFNB && [
                                                                                                                                                                                                                                                                        "Makanan", "Minuman", "Snack", "Paket"
                                                                                                                                                                                                                                                                      ].map(cat => (
                                                                                                                                                                                                                                                                        <li key={cat}>
                                                                                                                                                                                                                                                                          <button
                                                                                                                                                                                                                                                                            onMouseDown={(e) => {
                                                                                                                                                                                                                                                                              e.preventDefault();
                                                                                                                                                                                                                                                                              setSelectedFilterTab(cat);
                                                                                                                                                                                                                                                                              setIsCategoryMenuOpen(false);
                                                                                                                                                                                                                                                                            }}
                                                                                                                                                                                                                                                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${selectedFilterTab === cat ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                                                                                                                                                                                                                                                                          >
                                                                                                                                                                                                                                                                            {cat}
                                                                                                                                                                                                                                                                            {selectedFilterTab === cat && <Check className="w-4 h-4" />}
                                                                                                                                                                                                                                                                          </button>
                                                                                                                                                                                                                                                                        </li>
                                                                                                                                                                                                                                                                      ))}
                                                                                                                                                                                                                                                                    </>
                                                                                                                                                                                                                                                                  )}
                                                                                      </ul>
                                                                                    </div>
                                                                                  )}
                                                                                </div>
                </div>

                {/* Input Barcode / SKU Cepat (Khusus Retail & F&B) */}
                                                {(!isPureJasa && !isRental) && (
                                  <div id="barcode-input" className="relative w-full max-w-md mt-1">
                                    {/* Retail: Prominent Scan Button */}
                                    {!isFNB && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const input = document.getElementById('manual-barcode-input') as HTMLInputElement;
                                          input?.focus();
                                        }}
                                        className="w-full mb-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                                        aria-label="Buka Scanner Barcode"
                                      >
                                        <Barcode className="w-5 h-5" />
                                        <span>📷 Scan Barcode / Ketik SKU</span>
                                      </button>
                                    )}
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-blue-600 pointer-events-none">
                                      <Barcode className="w-4 h-4" />
                                    </div>
                                    <input
                                      id="manual-barcode-input"
                                      type="text"
                                      placeholder="Scan atau Ketik SKU/Barcode (Enter)"
                                      value={barcodeInput}
                                      onChange={(e) => setBarcodeInput(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          processBarcodeScan(barcodeInput);
                                        }
                                      }}
                                      disabled={isScanning}
                                      className="w-full pl-9 pr-24 py-2 bg-blue-50/60 border border-blue-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-400 rounded-lg text-sm text-slate-800 placeholder:text-blue-600/60 outline-none transition-all shadow-sm font-mono"
                                    />
                                    {isScanning ? (
                                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                                      </div>
                                    ) : barcodeInput ? (
                                      <button
                                        type="button"
                                        onClick={() => processBarcodeScan(barcodeInput)}
                                        className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-2 py-1 rounded-md transition-colors"
                                      >
                                        Enter ↵
                                      </button>
                                    ) : (
                                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-blue-600/75 uppercase tracking-wider pointer-events-none bg-blue-100/70 px-1.5 py-0.5 rounded hidden sm:inline">
                                        Scanner Siap
                                      </span>
                                    )}
                                  </div>
                                )}
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto p-4 bg-slate-50 pb-28 lg:pb-4 flex flex-col touch-pan-y [-webkit-overflow-scrolling:touch]">
                {(isPureJasa || isRental) && (
                  <div className="lg:hidden p-3 mb-4 bg-blue-50 border border-blue-200 rounded-xl flex flex-row items-center justify-between shadow-sm">
                    <span className="text-sm font-medium text-blue-800">Ada pesanan online?</span>
                    <button
                      onClick={() => setIsQueueModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                    >
                      📋 Tarik Pesanan Online
                    </button>
                  </div>
                )}
                <div id="product-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-1 content-start">
                  {products.map(product => {
                                      const catLower = (product.category || '').toLowerCase();
                                      const isJasaMurni = isPureJasa && (catLower.includes('jasa') || catLower.includes('servis') || catLower.includes('layanan') || !product.category);
                    const remaining = isJasaMurni ? 999999 : getRemainingStock(product);
                    const isOutOfStock = !isJasaMurni && remaining <= 0;
                    const isLowStock = !isJasaMurni && Boolean(product.minStockThreshold && product.minStockThreshold > 0 && remaining > 0 && remaining <= product.minStockThreshold);
                    return (
                      <div
                        key={product.id}
                        onClick={() => !isOutOfStock && addToCart(product)}
                        className={`group relative rounded-xl border p-3 flex flex-col select-none ${
                          isOutOfStock
                            ? 'bg-red-50 border-red-200 cursor-not-allowed opacity-90'
                            : 'bg-white cursor-pointer hover:shadow-lg hover:border-blue-500 active:scale-[0.96] active:border-blue-600 transition-transform duration-75'
                        }`}
                      >
                        {isOutOfStock && (
                          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded-md shadow-sm z-20 animate-pulse border border-red-600">
                            STOK HABIS
                          </div>
                        )}
                        {isLowStock && (
                          <div className="absolute -top-2 -left-2 bg-amber-500 text-white text-[9px] font-black px-2 py-1 rounded-md shadow-sm z-20 animate-pulse border border-amber-600">
                            STOK MINIMUM
                          </div>
                        )}
                        <div className="relative mb-3 w-full h-32 rounded-lg overflow-hidden">
                          <Image
                            src={product.image || "https://placehold.co/400x300?text=No+Image"}
                            alt={product.name}
                            fill
                            className={`object-cover ${isOutOfStock ? 'grayscale opacity-70' : ''}`}
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          />
                          {(!isJasaMurni && !isRental) && (
                            <div className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-1 rounded-md z-10 ${isOutOfStock ? 'bg-red-600 text-white shadow-sm' : 'bg-slate-900/85 text-white shadow-sm'}`}>
                              {isOutOfStock ? 'HABIS' : `Sisa: ${remaining}`}
                            </div>
                          )}
                          {Boolean(product.discount && product.discount > 0) && (
                            <div className="absolute top-2 left-2 text-[10px] font-bold px-2 py-1 rounded-md z-10 bg-rose-600 text-white shadow-sm">
                              Promo
                            </div>
                          )}
                        </div>
                        <h3 className="font-bold text-sm h-10 line-clamp-2 mb-1 group-hover:text-blue-700 transition-colors">{product.name}</h3>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex flex-col">
                            {(product.discount && product.discount > 0) ? (
                              <>
                                <span className={`text-[10px] line-through ${isOutOfStock ? 'text-gray-400' : 'text-gray-400'}`}>{formatRupiah(product.hargaJual)}</span>
                                <span className={`font-black text-sm ${isOutOfStock ? 'text-gray-400' : 'text-red-600'}`}>{formatRupiah(product.hargaJual - product.discount)}</span>
                              </>
                            ) : (
                              <span className={`font-black text-sm ${isOutOfStock ? 'text-gray-400' : 'text-blue-600'}`}>{formatRupiah(product.hargaJual)}</span>
                            )}
                          </div>
                          {/* Action Icon Plus */}
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isOutOfStock ? 'bg-gray-200 text-gray-400 opacity-50' : 'bg-blue-50 text-blue-600 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white'}`}>
                            <Plus className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            </div>

            {/* CART SIDEBAR (Desktop Only) */}
                        <div id="cart-panel" className="hidden lg:flex w-[450px] min-w-[450px] shrink-0 bg-white border-l flex-col shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-20 h-full min-h-0">
                          {renderCartContent(false)}
                        </div>
          </div>
        </div>

        {/* STICKY BOTTOM BAR (Mobile Only) */}
        {!isMobileCartOpen && cart.length > 0 && (
          <div className="fixed bottom-16 left-0 right-0 p-4 bg-white/95 border-t shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] lg:hidden z-30 animate-in slide-in-from-bottom-5 duration-300">
            <button
              onClick={() => setIsMobileCartOpen(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm border-0 transition-all duration-200 ease-in-out rounded-2xl py-3.5 px-5 font-bold flex justify-between items-center active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 px-2.5 py-1 rounded-lg text-sm">{cart.reduce((acc, item) => acc + item.qty, 0)} Item</div>
                <span>Lihat Keranjang</span>
              </div>
              <span className="text-lg">{formatRupiah(grandTotal)}</span>
            </button>
          </div>
        )}



        {/* MOBILE CART MODAL (Full Screen) */}
        {isMobileCartOpen && (
          <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col lg:hidden animate-in slide-in-from-bottom-full duration-300">
            {renderCartContent(true)}
          </div>
        )}

        {/* MODAL SUKSES CHECKOUT */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-in fade-in zoom-in duration-200">
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black mb-2 text-slate-800">Pembayaran Berhasil!</h2>
              <p className="text-sm text-gray-500 mb-6">Terima kasih atas pesanan Anda. Silakan cetak struk untuk pelanggan.</p>
              <div className="space-y-3">
                {/* Format Cetak untuk Rental / Jasa */}
                {(isRental || isPureJasa) && (
                  <div className="flex items-center justify-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        setRentalPrintFormat('document');
                        localStorage.setItem('kasir_rental_print_format', 'document');
                      }}
                      className={`flex-1 py-1.5 px-2 rounded-lg transition-all ${
                        rentalPrintFormat === 'document'
                          ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      📄 Dokumen (A4/A5)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRentalPrintFormat('thermal');
                        localStorage.setItem('kasir_rental_print_format', 'thermal');
                      }}
                      className={`flex-1 py-1.5 px-2 rounded-lg transition-all ${
                        rentalPrintFormat === 'thermal'
                          ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      🧾 Struk Kasir
                    </button>
                  </div>
                )}

                {/* Selector Ukuran Kertas Dinamis */}
                {(isRental || isPureJasa) && rentalPrintFormat === 'document' ? (
                  <div className="flex items-center justify-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold mb-1">
                    <button
                      type="button"
                      onClick={() => {
                        setDocumentPaperSize('A4');
                        localStorage.setItem('kasir_doc_paper_size', 'A4');
                      }}
                      className={`flex-1 py-1.5 px-2 rounded-lg transition-all ${
                        documentPaperSize === 'A4'
                          ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      📄 A4 (Standar)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDocumentPaperSize('A5');
                        localStorage.setItem('kasir_doc_paper_size', 'A5');
                      }}
                      className={`flex-1 py-1.5 px-2 rounded-lg transition-all ${
                        documentPaperSize === 'A5'
                          ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      📑 A5 (Kompak)
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold mb-1">
                    <button
                      type="button"
                      onClick={() => {
                        setThermalPaperSize('58mm');
                        localStorage.setItem('kasir_thermal_paper_size', '58mm');
                      }}
                      className={`flex-1 py-1.5 px-2 rounded-lg transition-all ${
                        thermalPaperSize === '58mm'
                          ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      🧾 58mm (Standar)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setThermalPaperSize('80mm');
                        localStorage.setItem('kasir_thermal_paper_size', '80mm');
                      }}
                      className={`flex-1 py-1.5 px-2 rounded-lg transition-all ${
                        thermalPaperSize === '80mm'
                          ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      🧾 80mm (Lebar)
                    </button>
                  </div>
                )}

                <button
                  onClick={() => printReceipt('customer')}
                  className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm border-0 transition-all duration-200 ease-in-out active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {((isRental || isPureJasa) && rentalPrintFormat === 'document') ? '🖨️ Cetak Dokumen / Invoice' : '🖨️ Cetak Struk Kasir'}
                </button>

                {/* Tombol Unduh Gambar / PDF HD */}
                <button
                  onClick={handleDownloadImage}
                  disabled={isDownloadingImage}
                  className="w-full py-2.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-900 text-white shadow-sm border-0 transition-all duration-200 ease-in-out active:scale-[0.98] flex items-center justify-center gap-2 text-xs"
                >
                  {isDownloadingImage ? '⏳ Menyiapkan Berkas...' : '📥 Unduh Bukti (Gambar HD)'}
                </button>

                {/* Tombol Bluetooth Printer (Tampil jika format Thermal atau Retail/FNB) */}
                                {((!isRental && !isPureJasa) || rentalPrintFormat === 'thermal') && (
                                  isBluetoothSupported() ? (
                                    <div className="space-y-2">
                                      <button
                                        id="bluetooth-print-btn"
                                        onClick={handleBluetoothPrint}
                                        className="w-full py-3 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm border-0 transition-all duration-200 ease-in-out active:scale-[0.98] flex items-center justify-center gap-2"
                                      >
                                        🖨️ Cetak Struk (Bluetooth)
                                      </button>
                                      <button
                                        onClick={() => setIsPrinterSetupOpen(true)}
                                        className="w-full py-2 rounded-xl font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                                      >
                                        <Printer className="w-4 h-4" />
                                        Setup Printer (Auto-Detect + Test Print)
                                      </button>
                                      <button onClick={() => setIsPrinterHelpOpen(true)} className="text-xs text-blue-600 font-medium hover:underline w-full text-center py-1">
                                        Bingung Cara Print? Klik di sini
                                      </button>
                                    </div>
                                  ) : (
                                    <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                                      ⚠️ Browser Anda tidak mendukung cetak via Bluetooth.
                                      Gunakan Chrome / Edge untuk fitur ini.
                                    </p>
                                  )
                                )}
                {isFNB && (
                                  <div className="grid grid-cols-2 gap-2">
                                    <button
                                      onClick={() => printReceipt('kitchen')}
                                      className="py-2.5 px-2 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm border-0 transition-all text-xs flex items-center justify-center gap-1.5"
                                    >
                                      🍳 Tiket Dapur
                                    </button>
                                    <button
                                      onClick={() => printReceipt('bar')}
                                      className="py-2.5 px-2 rounded-xl font-bold bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm border-0 transition-all text-xs flex items-center justify-center gap-1.5"
                                    >
                                      ☕ Tiket Bar
                                    </button>
                                  </div>
                                )}
                <button
                  onClick={closeCheckoutModal}
                  className="w-full py-3 rounded-xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* STRUK KASIR & DOKUMEN CETAK (HANYA TAMPIL SAAT DIPRINT) */}
      {(!isRental && !isPureJasa) || rentalPrintFormat === 'thermal' ? (
        /* FORMAT THERMAL (58mm / 80mm) */
        <div
          id="receipt-thermal-print-target"
          style={{ boxSizing: 'border-box' }}
          className={`hidden ${printType === 'customer' ? 'print:block' : 'print:hidden'} ${thermalPaperSize === '80mm' ? 'w-[80mm] min-w-[80mm] max-w-[80mm] print:w-[80mm] print:min-w-[80mm] print:max-w-[80mm]' : 'w-[58mm] min-w-[58mm] max-w-[58mm] print:w-[58mm] print:min-w-[58mm] print:max-w-[58mm]'} mx-auto overflow-hidden p-2 bg-white text-black text-[11px] leading-tight font-mono box-border print:box-border print:m-0`}
        >
          <style>{`
            @media print {
              @page { 
                size: ${thermalPaperSize === '80mm' ? '80mm auto' : '58mm auto'}; 
                margin: 0 !important; 
              }
              html, body {
                width: ${thermalPaperSize === '80mm' ? '80mm' : '58mm'} !important;
                min-width: ${thermalPaperSize === '80mm' ? '80mm' : '58mm'} !important;
                max-width: ${thermalPaperSize === '80mm' ? '80mm' : '58mm'} !important;
                margin: 0 auto !important;
                padding: 0 !important;
                background: #ffffff !important;
                color: #000000 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          `}</style>
          <div className="text-center mb-3 border-b border-dashed border-gray-400 pb-3">
            <h1 className="text-sm font-bold uppercase mb-0.5">{tenantName || "PJTECH KASIR POS"}</h1>
            {tenantCategory && <p className="mb-0.5 text-[9px] uppercase font-bold text-gray-700">{tenantCategory}</p>}
            <p className="text-[10px]">Telp: {tenantPhone || "-"}</p>
          </div>

          {lastTransaction && (
            <>
              <div className="mb-3 space-y-0.5 text-[10px]">
                <p>Waktu : {lastTransaction.date} {lastTransaction.time}</p>
                <p>Kasir : {user?.fullName || user?.firstName || 'Admin'}</p>
                <p>Pelanggan : {lastTransaction.customerName}</p>
                {lastTransaction.tableId && <p>No. Meja : {getTableName(lastTransaction.tableId)}</p>}
                {lastTransaction.licensePlate && (
                  <p>{lastTransaction.rentalMode === 'property' ? 'No. Kamar' : lastTransaction.rentalMode === 'equipment' ? 'Kode Unit' : 'Unit / Plat'} : {lastTransaction.licensePlate}</p>
                )}
                {(lastTransaction.startDate || lastTransaction.endDate) && (
                  <p>Periode : {lastTransaction.startDate || '-'} s/d {lastTransaction.endDate || '-'}</p>
                )}
                {lastTransaction.serviceDate && (
                  <p>Jadwal : {new Date(lastTransaction.serviceDate).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</p>
                )}
                {lastTransaction.driverName && (
                  <p>{lastTransaction.rentalMode === 'property' || lastTransaction.rentalMode === 'equipment' ? 'No. Kontak' : 'Operator'} : {lastTransaction.driverName}</p>
                )}
                {lastTransaction.guarantee && <p>Jaminan : {lastTransaction.guarantee}</p>}
                {lastTransaction.destination && <p>Tujuan : {lastTransaction.destination}</p>}
                <p>ID Transaksi : {lastTransaction.id}</p>
              </div>

              <div className="border-b border-dashed border-gray-400 pb-2 mb-2">
                <table className="w-full text-left text-[11px] leading-tight">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="pb-1 font-normal w-1/2">Item</th>
                      <th className="pb-1 font-normal text-center">Qty</th>
                      <th className="pb-1 font-normal text-right">Harga</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lastTransaction.items.map(item => (
                      <React.Fragment key={item.cartItemId || item.id}>
                        <tr className="break-inside-avoid print:break-inside-avoid">
                          <td className="pt-1.5 pr-1">{item.name}</td>
                          <td className="pt-1.5 text-center whitespace-nowrap">{item.qty}</td>
                          <td className="pt-1.5 text-right whitespace-nowrap">{formatRupiah(item.hargaJual * item.qty)}</td>
                        </tr>
                        {item.workerId && (
                          <tr className="break-inside-avoid print:break-inside-avoid">
                            <td colSpan={3} className="text-gray-600 text-[9px] pl-1.5">
                              (Oleh: {item.workerId === 'admin_owner' ? 'Admin/Pemilik' : (employees.find((e: any) => e.id === item.workerId)?.name || item.workerId)})
                            </td>
                          </tr>
                        )}
                        {item.note && (
                          <tr className="break-inside-avoid print:break-inside-avoid">
                            <td colSpan={3} className="text-gray-500 italic pl-1.5 text-[9px]">* {item.note}</td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-0.5 mb-3 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatRupiah(lastTransaction.items.reduce((acc, i) => acc + i.hargaJual * i.qty, 0))}</span>
                </div>
                <div className="flex justify-between font-bold text-xs mt-1.5 pt-1.5 border-t border-dashed border-gray-400">
                  <span>Total Transaksi</span>
                  <span>{formatRupiah(lastTransaction.total)}</span>
                </div>
                {Boolean(lastTransaction.downPayment && lastTransaction.downPayment > 0) && (
                  <>
                    <div className="flex justify-between text-[10px]">
                      <span>Uang Muka (DP)</span>
                      <span className="font-semibold text-green-700">-{formatRupiah(lastTransaction.downPayment || 0)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-[10px] text-red-600">
                      <span>Sisa Tagihan</span>
                      <span>{formatRupiah(lastTransaction.remainingBalance || 0)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between mt-1 text-[10px]">
                  <span>Metode</span>
                  <span className="uppercase font-semibold">{lastTransaction.method}</span>
                </div>
                {lastTransaction.method === 'cash' && (
                  <>
                    <div className="flex justify-between text-[10px]">
                      <span>Tunai</span>
                      <span>{formatRupiah(parseInt(cashGiven.replace(/[^0-9]/g, '') || "0"))}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span>Kembalian</span>
                      <span>{formatRupiah(parseInt(cashGiven.replace(/[^0-9]/g, '') || "0") - ((lastTransaction.downPayment && lastTransaction.downPayment > 0) ? lastTransaction.downPayment : lastTransaction.total))}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="text-center mt-4 pt-3 border-t border-dashed border-gray-400 text-[10px] break-inside-avoid print:break-inside-avoid">
                <p className="font-bold">Terima Kasih!</p>
                <p>Silakan berkunjung kembali</p>
                <p className="mt-2 text-[8px] text-gray-400">Powered by PJTECH</p>
              </div>
            </>
          )}
        </div>
      ) : (
        /* RENTAL & JASA: FORMAT A4 / A5 DOKUMEN */
        <div className={`hidden ${printType === 'customer' ? 'print:block' : 'print:hidden'} ${documentPaperSize === 'A5' ? 'print:w-[148mm] print:min-w-[148mm] print:max-w-[148mm]' : 'print:w-[210mm] print:min-w-[210mm] print:max-w-[210mm]'} mx-auto`}>
          <InvoiceRentalA4
            tenantName={tenantName || ""}
            tenantCategory={tenantCategory || ""}
            tenantPhone={tenantPhone || ""}
            transaction={lastTransaction}
            user={user}
            paperSize={documentPaperSize}
          />
        </div>
      )}

      {/* TIKET DAPUR / BAR (HANYA TAMPIL SAAT DIPRINT KITCHEN ATAU BAR) */}
            {(printType === 'kitchen' || printType === 'bar') && (
              <div
                style={{ boxSizing: 'border-box' }}
                className={`print:block ${thermalPaperSize === '80mm' ? 'w-[80mm] min-w-[80mm] max-w-[80mm] print:w-[80mm] print:min-w-[80mm] print:max-w-[80mm]' : 'w-[58mm] min-w-[58mm] max-w-[58mm] print:w-[58mm] print:min-w-[58mm] print:max-w-[58mm]'} mx-auto overflow-hidden p-2 bg-white text-black font-mono box-border print:box-border print:m-0`}
              >
                <style>{`
                  @media print {
                    @page { 
                      size: ${thermalPaperSize === '80mm' ? '80mm auto' : '58mm auto'}; 
                      margin: 0 !important; 
                    }
                    html, body {
                      width: ${thermalPaperSize === '80mm' ? '80mm' : '58mm'} !important;
                      min-width: ${thermalPaperSize === '80mm' ? '80mm' : '58mm'} !important;
                      max-width: ${thermalPaperSize === '80mm' ? '80mm' : '58mm'} !important;
                      margin: 0 auto !important;
                      padding: 0 !important;
                      background: #ffffff !important;
                      color: #000000 !important;
                      -webkit-print-color-adjust: exact !important;
                      print-color-adjust: exact !important;
                    }
                  }
                `}</style>
                {lastTransaction && (() => {
                  const filteredItems = printType === 'bar'
                    ? lastTransaction.items.filter(i => isBarItem(i.category, i.name))
                    : lastTransaction.items.filter(i => !isBarItem(i.category, i.name));
                  const displayItems = filteredItems.length > 0 ? filteredItems : lastTransaction.items;

                  return (
                    <>
                      <div className="text-center mb-4 border-b-2 border-black pb-2">
                        <h1 className="text-xl font-black uppercase mb-1">
                          {printType === 'bar' ? '☕ TIKET BAR / MINUMAN' : '🍳 TIKET DAPUR / MAKANAN'}
                        </h1>
                        <h2 className="text-2xl font-black">{lastTransaction.tableId ? `MEJA ${getTableName(lastTransaction.tableId)}` : 'TAKEAWAY'}</h2>
                      </div>

                      <div className="mb-4 text-xs">
                        <p className="font-bold">Waktu: {lastTransaction.date} {lastTransaction.time}</p>
                        <p className="font-bold">ID: {lastTransaction.id}</p>
                      </div>

                      <div className="border-b-2 border-black pb-3 mb-3">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b-2 border-black text-xs font-black">
                              <th className="pb-1.5 w-3/4">Item</th>
                              <th className="pb-1.5 text-center w-1/4">Qty</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {displayItems.map(item => (
                              <React.Fragment key={item.id}>
                                <tr className="break-inside-avoid print:break-inside-avoid">
                                  <td className="pt-2 font-black text-sm leading-tight pr-1">{item.name}</td>
                                  <td className="pt-2 font-black text-base text-center">{item.qty}</td>
                                </tr>
                                {item.note && (
                                  <tr className="break-inside-avoid print:break-inside-avoid">
                                    <td colSpan={2} className="text-xs italic font-bold pb-1 text-gray-700 uppercase">* Note: {item.note}</td>
                                  </tr>
                                )}
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="text-center mt-4 text-xs font-bold break-inside-avoid print:break-inside-avoid">
                        <p>--- AKHIR PESANAN ---</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
      {/* Printer Help Modal */}
                  <PrinterHelpModal isOpen={isPrinterHelpOpen} onClose={() => setIsPrinterHelpOpen(false)} />

                  {/* Printer Setup Modal (Auto-detect + Test Print) */}
                  <PrinterSetupModal
                    isOpen={isPrinterSetupOpen}
                    onClose={() => setIsPrinterSetupOpen(false)}
                    onPrinterReady={(name) => setPrinterName(name)}
                  />

                  {/* Tax Export Modal */}
                                                      <TaxExportModal
                                                        isOpen={isTaxExportOpen}
                                                        onClose={() => setIsTaxExportOpen(false)}
                                                        transactions={transactions}
                                                        tenantCategory={tenantCategory}
                                                        tenantName={tenantName || 'Toko'}
                                                      />

                                                      {/* Onboarding Wizard */}
                                                                                                            <OnboardingWizard
                                                                                                              isOpen={isOnboardingOpen}
                                                                                                              tenantCategory={tenantCategory}
                                                                                                              onClose={() => {
                                                                                                                if (currentTenantId) {
                                                                                                                  localStorage.setItem(`onboarding_completed_${currentTenantId}`, 'true');
                                                                                                                }
                                                                                                                localStorage.setItem('onboarding_completed', 'true');
                                                                                                                setIsOnboardingOpen(false);
                                                                                                              }}
                                                                                                              onComplete={() => {
                                                                                                                if (currentTenantId) {
                                                                                                                  localStorage.setItem(`onboarding_completed_${currentTenantId}`, 'true');
                                                                                                                }
                                                                                                                localStorage.setItem('onboarding_completed', 'true');
                                                                                                                setIsOnboardingOpen(false);
                                                                                                              }}
                                                                                                            />

      {/* Queue Modal */}
      <QueueModal isOpen={isQueueModalOpen} onClose={() => setIsQueueModalOpen(false)} onProcess={handleProcessQueue} isRental={isRental} />

      {/* Modal F&B */}
      {fnbSelectedProduct && (
        <FnbModifierModal
          product={fnbSelectedProduct}
          isOpen={!!fnbSelectedProduct}
          onClose={() => setFnbSelectedProduct(null)}
          modifierNote={fnbModifierNote}
          setModifierNote={setFnbModifierNote}
          onSubmit={submitFnbModifier}
        />
      )}

      {/* Modal Data Armada & Sewa (Khusus Rental - Dual Mode) */}
      {isRentalFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-slate-50">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Form Data Sewa & Check-in
              </h2>
              <button
                onClick={() => setIsRentalFormModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toggle Tabs Mode (Properti vs Kendaraan vs Alat) - Locked per tenant catalog like booking link & admin CRUD */}
                                                <div className="flex border-b border-gray-200 bg-slate-50 p-2 gap-2">
                                                  {(["property", "vehicle", "equipment"] as const).map((type) => {
                                                    const isActive = rentalMode === type;
                                                    const isAvailable = availableRentalTypes.includes(type) || (!availableRentalTypes.length && tenantRentalType === type);
                                                    return (
                                                      <button
                                                        key={type}
                                                        type="button"
                                                        onClick={() => isAvailable && setRentalMode(type)}
                                                        disabled={!isAvailable}
                                                        className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                                                          !isAvailable
                                                            ? "opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border border-slate-200"
                                                            : isActive
                                                            ? "bg-white shadow-sm border"
                                                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                                                        } ${isActive
                                                          ? type === 'property'
                                                            ? 'text-blue-700 border-blue-200'
                                                            : type === 'vehicle'
                                                            ? 'text-amber-700 border-amber-200'
                                                            : 'text-emerald-700 border-emerald-200'
                                                          : ''}`}
                                                        title={!isAvailable ? `Tidak tersedia untuk ${availableRentalTypes[0] === "property" ? "Properti/Kos" : availableRentalTypes[0] === "vehicle" ? "Kendaraan/Travel" : "Alat/Barang"}` : ""}
                                                      >
                                                        {type === "property" && <Bed className="w-4 h-4" />}
                                                        {type === "vehicle" && <Car className="w-4 h-4" />}
                                                        {type === "equipment" && <Package className="w-4 h-4" />}
                                                        {type === "property" && "Form Properti / Check-in"}
                                                        {type === "vehicle" && "Form Kendaraan / Surat Jalan"}
                                                        {type === "equipment" && "Form Alat / Barang"}
                                                      </button>
                                                    );
                                                  })}
                                                </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {rentalMode === 'property' ? (
                /* Mode Properti / Kos / Vila */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-1.5 block">No. WhatsApp / Kontak Tamu *</label>
                      <input
                        type="tel"
                        placeholder="contoh: 081234567890"
                        value={rentalInfo.driverName}
                        onChange={(e) => setRentalInfo(prev => ({ ...prev, driverName: e.target.value }))}
                        className="w-full p-3 bg-white border border-gray-300 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-1.5 block">No. Kamar / Kode Unit *</label>
                      <input
                        type="text"
                        placeholder="contoh: Kamar 101 / Vila A"
                        value={rentalInfo.licensePlate}
                        onChange={(e) => setRentalInfo(prev => ({ ...prev, licensePlate: e.target.value.toUpperCase() }))}
                        className="w-full p-3 bg-white border border-gray-300 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 transition-all font-mono tracking-wider uppercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-1.5 block">Tgl Check-in</label>
                      <input
                        type="date"
                        value={rentalInfo.startDate}
                        onChange={(e) => setRentalInfo(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full p-3 bg-white border border-gray-300 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-1.5 block">Tgl Check-out / Selesai</label>
                      <input
                        type="date"
                        value={rentalInfo.endDate}
                        onChange={(e) => setRentalInfo(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full p-3 bg-white border border-gray-300 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-1.5 block">Identitas / Jaminan (KTP/SIM/Paspor) *</label>
                    <input
                      type="text"
                      placeholder="contoh: KTP No. 3271xxxx atau Paspor"
                      value={rentalInfo.guarantee}
                      onChange={(e) => setRentalInfo(prev => ({ ...prev, guarantee: e.target.value }))}
                      className="w-full p-3 bg-white border border-gray-300 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      * Wajib diisi untuk pendataan tamu/penyewa (KTP, SIM, Paspor, atau Deposit).
                    </p>
                  </div>
                </div>
                              ) : rentalMode === 'equipment' ? (
                                /* Mode Alat / Barang */
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-bold text-gray-700 mb-1.5 block">No. WhatsApp / Kontak Penyewa *</label>
                                      <input
                                        type="tel"
                                        placeholder="contoh: 081234567890"
                                        value={rentalInfo.driverName}
                                        onChange={(e) => setRentalInfo(prev => ({ ...prev, driverName: e.target.value }))}
                                        className="w-full p-3 bg-white border border-gray-300 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 transition-all"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-sm font-bold text-gray-700 mb-1.5 block">Kode Unit / Nama Alat *</label>
                                      <input
                                        type="text"
                                        placeholder="contoh: CAM-001 / Kamera Sony A7III"
                                        value={rentalInfo.licensePlate}
                                        onChange={(e) => setRentalInfo(prev => ({ ...prev, licensePlate: e.target.value.toUpperCase() }))}
                                        className="w-full p-3 bg-white border border-gray-300 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 transition-all font-mono tracking-wider uppercase"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-bold text-gray-700 mb-1.5 block">Lokasi Ambil / Pengiriman <span className="font-normal text-gray-400">(opsional)</span></label>
                                      <input
                                        type="text"
                                        placeholder="contoh: Toko kami di Jl. Sudirman No. 10 / Antar ke hotel"
                                        value={rentalInfo.pickupLocation}
                                        onChange={(e) => setRentalInfo(prev => ({ ...prev, pickupLocation: e.target.value }))}
                                        className="w-full p-3 bg-white border border-gray-300 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 transition-all"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-sm font-bold text-gray-700 mb-1.5 block">Jam Ambil *</label>
                                      <input
                                        type="time"
                                        value={rentalInfo.pickupTime || "08:00"}
                                        onChange={(e) => setRentalInfo(prev => ({ ...prev, pickupTime: e.target.value }))}
                                        className="w-full p-3 bg-white border border-gray-300 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 transition-all"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-bold text-gray-700 mb-1.5 block">Tgl Mulai</label>
                                      <input
                                        type="date"
                                        value={rentalInfo.startDate}
                                        onChange={(e) => setRentalInfo(prev => ({ ...prev, startDate: e.target.value }))}
                                        className="w-full p-3 bg-white border border-gray-300 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 transition-all"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-sm font-bold text-gray-700 mb-1.5 block">Tgl Selesai</label>
                                      <input
                                        type="date"
                                        value={rentalInfo.endDate}
                                        onChange={(e) => setRentalInfo(prev => ({ ...prev, endDate: e.target.value }))}
                                        className="w-full p-3 bg-white border border-gray-300 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 transition-all"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-bold text-gray-700 mb-1.5 block">Jam Kembali *</label>
                                      <input
                                        type="time"
                                        value={rentalInfo.returnTime || "17:00"}
                                        onChange={(e) => setRentalInfo(prev => ({ ...prev, returnTime: e.target.value }))}
                                        className="w-full p-3 bg-white border border-gray-300 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 transition-all"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-sm font-bold text-gray-700 mb-1.5 block">Deposit / Jaminan <span className="font-normal text-gray-400">(opsional)</span></label>
                                      <input
                                        type="number"
                                        min="0"
                                        step="1000"
                                        value={rentalInfo.deposit || 0}
                                        onChange={(e) => setRentalInfo(prev => ({ ...prev, deposit: Number(e.target.value) || 0 }))}
                                        className="w-full p-3 bg-white border border-gray-300 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 transition-all"
                                        placeholder="contoh: 500000"
                                      />
                                      <p className="text-xs text-gray-500 mt-2">
                                        Akan ditambahkan ke total tagihan & dikembalikan saat alat dikembalikan utuh.
                                      </p>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-sm font-bold text-gray-700 mb-1.5 block">Catatan Kondisi / Request Khusus <span className="font-normal text-gray-400">(opsional)</span></label>
                                    <textarea
                                      rows={3}
                                      value={rentalInfo.conditionNotes || ""}
                                      onChange={(e) => setRentalInfo(prev => ({ ...prev, conditionNotes: e.target.value }))}
                                      placeholder="contoh: Lens filter sudah dipasang, bawa charger tambahan, butuh tas kamera..."
                                      className="w-full p-3 bg-white border border-gray-300 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 transition-all resize-none"
                                    />
                                  </div>
                                </div>
                              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-1.5 block">Operator / Driver / Supir *</label>
                      <input
                        type="text"
                        placeholder="contoh: Supir Pak Agus / Lepas Kunci"
                        value={rentalInfo.driverName}
                        onChange={(e) => setRentalInfo(prev => ({ ...prev, driverName: e.target.value }))}
                        className="w-full p-3 bg-white border border-gray-300 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-1.5 block">No. Seri / Kode Unit / Plat Nomor *</label>
                      <input
                        type="text"
                        placeholder="contoh: B 1234 ABC"
                        value={rentalInfo.licensePlate}
                        onChange={(e) => setRentalInfo(prev => ({ ...prev, licensePlate: e.target.value.toUpperCase() }))}
                        className="w-full p-3 bg-white border border-gray-300 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 transition-all font-mono tracking-widest uppercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-1.5 block">Titik Jemput <span className="font-normal text-gray-400">(opsional)</span></label>
                      <input
                        type="text"
                        placeholder="contoh: Bandara / Stasiun"
                        value={rentalInfo.pickupLocation}
                        onChange={(e) => setRentalInfo(prev => ({ ...prev, pickupLocation: e.target.value }))}
                        className="w-full p-3 bg-white border border-gray-300 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-1.5 block">Titik Tujuan <span className="font-normal text-gray-400">(opsional)</span></label>
                      <input
                        type="text"
                        placeholder="contoh: Bandung / Dalam Kota"
                        value={rentalInfo.dropoffLocation}
                        onChange={(e) => setRentalInfo(prev => ({ ...prev, dropoffLocation: e.target.value }))}
                        className="w-full p-3 bg-white border border-gray-300 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-1.5 block">Tgl Mulai</label>
                      <input
                        type="date"
                        value={rentalInfo.startDate}
                        onChange={(e) => setRentalInfo(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full p-3 bg-white border border-gray-300 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-1.5 block">Tgl Selesai</label>
                      <input
                        type="date"
                        value={rentalInfo.endDate}
                        onChange={(e) => setRentalInfo(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full p-3 bg-white border border-gray-300 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-1.5 block">Jaminan (KTP/SIM/Deposit) *</label>
                    <input
                      type="text"
                      placeholder="contoh: KTP Asli + Motor"
                      value={rentalInfo.guarantee}
                      onChange={(e) => setRentalInfo(prev => ({ ...prev, guarantee: e.target.value }))}
                      className="w-full p-3 bg-white border border-gray-300 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      * Jaminan wajib diisi. Contoh: KTP, SIM, STNK, atau Uang Deposit.
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setIsRentalFormModalOpen(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => setIsRentalFormModalOpen(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-600/20 transition-all"
              >
                Simpan & Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    {/* Tutorial Overlay */}
              <TutorialOverlay
                show={showTutorial}
                steps={isFNB ? fnbTutorialSteps : retailTutorialSteps}
                step={tutorialStep}
                onNext={() => setTutorialStep(prev => prev + 1)}
                onSkip={() => {
                  setShowTutorial(false);
                  if (isFNB) {
                    localStorage.setItem('pos_fnb_tutorial_seen', 'true');
                  } else {
                    localStorage.setItem('pos_tutorial_seen', 'true');
                  }
                }}
                onFinish={() => {
                  setShowTutorial(false);
                  if (isFNB) {
                    localStorage.setItem('pos_fnb_tutorial_seen', 'true');
                  } else {
                    localStorage.setItem('pos_tutorial_seen', 'true');
                  }
                }}
              />

              {/* Table Grid Modal (F&B) */}
              <TableGridModal
                tables={tables}
                selectedTableId={tableId}
                onSelectTable={setTableId}
                isOpen={isTableModalOpen}
                onClose={() => setIsTableModalOpen(false)}
              />

              {/* Split Bill Modal (F&B) */}
              <SplitBillModal
                isOpen={isSplitBillOpen}
                onClose={() => setIsSplitBillOpen(false)}
                totalAmount={grandTotal}
                formatRupiah={formatRupiah}
              />
            </>
          );
        }