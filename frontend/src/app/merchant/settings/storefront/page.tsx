'use client';

import { useState, useEffect } from 'react';
import { merchantApi } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Switch } from '@/components/ui/switch';
import { uploadImageToImgBB } from '@/lib/upload';
import { Upload, Palette, Eye, Settings, Image as ImageIcon, Globe, Facebook, Instagram, Twitter, MessageCircle, Sparkles } from 'lucide-react';

interface StorefrontSettings {
  // Branding
  logo?: string;
  favicon?: string;
  storeName?: string;
  storeNameAr?: string;
  storeSlogan?: string;
  
  // Theme & Colors
  theme?: 'light' | 'dark' | 'auto';
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonStyle?: 'rounded' | 'square' | 'pill';
  
  // Banner
  bannerImage?: string;
  bannerTitle?: string;
  bannerSubtitle?: string;
  bannerButtonText?: string;
  bannerButtonLink?: string;
  
  // Pages Customization
  thankYouPage?: {
    title?: string;
    message?: string;
    showOrderDetails?: boolean;
    redirectAfterSeconds?: number;
  };
  
  productPage?: {
    showRelatedProducts?: boolean;
    showReviews?: boolean;
    showShareButtons?: boolean;
  };
  
  // Platform Branding
  hidePlatformBranding?: boolean; // فقط للخطط المدفوعة
  
  // Footer
  footerText?: string;
  footerCopyright?: string;
  
  // Social Links
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    whatsapp?: string;
  };
  
  // Features
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
    theme: 'light',
    primaryColor: '#8B5CF6',
    secondaryColor: '#EC4899',
    accentColor: '#3B82F6',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    buttonStyle: 'rounded',
    showFreeShipping: true,
    showWarranty: true,
    showSeasonalOffers: true,
    showExclusiveDeals: true,
    showFreeReturn: true,
    warrantyDays: 7,
    freeShippingThreshold: 10000,
    customFeatures: [],
    socialLinks: {},
    hidePlatformBranding: false,
    thankYouPage: {
      title: 'شكراً لك!',
      message: 'تم استلام طلبك بنجاح وسنتواصل معك قريباً',
      showOrderDetails: true,
      redirectAfterSeconds: 0,
    },
    productPage: {
      showRelatedProducts: true,
      showReviews: true,
      showShareButtons: true,
    },
  });
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [activeTab, setActiveTab] = useState<'branding' | 'theme' | 'banner' | 'pages' | 'features' | 'social' | 'platform'>('branding');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await merchantApi.getDashboard();
      if (data.tenant?.theme?.storeFeatures) {
        setSettings(data.tenant.theme.storeFeatures);
      }
      // Get subscription info
      if (data.tenant?.subscription) {
        setSubscription(data.tenant.subscription);
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

  const handleLogoUpload = async (file: File) => {
    try {
      setUploadingLogo(true);
      const url = await uploadImageToImgBB(file);
      setSettings(prev => ({ ...prev, logo: url }));
      toast.success('تم رفع اللوقو بنجاح!');
    } catch (error) {
      toast.error('فشل في رفع اللوقو');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleBannerUpload = async (file: File) => {
    try {
      setUploadingBanner(true);
      const url = await uploadImageToImgBB(file);
      setSettings(prev => ({ ...prev, bannerImage: url }));
      toast.success('تم رفع البانر بنجاح!');
    } catch (error) {
      toast.error('فشل في رفع البانر');
    } finally {
      setUploadingBanner(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الإعدادات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-purple-600" />
            تخصيص واجهة المتجر
          </h1>
          <p className="text-gray-600 mt-2">صمم متجرك الإلكتروني بالشكل الذي تريده</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('branding')}
                className={`px-6 py-4 font-semibold border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'branding'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <ImageIcon className="w-5 h-5" />
                العلامة التجارية
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('theme')}
                className={`px-6 py-4 font-semibold border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'theme'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Palette className="w-5 h-5" />
                الثيم والألوان
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('banner')}
                className={`px-6 py-4 font-semibold border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'banner'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Eye className="w-5 h-5" />
                البانر والواجهة
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('features')}
                className={`px-6 py-4 font-semibold border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'features'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                المزايا
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pages')}
                className={`px-6 py-4 font-semibold border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'pages'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Eye className="w-5 h-5" />
                تخصيص الصفحات
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('social')}
                className={`px-6 py-4 font-semibold border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'social'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Globe className="w-5 h-5" />
                وسائل التواصل
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('platform')}
                className={`px-6 py-4 font-semibold border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'platform'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                وسم المنصة
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Branding Tab */}
            {activeTab === 'branding' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">العلامة التجارية</h3>
                
                {/* Logo */}
                <div>
                  <label className="block text-sm font-semibold mb-3">لوقو المتجر</label>
                  <div className="flex items-center gap-4">
                    {settings.logo && (
                      <div className="relative w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden">
                        <img src={settings.logo} alt="Logo" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div>
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                        <Upload className="w-5 h-5" />
                        {uploadingLogo ? 'جاري الرفع...' : 'رفع لوقو'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
                          disabled={uploadingLogo}
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-2">PNG أو JPG - حجم موصى به: 200x200px</p>
                    </div>
                  </div>
                </div>

                {/* Store Names */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">اسم المتجر (English)</label>
                    <input
                      type="text"
                      value={settings.storeName || ''}
                      onChange={(e) => setSettings(prev => ({ ...prev, storeName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="My Store"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">اسم المتجر (عربي)</label>
                    <input
                      type="text"
                      value={settings.storeNameAr || ''}
                      onChange={(e) => setSettings(prev => ({ ...prev, storeNameAr: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="متجري"
                    />
                  </div>
                </div>

                {/* Store Slogan */}
                <div>
                  <label className="block text-sm font-semibold mb-2">شعار المتجر</label>
                  <input
                    type="text"
                    value={settings.storeSlogan || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, storeSlogan: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="أفضل منتجات بأفضل الأسعار"
                  />
                </div>
              </div>
            )}

            {/* Theme Tab */}
            {activeTab === 'theme' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">الثيم والألوان</h3>
                <p className="text-sm text-gray-600">اختر الثيم والألوان التي تعكس هوية علامتك التجارية</p>
                
                {/* Theme Selection */}
                <div>
                  <label className="block text-sm font-semibold mb-3">نمط الثيم</label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => setSettings(prev => ({ ...prev, theme: 'light' }))}
                      className={`p-4 border-2 rounded-lg transition ${
                        settings.theme === 'light' 
                          ? 'border-purple-600 bg-purple-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">☀️</div>
                        <div className="font-semibold">فاتح</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettings(prev => ({ ...prev, theme: 'dark' }))}
                      className={`p-4 border-2 rounded-lg transition ${
                        settings.theme === 'dark' 
                          ? 'border-purple-600 bg-purple-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">🌙</div>
                        <div className="font-semibold">داكن</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettings(prev => ({ ...prev, theme: 'auto' }))}
                      className={`p-4 border-2 rounded-lg transition ${
                        settings.theme === 'auto' 
                          ? 'border-purple-600 bg-purple-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">⚙️</div>
                        <div className="font-semibold">تلقائي</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Button Style */}
                <div>
                  <label className="block text-sm font-semibold mb-3">شكل الأزرار</label>
                  <div className="grid grid-cols-3 gap-4">
                    {(['rounded', 'square', 'pill'] as const).map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setSettings(prev => ({ ...prev, buttonStyle: style }))}
                        className={`p-4 border-2 rounded-lg transition ${
                          settings.buttonStyle === style 
                            ? 'border-purple-600 bg-purple-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`h-10 bg-gradient-to-r from-purple-600 to-pink-600 mb-2 ${
                          style === 'rounded' ? 'rounded-lg' : 
                          style === 'square' ? '' : 
                          'rounded-full'
                        }`}></div>
                        <div className="font-semibold text-sm">
                          {style === 'rounded' ? 'مدور' : 
                           style === 'square' ? 'مربع' : 
                           'بيضاوي'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">الألوان</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">اللون الأساسي</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.primaryColor || '#8B5CF6'}
                        onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-16 h-12 border-2 border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.primaryColor || '#8B5CF6'}
                        onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">اللون الثانوي</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.secondaryColor || '#EC4899'}
                        onChange={(e) => setSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="w-16 h-12 border-2 border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.secondaryColor || '#EC4899'}
                        onChange={(e) => setSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">لون التمييز</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.accentColor || '#3B82F6'}
                        onChange={(e) => setSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                        className="w-16 h-12 border-2 border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.accentColor || '#3B82F6'}
                        onChange={(e) => setSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="border-2 border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold mb-4">معاينة الألوان</h4>
                  <div className="space-y-3">
                    <button 
                      type="button"
                      style={{ backgroundColor: settings.primaryColor }}
                      className="w-full px-4 py-3 text-white rounded-lg font-semibold"
                    >
                      زر بااللون الأساسي
                    </button>
                    <button 
                      type="button"
                      style={{ backgroundColor: settings.secondaryColor }}
                      className="w-full px-4 py-3 text-white rounded-lg font-semibold"
                    >
                      زر باللون الثانوي
                    </button>
                    <button 
                      type="button"
                      style={{ backgroundColor: settings.accentColor }}
                      className="w-full px-4 py-3 text-white rounded-lg font-semibold"
                    >
                      زر بلون التمييز
                    </button>
                  </div>
                </div>
                </div>
              </div>
            )}

            {/* Banner Tab */}
            {activeTab === 'banner' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">البانر والواجهة الرئيسية</h3>
                
                {/* Banner Image */}
                <div>
                  <label className="block text-sm font-semibold mb-3">صورة البانر</label>
                  <div className="space-y-3">
                    {settings.bannerImage && (
                      <div className="relative w-full h-48 border-2 border-gray-200 rounded-lg overflow-hidden">
                        <img src={settings.bannerImage} alt="Banner" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                      <Upload className="w-5 h-5" />
                      {uploadingBanner ? 'جاري الرفع...' : 'رفع صورة البانر'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleBannerUpload(e.target.files[0])}
                        disabled={uploadingBanner}
                      />
                    </label>
                    <p className="text-xs text-gray-500">حجم موصى به: 1920x600px</p>
                  </div>
                </div>

                {/* Banner Content */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">عنوان البانر</label>
                    <input
                      type="text"
                      value={settings.bannerTitle || ''}
                      onChange={(e) => setSettings(prev => ({ ...prev, bannerTitle: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="مرحباً بك في متجرنا"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">العنوان الفرعي</label>
                    <input
                      type="text"
                      value={settings.bannerSubtitle || ''}
                      onChange={(e) => setSettings(prev => ({ ...prev, bannerSubtitle: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="اكتشف أفضل المنتجات بأفضل الأسعار"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">نص الزر</label>
                      <input
                        type="text"
                        value={settings.bannerButtonText || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, bannerButtonText: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="تسوق الآن"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">رابط الزر</label>
                      <input
                        type="text"
                        value={settings.bannerButtonLink || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, bannerButtonLink: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="/products"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">تذييل الصفحة</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">نص التذييل</label>
                      <textarea
                        value={settings.footerText || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, footerText: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows={3}
                        placeholder="معلومات عن المتجر..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">حقوق النشر</label>
                      <input
                        type="text"
                        value={settings.footerCopyright || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, footerCopyright: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="© 2024 جميع الحقوق محفوظة"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Features Tab */}
            {activeTab === 'features' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">مزايا المتجر</h3>
                <p className="text-sm text-gray-600">اختر المزايا التي تريد عرضها للزبائن</p>

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

                {/* Custom Features */}
                <div className="space-y-4 pt-6 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">مزايا مخصصة</h4>
                      <p className="text-sm text-gray-600">أضف مزايا خاصة بمتجرك</p>
                    </div>
                    <button
                      type="button"
                      onClick={addCustomFeature}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
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
              </div>
            )}

            {/* Pages Tab */}
            {activeTab === 'pages' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">تخصيص الصفحات</h3>
                <p className="text-sm text-gray-600">قم بتخصيص صفحات متجرك حسب احتياجاتك</p>

                {/* Thank You Page */}
                <div className="border-2 border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    🎉 صفحة الشكر (بعد الطلب)
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">عنوان الصفحة</label>
                      <input
                        type="text"
                        value={settings.thankYouPage?.title || ''}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          thankYouPage: { ...prev.thankYouPage, title: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="شكراً لك!"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2">رسالة الشكر</label>
                      <textarea
                        value={settings.thankYouPage?.message || ''}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          thankYouPage: { ...prev.thankYouPage, message: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows={3}
                        placeholder="تم استلام طلبك بنجاح..."
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">إظهار تفاصيل الطلب</p>
                        <p className="text-sm text-gray-600">عرض رقم الطلب والمنتجات</p>
                      </div>
                      <Switch
                        checked={settings.thankYouPage?.showOrderDetails ?? true}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ 
                            ...prev, 
                            thankYouPage: { ...prev.thankYouPage, showOrderDetails: checked }
                          }))
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">إعادة التوجيه التلقائي (بالثواني)</label>
                      <input
                        type="number"
                        min="0"
                        max="60"
                        value={settings.thankYouPage?.redirectAfterSeconds || 0}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          thankYouPage: { ...prev.thankYouPage, redirectAfterSeconds: parseInt(e.target.value) }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="0"
                      />
                      <p className="text-xs text-gray-500 mt-1">0 = بدون إعادة توجيه تلقائي</p>
                    </div>
                  </div>
                </div>

                {/* Product Page */}
                <div className="border-2 border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    📦 صفحة المنتج
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">إظهار منتجات مشابهة</p>
                        <p className="text-sm text-gray-600">عرض منتجات من نفس التصنيف</p>
                      </div>
                      <Switch
                        checked={settings.productPage?.showRelatedProducts ?? true}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ 
                            ...prev, 
                            productPage: { ...prev.productPage, showRelatedProducts: checked }
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">إظهار التقييمات</p>
                        <p className="text-sm text-gray-600">عرض تقييمات العملاء</p>
                      </div>
                      <Switch
                        checked={settings.productPage?.showReviews ?? true}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ 
                            ...prev, 
                            productPage: { ...prev.productPage, showReviews: checked }
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">أزرار المشاركة</p>
                        <p className="text-sm text-gray-600">مشاركة المنتج على وسائل التواصل</p>
                      </div>
                      <Switch
                        checked={settings.productPage?.showShareButtons ?? true}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ 
                            ...prev, 
                            productPage: { ...prev.productPage, showShareButtons: checked }
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Social Tab */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">روابط وسائل التواصل الاجتماعي</h3>
                <p className="text-sm text-gray-600">أضف روابط حساباتك على منصات التواصل</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                      <Facebook className="w-5 h-5 text-blue-600" />
                      فيسبوك
                    </label>
                    <input
                      type="url"
                      value={settings.socialLinks?.facebook || ''}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, facebook: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                      <Instagram className="w-5 h-5 text-pink-600" />
                      إنستغرام
                    </label>
                    <input
                      type="url"
                      value={settings.socialLinks?.instagram || ''}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="https://instagram.com/yourprofile"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                      <Twitter className="w-5 h-5 text-blue-400" />
                      تويتر / X
                    </label>
                    <input
                      type="url"
                      value={settings.socialLinks?.twitter || ''}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="https://twitter.com/yourprofile"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-green-600" />
                      واتساب (رقم فقط)
                    </label>
                    <input
                      type="tel"
                      value={settings.socialLinks?.whatsapp || ''}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, whatsapp: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="213555123456"
                    />
                    <p className="text-xs text-gray-500 mt-1">مثال: 213555123456 (بدون + أو 00)</p>
                  </div>
                </div>
              </div>
            )}

            {/* Platform Branding Tab */}
            {activeTab === 'platform' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">وسم المنصة "رحبة"</h3>
                <p className="text-sm text-gray-600">تحكم في عرض علامة منصة رحبة في متجرك</p>

                {/* Platform Badge Preview */}
                <div className="border-2 border-purple-200 bg-purple-50 rounded-lg p-6">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-sm">
                      ⚡ Powered by رحبة
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    هذا هو شكل الوسم الذي يظهر في أسفل متجرك
                  </p>
                </div>

                {/* Free Plan Notice */}
                {(!subscription || subscription.plan === 'free') && (
                  <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">ℹ️</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-blue-900 mb-2">الخطة المجانية</h4>
                        <p className="text-sm text-blue-800 mb-3">
                          أنت حالياً على الخطة المجانية. وسم "رحبة" مطلوب لجميع المتاجر على الخطة المجانية.
                        </p>
                        <p className="text-sm text-blue-800 font-semibold">
                          💡 لإخفاء الوسم، قم بالترقية إلى خطة مدفوعة من صفحة الاشتراكات
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Paid Plan Options */}
                {subscription && subscription.plan !== 'free' && (
                  <div className="space-y-4">
                    <div className="border-2 border-green-200 bg-green-50 rounded-lg p-6">
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">✅</div>
                        <div className="flex-1">
                          <h4 className="font-bold text-green-900 mb-2">خطة {subscription.plan}</h4>
                          <p className="text-sm text-green-800">
                            يمكنك الآن إخفاء وسم المنصة واستخدام اسم متجرك الخاص فقط!
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                      <div>
                        <p className="font-semibold text-gray-900">إخفاء وسم "رحبة"</p>
                        <p className="text-sm text-gray-600">إظهار اسم متجرك فقط بدون علامة المنصة</p>
                      </div>
                      <Switch
                        checked={settings.hidePlatformBranding ?? false}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, hidePlatformBranding: checked }))
                        }
                      />
                    </div>

                    {settings.hidePlatformBranding && (
                      <div className="border-2 border-purple-200 bg-purple-50 rounded-lg p-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">معاينة التذييل بدون الوسم:</p>
                          <div className="text-gray-700 font-medium">
                            © 2024 {settings.storeNameAr || settings.storeName || 'متجرك'} - جميع الحقوق محفوظة
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Support Message */}
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                  <p className="text-sm text-gray-700 text-center">
                    💝 شكراً لدعمك! وسم المنصة يساعدنا في النمو وتقديم خدمات أفضل
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200 mt-8">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    حفظ الإعدادات
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
