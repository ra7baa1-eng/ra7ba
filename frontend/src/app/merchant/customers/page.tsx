'use client';

import { useEffect, useState } from 'react';
import { Users, Search, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function MerchantCustomersPage() {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // TODO: Replace with actual API call
    setTimeout(() => {
      setCustomers([
        {
          id: '1',
          name: 'أحمد محمد',
          email: 'ahmed@example.com',
          phone: '+213 555 000 001',
          city: 'الجزائر',
          ordersCount: 5,
          totalSpent: 25000,
          lastOrder: new Date(),
        },
        {
          id: '2',
          name: 'فاطمة الزهراء',
          email: 'fatima@example.com',
          phone: '+213 555 000 002',
          city: 'وهران',
          ordersCount: 3,
          totalSpent: 15000,
          lastOrder: new Date(Date.now() - 86400000),
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل العملاء...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Users className="h-8 w-8 text-blue-600" />
          العملاء
        </h1>
        <p className="text-gray-600 mt-2">إدارة قاعدة بيانات عملائك</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="بحث بالاسم، البريد الإلكتروني، أو رقم الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">إجمالي العملاء</p>
          <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">عملاء جدد (هذا الشهر)</p>
          <p className="text-2xl font-bold text-green-600">0</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">إجمالي الطلبات</p>
          <p className="text-2xl font-bold text-blue-600">
            {customers.reduce((sum, c) => sum + c.ordersCount, 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">إجمالي الإيرادات</p>
          <p className="text-2xl font-bold text-purple-600">
            {formatCurrency(customers.reduce((sum, c) => sum + c.totalSpent, 0))}
          </p>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            لا توجد عملاء مطابقين للبحث
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <div key={customer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              {/* Customer Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">
                      {customer.name.charAt(0)}
                    </span>
                  </div>
                  <div className="mr-3">
                    <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                    <p className="text-sm text-gray-500">عميل منذ {formatDate(customer.lastOrder)}</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 ml-2 text-gray-400" />
                  {customer.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 ml-2 text-gray-400" />
                  {customer.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 ml-2 text-gray-400" />
                  {customer.city}
                </div>
              </div>

              {/* Stats */}
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">عدد الطلبات</p>
                    <p className="text-lg font-semibold text-gray-900">{customer.ordersCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">إجمالي الإنفاق</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(customer.totalSpent)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4">
                <button className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  عرض الطلبات
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
