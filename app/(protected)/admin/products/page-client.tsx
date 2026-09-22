"use client";

import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { PackageSearch, Plus, Edit2, Trash2, Loader2, PackageX, PackagePlus, ImagePlus, X, Search, Filter, Check, Upload, FileDown } from 'lucide-react';
import nextDynamic from 'next/dynamic';

const CsvImportModal = nextDynamic(() => import('@/components/CsvImportModal'), {
  ssr: false,
});
import { Pagination } from '@/components/Pagination';
import { isServiceBusinessCategory, isRentalTravelCategory, isPureServiceCategory, detectRentalItemType } from '@/lib/business-category';
import { humanizeError } from '@/lib/error-mapper';

export const dynamic = 'force-dynamic';

type Product = {
  id: number;
  kodeBarang: string | null;
  name: string;
  category: string;
  hpp: number;
  biayaModal: number;
  hargaJual: number;
  stock: number;
  discount: number;
  image: string;
  brand?: string | null;
  variant?: string | null;
  minStockThreshold: number;
  description?: string | null;
  employeeCommission?: number | null;
  isService?: boolean;
  status?: string;
};

const fetcher = async (args: string | [string, string]) => {
  const url = Array.isArray(args) ? args[0] : args;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Gagal memuat data');
  return res.json();
};

export default function AdminProductsClientPage({
  kategoriUsaha,
  initialData,
}: {
  kategoriUsaha: string;
  initialData?: { products: Product[]; totalPages: number };
}) {
  const { user } = useUser();
  const currentTenantId = user?.publicMetadata?.role === 'CASHIER' ? user?.publicMetadata?.tenantId : user?.id;
  const isJasa = isServiceBusinessCategory(kategoriUsaha);
  const isRental = isRentalTravelCategory(kategoriUsaha);
  const isPureJasa = isPureServiceCategory(kategoriUsaha);
  const isFNB = kategoriUsaha === 'FNB' || kategoriUsaha === 'F&B' || kategoriUsaha === 'F&B / Kuliner';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [quickRestockProduct, setQuickRestockProduct] = useState<Product | null>(null);
  const [quickRestockAmount, setQuickRestockAmount] = useState<string>('');
  const [isRestocking, setIsRestocking] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  const queryUrl = `/api/products?page=${currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(selectedCategory === "Semua" ? "" : selectedCategory)}`;
  const isInitialPage = currentPage === 1 && !searchQuery && selectedCategory === "Semua";

  const { data, error, isLoading, mutate } = useSWR<{ products: Product[], totalPages: number }>(
    queryUrl && currentTenantId ? [queryUrl, currentTenantId as string] : null,
    fetcher,
    {
      fallbackData: isInitialPage ? initialData : undefined,
      keepPreviousData: true,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  const rawProducts = data?.products || [];
  const totalPages = data?.totalPages || 1;

  // Instant Client-side Filter untuk Respons 0ms (Kategori + Search)
  const filteredProducts = useMemo(() => {
    if (!rawProducts || rawProducts.length === 0) return [];
    
    let result = rawProducts;

    if (selectedCategory !== "Semua") {
      const catLower = selectedCategory.toLowerCase().trim();
      if (isRental) {
        if (selectedCategory === "Unit Sewa" || catLower === "unit sewa" || catLower === "unit") {
          result = result.filter(p => !p.isService);
        } else if (selectedCategory === "Layanan & Add-on" || catLower.includes("layanan") || catLower.includes("add-on") || catLower.includes("tambahan")) {
          result = result.filter(p => p.isService || (p.category || "").toLowerCase().includes("layanan") || (p.category || "").toLowerCase().includes("tambahan"));
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

    if (searchQuery && searchQuery.trim() !== "") {
      const sLower = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(sLower) ||
        (p.kodeBarang && p.kodeBarang.toLowerCase().includes(sLower)) ||
        (p.description && p.description.toLowerCase().includes(sLower))
      );
    }

    return result;
  }, [rawProducts, selectedCategory, searchQuery]);

  const products = filteredProducts;

  const [formData, setFormData] = useState({
    kodeBarang: '',
    name: '',
    category: '',
    hpp: '',
    hargaJual: '',
    stock: '',
    discount: '0',
    image: '',
    brand: '',
    variant: '',
    minStockThreshold: '',
    employeeCommission: '0',
    description: '',
    biayaModal: '',
    // Rental Equipment specific fields
    rentalUnit: 'day',
    serialNumber: '',
    deposit: '0',
    conditionNotes: '',
    accessories: '',
    lateFee: '0',
    maintenanceSchedule: ''
  });

  const uniqueCategories = Array.from(new Set(rawProducts.map(p => p.category).filter(Boolean)));
  const categories = isPureJasa
    ? ["Semua", "Jasa / Servis", "Produk / Barang"]
    : isRental
      ? ["Semua", "Unit Sewa", "Layanan & Add-on", ...uniqueCategories.filter(c => c && c !== "Unit Sewa" && c !== "Layanan & Add-on")]
      : ["Semua", ...uniqueCategories];


  const formatNumberInput = (val: string) => {
    const numbers = val.replace(/\D/g, '');
    if (!numbers) return '';
    return new Intl.NumberFormat('id-ID').format(Number(numbers));
  };

  const parseNumberInput = (val: string | number) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    return parseInt(val.toString().replace(/\D/g, ''), 10) || 0;
  };

  // State untuk sub-tipe modal rental
  const [rentalModalType, setRentalModalType] = useState<"equipment" | "vehicle" | "property" | "addon">("equipment");

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      const isJasaMurni = isPureJasa && (product.category?.toLowerCase().includes('jasa') || product.category?.toLowerCase().includes('servis'));

      if (isRental) {
        if (product.isService || (product.category || '').toLowerCase().includes('layanan') || (product.category || '').toLowerCase().includes('tambahan') || (product.category || '').toLowerCase().includes('operator') || (product.category || '').toLowerCase().includes('supir')) {
          setRentalModalType('addon');
        } else {
          const detected = detectRentalItemType(product.name, product.description, product.category);
          setRentalModalType(detected === "unknown" ? "equipment" : detected);
        }
      }

      setFormData({
        kodeBarang: product.kodeBarang || '',
        name: product.name,
        category: product.category,
        hpp: formatNumberInput(isJasaMurni ? (product.biayaModal || product.hpp || 0).toString() : product.hpp.toString()),
        hargaJual: formatNumberInput(product.hargaJual.toString()),
        stock: isJasaMurni ? '' : product.stock.toString(),
        discount: formatNumberInput(product.discount.toString()),
        image: product.image,
        brand: product.brand || '',
        variant: product.variant || '',
        minStockThreshold: isJasaMurni ? '' : product.minStockThreshold.toString(),
        employeeCommission: formatNumberInput((product as any).employeeCommission?.toString() || '0'),
        description: product.description || '',
        biayaModal: formatNumberInput((product.biayaModal || product.hpp || 0).toString()),
        rentalUnit: (product as any).rentalUnit || 'day',
        serialNumber: (product as any).serialNumber || '',
        deposit: formatNumberInput((product as any).deposit?.toString() || '0'),
        conditionNotes: (product as any).conditionNotes || '',
        accessories: (product as any).accessories || '',
        lateFee: formatNumberInput((product as any).lateFee?.toString() || '0'),
        maintenanceSchedule: (product as any).maintenanceSchedule || ''
      });
    } else {
      setEditingProduct(null);

      let initialRentalType: "equipment" | "vehicle" | "property" | "addon" = "equipment";
      if (isRental) {
        if (selectedCategory === "Unit Sewa" || selectedCategory === "Armada") initialRentalType = "vehicle";
        else if (selectedCategory === "Properti") initialRentalType = "property";
        else if (selectedCategory === "Layanan & Add-on") initialRentalType = "addon";
        else if (selectedCategory === "Peralatan" || selectedCategory === "Alat") initialRentalType = "equipment";
        setRentalModalType(initialRentalType);
      }

      const defaultCategory = isPureJasa ? 'Jasa / Servis' : isRental ? (initialRentalType === 'equipment' ? 'Peralatan' : initialRentalType === 'vehicle' ? 'Armada' : initialRentalType === 'property' ? 'Properti' : 'Layanan Tambahan') : '';
      setFormData({
        kodeBarang: '',
        name: '',
        category: defaultCategory,
        hpp: '',
        hargaJual: '',
        stock: isRental && initialRentalType !== 'addon' ? '1' : '',
        discount: '0',
        image: '',
        brand: '',
        variant: '',
        minStockThreshold: isRental && initialRentalType !== 'addon' ? '1' : '',
        employeeCommission: '0',
        description: '',
        biayaModal: '',
        rentalUnit: 'day',
        serialNumber: '',
        deposit: '0',
        conditionNotes: '',
        accessories: '',
        lateFee: '0',
        maintenanceSchedule: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const closeImportModal = () => {
    setIsImportModalOpen(false);
    setImportFile(null);
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFile) {
      toast.error("Pilih file terlebih dahulu");
      return;
    }

    setIsImporting(true);
    try {
      const XLSX = await import('xlsx');
      const arrayBuffer = await importFile.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error("File kosong atau tidak memiliki lembar kerja (sheet).");
      }

      let rawRows: any[] = [];
      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        if (worksheet) {
          const sheetRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
          const processed = sheetRows.map((row: any) => ({
            ...row,
            _sheetName: sheetName, // Pass sheet name for server-side category detection
            category: row.category || row['Kategori'] || row.kategori || sheetName
          }));
          rawRows.push(...processed);
        }
      }

      if (!rawRows || rawRows.length === 0) {
        throw new Error("File tidak memiliki baris data yang valid.");
      }

      const productsList = rawRows.map((row) => {
        const rawName = row.name || 
          row['Nama Unit Kendaraan / Plat'] || 
          row['Nama Unit / Plat'] || 
          row['Nama Unit Kendaraan'] || 
          row['Nama Unit / No. Kamar'] || 
          row['Nama Kamar / Unit'] || 
          row['Nama Alat / Perlengkapan'] || 
          row['Nama Alat'] || 
          row['Nama Perlengkapan'] || 
          row['Nama Unit'] || 
          row['Nama Unit / Properti'] || 
          row['Nama Layanan'] || 
          row['Nama Produk'] || 
          row['Nama Produk / Barang'] || 
          row['Nama Barang'] || 
          row['Nama Menu'] || 
          row['Nama Layanan / Produk'] || 
          row['Nama Layanan / Barang'] || 
          row['Nama Sparepart'] || 
          row.nama || 
          row.unit || 
          '';

        return {
          _sheetName: row._sheetName || '', // Wajib dikirim ke API bulk untuk deteksi kategori
          kodeBarang: row.kodeBarang || row['Kode Barang'] || row['Kode Barang (SKU)'] || row['Kode Barang / SKU'] || row.sku || row.SKU || row['Kode Unit'] || row['Kode Layanan'] || '',
          name: String(rawName).trim(),
          category: row.category || row['Kategori Alat'] || row['Kategori'] || row.kategori || row._sheetName || 'Umum',
          brand: row.brand || row['Merek / Brand'] || row['Merek'] || row['Brand'] || '',
          variant: row.variant || row['Kelengkapan Unit'] || row['Kelengkapan'] || row['Varian'] || '',
          hpp: row.hpp ?? row['HPP / Biaya Perawatan per Sewa (Rp)'] ?? row['HPP / Biaya Operasional per Hari (Rp)'] ?? row['HPP / Biaya Operasional (Rp)'] ?? row['Biaya Operasional/Hari (Rp)'] ?? row['Biaya Operasional (B.Ops)'] ?? row['Biaya Operasional'] ?? row['HPP'] ?? row['Harga Modal'] ?? row['Harga Modal (HPP)'] ?? row['HPP (Modal)'] ?? row['HPP / Modal Beli (Rp)'] ?? row['HPP / Biaya Modal (Rp)'] ?? row['Modal'] ?? row.bOps ?? row.biayaOperasional ?? row['Biaya Modal / Bahan (Rp)'] ?? row['Biaya Modal'] ?? 0,
          hargaJual: row.hargaJual ?? row['Harga Sewa/Hari (Rp)'] ?? row['Harga Sewa/Bulan (Rp)'] ?? row['Harga Sewa/Jam (Rp)'] ?? row['Harga Sewa (Rp)'] ?? row['Tarif (Rp)'] ?? row['Tarif Layanan (Rp)'] ?? row['Harga Jual / Tarif (Rp)'] ?? row['Harga Jual (Rp)'] ?? row['Harga Jual'] ?? row['Tarif Layanan'] ?? row['Tarif'] ?? row.harga ?? row.tarif ?? 0,
          stock: row.stock ?? row['Stok'] ?? row['Qty (Stok)'] ?? row['Qty'] ?? row['Quantity'] ?? row.stok ?? row.qty ?? 0,
          minStockThreshold: row.minStockThreshold ?? row['Min Stok'] ?? row['Batas Minimum Stok'] ?? 5,
          satuan: row.satuan || row['Satuan'] || '',
          employeeCommission: row.employeeCommission ?? row['Komisi Operator / Kru (Rp)'] ?? row['Komisi Driver (Rp)'] ?? row['Komisi Staf (Rp)'] ?? row['Komisi Staf'] ?? row['Komisi Driver'] ?? row.komisi ?? row.komisiKaryawan ?? row['Komisi'] ?? 0,
          description: row.description || row['Fasilitas / Catatan'] || row['Catatan / Fasilitas'] || row['Catatan / Spesifikasi'] || row['Detail HPP (Listrik,Air,Internet,Kebersihan,Penyusutan)'] || row['Fasilitas / Deskripsi'] || row['Deskripsi Layanan'] || row['Deskripsi'] || row['Deskripsi / Catatan'] || row['Fasilitas'] || row.deskripsi || row.fasilitas || row.keterangan || '',
          isService: isPureJasa && (row.category?.toLowerCase() === 'jasa' || row.category?.toLowerCase() === 'jasa / servis' || !row.category)
        };
      }).filter(p => Boolean(p.name && String(p.name).trim()));

      if (productsList.length === 0) {
        throw new Error("Tidak ada data produk yang valid ditemukan (Pastikan kolom 'name' terisi).");
      }

      const res = await fetch('/api/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: productsList })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gagal import massal");

      toast.success(result.message || "Import berhasil");
      mutate();
      closeImportModal();
    } catch (err: any) {
      toast.error(humanizeError(err));
    } finally {
      setIsImporting(false);
    }
  };

  const handleExportCatalog = async () => {
    try {
      setIsExporting(true);
      const res = await fetch('/api/products/export');
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Gagal mengekspor data produk');
      }
      const blob = await res.blob();
      const contentDisposition = res.headers.get('Content-Disposition');
      let filename = 'Katalog_Produk.xlsx';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^";]+)"?/);
        if (match && match[1]) filename = match[1];
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Katalog produk berhasil diekspor!');
    } catch (err: any) {
      toast.error(humanizeError(err));
    } finally {
      setIsExporting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (['hpp', 'hargaJual', 'discount', 'employeeCommission'].includes(name)) {
      setFormData(prev => ({ ...prev, [name]: formatNumberInput(value) }));
    } else {
      const finalVal = (name === 'kodeBarang' || (isRental && name === 'name')) ? value.toUpperCase() : value;
      setFormData(prev => ({ ...prev, [name]: finalVal }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran foto terlalu besar. Maksimal 5MB.");
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          const MAX_DIM = 800;

          if (width > height && width > MAX_DIM) {
            height = Math.round(height * (MAX_DIM / width));
            width = MAX_DIM;
          } else if (height > MAX_DIM) {
            width = Math.round(width * (MAX_DIM / height));
            height = MAX_DIM;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setFormData(prev => ({ ...prev, image: compressedBase64 }));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.hargaJual) {
      toast.error('Harga Jual wajib diisi!');
      return;
    }

    setIsSubmitting(true);

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const isRentalAddon = isRental && rentalModalType === 'addon';
      const payload = {
        ...formData,
        hpp: parseInt(formData.hpp.toString().replace(/[^0-9]/g, ''), 10) || 0,
        hargaJual: parseInt(formData.hargaJual.toString().replace(/[^0-9]/g, ''), 10) || 0,
        discount: parseInt(formData.discount.toString().replace(/[^0-9]/g, ''), 10) || 0,
        // Jasa murni (category === "Jasa"): no stock, no hpp (use biayaModal instead)
        // Rental addon: unlimited stock
        stock: (isPureJasa && formData.category === "Jasa / Servis") ? 999999 : isRentalAddon ? 999999 : (parseInt(formData.stock.toString().replace(/[^0-9]/g, ''), 10) || (isRental ? 1 : 0)),
        minStockThreshold: (isPureJasa && formData.category === "Jasa / Servis") ? 0 : isRentalAddon ? 0 : (parseInt(formData.minStockThreshold.toString().replace(/[^0-9]/g, ''), 10) || (isRental ? 1 : 5)),
        employeeCommission: (isPureJasa || isRental) ? (parseInt(formData.employeeCommission.toString().replace(/[^0-9]/g, ''), 10) || 0) : 0,
        description: isRental ? formData.description : null,
        isService: (isPureJasa && formData.category === "Jasa / Servis") || isRentalAddon,
        // biayaModal untuk Jasa murni (pakai field biayaModal, bukan hpp)
        biayaModal: (isPureJasa && formData.category === "Jasa / Servis") ? (parseInt(formData.biayaModal.toString().replace(/[^0-9]/g, ''), 10) || 0) : 0,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let result;
      try {
        result = await res.json();
      } catch (parseErr) {
        throw new Error(`Error ${res.status}: Payload terlalu besar atau server bermasalah.`);
      }

      if (!res.ok) {
        console.error("Server Error Response:", result);
        throw new Error(result?.error || (typeof result === 'object' ? JSON.stringify(result) : `Terjadi kesalahan (${res.status})`));
      }

      toast.success(
        editingProduct
          ? (isRental ? 'Unit sewa berhasil diperbarui!' : isPureJasa ? 'Layanan berhasil diperbarui!' : isFNB ? 'Menu berhasil diperbarui!' : 'Produk berhasil diperbarui!')
          : (isRental ? 'Unit sewa baru ditambahkan!' : isPureJasa ? 'Layanan baru ditambahkan!' : isFNB ? 'Menu baru ditambahkan!' : 'Produk baru ditambahkan!')
      );
      mutate();
      closeModal();
    } catch (err: any) {
      console.error("Submit Error:", err);
      toast.error(humanizeError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    const targetId = productToDelete;
    setProductToDelete(null);

    // Optimistic UI: langsung hapus produk dari UI lokal dalam waktu < 50ms
    mutate(
      async (current) => {
        const res = await fetch(`/api/products/${targetId}`, { method: 'DELETE' });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Gagal menghapus');
        toast.success('Produk berhasil dihapus');
        return {
          products: (current?.products || []).filter(p => p.id !== targetId),
          totalPages: current?.totalPages || 1
        };
      },
      {
        optimisticData: (current) => ({
          products: (current?.products || []).filter(p => p.id !== targetId),
          totalPages: current?.totalPages || 1
        }),
        rollbackOnError: true,
        revalidate: true,
      }
    ).catch((err: any) => {
      toast.error(humanizeError(err));
    });
  };

  const handleQuickRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickRestockProduct) return;

    const amount = parseInt(quickRestockAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Jumlah stok masuk tidak valid');
      return;
    }

    const targetProduct = quickRestockProduct;
    setQuickRestockProduct(null);
    setQuickRestockAmount('');

    // Optimistic UI: langsung perbarui stok di UI lokal dalam waktu < 50ms
    mutate(
      async (current) => {
        setIsRestocking(true);
        try {
          const res = await fetch(`/api/products/${targetProduct.id}/stock`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount })
          });
          const result = await res.json();
          if (!res.ok) throw new Error(result.error || 'Gagal menambah stok');
          toast.success(`Stok ${targetProduct.name} berhasil ditambahkan!`);
          return {
            products: (current?.products || []).map(p => p.id === targetProduct.id ? { ...p, stock: p.stock + amount } : p),
            totalPages: current?.totalPages || 1
          };
        } finally {
          setIsRestocking(false);
        }
      },
      {
        optimisticData: (current) => ({
          products: (current?.products || []).map(p => p.id === targetProduct.id ? { ...p, stock: p.stock + amount } : p),
          totalPages: current?.totalPages || 1
        }),
        rollbackOnError: true,
        revalidate: true,
      }
    ).catch((err: any) => {
      toast.error(humanizeError(err));
    });
  };

  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  if (error) return <div className="text-red-500 p-4 bg-red-50 rounded-xl border border-red-100">Error: Gagal memuat data produk</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <PackageSearch className="w-6 h-6 text-blue-600" />
            {isPureJasa ? "Manajemen Layanan" : isFNB ? "Manajemen Menu" : isRental ? "Manajemen Unit & Properti" : "Manajemen Produk"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">Kelola daftar {isPureJasa ? "layanan" : isFNB ? "menu" : isRental ? "unit & properti" : "produk"}, harga, dan {isPureJasa ? "ketersediaan" : isRental ? "ketersediaan" : "stok"} Anda.</p>
        </div>
        {(isLoading || (products && products.length > 0)) && (
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm transition-all duration-200 ease-in-out px-4 py-2.5 rounded-xl font-bold flex justify-center items-center gap-2 active:scale-95 w-full sm:w-auto shrink-0"
              title="Import Data: Memasukkan banyak produk/layanan dari file Excel ke kasir (Input Massal)"
            >
              <Upload className="w-5 h-5 text-gray-500" />
              <span>Import Data</span>
            </button>
            <button
              onClick={handleExportCatalog}
              disabled={isExporting}
              className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm transition-all duration-200 ease-in-out px-4 py-2.5 rounded-xl font-bold flex justify-center items-center gap-2 active:scale-95 w-full sm:w-auto shrink-0 disabled:opacity-50"
              title="Export Data: Mengunduh & membackup daftar produk/layanan yang saat ini tersimpan di kasir ke file Excel"
            >
              {isExporting ? <Loader2 className="w-5 h-5 animate-spin text-gray-500" /> : <FileDown className="w-5 h-5 text-gray-500" />}
              <span>Export Data</span>
            </button>
            <button
              onClick={() => openModal()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm border-0 transition-all duration-200 ease-in-out px-5 py-2.5 rounded-xl font-bold flex justify-center items-center gap-2 active:scale-95 w-full sm:w-auto shrink-0"
            >
              <Plus className="w-5 h-5" />
              {isRental ? "Tambah Unit Sewa / Armada" : isPureJasa ? "Tambah Layanan" : isFNB ? "Tambah Menu" : "Tambah Barang"}
            </button>
          </div>
        )}
      </div>

      {/* Search Bar & Kategori */}
      <div className="flex flex-row items-center gap-2 mb-2">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={isPureJasa ? "Cari layanan atau kode..." : isFNB ? "Cari menu atau SKU..." : isRental ? "Cari unit / plat / kamar..." : "Cari produk atau barcode..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
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
            <span className={`text-sm max-w-[120px] truncate ${selectedCategory !== "Semua" && "font-semibold"}`}>
              {selectedCategory === "Semua" 
                ? (isPureJasa ? "Jasa & Produk" : isFNB ? "Makanan & Minuman" : isRental ? "Unit & Properti" : "Semua Produk")
                : selectedCategory}
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
                      <span className="truncate">
                        {isRental && cat === "Semua" ? "🌐 Semua Unit & Layanan"
                          : isRental && cat === "Unit Sewa" ? "📦 Unit Sewa (Fisik)"
                          : isRental && cat === "Layanan & Add-on" ? "🛠️ Layanan & Add-on"
                          : cat}
                      </span>
                      {selectedCategory === cat && <Check className="w-4 h-4 shrink-0" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {(!data && !error) ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
            <p>Memuat data produk...</p>
          </div>
        ) : products && products.length > 0 ? (
          <div className="flex flex-col">
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50/50">
              {products.map(product => (
                <div key={product.id} className="bg-white p-4 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-200 flex gap-4 hover:shadow-[0_8px_20px_-6px_rgba(6,81,237,0.15)] hover:border-blue-200 transition-all">
                  {/* Product Image */}
                  {product.image ? (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-50 relative">
                      <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 5rem, 6rem" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg shrink-0 border border-slate-100 bg-slate-50 flex items-center justify-center text-slate-300">
                      <PackageSearch className="w-8 h-8 opacity-50" />
                    </div>
                  )}

                  {/* Product Details */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-900 truncate leading-tight">{product.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-1 truncate">{product.kodeBarang || 'Tanpa SKU'}</div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        {!isPureJasa && !isRental && (
                          <button onClick={() => { setQuickRestockProduct(product); setQuickRestockAmount(''); }} className="p-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-md transition-colors" title="Tambah Stok Cepat">
                            <PackagePlus className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button onClick={() => openModal(product)} className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors" title="Edit">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setProductToDelete(product.id)} className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors" title="Hapus">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md font-medium border border-slate-200">{product.category}</span>
                      {product.discount > 0 && (
                        <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md border border-red-200">Diskon</span>
                      )}
                    </div>

                    <div className="mt-auto pt-3 flex items-end justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 font-medium mb-0.5">
                          {isRental ? 'B. Ops' : isPureJasa ? (product.category?.toLowerCase() === 'jasa' ? 'Modal/Bahan' : 'HPP') : 'HPP'}: {formatRupiah(product.hpp || product.biayaModal || 0)}
                        </div>
                        {product.discount > 0 ? (
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 line-through leading-none mb-0.5">{formatRupiah(product.hargaJual)}</span>
                            <span className="text-sm font-bold text-red-600 leading-none">{formatRupiah(product.hargaJual - product.discount)}</span>
                          </div>
                        ) : (
                          <div className="text-sm font-bold text-blue-600 leading-none">{formatRupiah(product.hargaJual)}</div>
                        )}
                      </div>
                      {/* Stok hanya untuk Retail/FNB/Barang, bukan Jasa murni & bukan Rental */}
                      {!isPureJasa && !isRental && (
                        <div className="text-right">
                          <span className={`inline-flex min-w-[3.5rem] justify-center px-1.5 py-0.5 rounded-md text-[10px] font-bold border ${product.stock > (product.minStockThreshold || 5) ? 'bg-green-50 text-green-700 border-green-200' : product.stock > 0 ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                            Sisa: {product.stock}
                          </span>
                        </div>
                      )}
                      {/* Rental: tampilkan status ketersediaan */}
                      {isRental && (
                        <div className="text-right">
                          <span className={`inline-flex min-w-[3.5rem] justify-center px-1.5 py-0.5 rounded-md text-[10px] font-bold border ${product.status === 'Tersedia' ? 'bg-green-50 text-green-700 border-green-200' : product.status === 'Disewa' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                            {product.status || 'Tersedia'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        ) : (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <PackageX className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Belum ada {isRental ? "unit sewa" : isPureJasa ? "layanan" : isFNB ? "menu" : "produk"}
            </h3>
            <p className="text-slate-500 max-w-sm mb-6">
              Anda belum menambahkan {isRental ? "unit sewa" : isPureJasa ? "layanan" : isFNB ? "menu" : "produk"} apapun. Silakan tambah {isRental ? "unit sewa / armada" : isPureJasa ? "layanan" : isFNB ? "menu" : "produk"} pertama Anda untuk mulai berjualan.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() => openModal()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm border-0 transition-all duration-200 ease-in-out px-6 py-3 rounded-xl font-bold flex justify-center items-center gap-2 active:scale-95 w-full sm:w-auto shrink-0"
              >
                <Plus className="w-5 h-5" />
                {isRental ? "Tambah Unit Sewa / Armada" : isPureJasa ? "Tambah Layanan" : isFNB ? "Tambah Menu" : "Tambah Barang"}
              </button>
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm transition-all duration-200 ease-in-out px-6 py-3 rounded-xl font-bold flex justify-center items-center gap-2 active:scale-95 w-full sm:w-auto shrink-0"
              >
                <Upload className="w-5 h-5 text-gray-500" />
                Import Data
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct
                  ? (isRental ? (rentalModalType === 'equipment' ? 'Edit Unit Alat / Perlengkapan' : rentalModalType === 'vehicle' ? 'Edit Unit Kendaraan' : rentalModalType === 'property' ? 'Edit Unit Properti' : 'Edit Layanan Tambahan') : isPureJasa ? 'Edit Layanan' : isFNB ? 'Edit Menu' : 'Edit Produk')
                  : (isRental ? (rentalModalType === 'equipment' ? 'Tambah Unit Alat / Barang Baru' : rentalModalType === 'vehicle' ? 'Tambah Unit Kendaraan Baru' : rentalModalType === 'property' ? 'Tambah Unit Properti Baru' : 'Tambah Layanan Tambahan Baru') : isPureJasa ? 'Tambah Layanan Baru' : isFNB ? 'Tambah Menu Baru' : 'Tambah Produk Baru')}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-2">
              <form id="product-form" onSubmit={handleSubmit} className="p-3 space-y-4">
                {/* Image Upload Area */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Foto {isRental ? (rentalModalType === 'equipment' ? 'Alat' : rentalModalType === 'vehicle' ? 'Kendaraan' : rentalModalType === 'property' ? 'Properti' : 'Layanan') : isPureJasa ? 'Layanan' : isFNB ? 'Menu' : 'Produk'} <span className="text-gray-400 font-normal">(Opsional)</span></label>
                  {formData.image ? (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 group">
                      <Image src={formData.image} alt="Preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                        <button type="button" onClick={removeImage} className="text-white p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-24 border border-gray-200 rounded-xl cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col items-center justify-center">
                        <ImagePlus className="w-6 h-6 text-gray-400 mb-1" />
                        <p className="text-xs text-gray-500 font-medium">Klik untuk unggah foto</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  )}
                </div>

                {!isFNB && !isPureJasa && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Kode Barang / SKU <span className="text-slate-400 font-normal">(Opsional)</span></label>
                    <input
                      type="text"
                      name="kodeBarang"
                      value={formData.kodeBarang}
                      onChange={handleChange}
                      placeholder={isRental ? (rentalModalType === 'equipment' ? "ALT001" : rentalModalType === 'vehicle' ? "ARM001" : "PRP001") : "SKU-001"}
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 uppercase font-mono"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Selector Jenis Item Khusus RENTAL */}
                  {isRental && (
                    <div className="sm:col-span-2 bg-slate-50 border border-slate-200 p-3 rounded-xl mb-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pilih Jenis Unit Sewa</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setRentalModalType('equipment');
                            setFormData(prev => ({
                              ...prev,
                              category: prev.category === 'Armada' || prev.category === 'Properti' || prev.category === 'Layanan Tambahan' ? 'Peralatan' : prev.category || 'Peralatan',
                              stock: prev.stock || '1',
                              minStockThreshold: prev.minStockThreshold || '1',
                            }));
                          }}
                          className={`py-2 px-2 rounded-lg text-xs font-bold border text-center transition-all flex items-center justify-center gap-1.5 ${
                            rentalModalType === 'equipment'
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          📦 Alat / Barang
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRentalModalType('vehicle');
                            setFormData(prev => ({
                              ...prev,
                              category: prev.category === 'Peralatan' || prev.category === 'Properti' || prev.category === 'Layanan Tambahan' ? 'Armada' : prev.category || 'Armada',
                              stock: prev.stock || '1',
                              minStockThreshold: prev.minStockThreshold || '1',
                            }));
                          }}
                          className={`py-2 px-2 rounded-lg text-xs font-bold border text-center transition-all flex items-center justify-center gap-1.5 ${
                            rentalModalType === 'vehicle'
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          🚗 Kendaraan
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRentalModalType('property');
                            setFormData(prev => ({
                              ...prev,
                              category: prev.category === 'Peralatan' || prev.category === 'Armada' || prev.category === 'Layanan Tambahan' ? 'Properti' : prev.category || 'Properti',
                              stock: prev.stock || '1',
                              minStockThreshold: prev.minStockThreshold || '1',
                            }));
                          }}
                          className={`py-2 px-2 rounded-lg text-xs font-bold border text-center transition-all flex items-center justify-center gap-1.5 ${
                            rentalModalType === 'property'
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          🏨 Properti / Kos
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRentalModalType('addon');
                            setFormData(prev => ({
                              ...prev,
                              category: 'Layanan Tambahan',
                              stock: '999999',
                              minStockThreshold: '0',
                              hpp: '0',
                            }));
                          }}
                          className={`py-2 px-2 rounded-lg text-xs font-bold border text-center transition-all flex items-center justify-center gap-1.5 ${
                            rentalModalType === 'addon'
                              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          🛠️ Layanan / Kru
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Selector Jenis Item Khusus JASA */}
                  {isPureJasa && (
                    <div className="sm:col-span-2 bg-slate-50 border border-slate-200 p-3 rounded-xl mb-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pilih Jenis Item</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, category: 'Jasa / Servis' }))}
                          className={`py-2 px-3 rounded-lg text-xs font-bold border text-center transition-all ${
                            (formData.category.toLowerCase().includes('jasa') || formData.category.toLowerCase().includes('servis') || !formData.category)
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          🛠️ Jasa / Servis (Layanan)
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, category: 'Produk / Barang' }))}
                          className={`py-2 px-3 rounded-lg text-xs font-bold border text-center transition-all ${
                            (formData.category.toLowerCase().includes('produk') || formData.category.toLowerCase().includes('barang') || formData.category.toLowerCase().includes('sparepart'))
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          📦 Produk / Barang (Fisik)
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      {isRental
                        ? (rentalModalType === 'equipment' ? 'Nama Alat / Perlengkapan' : rentalModalType === 'vehicle' ? 'Nama Kendaraan / Nomor Plat' : rentalModalType === 'property' ? 'Nama Kamar / Unit Properti' : 'Nama Layanan Tambahan / Kru')
                        : (isPureJasa && (formData.category.toLowerCase().includes('jasa') || formData.category.toLowerCase().includes('servis') || !formData.category))
                          ? 'Nama Jasa / Paket Layanan'
                          : isPureJasa ? 'Nama Produk / Barang' : isFNB ? 'Nama Menu' : 'Nama Produk'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={
                        isRental
                          ? (rentalModalType === 'equipment' ? "misal: Sony Alpha 7 IV, Tenda Dome 4P, Sound System 5000W" : rentalModalType === 'vehicle' ? "misal: Avanza Veloz - B 1234 ABC, Innova Reborn" : rentalModalType === 'property' ? "misal: Room 101, Villa Puncak Asri, Glamping Suite 1" : "misal: Jasa Operator Soundman, Jasa Supir Harian")
                          : (isPureJasa && (formData.category.toLowerCase().includes('jasa') || formData.category.toLowerCase().includes('servis') || !formData.category)) ? "misal: Cuci Motor Kilat, Servis Ringan, Pangkas Rambut" : isPureJasa ? "misal: Oli Mesin Matic 0.8L, Pomade Styling, Shampoo 500ml" : ""
                      }
                      className={`bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${isRental && rentalModalType === 'vehicle' ? 'uppercase font-mono' : ''}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      {isRental ? (rentalModalType === 'equipment' ? 'Kategori Alat' : rentalModalType === 'vehicle' ? 'Tipe Kendaraan' : rentalModalType === 'property' ? 'Tipe Properti' : 'Kategori Layanan') : 'Kategori'} <span className="text-red-500">*</span>
                    </label>
                    {isPureJasa ? (
                      <select
                        name="category"
                        required
                        value={formData.category.toLowerCase().includes('jasa') || formData.category.toLowerCase().includes('servis') || !formData.category ? 'Jasa / Servis' : 'Produk / Barang'}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 font-semibold"
                      >
                        <option value="Jasa / Servis">🛠️ Jasa / Servis (Layanan)</option>
                        <option value="Produk / Barang">📦 Produk / Barang (Barang Fisik)</option>
                      </select>
                    ) : isRental ? (
                      // RENTAL: Locked category based on rentalModalType
                      <select
                        name="category"
                        required
                        disabled={!!editingProduct} // Locked when editing
                        value={editingProduct ? formData.category : (
                          rentalModalType === 'equipment' ? 'Peralatan' :
                          rentalModalType === 'vehicle' ? 'Armada' :
                          rentalModalType === 'property' ? 'Properti' :
                          'Layanan Tambahan'
                        )}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className={`bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 font-semibold ${
                          editingProduct ? 'bg-slate-50 cursor-not-allowed opacity-70' : ''
                        }`}
                      >
                        {rentalModalType === 'equipment' && (
                          <>
                            <option value="Peralatan">📦 Peralatan / Alat / Barang</option>
                            <option value="Kamera & Lensa">Kamera & Lensa</option>
                            <option value="Outdoor & Camping">Outdoor & Camping</option>
                            <option value="Sound System & Event">Sound System & Event</option>
                            <option value="Console & Game">Console & Game</option>
                            <option value="Perkakas & Alat Berat">Perkakas & Alat Berat</option>
                            <option value="Pakaian & Kostum">Pakaian & Kostum</option>
                            <option value="Lainnya">Lainnya</option>
                          </>
                        )}
                        {rentalModalType === 'vehicle' && (
                          <>
                            <option value="Armada">🚗 Armada / Kendaraan</option>
                            <option value="MPV">MPV</option>
                            <option value="SUV">SUV</option>
                            <option value="Sedan">Sedan</option>
                            <option value="Minibus">Minibus</option>
                            <option value="Motor">Motor</option>
                            <option value="Bus">Bus</option>
                          </>
                        )}
                        {rentalModalType === 'property' && (
                          <>
                            <option value="Properti">🏨 Properti / Penginapan</option>
                            <option value="Kamar Kost">Kamar Kost</option>
                            <option value="Villa">Villa</option>
                            <option value="Apartemen">Apartemen</option>
                            <option value="Hotel">Hotel</option>
                            <option value="Glamping">Glamping</option>
                            <option value="Homestay">Homestay</option>
                          </>
                        )}
                        {rentalModalType === 'addon' && (
                          <>
                            <option value="Layanan Tambahan">🛠️ Layanan Tambahan / Add-on</option>
                            <option value="Operator/Kru">Operator/Kru</option>
                            <option value="Supir/Bunker">Supir/Bunker</option>
                            <option value="Extra Bed">Extra Bed</option>
                            <option value="Sarapan/Makan">Sarapan/Makan</option>
                            <option value="Laundry">Laundry</option>
                            <option value="Antar Jemput">Antar Jemput</option>
                          </>
                        )}
                      </select>
                    ) : (
                      <>
                        <input
                          type="text"
                          name="category"
                          required
                          autoComplete="off"
                          list="category-options"
                          placeholder="Kategori produk"
                          value={formData.category}
                          onChange={handleChange}
                          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                        <datalist id="category-options">
                          {uniqueCategories.map(cat => (
                            <option key={cat} value={cat} />
                          ))}
                        </datalist>
                      </>
                    )}
                  </div>

                  {((!isFNB && !isPureJasa && !isRental) || (isRental && rentalModalType === 'equipment')) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 col-span-1 sm:col-span-2">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Merek / Brand <span className="text-slate-400 font-normal">(Opsional)</span></label>
                        <input
                          type="text"
                          name="brand"
                          placeholder={isRental ? "misal: Sony, Canon, Quechua, Yamaha" : ""}
                          value={formData.brand}
                          onChange={handleChange}
                          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Kelengkapan Unit / Aksesori <span className="text-slate-400 font-normal">(Opsional)</span></label>
                        <input
                          type="text"
                          name="variant"
                          placeholder={isRental ? "misal: Body, 2 Baterai, Charger, Tas" : ""}
                          value={formData.variant}
                          onChange={handleChange}
                          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                      </div>
                    </div>
                  )}

                  {(isPureJasa && (formData.category?.toLowerCase().includes('jasa') || formData.category?.toLowerCase().includes('servis') || !formData.category)) || (isRental && rentalModalType === 'addon') ? null : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 col-span-1 sm:col-span-2">
                      <div className={isFNB ? 'sm:col-span-2' : ''}>
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                          {isRental
                            ? (rentalModalType === 'equipment' ? "Jumlah Unit Alat (Stok Fisik)" : rentalModalType === 'vehicle' ? "Jumlah Unit Armada" : "Jumlah Unit Kamar")
                            : "Stok Awal"}
                        </label>
                        <input
                          type="number"
                          name="stock"
                          min="0"
                          placeholder={isRental ? "1" : "0"}
                          value={formData.stock}
                          onChange={handleChange}
                          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                      </div>
                      {!isFNB && (
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">
                            {isRental ? "Batas Minimum Unit" : "Batas Stok Menipis"} <span className="text-slate-400 font-normal">(Opsional)</span>
                          </label>
                          <input
                            type="number"
                            name="minStockThreshold"
                            min="0"
                            value={formData.minStockThreshold}
                            onChange={handleChange}
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {!(isRental && rentalModalType === 'addon') && (
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        {isRental
                          ? (rentalModalType === 'equipment' ? 'HPP / Biaya Perawatan per Sewa (Opsional)' : rentalModalType === 'vehicle' ? 'Biaya Operasional per Hari (Opsional)' : 'HPP / Operasional per Hari (Opsional)')
                          : (isPureJasa && formData.category.toLowerCase().includes('jasa')) ? 'Biaya Modal / Bahan Dasar (Opsional)' : 'Harga Modal (HPP)'}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">Rp</span>
                        <input
                          type="text"
                          name={(isPureJasa && formData.category.toLowerCase().includes('jasa')) ? "biayaModal" : "hpp"}
                          required={!isPureJasa && !isRental}
                          value={formData[(isPureJasa && formData.category.toLowerCase().includes('jasa')) ? "biayaModal" : "hpp"]}
                          onChange={handleChange}
                          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                        />
                      </div>
                      {isRental && rentalModalType === 'equipment' && (
                        <p className="text-xs text-slate-500 mt-1">Biaya sensor cleaning, laundry tenda, atau penyusutan alat per transaksi.</p>
                      )}
                      {isRental && rentalModalType === 'vehicle' && (
                        <p className="text-xs text-slate-500 mt-1">Biaya bensin, ganti oli, cuci, atau operasional per hari.</p>
                      )}
                      {isRental && rentalModalType === 'property' && (
                        <p className="text-xs text-slate-500 mt-1">Estimasi biaya listrik, air, kebersihan, dan laundry per hari/malam.</p>
                      )}
                      {isPureJasa && formData.category.toLowerCase().includes('jasa') && (
                        <p className="text-xs text-slate-500 mt-1">Biaya bahan habis pakai per pengerjaan jasa (misal: sampo, oli rem).</p>
                      )}
                      {isPureJasa && !formData.category.toLowerCase().includes('jasa') && (
                        <p className="text-xs text-slate-500 mt-1">Harga beli modal sparepart / produk dari supplier.</p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      {isRental
                        ? (rentalModalType === 'addon' ? "Tarif Layanan (Rp)" : "Harga Sewa / Tarif (Per Hari / Per Unit)")
                        : (isPureJasa && formData.category.toLowerCase().includes('jasa')) ? "Tarif Jasa" : isPureJasa ? "Harga Jual Produk / Barang" : "Harga Jual"} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">Rp</span>
                      <input
                        type="text"
                        name="hargaJual"
                        required
                        value={formData.hargaJual}
                        onChange={handleChange}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                      />
                    </div>
                  </div>

                  {(isPureJasa || isRental) && (
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        {isRental
                          ? (rentalModalType === 'equipment' ? 'Komisi Operator / Kru Audio / Teknisi (Opsional, Rp)' : rentalModalType === 'vehicle' ? 'Komisi Driver / Supir (Opsional, Rp)' : 'Komisi Staf / Kru (Opsional, Rp)')
                          : formData.category.toLowerCase().includes('jasa') ? 'Komisi Staf / Teknisi (Rp)' : 'Komisi Penjualan Staf (Opsional, Rp)'}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">Rp</span>
                        <input
                          type="text"
                          name="employeeCommission"
                          value={formData.employeeCommission}
                          onChange={handleChange}
                          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {isRental
                          ? (rentalModalType === 'equipment' ? 'Nominal komisi bagi hasil untuk soundman, videografer, atau kru yang mengoperasikan alat ini.' : rentalModalType === 'vehicle' ? 'Nominal komisi untuk supir / driver per perjalanan.' : 'Nominal bonus / komisi staf per sewa.')
                          : formData.category.toLowerCase().includes('jasa') ? 'Nominal bagi hasil untuk teknisi/kapster/staf yang mengerjakan jasa ini.' : 'Nominal bonus/komisi staf jika berhasil menjual sparepart/barang ini.'}
                      </p>
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Diskon (Opsional)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">Rp</span>
                      <input
                        type="text"
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Potongan harga langsung untuk produk ini.</p>
                  </div>

                  {isRental && (
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        {rentalModalType === 'equipment' ? 'Spesifikasi / Catatan Kelayakan Alat (Opsional)' : rentalModalType === 'vehicle' ? 'Fasilitas / Catatan Kendaraan (Opsional)' : rentalModalType === 'property' ? 'Fasilitas / Catatan Properti (Opsional)' : 'Deskripsi Layanan (Opsional)'}
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange as any}
                        placeholder={
                          rentalModalType === 'equipment'
                            ? "Misal: Sensor 33MP Full-frame, 4K 60p, shutter count rendah, include hardcase anti air."
                            : rentalModalType === 'vehicle'
                            ? "Misal: Transmisi Automatic, bensin full to full, dilarang merokok di kabin."
                            : rentalModalType === 'property'
                            ? "Misal: Harga sudah termasuk Listrik & WiFi 50Mbps, AC dingin, water heater."
                            : "Misal: Standby operator audio selama acara berlangsung max 8 jam."
                        }
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 min-h-[80px]"
                      />
                    </div>
                  )}
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 shrink-0 rounded-b-2xl">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                form="product-form"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm border-0 transition-all duration-200 ease-in-out px-8 py-2.5 rounded-xl font-bold active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                {isSubmitting ? 'Menyimpan...' : (isPureJasa ? 'Simpan Layanan' : isFNB ? 'Simpan Menu' : isRental ? (rentalModalType === 'equipment' ? 'Simpan Alat' : rentalModalType === 'vehicle' ? 'Simpan Kendaraan' : rentalModalType === 'property' ? 'Simpan Properti' : 'Simpan Layanan') : 'Simpan Produk')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Restock Modal */}
      {quickRestockProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-2xl">
              <h2 className="text-lg font-bold text-gray-900 truncate pr-4">
                Tambah Stok: {quickRestockProduct.name}
              </h2>
              <button onClick={() => setQuickRestockProduct(null)} className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-50 rounded-full shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuickRestock} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Sisa Stok Saat Ini</label>
                <div className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-bold">
                  {quickRestockProduct.stock}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Jumlah Stok Masuk <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min="1"
                  required
                  autoFocus
                  value={quickRestockAmount}
                  onChange={(e) => setQuickRestockAmount(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 font-bold"
                  placeholder="Misal: 10"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isRestocking || !quickRestockAmount}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm border-0 transition-all duration-200 ease-in-out px-4 py-2.5 rounded-xl font-bold active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isRestocking ? <Loader2 className="w-5 h-5 animate-spin" /> : <PackagePlus className="w-5 h-5" />}
                  {isRestocking ? 'Menyimpan...' : 'Simpan Stok'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Hapus Produk?</h3>
            <p className="text-slate-500 text-sm mb-6">Tindakan ini tidak dapat dibatalkan. Produk akan dihapus secara permanen dari sistem.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-5 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors w-full"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors w-full"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      <CsvImportModal
        isOpen={isImportModalOpen}
        onClose={closeImportModal}
        importFile={importFile}
        setImportFile={setImportFile}
        isImporting={isImporting}
        handleImportSubmit={handleImportSubmit}
        kategoriUsaha={kategoriUsaha}
      />
    </div>
  );
}
