'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { merchantApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function MerchantDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && user) {
      loadDashboard();
    }
  }, [authLoading, user]);

  const loadDashboard = async () => {
    try {
      const { data } = await merchantApi.getDashboard();
      setDashboard(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      // Don't redirect immediately - let AuthContext handle it
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">جاري التحميل...</div>
      </div>
    );
  }

  const tenant = dashboard?.tenant;
  const stats = dashboard?.stats;
  const isTrial = tenant?.status === 'TRIAL';
  const isActive = tenant?.status === 'ACTIVE';
  const isExpired = tenant?.status === 'EXPIRED' || tenant?.status === 'SUSPENDED';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-purple-600">🛍️ {tenant?.name}</h1>
              {isTrial && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                  تجريبي
                </span>
              )}
              {isExpired && (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                  منتهي
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`https://${tenant?.subdomain}.rahba.dz`}
                target="_blank"
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
              >
                عرض المتجر 🔗
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Trial/Status Warning */}
        {isTrial && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="text-5xl">⏰</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  الفترة التجريبية
                </h3>
                <p className="text-blue-700 mb-3">
                  لديك <strong>{dashboard?.trialDaysLeft || 0}</strong> يوم متبقي في الفترة التجريبية
                </p>
                <div className="flex gap-4 text-sm">
                  <div>📦 المنتجات: <strong>{stats?.productsCount || 0}</strong> / 10</div>
                  <div>🛒 الطلبات: <strong>{stats?.ordersCount || 0}</strong> / 20</div>
                </div>
                <Link
                  href="/merchant/subscription"
                  className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  ترقية الآن 🚀
                </Link>
              </div>
            </div>
          </div>
        )}

        {isExpired && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="text-5xl">⚠️</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-red-900 mb-2">
                  الاشتراك منتهي
                </h3>
                <p className="text-red-700 mb-3">
                  يرجى تجديد الاشتراك لمواصلة استخدام المتجر
                </p>
                <Link
                  href="/merchant/subscription"
                  className="inline-block px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                >
                  تجديد الاشتراك الآن
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Link
            href="/merchant/products"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition border-2 border-transparent hover:border-purple-200"
          >
            <div className="text-4xl mb-3">📦</div>
            <div className="font-bold text-lg">المنتجات</div>
            <div className="text-gray-600">إدارة منتجاتك</div>
          </Link>

          <Link
            href="/merchant/orders"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition border-2 border-transparent hover:border-purple-200"
          >
            <div className="text-4xl mb-3">🛒</div>
            <div className="font-bold text-lg">الطلبات</div>
            <div className="text-gray-600">متابعة الطلبات</div>
          </Link>

          <Link
            href="/merchant/settings"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition border-2 border-transparent hover:border-purple-200"
          >
            <div className="text-4xl mb-3">⚙️</div>
            <div className="font-bold text-lg">الإعدادات</div>
            <div className="text-gray-600">إعدادات المتجر</div>
          </Link>

          <Link
            href="/merchant/subscription"
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition"
          >
            <div className="text-4xl mb-3">💎</div>
            <div className="font-bold text-lg">الاشتراك</div>
            <div className="opacity-90">الترقية والفواتير</div>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">💰</div>
              <div className="text-sm text-gray-500">اليوم</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {formatCurrency(stats?.todayRevenue || 0)}
            </div>
            <div className="text-gray-600">إيرادات اليوم</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">📊</div>
              <div className="text-sm text-gray-500">هذا الشهر</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {formatCurrency(stats?.monthRevenue || 0)}
            </div>
            <div className="text-gray-600">إيرادات الشهر</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🛒</div>
              <div className="text-sm text-gray-500">الكل</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.ordersCount || 0}
            </div>
            <div className="text-gray-600">إجمالي الطلبات</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">📦</div>
              <div className="text-sm text-gray-500">الكل</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.productsCount || 0}
            </div>
            <div className="text-gray-600">المنتجات</div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">📋 أحدث الطلبات</h2>
            <Link
              href="/merchant/orders"
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              عرض الكل ←
            </Link>
          </div>

          {stats?.recentOrders?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentOrders.map((order: any) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold">#{order.orderNumber}</div>
                      <div className="text-sm text-gray-600">{order.customerName}</div>
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-purple-600">
                        {formatCurrency(order.totalAmount)}
                      </div>
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          order.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-700'
                            : order.status === 'CONFIRMED'
                            ? 'bg-blue-100 text-blue-700'
                            : order.status === 'DELIVERED'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📭</div>
              <p>لا توجد طلبات بعد</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
