'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

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
        <div className="text-lg text-gray-500">جاري التحقق من الصلاحيات...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
