'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ordersApi } from '@/lib/api';
import { formatCurrency, formatDateTime } from '@/lib/utils';

export default function MerchantOrders() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await ordersApi.getAll();
      const list = response.data?.data || [];
      // Normalize fields to match UI expectations
      const normalized = list.map((o: any) => ({
        ...o,
        totalAmount: Number(o.total ?? 0),
        deliveryFee: Number(o.shippingCost ?? 0),
        itemsCount: Array.isArray(o.items) ? o.items.length : (o._count?.items || 0),
      }));
      setOrders(normalized);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectOrder = async (orderId: string) => {
    try {
      const resp = await ordersApi.getOne(orderId);
      const o = resp.data;
      setSelectedOrder({
        ...o,
        totalAmount: Number(o.total ?? 0),
        deliveryFee: Number(o.shippingCost ?? 0),
      });
    } catch (e) {
      // fallback: pick from list if API fails
      const fallback = orders.find((x) => x.id === orderId);
      if (fallback) setSelectedOrder(fallback);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await ordersApi.updateStatus(orderId, status);
      alert('تم تحديث حالة الطلب');
      loadOrders();
      if (selectedOrder?.id === orderId) {
        const { data } = await ordersApi.getOne(orderId);
        setSelectedOrder(data);
      }
    } catch (error) {
      alert('حدث خطأ في التحديث');
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'ALL') return true;
    return order.status === filter;
  });

  const statusColors: any = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    PROCESSING: 'bg-purple-100 text-purple-700',
    SHIPPED: 'bg-indigo-100 text-indigo-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };

  const statusLabels: any = {
    PENDING: 'قيد الانتظار',
    CONFIRMED: 'مؤكد',
    PROCESSING: 'قيد المعالجة',
    SHIPPED: 'تم الشحن',
    DELIVERED: 'تم التوصيل',
    CANCELLED: 'ملغي',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/merchant/dashboard" className="text-gray-600 hover:text-purple-600">
              ← الرئيسية
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">🛒 الطلبات</h1>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold">
              {orders.length}
            </span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            {['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                  filter === status
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'ALL' ? 'الكل' : statusLabels[status]}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">جاري التحميل...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold mb-2">لا توجد طلبات</h3>
            <p className="text-gray-600">
              {filter === 'ALL' ? 'لم تستلم أي طلبات بعد' : `لا توجد طلبات بحالة ${statusLabels[filter]}`}
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => selectOrder(order.id)}
                  className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer transition hover:shadow-md ${
                    selectedOrder?.id === order.id ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold text-lg">#{order.orderNumber}</div>
                      <div className="text-sm text-gray-600">{order.customerName}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency(order.totalAmount)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDateTime(order.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Details */}
            {selectedOrder ? (
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                <h2 className="text-2xl font-bold mb-6">تفاصيل الطلب</h2>

                {/* Order Info */}
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-600">رقم الطلب</div>
                    <div className="font-bold text-lg">#{selectedOrder.orderNumber}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600">العميل</div>
                    <div className="font-semibold">{selectedOrder.customerName}</div>
                    <div className="text-sm">{selectedOrder.customerPhone}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600">العنوان</div>
                    <div>{selectedOrder.address}</div>
                    <div className="text-sm text-gray-600">
                      {selectedOrder.wilaya} - {selectedOrder.commune}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600">الحالة</div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColors[selectedOrder.status]}`}>
                      {statusLabels[selectedOrder.status]}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="border-t pt-4 mb-6">
                  <h3 className="font-bold mb-3">المنتجات</h3>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between">
                        <div>
                          <div className="font-semibold">{item.product.nameAr}</div>
                          <div className="text-sm text-gray-600">× {item.quantity}</div>
                        </div>
                        <div className="font-semibold">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="border-t pt-4 mb-6 space-y-2">
                  <div className="flex justify-between">
                    <span>المجموع الفرعي</span>
                    <span className="font-semibold">{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>رسوم التوصيل</span>
                    <span className="font-semibold">{formatCurrency(selectedOrder.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>الإجمالي</span>
                    <span className="text-purple-600">{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <div className="text-sm font-semibold mb-2">تحديث الحالة:</div>
                  {selectedOrder.status === 'PENDING' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'CONFIRMED')}
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      ✓ تأكيد الطلب
                    </button>
                  )}
                  {selectedOrder.status === 'CONFIRMED' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'PROCESSING')}
                      className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
                    >
                      📦 بدء المعالجة
                    </button>
                  )}
                  {selectedOrder.status === 'PROCESSING' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'SHIPPED')}
                      className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                    >
                      🚚 تم الشحن
                    </button>
                  )}
                  {selectedOrder.status === 'SHIPPED' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'DELIVERED')}
                      className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                      ✅ تم التوصيل
                    </button>
                  )}
                  {(selectedOrder.status === 'PENDING' || selectedOrder.status === 'CONFIRMED') && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'CANCELLED')}
                      className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                    >
                      ✗ إلغاء الطلب
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">👈</div>
                <p className="text-gray-600">اختر طلباً لعرض التفاصيل</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
