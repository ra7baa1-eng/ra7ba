'use client';

import { useState, useEffect } from 'react';
import { Shield, Save, Eye, FileText } from 'lucide-react';
import RichTextEditor from '@/components/editor/RichTextEditor';

export default function PrivacySettings() {
  const [saving, setSaving] = useState(false);
  const [privacyPolicy, setPrivacyPolicy] = useState('');
  const [termsOfService, setTermsOfService] = useState('');
  const [returnPolicy, setReturnPolicy] = useState('');

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      // TODO: استدعاء API لجلب السياسات
      // const { data } = await settingsApi.getPolicies();
      // setPrivacyPolicy(data.privacyPolicy || '');
      // setTermsOfService(data.termsOfService || '');
      // setReturnPolicy(data.returnPolicy || '');
    } catch (error) {
      console.error('Error loading policies:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: استدعاء API لحفظ السياسات
      // await settingsApi.updatePolicies({
      //   privacyPolicy,
      //   termsOfService,
      //   returnPolicy
      // });
      alert('تم حفظ السياسات بنجاح! ✅');
    } catch (error) {
      alert('حدث خطأ في الحفظ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-purple-100 rounded-xl">
            <Shield className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">السياسات والشروط</h1>
            <p className="text-gray-600">إدارة سياسة الخصوصية وشروط الاستخدام</p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>

      {/* Privacy Policy */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">سياسة الخصوصية</h2>
          </div>
          <a
            href={`/store/[subdomain]/privacy`}
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
          >
            <Eye className="w-4 h-4" />
            معاينة
          </a>
        </div>
        <p className="text-gray-600 mb-4">
          اكتب سياسة الخصوصية الخاصة بمتجرك. ستظهر للعملاء في صفحة مخصصة.
        </p>
        <RichTextEditor
          value={privacyPolicy}
          onChange={setPrivacyPolicy}
          placeholder="اكتب سياسة الخصوصية هنا..."
          height="400px"
        />
      </div>

      {/* Terms of Service */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">شروط الاستخدام</h2>
          </div>
          <a
            href={`/store/[subdomain]/terms`}
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
          >
            <Eye className="w-4 h-4" />
            معاينة
          </a>
        </div>
        <p className="text-gray-600 mb-4">
          حدد شروط وأحكام استخدام متجرك والتعامل مع العملاء.
        </p>
        <RichTextEditor
          value={termsOfService}
          onChange={setTermsOfService}
          placeholder="اكتب شروط الاستخدام هنا..."
          height="400px"
        />
      </div>

      {/* Return Policy */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-900">سياسة الاسترجاع والاستبدال</h2>
          </div>
          <a
            href={`/store/[subdomain]/return-policy`}
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition"
          >
            <Eye className="w-4 h-4" />
            معاينة
          </a>
        </div>
        <p className="text-gray-600 mb-4">
          اشرح سياسة الاسترجاع والاستبدال للمنتجات في متجرك.
        </p>
        <RichTextEditor
          value={returnPolicy}
          onChange={setReturnPolicy}
          placeholder="اكتب سياسة الاسترجاع هنا..."
          height="400px"
        />
      </div>

      {/* Save Button Bottom */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'جاري الحفظ...' : 'حفظ جميع التغييرات'}
        </button>
      </div>
    </div>
  );
}
