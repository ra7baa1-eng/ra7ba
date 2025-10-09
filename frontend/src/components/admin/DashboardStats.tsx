'use client';

import { useEffect, useState } from 'react';

interface Stats {
  totalTenants: number;
  activeTenants: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingSubscriptions: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/dashboard/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatCard
        title="إجمالي المتاجر"
        value={stats?.totalTenants || 0}
        subtitle={`${stats?.activeTenants || 0} نشط`}
        color="bg-blue-500"
      />
      <StatCard
        title="إجمالي المنتجات"
        value={stats?.totalProducts || 0}
        color="bg-green-500"
      />
      <StatCard
        title="إجمالي الطلبات"
        value={stats?.totalOrders || 0}
        color="bg-purple-500"
      />
      <StatCard
        title="الإيرادات الكلية"
        value={`${stats?.totalRevenue || 0} دج`}
        color="bg-yellow-500"
      />
      <StatCard
        title="اشتراكات معلقة"
        value={stats?.pendingSubscriptions || 0}
        color="bg-red-500"
      />
    </div>
  );
}

function StatCard({ title, value, subtitle, color }: any) {
  return (
    <div className={`${color} text-white rounded-lg p-6 shadow-lg`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
      {subtitle && <p className="text-sm mt-2 opacity-90">{subtitle}</p>}
    </div>
  );
}
