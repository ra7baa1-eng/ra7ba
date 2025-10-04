'use client';

import { useState, useEffect } from 'react';
import { merchantApi } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface StoreSettings {
  name: string;
  nameAr: string;
  description?: string;
  logo?: string;
  banner?: string;
  phone?: string;
  address?: string;
  customDomain?: string;
}

export default function StoreSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>({
    name: '',
    nameAr: '',
    description: '',
    logo: '',
    banner: '',
    phone: '',
    address: '',
    customDomain: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStoreSettings();
  }, []);

  const fetchStoreSettings = async () => {
    try {
      const { data } = await merchantApi.getDashboard();
      if (data.tenant) {
        setSettings({
          name: data.tenant.name || '',
          nameAr: data.tenant.nameAr || '',
          description: data.tenant.description || '',
          logo: data.tenant.logo || '',
          banner: data.tenant.banner || '',
          phone: data.tenant.phone || '',
          address: data.tenant.address || '',
          customDomain: data.tenant.customDomain || '',
        });
      }
    } catch (error) {
      console.error('Error fetching store settings:', error);
      toast.error('فشل في تحميل إعدادات المتجر');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await merchantApi.updateStore(settings);
      toast.success('تم حفظ الإعدادات بنجاح!');
    } catch (error) {
      console.error('Error updating store settings:', error);
      toast.error('فشل في حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof StoreSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الإعدادات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">إعدادات المتجر</h1>
            <p className="text-gray-600 mt-1">قم بتخصيص معلومات متجرك</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Store Names */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المتجر (عربي) *
                </label>
                <input
                  type="text"
                  value={settings.nameAr}
                  onChange={(e) => handleInputChange('nameAr', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="مثال: متجر الإلكترونيات"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name (English) *
                </label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Example: Electronics Store"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف المتجر
              </label>
              <textarea
                value={settings.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="اكتب وصفاً مختصراً عن متجرك..."
              />
            </div>

            {/* Contact Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="+213 555 000 000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="الجزائر العاصمة، الجزائر"
                />
              </div>
            </div>

            {/* Images */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رابط الشعار (Logo)
                </label>
                <input
                  type="url"
                  value={settings.logo}
                  onChange={(e) => handleInputChange('logo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="https://example.com/logo.png"
                />
                {settings.logo && (
                  <div className="mt-2">
                    <img
                      src={settings.logo}
                      alt="Store Logo"
                      className="h-16 w-16 object-cover rounded-lg border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رابط البانر (Banner)
                </label>
                <input
                  type="url"
                  value={settings.banner}
                  onChange={(e) => handleInputChange('banner', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="https://example.com/banner.png"
                />
                {settings.banner && (
                  <div className="mt-2">
                    <img
                      src={settings.banner}
                      alt="Store Banner"
                      className="h-16 w-32 object-cover rounded-lg border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Custom Domain */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                النطاق المخصص (Custom Domain)
              </label>
              <input
                type="text"
                value={settings.customDomain}
                onChange={(e) => handleInputChange('customDomain', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="mystore.com"
              />
              <p className="text-sm text-gray-500 mt-1">
                متاح فقط في الباقة المتقدمة (Pro)
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    جاري الحفظ...
                  </div>
                ) : (
                  'حفظ الإعدادات'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
