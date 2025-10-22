'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardTopbar } from '@/components/dashboard/topbar';

interface Props {
  children: ReactNode;
}

export default function MerchantShell({ children }: Props) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const statsSnapshot = useMemo(() => {
    const stats = user?.tenant?.stats as {
      ordersCount?: number;
      productsCount?: number;
      totalSales?: number;
    } | undefined;

    if (!stats) return undefined;

    return {
      totalOrders: stats.ordersCount,
      totalProducts: stats.productsCount,
      totalRevenue: stats.totalSales,
    };
  }, [user?.tenant?.stats]);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/auth/login?redirect=/merchant/dashboard');
      return;
    }

    if (user.role !== 'MERCHANT') {
      router.replace('/admin/dashboard');
    }
  }, [loading, user, router]);

  if (loading || !user || user.role !== 'MERCHANT') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:pr-64">
      <DashboardSidebar />

      {/* Mobile Sidebar */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />
          <DashboardSidebar
            variant="mobile"
            onNavigate={() => setMobileNavOpen(false)}
            className="relative z-50"
          />
        </div>
      )}

      <div className="lg:pr-0 lg:ml-0 flex flex-col min-h-screen">
        <DashboardTopbar
          onMenuClick={() => setMobileNavOpen(true)}
          userName={user?.name}
          tenantName={user?.tenant?.name}
          statsSnapshot={statsSnapshot}
        />
        <main className="flex-1 px-4 py-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
