'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { merchantApi } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  ShoppingBag, 
  Users, 
  CreditCard, 
  Package, 
  Clock, 
  AlertCircle,
  ArrowUpRight,
  BarChart2,
  Settings,
  LogOut,
  ExternalLink,
  Plus,
  RefreshCw,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  trendText?: string;
  className?: string;
};

// مكون البطاقة الإحصائية
const StatCard = ({ title, value, icon: Icon, trend, trendText, className = '' }: StatCardProps) => (
  <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {trend && (
          <div className={`mt-2 flex items-center text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% {trendText}
          </div>
        )}
      </div>
      <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

type QuickActionProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
  className?: string;
};

// مكون زر الإجراء السريع
const QuickAction = ({ icon: Icon, title, description, onClick, className = '' }: QuickActionProps) => (
  <button 
    onClick={onClick}
    className={`bg-white rounded-xl p-5 text-right border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all ${className}`}
  >
    <div className="flex items-start justify-between mb-2">
      <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
        <Icon className="w-5 h-5" />
      </div>
      <ArrowUpRight className="w-5 h-5 text-gray-400" />
    </div>
    <h4 className="font-bold text-gray-900 text-lg mb-1">{title}</h4>
    <p className="text-sm text-gray-500">{description}</p>
  </button>
);

export default function MerchantDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboard, setDashboard] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!authLoading && user) {
      loadDashboard();
    }
  }, [authLoading, user]);

  const loadDashboard = async () => {
    try {
      setRefreshing(true);
      const { data } = await merchantApi.getDashboard();
      setDashboard(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  const tenant = dashboard?.tenant || {};
  const stats = dashboard?.stats || {};
  const recentOrders = dashboard?.recentOrders || [];
  const topProducts = stats?.topProducts || [];
  const isTrial = tenant?.status === 'TRIAL';
  const isActive = tenant?.status === 'ACTIVE';
  const isExpired = tenant?.status === 'EXPIRED' || tenant?.status === 'SUSPENDED';

  return (
    <div className="container mx-auto px-4 py-6">
        {/* حالة الاشتراك */}
        {isTrial && (
          <div className="bg-blue-50 border-r-4 border-blue-500 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div className="mr-3">
                <h3 className="text-sm font-medium text-blue-800">فترة تجريبية نشطة</h3>
                <p className="mt-1 text-sm text-blue-700">
                  لديك {dashboard?.trialDaysLeft || 0} يوم متبقي في الفترة التجريبية. قم بترقية اشتراكك الآن للاستمرار في استخدام الخدمة.
                </p>
                <div className="mt-2">
                  <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    ترقية الاشتراك
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isExpired && (
          <div className="bg-red-50 border-r-4 border-red-500 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="mr-3">
                <h3 className="text-sm font-medium text-red-800">اشتراك منتهي</h3>
                <p className="mt-1 text-sm text-red-700">
                  انتهت صلاحية اشتراكك. يرجى تجديد الاشتراك لاستعادة الوصول الكامل إلى لوحة التحكم.
                </p>
                <div className="mt-2">
                  <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    تجديد الاشتراك
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* البطاقات الإحصائية */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="إجمالي المبيعات"
            value={formatCurrency(stats.totalSales || 0)}
            icon={ShoppingBag}
            trend={stats.salesGrowthPercentage ?? 0}
            trendText="عن الشهر الماضي"
          />
          <StatCard
            title="الطلبات الجديدة"
            value={stats.newOrders ?? 0}
            icon={Package}
            trend={stats.ordersGrowthPercentage ?? 0}
            trendText="عن الأسبوع الماضي"
          />
          <StatCard
            title="عدد العملاء"
            value={stats.customersCount ?? 0}
            icon={Users}
            trend={stats.customersGrowthPercentage ?? 0}
            trendText="تغير شهري"
          />
          <StatCard
            title="إيرادات الاشتراكات"
            value={formatCurrency(stats.subscriptionRevenue || 0)}
            icon={CreditCard}
            trend={stats.subscriptionGrowthPercentage ?? 0}
            trendText="عن الدورة السابقة"
          />
        </div>

        {/* إجراءات سريعة */}
        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <QuickAction
            icon={Plus}
            title="إضافة منتج جديد"
            description="قم بإضافة منتجك خلال ثوانٍ مع دعم رفع الصور والتصنيفات."
            onClick={() => setActiveTab('products')}
          />
          <QuickAction
            icon={BarChart2}
            title="استعراض التقارير"
            description="تابع أداء المبيعات ومصادر الزيارات في لوحة تقارير متقدمة."
            onClick={() => setActiveTab('reports')}
          />
          <QuickAction
            icon={Settings}
            title="تخصيص المتجر"
            description="قم بتعديل الهوية البصرية وسياسات الشحن وبيانات الاتصال."
            onClick={() => setActiveTab('settings')}
          />
        </div>

        {/* أحدث الطلبات */}
        <div className="mt-10 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">أحدث الطلبات</h2>
            <Link
              href="/merchant/orders"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              عرض الكل
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-500">لا توجد طلبات حديثة حالياً.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-right">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الطلب</th>
                    <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">العميل</th>
                    <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">المبلغ</th>
                    <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                    <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100 text-sm">
                  {recentOrders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-900">#{order.orderNumber}</td>
                      <td className="px-4 py-3 text-gray-700">{order.customerName || 'عميل مجهول'}</td>
                      <td className="px-4 py-3 text-gray-900">{formatCurrency(order.totalAmount || 0)}</td>
                      <td className="px-4 py-3 text-gray-500">{order.createdAt ? formatDate(order.createdAt) : 'غير متاح'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            order.status === 'DELIVERED'
                              ? 'bg-green-100 text-green-700'
                              : order.status === 'CONFIRMED'
                              ? 'bg-blue-100 text-blue-700'
                              : order.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {order.status || 'غير محدد'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* أفضل المنتجات أداءً */}
        <div className="mt-10 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">أفضل المنتجات أداءً</h2>
            <Link
              href="/merchant/products"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              إدارة المنتجات
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {topProducts.length === 0 ? (
            <p className="text-sm text-gray-500">لم يتم تسجيل منتجات مميزة حتى الآن.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {topProducts.map((product: any) => (
                <div key={product.id} className="rounded-lg border border-gray-100 p-4 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{formatCurrency(product.totalSales || 0)} مبيعات</p>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium ${
                      (product.change ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {(product.change ?? 0) >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {Math.abs(product.change ?? 0)}%
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                    <span>المخزون: {product.stock ?? 'غير محدد'}</span>
                    <span>الطلبات: {product.ordersCount ?? 0}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    </div>
  );
}
