'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Download, TrendingUp, TrendingDown, Calendar, DollarSign, ShoppingCart, Package } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function MerchantReportsPage() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30days');
  const [reportData, setReportData] = useState<any>({
    revenue: {
      total: 125000,
      growth: 15.3,
      data: [],
    },
    orders: {
      total: 45,
      growth: 8.2,
      data: [],
    },
    products: {
      total: 12,
      growth: -2.1,
      data: [],
    },
    avgOrderValue: {
      total: 2777,
      growth: 6.5,
    },
  });

  useEffect(() => {
    // TODO: Replace with actual API call
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [dateRange]);

  const exportReport = (format: 'csv' | 'pdf') => {
    alert(`تصدير التقرير بصيغة ${format.toUpperCase()}`);
    // TODO: Implement actual export
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل التقارير...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          التقارير والتحليلات
        </h1>
        <p className="text-gray-600 mt-2">تابع أداء متجرك بشكل تفصيلي</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Date Range Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7days">آخر 7 أيام</option>
              <option value="30days">آخر 30 يوم</option>
              <option value="90days">آخر 90 يوم</option>
              <option value="year">هذا العام</option>
              <option value="custom">تخصيص...</option>
            </select>
          </div>

          {/* Export Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportReport('csv')}
              className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              CSV
            </button>
            <button
              onClick={() => exportReport('pdf')}
              className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-8 w-8 opacity-80" />
            <div className={`flex items-center gap-1 text-sm ${reportData.revenue.growth >= 0 ? 'text-green-200' : 'text-red-200'}`}>
              {reportData.revenue.growth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {Math.abs(reportData.revenue.growth)}%
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">إجمالي الإيرادات</p>
          <p className="text-3xl font-bold">{formatCurrency(reportData.revenue.total)}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="h-8 w-8 opacity-80" />
            <div className={`flex items-center gap-1 text-sm ${reportData.orders.growth >= 0 ? 'text-green-200' : 'text-red-200'}`}>
              {reportData.orders.growth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {Math.abs(reportData.orders.growth)}%
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">عدد الطلبات</p>
          <p className="text-3xl font-bold">{reportData.orders.total}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Package className="h-8 w-8 opacity-80" />
            <div className={`flex items-center gap-1 text-sm ${reportData.products.growth >= 0 ? 'text-green-200' : 'text-red-200'}`}>
              {reportData.products.growth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {Math.abs(reportData.products.growth)}%
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">المنتجات المباعة</p>
          <p className="text-3xl font-bold">{reportData.products.total}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="h-8 w-8 opacity-80" />
            <div className={`flex items-center gap-1 text-sm ${reportData.avgOrderValue.growth >= 0 ? 'text-green-200' : 'text-red-200'}`}>
              {reportData.avgOrderValue.growth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {Math.abs(reportData.avgOrderValue.growth)}%
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">متوسط قيمة الطلب</p>
          <p className="text-3xl font-bold">{formatCurrency(reportData.avgOrderValue.total)}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">الإيرادات حسب الوقت</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">الرسم البياني سيظهر هنا</p>
          </div>
        </div>

        {/* Orders Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">الطلبات حسب الوقت</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">الرسم البياني سيظهر هنا</p>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">أفضل المنتجات مبيعاً</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المنتج</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الكمية المباعة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإيرادات</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">النمو</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  لا توجد بيانات متاحة حالياً
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
