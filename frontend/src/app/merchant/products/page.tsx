'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { productsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function MerchantProducts() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    price: '',
    stock: '',
    sku: '',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data } = await productsApi.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await productsApi.create({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      });
      alert('تم إضافة المنتج بنجاح!');
      setShowAddModal(false);
      setFormData({
        name: '',
        nameAr: '',
        description: '',
        descriptionAr: '',
        price: '',
        stock: '',
        sku: '',
      });
      loadProducts();
    } catch (error: any) {
      alert(error.response?.data?.message || 'حدث خطأ في إضافة المنتج');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('هل تريد حذف هذا المنتج؟')) return;

    try {
      await productsApi.delete(id);
      alert('تم حذف المنتج');
      loadProducts();
    } catch (error) {
      alert('حدث خطأ في الحذف');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/merchant/dashboard" className="text-gray-600 hover:text-purple-600">
                ← الرئيسية
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">📦 المنتجات</h1>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              + إضافة منتج
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">جاري التحميل...</div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold mb-2">لا توجد منتجات بعد</h3>
            <p className="text-gray-600 mb-6">ابدأ بإضافة أول منتج لمتجرك</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              إضافة منتج الآن
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
              >
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.nameAr}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-6xl">
                    📦
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{product.nameAr}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.descriptionAr}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency(product.price)}
                    </div>
                    <div className="text-sm text-gray-600">
                      المخزون: <strong>{product.stock}</strong>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/merchant/products/${product.id}/edit`)}
                      className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">إضافة منتج جديد</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              {/* Name EN */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  اسم المنتج (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Product Name"
                />
              </div>

              {/* Name AR */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  اسم المنتج (عربي) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="اسم المنتج"
                />
              </div>

              {/* Description EN */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  الوصف (English)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="Product description"
                />
              </div>

              {/* Description AR */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  الوصف (عربي)
                </label>
                <textarea
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="وصف المنتج"
                />
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    السعر (دج) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="1500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    المخزون *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="100"
                  />
                </div>
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  رمز المنتج (SKU)
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="PROD-001"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
                >
                  إضافة المنتج
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
