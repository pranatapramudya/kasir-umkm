import { prisma } from "@/lib/prisma";
import { Building2, Users, PieChart, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import ExportButton from "@/components/ExportButton";
import AccTenantButton from "./AccTenantButton";
import ManualOverrideButton from "./ManualOverrideButton";
import SearchBar from "./SearchBar";

export const dynamic = "force-dynamic";

export default async function SuperAdminPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const pageStr = searchParams?.page;
  const categoryStr = searchParams?.kategori;
  const searchQuery = searchParams?.search;

  const page = typeof pageStr === 'string' ? parseInt(pageStr, 10) || 1 : 1;
  const category = typeof categoryStr === 'string' ? categoryStr : "Semua";
  const search = typeof searchQuery === 'string' ? searchQuery : "";

  const take = 10;
  const skip = (page - 1) * take;
  let whereClause = {};
  if (category !== "Semua") {
    if (category === "F&B") {
      whereClause = { category: "F&B / Kuliner" };
    } else if (category === "Retail") {
      whereClause = { category: "Retail / Toko Kelontong" };
    } else if (category === "Jasa/Servis") {
      whereClause = { category: "Jasa / Servis" };
    } else {
      whereClause = { category: { contains: category } };
    }
  }

  if (search) {
    whereClause = {
      ...whereClause,
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } }
      ]
    };
  }

  // Fetch Data
  const [tenants, totalFilteredTenants, allTenantsForStats, employeeCount] = await Promise.all([
    prisma.tenant.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take,
      skip
    }),
    prisma.tenant.count({ where: whereClause }),
    prisma.tenant.findMany({ select: { category: true } }),
    prisma.employee.count()
  ]);

  const totalPages = Math.max(1, Math.ceil(totalFilteredTenants / take));

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  // Fetch omset (Total GMV) untuk tenant yang sedang ditampilkan
  const transactionsAggr = await prisma.transaction.groupBy({
    by: ['userId'],
    where: {
      userId: { in: tenants.map(t => t.userId) },
      status: { in: ['completed', 'COMPLETED', 'paid', 'PAID', 'selesai', 'SELESAI'] },
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth
      }
    },
    _sum: {
      total: true
    }
  });

  const omsetMap = transactionsAggr.reduce((acc, curr) => {
    acc[curr.userId] = curr._sum.total || 0;
    return acc;
  }, {} as Record<string, number>);

  // KPI Calculations
  const totalTenants = allTenantsForStats.length;
  const totalUsers = totalTenants + employeeCount;

  // Calculate most popular category
  const categoryCounts = allTenantsForStats.reduce((acc, tenant) => {
    acc[tenant.category] = (acc[tenant.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  let mostPopularCategory = "-";
  let maxCount = 0;
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostPopularCategory = cat;
    }
  });

  const filterCategories = ["Semua", "F&B", "Retail", "Jasa/Servis"];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Overview</h1>
        <p className="text-slate-500 mt-1">Pantau performa global dan pendaftaran tenant baru.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl -mr-8 -mt-8 opacity-60 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-600">Total Tenant</h3>
            <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="relative z-10">
            <span className="text-3xl font-black text-slate-900">{totalTenants}</span>
            <span className="text-xs text-slate-500 ml-2">Toko Terdaftar</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl -mr-8 -mt-8 opacity-60 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-600">Total Pengguna</h3>
            <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="relative z-10">
            <span className="text-3xl font-black text-slate-900">{totalUsers}</span>
            <span className="text-xs text-slate-500 ml-2">User Aktif</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-purple-50 rounded-full blur-2xl -mr-8 -mt-8 opacity-60 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-600">Top Kategori</h3>
            <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="relative z-10">
            <span className="text-2xl font-black text-slate-900 line-clamp-1">{mostPopularCategory}</span>
            <span className="text-xs text-slate-500">{maxCount} Toko</span>
          </div>
        </div>
      </div>

      {/* Master Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">Master Data Tenant</h2>
            <p className="text-xs text-slate-500 mt-0.5">Daftar seluruh toko/usaha yang menggunakan platform PJTECH SUPER ADMIN.</p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div className="w-full md:w-auto">
              <SearchBar />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200 overflow-x-auto w-full sm:w-auto">
                {filterCategories.map(cat => (
                  <Link
                    key={cat}
                    href={`/superadmin?page=1&kategori=${encodeURIComponent(cat)}`}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md whitespace-nowrap transition-all ${category === cat
                        ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                        : 'text-slate-500 hover:text-slate-700'
                      }`}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
              <div className="w-full sm:w-auto">
                <ExportButton />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="py-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-12 text-center">No.</th>
                <th className="py-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nama Toko / Usaha</th>
                <th className="py-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
                <th className="py-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Telepon</th>
                <th className="py-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tanggal Daftar</th>
                <th className="py-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status Langganan</th>
                <th className="py-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Omset (Bulan Ini)</th>
                <th className="py-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tenants.map((tenant, index) => {
                const rowNumber = skip + index + 1;
                const omset = omsetMap[tenant.userId] || 0;
                const isDeleted = tenant.subscriptionStatus === 'DELETED_BY_USER';
                return (
                  <tr key={tenant.id} className={`transition-colors ${isDeleted ? 'bg-red-50/50 opacity-75' : 'hover:bg-slate-50/50'}`}>
                    <td className="py-2 px-3 text-sm text-slate-500 text-center">{rowNumber}</td>
                    <td className="py-2 px-3 text-sm font-semibold text-slate-800">
                      <span className={isDeleted ? 'line-through text-red-600' : ''}>{tenant.name}</span>
                      {isDeleted && <span className="ml-2 text-[10px] text-red-500 font-bold px-1.5 py-0.5 bg-red-100 rounded-md">DELETED</span>}
                    </td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-semibold">
                        {tenant.category}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-600 text-xs">{tenant.phone || "-"}</td>
                    <td className="py-2 px-3 text-slate-600 text-xs">
                      {new Date(tenant.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tenant.subscriptionPlan === 'FREE' ? 'bg-orange-100 text-orange-700' :
                          tenant.subscriptionPlan?.includes('PRO') ? 'bg-indigo-100 text-indigo-700' :
                            'bg-slate-100 text-slate-700'
                        }`}>
                        {tenant.subscriptionPlan}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <span className="text-green-600 font-semibold text-sm whitespace-nowrap">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(omset)}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {tenant.subscriptionStatus === 'PENDING' ? (
                          <AccTenantButton tenantId={tenant.id} plan={tenant.subscriptionPlan} />
                        ) : (
                          <span className="text-xs text-slate-400 font-medium px-2 py-1">{tenant.subscriptionStatus}</span>
                        )}
                        <ManualOverrideButton
                          tenantId={tenant.id}
                          currentPlan={tenant.subscriptionPlan}
                          currentStatus={tenant.subscriptionStatus}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {tenants.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-xs font-medium text-slate-500">
                    Belum ada tenant yang terdaftar pada kategori ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">
            Menampilkan {tenants.length} dari {totalFilteredTenants} data
          </span>
          <div className="flex items-center gap-2">
            <Link
              href={page > 1 ? `/superadmin?page=${page - 1}&kategori=${encodeURIComponent(category)}` : '#'}
              className={`p-1.5 rounded-lg border border-slate-200 transition-colors ${page > 1 ? 'hover:bg-slate-50 text-slate-700' : 'opacity-50 cursor-not-allowed text-slate-400'}`}
              aria-disabled={page <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <span className="text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              {page} / {totalPages}
            </span>
            <Link
              href={page < totalPages ? `/superadmin?page=${page + 1}&kategori=${encodeURIComponent(category)}` : '#'}
              className={`p-1.5 rounded-lg border border-slate-200 transition-colors ${page < totalPages ? 'hover:bg-slate-50 text-slate-700' : 'opacity-50 cursor-not-allowed text-slate-400'}`}
              aria-disabled={page >= totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
