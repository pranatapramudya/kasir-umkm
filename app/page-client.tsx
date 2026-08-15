"use client";

import React, { useState, useEffect } from 'react';
import {
  ShoppingCart, Plus, Minus, Store, User, Search, Trash2, CheckCircle, Pencil, Loader2, X, Check, Filter, Menu, Car
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { toast } from 'sonner';
import { useAuth, SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { BottomNavClient } from '@/components/BottomNavClient';
import { CustomUserButton } from '@/components/CustomUserButton';
import { Pagination } from '@/components/Pagination';
import { printBluetoothReceipt, isBluetoothSupported } from '@/lib/bluetooth-printer';
import { isRentalTravelCategory } from '@/lib/business-category';
import { humanizeError } from '@/lib/error-mapper';
import nextDynamic from 'next/dynamic';

const PrinterHelpModal = nextDynamic(() => import('@/components/PrinterHelpModal'), {
  ssr: false,
});
const FnbModifierModal = nextDynamic(() => import('@/components/FnbModifierModal'), {
  ssr: false,
});

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
  driverName?: string;
  licensePlate?: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
  serviceDate?: string;
  guarantee?: string;
  downPayment?: number;
  remainingBalance?: number;
};

export default function POSApp({ sidebar, isExpired = false, initialData, tenantName, tenantCategory, tenantPhone }: { sidebar: React.ReactNode; isExpired?: boolean; initialData?: { products: Product[], totalPages: number }, tenantName?: string, tenantCategory?: string, tenantPhone?: string }) {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const [isClient, setIsClient] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  // --- STATE DATA DARI DATABASE ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris'>('cash');
  const [tableId, setTableId] = useState("");
  const isFNB = tenantCategory === 'F&B' || tenantCategory === 'F&B / Kuliner';
  const isJasa = tenantCategory === 'Jasa / Servis';
  const isRental = isRentalTravelCategory(tenantCategory);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [printType, setPrintType] = useState<'customer' | 'kitchen'>('customer');
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false); // State untuk keranjang mobile
  const [cashGiven, setCashGiven] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState("");
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const isSubmittingRef = React.useRef(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State Edukasi & Modifiers
  const [isPrinterHelpOpen, setIsPrinterHelpOpen] = useState(false);
  const [fnbSelectedProduct, setFnbSelectedProduct] = useState<Product | null>(null);
  const [fnbModifierNote, setFnbModifierNote] = useState('');

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

  // State Rental & Travel
  const [isRentalFormModalOpen, setIsRentalFormModalOpen] = useState(false);
  const [rentalInfo, setRentalInfo] = useState({
    driverName: '',
    licensePlate: '',
    destination: '',
    startDate: '',
    endDate: '',
    guarantee: '',
  });

  // State Jasa
  const [serviceDate, setServiceDate] = useState("");

  // State DP
  const [isDownPayment, setIsDownPayment] = useState(false);
  const [downPaymentInput, setDownPaymentInput] = useState("");


  // --- MANTRA AMBIL DATA DARI NEON (SWR Auto-Refresh) ---
  const fetcher = async (url: string) => {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      if (res.status === 401) return { products: [], totalPages: 1 };
      throw new Error("Gagal mengambil data");
    }
    return res.json();
  };

  const queryUrl = `/api/products?page=${currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(search)}&category=${encodeURIComponent(selectedCategory === "Semua" ? "" : selectedCategory)}`;
  const { data: swrResponse, error, mutate } = useSWR<{ products: Product[], totalPages: number }>(
    queryUrl,
    fetcher,
    { fallbackData: initialData }
  );

  const products = swrResponse?.products || [];
  const totalPages = swrResponse?.totalPages || 1;

  const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
  const categories = ["Semua", ...uniqueCategories];

  // Fetch data karyawan (khusus untuk Jasa)
  const { data: employeesData } = useSWR<{ success: boolean, employees: Employee[] }>(
    isJasa ? '/api/employees' : null,
    fetcher
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
    const qtyInCart = cart.filter(item => item.id === product.id).reduce((acc, curr) => acc + curr.qty, 0);
    return product.stock - qtyInCart;
  };

  const addToCart = (product: Product, note?: string) => {
    const remaining = getRemainingStock(product);
    if (remaining <= 0) {
      toast.error(`Stok ${product.name} telah habis!`);
      return;
    }

    const finalPrice = (product.discount && product.discount > 0) ? product.hargaJual - product.discount : product.hargaJual;
    const cartProduct = { ...product, hargaJual: finalPrice };

    setCart((prev) => {
      if (isJasa) {
        return [...prev, { ...cartProduct, cartItemId: crypto.randomUUID(), qty: 1, note }];
      }

      if (isFNB && note) {
        return [...prev, { ...cartProduct, cartItemId: crypto.randomUUID(), qty: 1, note }];
      }

      const existing = prev.find((item) => item.id === cartProduct.id && !item.note);
      if (existing) {
        return prev.map((item) => item.id === cartProduct.id && !item.note ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...cartProduct, cartItemId: crypto.randomUUID(), qty: 1, note }];
    });
    toast.success(`${product.name} ditambahkan ke keranjang!`);
  };

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
        toast.error(`Stok ${cartItem.name} tidak mencukupi!`);
        return;
      }
    }
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
    if (isFNB && !tableId) return toast.error("Pilih Nomor Meja!");
    if (cart.length === 0) return toast.error("Keranjang masih kosong!");
    if (isCashInsufficient) return toast.error("Uang diterima kurang dari total belanja!");
    if (isJasa && cart.some(item => !item.workerId)) return toast.error("Pastikan semua layanan telah memiliki pekerja/terapis!");
    // Validasi Rental
    if (isRental && !rentalInfo.driverName.trim()) return toast.error("Isi Nama Supir untuk transaksi rental!");
    if (isRental && !rentalInfo.licensePlate.trim()) return toast.error("Isi Plat Nomor Kendaraan untuk transaksi rental!");

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
      status: remainingBalance > 0 ? 'pending' : 'completed', // Will be re-evaluated as 'partial' in backend
      ...(isFNB && { tableId }),
      ...(isJasa && { serviceDate: serviceDate || undefined }),
      // Sertakan data rental jika mode Rental
      ...(isRental && {
        driverName: rentalInfo.driverName.trim() || undefined,
        licensePlate: rentalInfo.licensePlate.trim() || undefined,
        destination: rentalInfo.destination.trim() || undefined,
        startDate: rentalInfo.startDate || undefined,
        endDate: rentalInfo.endDate || undefined,
        guarantee: rentalInfo.guarantee.trim() || undefined,
      }),
      downPayment: isDownPayment ? parsedDownPayment : 0,
      remainingBalance: remainingBalance,
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

      // Sinkronisasi stok real-time (Bypass Cache)
      mutate();

    } catch (err: any) {
      if (!navigator.onLine || err.message === 'Failed to fetch') {
        // OFFLINE MODE: Save to local storage
        const offlineTxs = JSON.parse(localStorage.getItem('offline_transactions') || '[]');
        offlineTxs.push(newTransaction);
        localStorage.setItem('offline_transactions', JSON.stringify(offlineTxs));

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
    setRentalInfo({ driverName: '', licensePlate: '', destination: '', startDate: '', endDate: '', guarantee: '' });
  };

  const sendWhatsAppReceipt = () => {
    if (!lastTransaction) return;

    const storeName = tenantName || "PJTECH KASIR POS";
    let text = `*STRUK PEMBELIAN*\n*${storeName}*\n`;
    text += `--------------------------------\n`;
    text += `Waktu : ${lastTransaction.date} ${lastTransaction.time}\n`;
    text += `Pelanggan : ${lastTransaction.customerName}\n`;
    if (lastTransaction.tableId) text += `Nomor Meja: ${getTableName(lastTransaction.tableId)}\n`;
    // Data Jasa
    if (lastTransaction.serviceDate) {
      text += `Waktu Layanan: ${new Date(lastTransaction.serviceDate).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}\n`;
    }
    // Data rental
    if (lastTransaction.destination) text += `Tujuan    : ${lastTransaction.destination}\n`;
    if (lastTransaction.startDate || lastTransaction.endDate)
      text += `Tgl Sewa  : ${lastTransaction.startDate ?? '?'} s/d ${lastTransaction.endDate ?? '?'}\n`;
    if (lastTransaction.driverName) text += `Supir     : ${lastTransaction.driverName}\n`;
    if (lastTransaction.licensePlate) text += `Plat Kend : ${lastTransaction.licensePlate}\n`;
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

  const printReceipt = (type: 'customer' | 'kitchen' = 'customer') => {
    setPrintType(type);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleBluetoothPrint = async () => {
    if (!lastTransaction) return;
    const parsedCash = parseInt(cashGiven.replace(/[^0-9]/g, '') || '0');
    await printBluetoothReceipt({
      storeName: tenantName || 'PJTECH KASIR POS',
      storeCategory: tenantCategory,
      date: lastTransaction.date,
      time: lastTransaction.time,
      transactionId: lastTransaction.id,
      customerName: lastTransaction.customerName,
      tableId: lastTransaction.tableId ? getTableName(lastTransaction.tableId) : undefined,
      // Data rental & Jasa
      destination: lastTransaction.destination,
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
    });
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
          <span>{isJasa ? 'Detail Layanan' : isRental ? 'Detail Sewa' : 'Keranjang'}</span>
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

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
        {/* Empty State Keranjang */}
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
            <ShoppingCart className="w-16 h-16 opacity-30" />
            <p className="text-sm font-medium text-center px-4">Keranjang masih kosong, silakan pilih {isJasa ? 'layanan' : isFNB ? 'menu' : 'produk'}</p>
          </div>
        ) : (
          cart.map(item => (
            <div key={item.cartItemId || item.id} className="flex flex-col bg-white border p-3 rounded-xl shadow-sm group hover:border-blue-200 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col pr-2">
                  <span className="font-bold text-sm text-gray-800 leading-tight">{item.name}</span>
                  <span className="text-gray-500 font-medium text-xs mt-0.5">{formatRupiah(item.hargaJual)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setEditingNoteId(item.cartItemId); setTempNote(item.note || ""); }} className="text-gray-400 hover:text-blue-500 transition-colors" title="+ Catatan">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => removeFromCart(item.cartItemId)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Pilihan Pekerja (Khusus Jasa) */}
              {isJasa && (
                <div className="mb-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Dikerjakan oleh:</label>
                  <select
                    className="w-full text-xs p-1.5 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={item.workerId || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCart(prev => prev.map(cartItem => cartItem.cartItemId === item.cartItemId ? { ...cartItem, workerId: val } : cartItem));
                    }}
                  >
                    <option value="" disabled>-- Pilih Karyawan --</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
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

              <div className="flex justify-between items-center">
                <p className="text-xs font-black text-blue-600">{formatRupiah(item.hargaJual * item.qty)}</p>
                <div className="flex items-center gap-1">
                  <button onClick={() => updateQty(item.cartItemId, -1)} className="p-1.5 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 active:scale-95 transition-all text-gray-600"><Minus className="w-3 h-3" /></button>
                  <span className="font-bold w-6 text-center text-sm">{item.qty}</span>
                  <button onClick={() => updateQty(item.cartItemId, 1)} disabled={item.qty >= item.stock} className="p-1.5 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 active:scale-95 transition-all text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"><Plus className="w-3 h-3" /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bagian Bawah Keranjang (Checkout) */}
      <div className="p-4 border-t bg-white space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 relative">

        {/* Input Nomor Meja (Khusus F&B) */}
        {isFNB && (
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Nomor Meja</label>
            <select
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg text-sm transition-all"
            >
              <option value="">Pilih Meja / Takeaway</option>
              {tables.map(t => {
                const isOccupied = t.status?.toUpperCase() === 'TERISI' || t.status?.toUpperCase() === 'OCCUPIED';
                return (
                  <option key={t.id} value={t.id} disabled={isOccupied}>
                    {t.name} (Kapasitas: {t.capacity}){isOccupied ? ' - TERISI' : ''}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {/* Form Jasa Waktu Layanan */}
        {isJasa && (
          <div className="space-y-2.5 bg-blue-50 border border-blue-200 rounded-xl p-3">
            <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
              🗓️ Jadwal Layanan
            </p>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Waktu Layanan *</label>
              <input
                type="datetime-local"
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
              <Car className="w-5 h-5" />
              {rentalInfo.driverName && rentalInfo.licensePlate && rentalInfo.guarantee
                ? "Data Sewa Terisi (Ubah)"
                : "⚠️ Lengkapi Data Sewa *"}
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
                className="w-full pl-9 pr-3 p-2.5 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg text-sm font-bold transition-all"
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
        {(isJasa || isRental) && cart.length > 0 && (
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
                    className="w-full pl-9 pr-3 p-2 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg text-sm transition-all"
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

        {/* Total & Tombol Bayar */}
        <div className="pt-3 border-t border-dashed space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-semibold text-gray-700">{formatRupiah(subTotal)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="font-bold text-gray-700">Total Belanja</span>
            <span className="font-black text-xl text-blue-600">{formatRupiah(grandTotal)}</span>
          </div>

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
            onClick={handleCheckout}
            disabled={cart.length === 0 || isCashInsufficient || isCheckoutLoading || isExpired || (isFNB && !tableId) || (isRental && (!rentalInfo.driverName.trim() || !rentalInfo.licensePlate.trim()))}
            className={`w-full py-3.5 rounded-xl font-bold shadow-sm transition-all duration-200 ease-in-out flex items-center justify-center gap-2 ${(cart.length === 0 || isCashInsufficient || isCheckoutLoading || isExpired || (isFNB && !tableId) || (isRental && (!rentalInfo.driverName.trim() || !rentalInfo.licensePlate.trim()))) ? 'bg-gray-300 text-gray-500 shadow-none cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-blue-600/30 active:scale-[0.98]'}`}
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
      <div className="flex h-screen bg-gray-50 overflow-hidden text-slate-900 print:hidden">
        {sidebar}
        {/* MAIN AREA */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {isExpired && (
            <div className="bg-red-600 text-white p-2 text-center text-sm font-bold shadow-sm z-50">
              ⚠️ Masa aktif paket berlangganan Anda telah berakhir. Harap perpanjang paket untuk dapat menggunakan fitur Kasir POS.
            </div>
          )}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="bg-white border-b p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl font-black flex items-center gap-2">
                      <Store className="w-6 h-6 text-blue-600" />
                      <span className="hidden sm:inline">PJTECH KASIR POS</span>
                      <span className="sm:hidden">KASIR POS</span>
                    </h1>
                  </div>
                  <div className="flex items-center gap-3">
                    <CustomUserButton />
                  </div>
                </div>

                {/* Search Bar & Kategori */}
                <div className="flex flex-row items-center gap-2 mb-2">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder={isJasa ? "Cari layanan atau kode..." : isFNB ? "Cari menu atau SKU..." : "Cari produk atau barcode..."}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="relative shrink-0">
                    <button
                      onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                      onBlur={() => setIsCategoryMenuOpen(false)}
                      className={`px-3 py-2 border rounded-lg flex items-center justify-center gap-2 transition-colors relative shadow-sm ${selectedCategory === "Semua"
                        ? "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        : "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                        }`}
                      title="Filter Kategori"
                    >
                      <Filter className={`w-4 h-4 ${selectedCategory === "Semua" ? "text-gray-500" : "text-blue-600"}`} />
                      <span className={`text-sm max-w-[100px] truncate ${selectedCategory !== "Semua" && "font-semibold"}`}>
                        {selectedCategory === "Semua" ? "Kategori" : selectedCategory}
                      </span>
                    </button>

                    {isCategoryMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                        <ul className="py-1 max-h-60 overflow-y-auto">
                          {categories.map(cat => (
                            <li key={cat}>
                              <button
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  setSelectedCategory(cat);
                                  setIsCategoryMenuOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${selectedCategory === cat ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                              >
                                {cat}
                                {selectedCategory === cat && <Check className="w-4 h-4" />}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-slate-50 pb-24 lg:pb-4 flex flex-col">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-1 content-start">
                  {products.map(product => {
                    const remaining = getRemainingStock(product);
                    const isOutOfStock = remaining <= 0;
                    return (
                      <div
                        key={product.id}
                        onClick={() => !isOutOfStock && (isFNB ? openFnbModal(product) : addToCart(product))}
                        className={`group relative rounded-xl border p-3 flex flex-col transition-all duration-200 ${isOutOfStock ? 'bg-red-50 border-red-200 cursor-not-allowed opacity-90' : 'bg-white cursor-pointer hover:shadow-lg hover:border-blue-500'}`}
                      >
                        {isOutOfStock && (
                          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded-md shadow-sm z-20 animate-pulse border border-red-600">
                            STOK HABIS
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
                          <div className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm z-10 ${isOutOfStock ? 'bg-red-600/90 text-white shadow-sm' : 'bg-black/60 text-white'}`}>
                            {isOutOfStock ? 'HABIS' : `Sisa: ${remaining}`}
                          </div>
                          {(product.discount && product.discount > 0) ? (
                            <div className="absolute top-2 left-2 text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm z-10 bg-red-600/90 text-white shadow-sm">
                              Promo
                            </div>
                          ) : null}
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
            <div className="hidden lg:flex w-[380px] bg-white border-l flex-col shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-20">
              {renderCartContent(false)}
            </div>
          </div>
        </div>

        {/* STICKY BOTTOM BAR (Mobile Only) */}
        {!isMobileCartOpen && cart.length > 0 && (
          <div className="fixed bottom-16 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] lg:hidden z-30 animate-in slide-in-from-bottom-5 duration-300">
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

        <BottomNavClient />

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
                <button
                  onClick={() => printReceipt('customer')}
                  className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm border-0 transition-all duration-200 ease-in-out active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  🖨️ Cetak Struk
                </button>
                {/* Tombol Bluetooth Printer */}
                {isBluetoothSupported() ? (
                  <div className="space-y-1">
                    <button
                      id="bluetooth-print-btn"
                      onClick={handleBluetoothPrint}
                      className="w-full py-3 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm border-0 transition-all duration-200 ease-in-out active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      🖨️ Cetak Struk (Bluetooth)
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
                )}
                {isFNB && (
                  <button
                    onClick={() => printReceipt('kitchen')}
                    className="w-full py-3 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm border-0 transition-all duration-200 ease-in-out active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    🍳 Cetak Tiket Dapur
                  </button>
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

      {/* STRUK KASIR (HANYA TAMPIL SAAT DIPRINT) */}
      <div className={`hidden ${printType === 'customer' ? 'print:block' : 'print:hidden'} w-[58mm] sm:w-[80mm] p-4 bg-white text-black text-xs font-mono mx-auto`}>
        <div className="text-center mb-4 border-b border-dashed border-gray-400 pb-4">
          <h1 className="text-lg font-bold uppercase mb-1">{tenantName || "PJTECH KASIR POS"}</h1>
          {tenantCategory && <p className="mb-1 text-[10px] uppercase font-bold">{tenantCategory}</p>}
          <p>Telp: {tenantPhone || "-"}</p>
        </div>

        {lastTransaction && (
          <>
            <div className="mb-4">
              <p>Waktu : {lastTransaction.date} {lastTransaction.time}</p>
              <p>Kasir : Admin</p>
              <p>Pelanggan : {lastTransaction.customerName}</p>
              {lastTransaction.tableId && <p>No. Meja : {getTableName(lastTransaction.tableId)}</p>}
              <p>ID Transaksi : {lastTransaction.id}</p>
            </div>

            <div className="border-b border-dashed border-gray-400 pb-2 mb-2">
              <table className="w-full text-left">
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
                      <tr>
                        <td className="pt-2">{item.name}</td>
                        <td className="pt-2 text-center">{item.qty}</td>
                        <td className="pt-2 text-right">{formatRupiah(item.hargaJual * item.qty)}</td>
                      </tr>
                      {item.workerId && (
                        <tr>
                          <td colSpan={3} className="text-gray-600 text-[10px] pl-2">(Oleh: {item.workerId})</td>
                        </tr>
                      )}
                      {item.note && (
                        <tr>
                          <td colSpan={3} className="text-gray-500 italic pl-2">- {item.note}</td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-1 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatRupiah(lastTransaction.items.reduce((acc, i) => acc + i.hargaJual * i.qty, 0))}</span>
              </div>
              <div className="flex justify-between font-bold text-sm mt-2 pt-2 border-t border-dashed border-gray-400">
                <span>Total Belanja</span>
                <span>{formatRupiah(lastTransaction.total)}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Metode</span>
                <span className="uppercase">{lastTransaction.method}</span>
              </div>
              {lastTransaction.method === 'cash' && (
                <>
                  <div className="flex justify-between">
                    <span>Tunai</span>
                    <span>{formatRupiah(parseInt(cashGiven.replace(/[^0-9]/g, '') || "0"))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kembalian</span>
                    <span>{formatRupiah(parseInt(cashGiven.replace(/[^0-9]/g, '') || "0") - lastTransaction.total)}</span>
                  </div>
                </>
              )}
            </div>

            <div className="text-center mt-6 pt-4 border-t border-dashed border-gray-400">
              <p className="font-bold">Terima Kasih!</p>
              <p>Silakan berkunjung kembali</p>
              <p className="mt-4 text-[10px]">Powered by PJTECH</p>
            </div>
          </>
        )}
      </div>

      {/* TIKET DAPUR (HANYA TAMPIL SAAT DIPRINT) */}
      <div className={`hidden ${printType === 'kitchen' ? 'print:block' : 'print:hidden'} w-[58mm] sm:w-[80mm] p-4 bg-white text-black font-mono mx-auto`}>
        {lastTransaction && (
          <>
            <div className="text-center mb-6 border-b-2 border-black pb-4">
              <h1 className="text-2xl font-black uppercase mb-2">PESANAN DAPUR</h1>
              <h2 className="text-3xl font-black">{lastTransaction.tableId ? `MEJA ${getTableName(lastTransaction.tableId)}` : 'TAKEAWAY'}</h2>
            </div>

            <div className="mb-6">
              <p className="text-sm font-bold">Waktu: {lastTransaction.date} {lastTransaction.time}</p>
              <p className="text-sm font-bold">ID: {lastTransaction.id}</p>
            </div>

            <div className="border-b-2 border-black pb-4 mb-4">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-black">
                    <th className="pb-2 font-black text-lg w-3/4">Item</th>
                    <th className="pb-2 font-black text-lg text-center w-1/4">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {lastTransaction.items.map(item => (
                    <React.Fragment key={item.id}>
                      <tr>
                        <td className="pt-4 font-black text-xl leading-tight pr-2">{item.name}</td>
                        <td className="pt-4 font-black text-2xl text-center">{item.qty}</td>
                      </tr>
                      {item.note && (
                        <tr>
                          <td colSpan={2} className="text-lg italic font-bold pb-2 pt-1 uppercase">* Note: {item.note}</td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-center mt-8">
              <p className="text-sm font-bold">--- AKHIR PESANAN ---</p>
            </div>
          </>
        )}
      </div>
      {/* Printer Help Modal */}
      <PrinterHelpModal isOpen={isPrinterHelpOpen} onClose={() => setIsPrinterHelpOpen(false)} />

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

      {/* Modal Data Armada & Sewa (Khusus Rental) */}
      {isRentalFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-amber-50 to-orange-50">
              <h2 className="text-lg font-black text-amber-900 flex items-center gap-2">
                <Car className="w-5 h-5 text-amber-600" />
                Lengkapi Data Sewa
              </h2>
              <button
                onClick={() => setIsRentalFormModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1.5 block">Nama Supir *</label>
                  <input
                    type="text"
                    placeholder="contoh: Budi Santoso"
                    value={rentalInfo.driverName}
                    onChange={(e) => setRentalInfo(prev => ({ ...prev, driverName: e.target.value }))}
                    className="w-full p-3 bg-gray-50 border border-gray-200 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 rounded-xl text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1.5 block">Plat Nomor *</label>
                  <input
                    type="text"
                    placeholder="contoh: B 1234 ABC"
                    value={rentalInfo.licensePlate}
                    onChange={(e) => setRentalInfo(prev => ({ ...prev, licensePlate: e.target.value.toUpperCase() }))}
                    className="w-full p-3 bg-gray-50 border border-gray-200 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 rounded-xl text-sm transition-all font-mono tracking-widest"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 mb-1.5 block">Tujuan <span className="font-normal text-gray-400">(opsional)</span></label>
                <input
                  type="text"
                  placeholder="contoh: Bandara, Bali..."
                  value={rentalInfo.destination}
                  onChange={(e) => setRentalInfo(prev => ({ ...prev, destination: e.target.value }))}
                  className="w-full p-3 bg-gray-50 border border-gray-200 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 rounded-xl text-sm transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1.5 block">Tgl Mulai</label>
                  <input
                    type="date"
                    value={rentalInfo.startDate}
                    onChange={(e) => setRentalInfo(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full p-3 bg-gray-50 border border-gray-200 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 rounded-xl text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1.5 block">Tgl Selesai</label>
                  <input
                    type="date"
                    value={rentalInfo.endDate}
                    onChange={(e) => setRentalInfo(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full p-3 bg-gray-50 border border-gray-200 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 rounded-xl text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 mb-1.5 block">Jaminan Diserahkan *</label>
                <input
                  type="text"
                  placeholder="contoh: KTP Asli / Motor + STNK"
                  value={rentalInfo.guarantee}
                  onChange={(e) => setRentalInfo(prev => ({ ...prev, guarantee: e.target.value }))}
                  className="w-full p-3 bg-gray-50 border border-gray-200 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 rounded-xl text-sm transition-all"
                />
                <p className="text-xs text-gray-500 mt-2">
                  * Jaminan wajib diisi. Contoh: KTP, KK, atau kendaraan milik penyewa.
                </p>
              </div>
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
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm shadow-amber-600/20 transition-all"
              >
                Simpan & Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}