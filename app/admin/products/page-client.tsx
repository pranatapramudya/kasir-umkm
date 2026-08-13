"use client";

import React, { useState } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';
import Image from 'next/image';
import { PackageSearch, Plus, Edit2, Trash2, Loader2, PackageX, PackagePlus, ImagePlus, X, Search, Filter, Check } from 'lucide-react';
import { Pagination } from '@/components/Pagination';
import { isServiceBusinessCategory } from '@/lib/business-category';

export const dynamic = 'force-dynamic';

type Product = {
  id: number;
  kodeBarang: string | null;
  name: string;
  category: string;
  hpp: number;
  hargaJual: number;
  stock: number;
  discount: number;
  image: string;
  brand?: string | null;
  variant?: string | null;
  minStockThreshold: number;
};

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Gagal memuat data');
  return res.json();
};

export default function AdminProductsClientPage({ kategoriUsaha }: { kategoriUsaha: string }) {
  const isJasa = isServiceBusinessCategory(kategoriUsaha);
  const isFNB = kategoriUsaha === 'F&B' || kategoriUsaha === 'F&B / Kuliner';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const queryUrl = `/api/products?page=${currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(selectedCategory === "Semua" ? "" : selectedCategory)}`;
  const { data, error, isLoading, mutate } = useSWR<{products: Product[], totalPages: number}>(queryUrl, fetcher);
  
  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;

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
    employeeCommission: '0'
  });

  const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
  const categories = ["Semua", ...uniqueCategories];


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

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        kodeBarang: product.kodeBarang || '',
        name: product.name,
        category: product.category,
        hpp: formatNumberInput(product.hpp.toString()),
        hargaJual: formatNumberInput(product.hargaJual.toString()),
        stock: product.stock.toString(),
        discount: formatNumberInput(product.discount.toString()),
        image: product.image,
        brand: product.brand || '',
        variant: product.variant || '',
        minStockThreshold: product.minStockThreshold.toString(),
        employeeCommission: formatNumberInput((product as any).employeeCommission?.toString() || '0')
      });
    } else {
      setEditingProduct(null);
      setFormData({
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
        employeeCommission: '0'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (['hpp', 'hargaJual', 'discount', 'employeeCommission'].includes(name)) {
      setFormData(prev => ({ ...prev, [name]: formatNumberInput(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
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
      
      const payload = {
        ...formData,
        hpp: parseInt(formData.hpp.toString().replace(/[^0-9]/g, ''), 10) || 0,
        hargaJual: parseInt(formData.hargaJual.toString().replace(/[^0-9]/g, ''), 10) || 0,
        discount: parseInt(formData.discount.toString().replace(/[^0-9]/g, ''), 10) || 0,
        stock: isJasa ? 999999 : (parseInt(formData.stock.toString().replace(/[^0-9]/g, ''), 10) || 0),
        minStockThreshold: isJasa ? 0 : (parseInt(formData.minStockThreshold.toString().replace(/[^0-9]/g, ''), 10) || 5),
        employeeCommission: isJasa ? (parseInt(formData.employeeCommission.toString().replace(/[^0-9]/g, ''), 10) || 0) : 0,
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
      
      toast.success(editingProduct ? 'Produk berhasil diperbarui!' : 'Produk baru ditambahkan!');
      mutate();
      closeModal();
    } catch (err: any) {
      console.error("Submit Error:", err);
      toast.error(err.message || 'Gagal menyimpan produk');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      const res = await fetch(`/api/products/${productToDelete}`, { method: 'DELETE' });
      const result = await res.json();
      
      if (!res.ok) throw new Error(result.error || 'Gagal menghapus');
      
      toast.success('Produk berhasil dihapus');
      mutate();
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan');
    } finally {
      setProductToDelete(null);
    }
  };

  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  if (error) return <div className="text-red-500 p-4 bg-red-50 rounded-xl border border-red-100">Error: Gagal memuat data produk</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <PackageSearch className="w-6 h-6 text-blue-600" />
            {isJasa ? "Manajemen Layanan" : isFNB ? "Manajemen Menu" : "Manajemen Produk"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">Kelola daftar {isJasa ? "layanan" : isFNB ? "menu" : "produk"}, harga, dan {isJasa ? "ketersediaan" : "stok"} Anda.</p>
        </div>
        {(isLoading || (products && products.length > 0)) && (
          <button 
            onClick={() => openModal()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm border-0 transition-all duration-200 ease-in-out px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 active:scale-95 shrink-0"
          >
            <Plus className="w-5 h-5" />
            {isJasa ? "Tambah Layanan" : isFNB ? "Tambah Menu" : "Tambah Barang"}
          </button>
        )}
      </div>

      {/* Search Bar & Kategori */}
      <div className="flex flex-row items-center gap-2 mb-2">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder={isJasa ? "Cari layanan atau kode..." : isFNB ? "Cari menu atau SKU..." : "Cari produk atau barcode..."} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div className="relative shrink-0">
          <button 
            onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
            onBlur={() => setIsCategoryMenuOpen(false)}
            className={`px-3 py-2 border rounded-lg flex items-center justify-center gap-2 transition-colors relative shadow-sm ${
              selectedCategory === "Semua" 
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

      {/* Table Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
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
                    <div>
                      <div className="font-bold text-slate-900 truncate leading-tight">{product.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-1">{product.kodeBarang || 'Tanpa SKU'}</div>
                    </div>
                    <div className="flex gap-1 shrink-0">
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
                      {!isJasa && <div className="text-[10px] text-slate-400 font-medium mb-0.5">HPP: {formatRupiah(product.hpp)}</div>}
                      {product.discount > 0 ? (
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 line-through leading-none mb-0.5">{formatRupiah(product.hargaJual)}</span>
                          <span className="text-sm font-bold text-red-600 leading-none">{formatRupiah(product.hargaJual - product.discount)}</span>
                        </div>
                      ) : (
                        <div className="text-sm font-bold text-blue-600 leading-none">{formatRupiah(product.hargaJual)}</div>
                      )}
                    </div>
                    {!isJasa && (
                      <div className="text-right">
                        <span className={`inline-flex min-w-[3.5rem] justify-center px-1.5 py-0.5 rounded-md text-[10px] font-bold border ${product.stock > (product.minStockThreshold || 5) ? 'bg-green-50 text-green-700 border-green-200' : product.stock > 0 ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                          Sisa: {product.stock}
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
            <h3 className="text-xl font-bold text-slate-800 mb-2">Belum ada {isJasa ? "layanan" : isFNB ? "menu" : "produk"}</h3>
            <p className="text-slate-500 max-w-sm mb-6">Anda belum menambahkan {isJasa ? "layanan" : isFNB ? "menu" : "produk"} apapun. Silakan tambah {isJasa ? "layanan" : isFNB ? "menu" : "produk"} pertama Anda untuk mulai berjualan.</p>
            <button 
              onClick={() => openModal()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm border-0 transition-all duration-200 ease-in-out px-6 py-3 rounded-xl font-bold flex items-center gap-2"
            >
              <PackagePlus className="w-5 h-5" />
              {isJasa ? "Tambah Layanan" : isFNB ? "Tambah Menu" : "Tambah Barang"}
            </button>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? (isJasa ? 'Edit Layanan' : isFNB ? 'Edit Menu' : 'Edit Produk') : (isJasa ? 'Tambah Layanan Baru' : isFNB ? 'Tambah Menu Baru' : 'Tambah Produk Baru')}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-2">
              <form id="product-form" onSubmit={handleSubmit} className="p-3 space-y-4">
                {/* Image Upload Area */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Foto {isJasa ? 'Layanan' : isFNB ? 'Menu' : 'Produk'} <span className="text-gray-400 font-normal">(Opsional)</span></label>
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

                {!isFNB && !isJasa && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Kode Barang (SKU) <span className="text-slate-400 font-normal">(Opsional)</span></label>
                    <input 
                      type="text" 
                      name="kodeBarang" 
                      value={formData.kodeBarang} 
                      onChange={handleChange} 
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">{isJasa ? 'Nama Layanan' : isFNB ? 'Nama Menu' : 'Nama Produk'} <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      value={formData.name} 
                      onChange={handleChange} 
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Kategori <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="category"
                      required
                      autoComplete="off"
                      placeholder="Masukkan nama kategori..."
                      value={formData.category} 
                      onChange={handleChange}
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                  </div>

                  {!isFNB && !isJasa && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 col-span-1 sm:col-span-2">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Merek <span className="text-slate-400 font-normal">(Opsional)</span></label>
                        <input 
                          type="text" 
                          name="brand" 
                          value={formData.brand} 
                          onChange={handleChange} 
                          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Varian / Ukuran <span className="text-slate-400 font-normal">(Opsional)</span></label>
                        <input 
                          type="text" 
                          name="variant" 
                          value={formData.variant} 
                          onChange={handleChange} 
                          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                      </div>
                    </div>
                  )}

                  {!isJasa && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 col-span-1 sm:col-span-2">
                      <div className={isFNB ? 'sm:col-span-2' : ''}>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Stok Awal</label>
                        <input 
                          type="number" 
                          name="stock" 
                          min="0"
                          value={formData.stock} 
                          onChange={handleChange} 
                          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                      </div>
                      {!isFNB && (
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Batas Stok Menipis <span className="text-slate-400 font-normal">(Opsional)</span></label>
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

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">{isJasa ? 'Biaya Bahan (Opsional)' : 'HPP (Modal)'}</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">Rp</span>
                      <input 
                        type="text" 
                        name="hpp" 
                        required={!isJasa}
                        value={formData.hpp} 
                        onChange={handleChange} 
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Harga Jual <span className="text-red-500">*</span></label>
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

                  {isJasa && (
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-1">Komisi Pekerja (Rp)</label>
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
                      <p className="text-xs text-slate-500 mt-1">Nominal bagi hasil untuk pekerja per transaksi.</p>
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
                {isSubmitting ? 'Menyimpan...' : (isJasa ? 'Simpan Layanan' : isFNB ? 'Simpan Menu' : 'Simpan Produk')}
              </button>
            </div>
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
    </div>
  );
}
