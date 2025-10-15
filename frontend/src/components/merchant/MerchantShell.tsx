'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import MerchantNav from './MerchantNav';

interface Props {
  children: ReactNode;
}

export default function MerchantShell({ children }: Props) {
  const router = useRouter();
  const { user, loading } = useAuth();

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
    <div className="min-h-screen bg-gray-50">
      <MerchantNav />
      <main className="lg:pr-64 pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
