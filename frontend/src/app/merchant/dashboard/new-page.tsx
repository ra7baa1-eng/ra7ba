'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { merchantApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
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
  RefreshCw
} from 'lucide-react';

// مكون البطاقة الإحصائية
const StatCard = ({ title, value, icon: Icon, trend, trendText, className = '' }) => (
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

// مكون زر الإجراء السريع
const QuickAction = ({ icon: Icon, title, description, onClick, className = '' }) => (
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
  const isTrial = tenant?.status === 'TRIAL';
  const isActive = tenant?.status === 'ACTIVE';
  const isExpired = tenant?.status === 'EXPIRED' || tenant?.status === 'SUSPENDED';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* شريط التنقل العلوي */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
              <button 
                onClick={loadDashboard}
                disabled={refreshing}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                title="تحديث البيانات"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={tenant?.subdomain ? `/store/${tenant.subdomain}` : '#'}
                target="_blank"
                className="px-4 py-2 flex items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                <ExternalLink size={18} />
                معاينة المتجر
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
          
          {/* علامات التبويب */}
          <div className="mt-4 flex space-x-1 space-x-reverse">
            {['overview', 'products', 'orders', 'customers', 'reports', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab === 'overview' && 'نظرة عامة'}
                {tab === 'products' && 'المنتجات'}
                {tab === 'orders' && 'الطلبات'}
                {tab === 'customers' && 'العملاء'}
                {tab === 'reports' && 'التقارير'}
                {tab === 'settings' && 'الإعدادات'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard 
            title="إجمالي المبيعات" 
            value={formatCurrency(stats.totalSales || 0)}
            icon={ShoppingBag}
            trend={12.5}
            trendText="عن الشهر الماضي"
          />
          <StatCard 
            title="الطلبات الجديدة" 
            value={stats.newOrders || 0}
            icon={Package}
            trend={8.3}
            trendText="عن الأسبوع الماضي"
          />
          <StatCard 
            title=
