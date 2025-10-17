'use client';

import { useState, useRef } from 'react';
import { 
  Store, Palette, Link2, Bell, Save, Upload, Globe, Smartphone,
  Eye, EyeOff, Check, Zap, Share2, MessageSquare, Mail, Image as ImageIcon,
} from 'lucide-react';

// المكونات المساعدة
const TabButton = ({ active, icon: Icon, label, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right font-semibold transition-all duration-300 ${
      active ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-50'
    }`}
  >
    <Icon className="w-5 h-5" />
    {label}
  </button>
);

const InputField = ({ label, type = 'text', value, onChange, placeholder, className = '' }: any) => (
  <div className={className}>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
    />
  </div>
);

const ToggleSwitch = ({ enabled, onChange, title, description }: any) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
    <div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    <button
      onClick={onChange}
      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
        enabled ? 'bg-green-500' : 'bg-gray-300'
      }`}
    >
      <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
        enabled ? 'translate-x-7' : 'translate-x-1'
      }`} />
    </button>
  </div>
);

export default function MerchantSettingsComplete() {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // الإعدادات
  const [generalSettings, setGeneralSettings] = useState({
    storeName: '', storeNameAr: '', subdomain: '', defaultLanguage: 'ar',
    storeEnabled: true, customDomain: '', logo: null, banner: null,
    // الحقول الجديدة لمعلومات المتجر
    storeDescription: '',
    storeAddress: '',
    supportEmail: '',
    supportPhone: '',
  });

  const [designSettings, setDesignSettings] = useState({
    primaryColor: '#3B82F6', secondaryColor: '#8B5CF6', theme: 'light',
    productDisplayMode: 'grid', buttonStyle: 'rounded', showFooter: true,
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    tiktokApiKey: '', facebookPixelId: '', googleSheetsApiKey: '', customWebhookUrl: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true, telegramChatId: '',
    newOrderMessage: 'تم استلام طلب جديد!',
  });

  // ميزات الواجهة (عرض الآراء/العروض)
  const [featuresSettings, setFeaturesSettings] = useState({
    showReviews: true,
    showOffers: true,
  });

  // مراجع ومديرو ملفات الشعار والبنر
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setGeneralSettings((prev: any) => ({ ...prev, logo: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const url = String(reader.result || '');
        setLogoPreviewUrl(url);
        try { localStorage.setItem('ra7ba:settings:logoPreview', url); } catch {}
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setGeneralSettings((prev: any) => ({ ...prev, banner: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const url = String(reader.result || '');
        setBannerPreviewUrl(url);
        try { localStorage.setItem('ra7ba:settings:bannerPreview', url); } catch {}
      };
      reader.readAsDataURL(file);
    }
  };

  // استرجاع الإعدادات من التخزين المحلي عند التحميل
  if (typeof window !== 'undefined' && !(globalThis as any).__ra7baSettingsHydrated) {
    try {
      const g = localStorage.getItem('ra7ba:settings:general');
      const d = localStorage.getItem('ra7ba:settings:design');
      const i = localStorage.getItem('ra7ba:settings:integrations');
      const n = localStorage.getItem('ra7ba:settings:notifications');
      const f = localStorage.getItem('ra7ba:settings:features');
      const lp = localStorage.getItem('ra7ba:settings:logoPreview');
      const bp = localStorage.getItem('ra7ba:settings:bannerPreview');
      if (g) setGeneralSettings((prev: any) => ({ ...prev, ...JSON.parse(g) }));
      if (d) setDesignSettings((prev: any) => ({ ...prev, ...JSON.parse(d) }));
      if (i) setIntegrationSettings((prev: any) => ({ ...prev, ...JSON.parse(i) }));
      if (n) setNotificationSettings((prev: any) => ({ ...prev, ...JSON.parse(n) }));
      if (f) setFeaturesSettings((prev: any) => ({ ...prev, ...JSON.parse(f) }));
      if (lp) setLogoPreviewUrl(lp);
      if (bp) setBannerPreviewUrl(bp);
    } catch {}
    (globalThis as any).__ra7baSettingsHydrated = true;
  }

  const saveSettings = async (endpoint: string, data: any) => {
    setSaving(true);
    try {
      // إذا كانت هناك ملفات ضمن الإعدادات العامة نرسل FormData
      if (endpoint === '/api/settings/general' && (data?.logo instanceof File || data?.banner instanceof File)) {
        const form = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value instanceof File) {
            form.append(key, value);
          } else if (typeof value === 'boolean') {
            form.append(key, value ? 'true' : 'false');
          } else if (value !== undefined && value !== null) {
            form.append(key, String(value));
          }
        });
        await fetch(endpoint, { method: 'PUT', body: form });
      } else {
        await fetch(endpoint, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }
      // حفظ محلي حسب القسم
      try {
        let storageKey = '';
        let payload: any = data;
        if (endpoint === '/api/settings/general') {
          storageKey = 'ra7ba:settings:general';
          // لا نخزن الملفات مباشرة
          const { logo, banner, ...rest } = data || {};
          payload = rest;
        } else if (endpoint === '/api/settings/design') {
          storageKey = 'ra7ba:settings:design';
        } else if (endpoint === '/api/settings/integrations') {
          storageKey = 'ra7ba:settings:integrations';
        } else if (endpoint === '/api/settings/notifications') {
          storageKey = 'ra7ba:settings:notifications';
        } else if (endpoint === '/api/settings/features') {
          storageKey = 'ra7ba:settings:features';
        }
        if (storageKey) localStorage.setItem(storageKey, JSON.stringify(payload));
      } catch {}
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('خطأ في الحفظ:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">إعدادات المتجر</h1>
          <p className="text-gray-600">تحكم كامل في متجرك الإلكتروني</p>
        </div>

        {success && (
          <div className="mb-6 bg-green-50 border-r-4 border-green-500 rounded-lg p-4 flex items-center gap-3">
            <Check className="w-5 h-5 text-green-700" />
            <p className="text-green-700 font-semibold">تم الحفظ بنجاح!</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-2">
            <nav className="space-y-1">
              <TabButton active={activeTab === 'general'} icon={Store} label="إعدادات عامة" onClick={() => setActiveTab('general')} />
              <TabButton active={activeTab === 'design'} icon={Palette} label="التصميم" onClick={() => setActiveTab('design')} />
              <TabButton active={activeTab === 'integrations'} icon={Link2} label="التكاملات" onClick={() => setActiveTab('integrations')} />
              <TabButton active={activeTab === 'notifications'} icon={Bell} label="الإشعارات" onClick={() => setActiveTab('notifications')} />
            </nav>
          </div>

          {/* المحتوى */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-8">
            
            {/* إعدادات عامة */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Store className="w-6 h-6" /> الإعدادات العامة
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <InputField label="اسم المتجر (عربي)" value={generalSettings.storeNameAr} 
                    onChange={(e: any) => setGeneralSettings({...generalSettings, storeNameAr: e.target.value})} 
                    placeholder="مثال: متجر الأزياء" />
                  <InputField label="اسم المتجر (English)" value={generalSettings.storeName}
                    onChange={(e: any) => setGeneralSettings({...generalSettings, storeName: e.target.value})}
                    placeholder="Fashion Store" />
                </div>

                {/* معلومات المتجر */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">وصف المتجر</label>
                    <textarea
                      value={(generalSettings as any).storeDescription || ''}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, storeDescription: e.target.value })}
                      className="w-full min-h-[100px] px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      placeholder="صف بإيجاز نوع المنتجات ورسالة المتجر"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">عنوان المتجر</label>
                    <input
                      type="text"
                      value={(generalSettings as any).storeAddress || ''}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, storeAddress: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      placeholder="مثال: الجزائر، الدار البيضاء..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">بريد الدعم</label>
                    <input
                      type="email"
                      value={(generalSettings as any).supportEmail || ''}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      placeholder="support@yourstore.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">هاتف الدعم</label>
                    <input
                      type="tel"
                      value={(generalSettings as any).supportPhone || ''}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, supportPhone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      placeholder="مثال: +213 555 55 55 55"
                    />
                  </div>
                </div>

                <InputField label="رابط المتجر" value={generalSettings.subdomain}
                  onChange={(e: any) => setGeneralSettings({...generalSettings, subdomain: e.target.value})}
                  placeholder="mystore" />
                {/* رفع الشعار والبنر */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* شعار المتجر */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">شعار المتجر (Logo)</label>
                    <div
                      onClick={() => logoInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      onDrop={(e) => { e.preventDefault(); const file = e.dataTransfer.files?.[0]; if (file) setGeneralSettings((prev: any) => ({ ...prev, logo: file })); }}
                      className="relative border-2 border-dashed border-gray-300 rounded-xl p-5 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all group"
                    >
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                      {generalSettings.logo ? (
                        <div className="space-y-2">
                          <img
                            src={URL.createObjectURL(generalSettings.logo as File)}
                            alt="Logo Preview"
                            className="mx-auto h-24 object-contain"
                          />
                          <p className="text-xs text-gray-600">{(generalSettings.logo as File).name}</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 mb-2 text-gray-400 group-hover:text-blue-500"><path d="M19.5 14.25v2.878a2.25 2.25 0 01-2.25 2.25h-10.5a2.25 2.25 0 01-2.25-2.25V14.25m15 0A2.25 2.25 0 0017.25 12h-10.5A2.25 2.25 0 004.5 14.25m15 0v-4.372a2.25 2.25 0 00-.659-1.591l-3.128-3.128A2.25 2.25 0 0014.121 4.5H9.879a2.25 2.25 0 00-1.591.659L5.16 8.287A2.25 2.25 0 004.5 9.879V14.25"/></svg>
                          <span className="text-sm">انقر أو اسحب الصورة هنا</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* صورة الغلاف */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">صورة الغلاف (Banner)</label>
                    <div
                      onClick={() => bannerInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      onDrop={(e) => { e.preventDefault(); const file = e.dataTransfer.files?.[0]; if (file) setGeneralSettings((prev: any) => ({ ...prev, banner: file })); }}
                      className="relative border-2 border-dashed border-gray-300 rounded-xl p-5 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all group"
                    >
                      <input
                        ref={bannerInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleBannerChange}
                        className="hidden"
                      />
                      {generalSettings.banner ? (
                        <div className="space-y-2">
                          <img
                            src={URL.createObjectURL(generalSettings.banner as File)}
                            alt="Banner Preview"
                            className="mx-auto h-24 object-cover rounded"
                          />
                          <p className="text-xs text-gray-600">{(generalSettings.banner as File).name}</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 mb-2 text-gray-400 group-hover:text-blue-500"><path d="M19.5 14.25v2.878a2.25 2.25 0 01-2.25 2.25h-10.5a2.25 2.25 0 01-2.25-2.25V14.25m15 0A2.25 2.25 0 0017.25 12h-10.5A2.25 2.25 0 004.5 14.25m15 0v-4.372a2.25 2.25 0 00-.659-1.591l-3.128-3.128A2.25 2.25 0 0014.121 4.5H9.879a2.25 2.25 0 00-1.591.659L5.16 8.287A2.25 2.25 0 004.5 9.879V14.25"/></svg>
                          <span className="text-sm">انقر أو اسحب الصورة هنا</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <ToggleSwitch 
                  enabled={generalSettings.storeEnabled}
                  onChange={() => setGeneralSettings({...generalSettings, storeEnabled: !generalSettings.storeEnabled})}
                  title="حالة المتجر"
                  description="تفعيل أو تعطيل ظهور متجرك للعملاء"
                />

                <button onClick={() => saveSettings('/api/settings/general', generalSettings)} disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <Save className="w-5 h-5" /> {saving ? 'جاري الحفظ...' : 'حفظ'}
                </button>
              </div>
            )}

            {/* إعدادات التصميم */}
            {activeTab === 'design' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Palette className="w-6 h-6" /> إعدادات التصميم
                </h2>

                <div>
                  <label className="block text-sm font-semibold mb-3">الألوان</label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-600">اللون الأساسي</label>
                      <input type="color" value={designSettings.primaryColor}
                        onChange={(e) => setDesignSettings({...designSettings, primaryColor: e.target.value})}
                        className="w-full h-12 rounded-lg border-2 cursor-pointer" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">اللون الثانوي</label>
                      <input type="color" value={designSettings.secondaryColor}
                        onChange={(e) => setDesignSettings({...designSettings, secondaryColor: e.target.value})}
                        className="w-full h-12 rounded-lg border-2 cursor-pointer" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">نمط عرض المنتجات</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['grid', 'list', 'landing'].map((mode) => (
                      <button key={mode}
                        onClick={() => setDesignSettings({...designSettings, productDisplayMode: mode})}
                        className={`p-4 rounded-xl border-2 ${designSettings.productDisplayMode === mode ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                        {mode === 'grid' ? '▦ شبكة' : mode === 'list' ? '☰ قائمة' : '📄 صفحة هبوط'}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={() => saveSettings('/api/settings/design', designSettings)} disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-xl shadow-lg">
                  <Save className="w-5 h-5" /> {saving ? 'جاري الحفظ...' : 'حفظ التصميم'}
                </button>
              </div>
            )}

            {/* إعدادات التكاملات */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Link2 className="w-6 h-6" /> التكاملات
                </h2>

                <div className="p-6 bg-gradient-to-br from-gray-50 to-pink-50 rounded-2xl border-2">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Smartphone className="w-5 h-5" /> TikTok API
                  </h3>
                  <InputField label="API Key" value={integrationSettings.tiktokApiKey}
                    onChange={(e: any) => setIntegrationSettings({...integrationSettings, tiktokApiKey: e.target.value})}
                    placeholder="أدخل TikTok API Key" />
                </div>

                <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Share2 className="w-5 h-5" /> Facebook Pixel
                  </h3>
                  <InputField label="Pixel ID" value={integrationSettings.facebookPixelId}
                    onChange={(e: any) => setIntegrationSettings({...integrationSettings, facebookPixelId: e.target.value})}
                    placeholder="أدخل Facebook Pixel ID" />
                </div>

                <div className="p-6 bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl border-2">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5" /> Google Sheets
                  </h3>
                  <InputField label="API Key" value={integrationSettings.googleSheetsApiKey}
                    onChange={(e: any) => setIntegrationSettings({...integrationSettings, googleSheetsApiKey: e.target.value})}
                    placeholder="أدخل Google Sheets API Key" />
                </div>

                <InputField label="Custom Webhook URL" value={integrationSettings.customWebhookUrl}
                  onChange={(e: any) => setIntegrationSettings({...integrationSettings, customWebhookUrl: e.target.value})}
                  placeholder="https://your-webhook-url.com" />

                <button onClick={() => saveSettings('/api/settings/integrations', integrationSettings)} disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold rounded-xl shadow-lg">
                  <Save className="w-5 h-5" /> {saving ? 'جاري الحفظ...' : 'حفظ التكاملات'}
                </button>
              </div>
            )}

            {/* إعدادات الإشعارات */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Bell className="w-6 h-6" /> الإشعارات
                </h2>

                <ToggleSwitch 
                  enabled={notificationSettings.emailNotifications}
                  onChange={() => setNotificationSettings({...notificationSettings, emailNotifications: !notificationSettings.emailNotifications})}
                  title="إشعارات البريد الإلكتروني"
                  description="استقبال إشعارات الطلبات عبر البريد"
                />

                <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" /> Telegram Bot
                  </h3>
                  <div className="space-y-4">
                    <div className="mb-1 text-sm text-gray-700">
                      البوت المستخدم: <a href="https://t.me/ra7ba1_bot" target="_blank" rel="noopener" className="text-blue-600 hover:underline">@ra7ba1_bot</a>
                    </div>
                    <InputField label="Chat ID" value={notificationSettings.telegramChatId}
                      onChange={(e: any) => setNotificationSettings({...notificationSettings, telegramChatId: e.target.value})}
                      placeholder="أدخل Chat ID" />
                  </div>
                </div>

                <InputField label="رسالة الطلب الجديد" value={notificationSettings.newOrderMessage}
                  onChange={(e: any) => setNotificationSettings({...notificationSettings, newOrderMessage: e.target.value})}
                  placeholder="تم استلام طلب جديد!" />

                <button onClick={() => saveSettings('/api/settings/notifications', notificationSettings)} disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl shadow-lg">
                  <Save className="w-5 h-5" /> {saving ? 'جاري الحفظ...' : 'حفظ الإشعارات'}
                </button>

                {/* ميزات الواجهة */}
                <div className="pt-6 border-t border-gray-100 space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">ميزات الواجهة</h3>
                  <ToggleSwitch
                    enabled={featuresSettings.showReviews}
                    onChange={() => setFeaturesSettings({ ...featuresSettings, showReviews: !featuresSettings.showReviews })}
                    title="عرض آراء العملاء"
                    description="إظهار قسم التقييمات في واجهة المتجر"
                  />
                  <ToggleSwitch
                    enabled={featuresSettings.showOffers}
                    onChange={() => setFeaturesSettings({ ...featuresSettings, showOffers: !featuresSettings.showOffers })}
                    title="عرض العروض الحصرية"
                    description="إظهار صندوق العروض الموسمية"
                  />
                  <button onClick={() => saveSettings('/api/settings/features', featuresSettings)} disabled={saving}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg">
                    <Save className="w-5 h-5" /> {saving ? 'جاري الحفظ...' : 'حفظ الميزات'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
