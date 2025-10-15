'use client';

import { useState, useEffect } from 'react';
import { merchantApi } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Switch } from '@/components/ui/switch';

interface StorefrontSettings {
  showFreeShipping?: boolean;
  showWarranty?: boolean;
  showSeasonalOffers?: boolean;
  showExclusiveDeals?: boolean;
  showFreeReturn?: boolean;
  warrantyDays?: number;
  freeShippingThreshold?: number;
  customFeatures?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export default function StorefrontSettingsPage() {
  const [settings, setSettings] = useState<StorefrontSettings>({
    showFreeShipping: true,
    showWarranty: true,
    showSeasonalOffers: true,
    showExclusiveDeals: true,
    showFreeReturn: true,
    warrantyDays: 7,
    freeShippingThreshold: 10000,
    customFeatures: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await merchantApi.getDashboard();
      if (data.tenant?.theme?.storeFeatures) {
        setSettings(data.tenant.theme.storeFeatures);
      }
    } catch (error) {
      console.error('Error fetching storefront settings:', error);
      toast.error('فشل في تحميل إعدادات الواجهة');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await merchantApi.updateStore({
        theme: {
          storeFeatures: settings,
        },
      });
      toast.success('تم حفظ إعدادات الواجهة بنجاح!');
    } catch (error) {
      console.error('Error updating storefront settings:', error);
      toast.error('فشل في حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  const addCustomFeature = () => {
    setSettings(prev => ({
      ...prev,
      customFeatures: [
        ...(prev.customFeatures || []),
        { icon: '✨', title: '', description: '' },
      ],
    }));
  };

  const removeCustomFeature = (index: number) => {
    setSettings(prev => ({
      ...prev,
      customFeatures: prev.customFeatures?.filter((_, i) => i !== index) || [],
    }));
  };

  const updateCustomFeature = (index: number, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      customFeatures: prev.customFeatures?.map((feature, i) =>
        i === index ? { ...feature, [field]: value } : feature
      ) || [],
    }));
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
            <h1 className="text-2xl font-bold text-gray-900">إعدادات واجهة المتجر</h1>
            <p className="text-gray-600 mt-1">تحكم في العناصر التي تظهر للزبائن في متجرك</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Default Features Toggle */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">المزايا الافتراضية</h3>
              <p className="text-sm text-gray-600">اختر المزايا التي تريد عرضها في متجرك</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">🚚 توصيل مجاني</p>
                    <p className="text-sm text-gray-600">عرض ميزة التوصيل المجاني</p>
                  </div>
                  <Switch
                    checked={settings.showFreeShipping}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, showFreeShipping: checked }))
                    }
                  />
                </div>

                {settings.showFreeShipping && (
                  <div className="mr-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الحد الأدنى للتوصيل المجاني (دج)
                    </label>
                    <input
                      type="number"
                      value={settings.freeShippingThreshold}
                      onChange={(e) =>
                        setSettings(prev => ({
                          ...prev,
                          freeShippingThreshold: Number(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="10000"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">🛡️ ضمان المنتج</p>
                    <p className="text-sm text-gray-600">عرض ميزة الضمان</p>
                  </div>
                  <Switch
                    checked={settings.showWarranty}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, showWarranty: checked }))
                    }
                  />
                </div>

                {settings.showWarranty && (
                  <div className="mr-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      مدة الضمان (أيام)
                    </label>
                    <input
                      type="number"
                      value={settings.warrantyDays}
                      onChange={(e) =>
                        setSettings(prev => ({
                          ...prev,
                          warrantyDays: Number(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="7"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">🔄 استبدال مجاني</p>
                    <p className="text-sm text-gray-600">عرض ميزة الاستبدال المجاني</p>
                  </div>
                  <Switch
                    checked={settings.showFreeReturn}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, showFreeReturn: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">🎁 عروض الموسم</p>
                    <p className="text-sm text-gray-600">عرض قسم العروض الموسمية</p>
                  </div>
                  <Switch
                    checked={settings.showSeasonalOffers}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, showSeasonalOffers: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">⭐ عروض حصرية</p>
                    <p className="text-sm text-gray-600">عرض قسم العروض الحصرية</p>
                  </div>
                  <Switch
                    checked={settings.showExclusiveDeals}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, showExclusiveDeals: checked }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Custom Features */}
            <div className="space-y-4 pt-6 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">مزايا مخصصة</h3>
                  <p className="text-sm text-gray-600">أضف مزايا خاصة بمتجرك</p>
                </div>
                <button
                  type="button"
                  onClick={addCustomFeature}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
                >
                  + إضافة ميزة
                </button>
              </div>

              {settings.customFeatures && settings.customFeatures.length > 0 && (
                <div className="space-y-4">
                  {settings.customFeatures.map((feature, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">ميزة #{index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeCustomFeature(index)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          حذف
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            الأيقونة
                          </label>
                          <input
                            type="text"
                            value={feature.icon}
                            onChange={(e) =>
                              updateCustomFeature(index, 'icon', e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            placeholder="✨"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            العنوان
                          </label>
                          <input
                            type="text"
                            value={feature.title}
                            onChange={(e) =>
                              updateCustomFeature(index, 'title', e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            placeholder="ميزة رائعة"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          الوصف
                        </label>
                        <input
                          type="text"
                          value={feature.description}
                          onChange={(e) =>
                            updateCustomFeature(index, 'description', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="وصف الميزة"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
