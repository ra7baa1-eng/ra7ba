'use client';

import { useState, useEffect } from 'react';
import { Globe, Check, X, Eye, AlertCircle, Copy, CheckCircle, ExternalLink } from 'lucide-react';
import { adminApi } from '@/lib/api';

export default function AdminDomains() {
  const [loading, setLoading] = useState(true);
  const [domains, setDomains] = useState<any[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<any>(null);
  const [showDNSModal, setShowDNSModal] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [dnsRecords, setDnsRecords] = useState<any[]>([]);

  useEffect(() => {
    loadDomains();
  }, []);

  const loadDomains = async () => {
    try {
      setLoading(true);
      const { data } = await adminApi.getCustomDomainRequests();
      setDomains(data);
    } catch (error) {
      console.error('Error loading domains:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyDomain = async (tenantId: string, domain: string) => {
    try {
      setVerifying(true);
      const { data } = await adminApi.verifyDomain(tenantId, domain);
      setDnsRecords(data.dnsRecords);
      setShowDNSModal(true);
    } catch (error) {
      alert('فشل التحقق من السجلات');
    } finally {
      setVerifying(false);
    }
  };

  const approveDomain = async (tenantId: string, domain: string) => {
    if (!confirm(`هل تريد الموافقة على الدومين ${domain}؟`)) return;
    
    try {
      await adminApi.approveDomain(tenantId, domain);
      alert('تمت الموافقة على الدومين بنجاح! ✅');
      loadDomains();
    } catch (error) {
      alert('حدث خطأ');
    }
  };

  const rejectDomain = async (tenantId: string) => {
    const reason = prompt('سبب الرفض:');
    if (!reason) return;

    try {
      await adminApi.rejectDomain(tenantId, reason);
      alert('تم رفض الدومين');
      loadDomains();
    } catch (error) {
      alert('حدث خطأ');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('تم النسخ! ✅');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة الدومينات المخصصة</h1>
        <p className="text-gray-600">الموافقة على طلبات ربط الدومينات</p>
      </div>

      {/* DNS Instructions Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 mb-6 border-2 border-blue-200">
        <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-6 h-6" />
          تعليمات DNS للتجار
        </h2>
        <div className="space-y-3 text-gray-700">
          <p className="font-semibold">يجب على التاجر إضافة السجلات التالية في إعدادات DNS الخاصة بالدومين:</p>
          
          <div className="bg-white rounded-lg p-4">
            <p className="font-bold text-blue-900 mb-2">1️⃣ سجل A Record:</p>
            <div className="bg-gray-50 p-3 rounded font-mono text-sm">
              <p>Type: <span className="text-blue-600">A</span></p>
              <p>Name: <span className="text-blue-600">@</span></p>
              <p>Value: <span className="text-blue-600">76.76.21.21</span> (مثال - استبدل بـ IP الخاص بك)</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <p className="font-bold text-blue-900 mb-2">2️⃣ سجل CNAME Record:</p>
            <div className="bg-gray-50 p-3 rounded font-mono text-sm">
              <p>Type: <span className="text-purple-600">CNAME</span></p>
              <p>Name: <span className="text-purple-600">www</span></p>
              <p>Value: <span className="text-purple-600">ra7ba41.vercel.app</span></p>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3 mt-4">
            <p className="text-sm text-yellow-800">
              <strong>⏱️ ملاحظة:</strong> قد يستغرق انتشار التغييرات من 1-48 ساعة
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">إجمالي الطلبات</p>
              <h3 className="text-3xl font-bold text-gray-900">{domains.length}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Globe className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">مفعّلة</p>
              <h3 className="text-3xl font-bold text-gray-900">
                {domains.filter(d => d.customDomain).length}
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">بانتظار التفعيل</p>
              <h3 className="text-3xl font-bold text-gray-900">
                {domains.filter(d => !d.customDomain).length}
              </h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Domains List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600">
          <h2 className="text-2xl font-bold text-white">طلبات الدومينات</h2>
        </div>

        {domains.length === 0 ? (
          <div className="p-12 text-center">
            <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">لا توجد طلبات دومينات</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {domains.map((domain) => (
              <div key={domain.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Globe className="w-6 h-6 text-blue-600" />
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{domain.customDomain || 'لم يحدد بعد'}</h3>
                        <p className="text-sm text-gray-600">
                          المتجر: <span className="font-semibold">{domain.name}</span> (@{domain.subdomain})
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-600">المالك</p>
                        <p className="font-semibold text-gray-900">{domain.owner.name}</p>
                        <p className="text-sm text-gray-500">{domain.owner.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">الخطة</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                          domain.subscription.plan === 'PRO' ? 'bg-purple-100 text-purple-700' :
                          domain.subscription.plan === 'STANDARD' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {domain.subscription.plan}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {domain.customDomain ? (
                      <>
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-bold">
                          <CheckCircle className="w-5 h-5" />
                          مفعّل
                        </span>
                        <a
                          href={`https://${domain.customDomain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-center"
                        >
                          <ExternalLink className="w-4 h-4" />
                          زيارة
                        </a>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => verifyDomain(domain.id, domain.customDomain)}
                          disabled={verifying}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                          <Eye className="w-4 h-4" />
                          التحقق من DNS
                        </button>
                        <button
                          onClick={() => approveDomain(domain.id, domain.customDomain)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                          <Check className="w-4 h-4" />
                          موافقة
                        </button>
                        <button
                          onClick={() => rejectDomain(domain.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                          <X className="w-4 h-4" />
                          رفض
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DNS Verification Modal */}
      {showDNSModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">نتائج التحقق من DNS</h2>

            <div className="space-y-4">
              {dnsRecords.map((record, idx) => (
                <div key={idx} className={`p-4 rounded-xl border-2 ${
                  record.status === 'verified' ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900">{record.type} Record</span>
                    {record.status === 'verified' ? (
                      <span className="inline-flex items-center gap-1 text-green-700 font-bold">
                        <CheckCircle className="w-5 h-5" />
                        تم التحقق
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-700 font-bold">
                        <X className="w-5 h-5" />
                        غير صحيح
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 w-20">Name:</span>
                      <code className="flex-1 px-3 py-2 bg-white rounded border font-mono text-sm">{record.name}</code>
                      <button
                        onClick={() => copyToClipboard(record.name)}
                        className="p-2 hover:bg-gray-100 rounded transition"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 w-20">Value:</span>
                      <code className="flex-1 px-3 py-2 bg-white rounded border font-mono text-sm">{record.value}</code>
                      <button
                        onClick={() => copyToClipboard(record.value)}
                        className="p-2 hover:bg-gray-100 rounded transition"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowDNSModal(false)}
              className="mt-6 w-full px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
