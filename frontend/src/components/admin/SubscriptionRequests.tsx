'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface SubscriptionRequest {
  id: string;
  email: string;
  proof_url: string;
  status: string;
  created_at: string;
  tenant: { name: string; slug: string };
  plan: { name: string; price_dzd: number };
}

export default function SubscriptionRequests() {
  const [requests, setRequests] = useState<SubscriptionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/admin/subscription-requests?status=PENDING');
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm('هل تريد الموافقة على هذا الطلب؟')) return;
    
    try {
      await fetch(`/api/admin/subscription-requests/${id}/approve`, {
        method: 'POST',
      });
      alert('تم تفعيل الاشتراك بنجاح');
      fetchRequests();
    } catch (error) {
      alert('حدث خطأ');
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('هل تريد رفض هذا الطلب؟')) return;
    
    try {
      await fetch(`/api/admin/subscription-requests/${id}/reject`, {
        method: 'POST',
      });
      alert('تم رفض الطلب');
      fetchRequests();
    } catch (error) {
      alert('حدث خطأ');
    }
  };

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">طلبات الاشتراك المعلقة</h2>
      
      {requests.length === 0 ? (
        <p className="text-gray-500 text-center py-8">لا توجد طلبات معلقة</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{req.tenant.name}</h3>
                  <p className="text-sm text-gray-600">{req.email}</p>
                  <p className="text-sm text-blue-600 mt-1">
                    الباقة: {req.plan.name} - {req.plan.price_dzd} دج
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(req.created_at).toLocaleDateString('ar-DZ')}
                </span>
              </div>

              {req.proof_url && (
                <div className="mb-4">
                  <p className="text-sm font-semibold mb-2">إثبات الدفع:</p>
                  <Image
                    src={req.proof_url}
                    alt="Payment Proof"
                    width={300}
                    height={200}
                    className="rounded border"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(req.id)}
                  className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
                >
                  موافقة
                </button>
                <button
                  onClick={() => handleReject(req.id)}
                  className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
                >
                  رفض
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
