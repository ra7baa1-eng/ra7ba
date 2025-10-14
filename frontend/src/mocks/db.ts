export type Role = 'SUPER_ADMIN' | 'MERCHANT' | 'CUSTOMER';

export interface User { id: string; name: string; email: string; role: Role }
export interface Store { id: string; name: string; slug: string; ownerId: string; email?: string; phone?: string; wilaya?: string; daira?: string; baladiya?: string; logoUrl?: string; bannerUrl?: string; colors?: any; landingPage?: any; checkoutConfig?: any; subscriptionStatus?: 'PENDING'|'ACTIVE'|'SUSPENDED'; isActive: boolean; createdAt: string; updatedAt: string }
export interface Product { id: string; storeId: string; name: string; nameAr: string; slug: string; description?: string; descriptionAr?: string; price: number; stock: number; sku?: string; images: string[]; isActive: boolean; createdAt: string; updatedAt: string }
export interface OrderItem { id: string; productId: string; name: string; price: number; quantity: number }
export interface Order { id: string; orderNumber: string; storeId: string; customerName: string; customerPhone: string; shippingAddress: string; wilaya?: string; commune?: string; status: 'PENDING'|'CONFIRMED'|'PROCESSING'|'SHIPPED'|'DELIVERED'|'CANCELLED'; subtotal: number; deliveryFee: number; totalAmount: number; items: OrderItem[]; createdAt: string; updatedAt: string; trackingNumber?: string }

const now = () => new Date().toISOString();
const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 10)}`;

export const users: User[] = [
  { id: 'u-admin', name: 'Super Admin', email: 'admin@rahba.dz', role: 'SUPER_ADMIN' },
  { id: 'u-merchant', name: 'Merchant One', email: 'merchant@rahba.dz', role: 'MERCHANT' },
];

export const stores: Store[] = [
  { id: 's-1', name: 'متجر رحبة', slug: 'demo', ownerId: 'u-merchant', email: 'contact@demo.dz', phone: '+213555000000', wilaya: 'الجزائر', daira: 'الجزائر الوسطى', baladiya: 'الجزائر الوسطى', logoUrl: 'https://picsum.photos/seed/rahba-logo/120/120', bannerUrl: 'https://picsum.photos/seed/rahba-banner/1200/300', colors: { primary: '#0284c7', secondary: '#e0f2fe' }, landingPage: {}, checkoutConfig: {}, subscriptionStatus: 'ACTIVE', isActive: true, createdAt: now(), updatedAt: now() },
];

const productSeeds = Array.from({ length: 8 }).map((_, i) => ({
  id: `p-${i+1}`,
  storeId: 's-1',
  name: `Demo Product ${i+1}`,
  nameAr: `منتج تجريبي ${i+1}`,
  slug: `demo-product-${i+1}`,
  description: `Sample description ${i+1}`,
  descriptionAr: `وصف تجريبي للمنتج رقم ${i+1}`,
  price: 1500 + i * 300,
  stock: 10 + i,
  sku: `SKU-${i+1}`,
  images: [`https://picsum.photos/seed/demo${i+1}/600/400`],
  isActive: true,
  createdAt: now(),
  updatedAt: now(),
}));

export const products: Product[] = [...productSeeds];
export const orders: Order[] = [];

export function findStoreBySlug(slug: string) {
  return stores.find(s => s.slug === slug);
}

export function getStoreProducts(storeId: string) {
  return products.filter(p => p.storeId === storeId && p.isActive);
}

export function addProduct(data: Partial<Product>) {
  const id = uid('p');
  const prod: Product = {
    id,
    storeId: data.storeId || 's-1',
    name: data.name || 'Product',
    nameAr: data.nameAr || 'منتج',
    slug: data.slug || `${id}`,
    description: data.description || '',
    descriptionAr: data.descriptionAr || '',
    price: Number(data.price || 0),
    stock: Number(data.stock || 0),
    sku: data.sku || undefined,
    images: Array.isArray(data.images) ? data.images : [],
    isActive: data.isActive ?? true,
    createdAt: now(),
    updatedAt: now(),
  };
  products.unshift(prod);
  return prod;
}

export function deleteProduct(id: string) {
  const idx = products.findIndex(p => p.id === id);
  if (idx >= 0) products.splice(idx, 1);
}

export function listMerchantProducts() {
  return products;
}

export function listMerchantOrders() {
  return orders.slice().reverse();
}

export function getOrderById(id: string) {
  return orders.find(o => o.id === id);
}

export function updateOrderStatus(id: string, status: Order['status']) {
  const o = getOrderById(id);
  if (o) {
    o.status = status;
    o.updatedAt = now();
  }
  return o;
}

export function createOrder(payload: { storeSlug: string; customerName: string; customerPhone: string; wilaya?: string; commune?: string; shippingAddress: string; items: Array<{ id: string; quantity: number }> }) {
  const store = findStoreBySlug(payload.storeSlug) || stores[0];
  const itms: OrderItem[] = [];
  let subtotal = 0;
  for (const ci of payload.items) {
    const p = products.find(pp => pp.id === ci.id);
    if (!p) continue;
    const line = { id: uid('oi'), productId: p.id, name: p.nameAr || p.name, price: p.price, quantity: ci.quantity };
    subtotal += p.price * ci.quantity;
    itms.push(line);
  }
  const deliveryFee = 400;
  const totalAmount = subtotal + deliveryFee;
  const order: Order = {
    id: uid('o'),
    orderNumber: Math.floor(100000 + Math.random() * 900000).toString(),
    storeId: store.id,
    customerName: payload.customerName,
    customerPhone: payload.customerPhone,
    shippingAddress: payload.shippingAddress,
    wilaya: payload.wilaya,
    commune: payload.commune,
    status: 'PENDING',
    subtotal,
    deliveryFee,
    totalAmount,
    items: itms,
    createdAt: now(),
    updatedAt: now(),
  };
  orders.push(order);
  return order;
}

export function getAdminStats() {
  const total = stores.length;
  const active = stores.filter(s => s.subscriptionStatus === 'ACTIVE').length;
  const trial = 0;
  const suspended = stores.filter(s => s.subscriptionStatus === 'SUSPENDED').length;
  return { tenants: { total, active, trial, suspended }, orders: { total: orders.length }, revenue: { total: 0 }, recentOrders: orders.slice(-5) };
}

export function getTenantsList() {
  return stores.map(s => ({ id: s.id, name: s.name, subdomain: s.slug, owner: { name: users.find(u => u.id === s.ownerId)?.name, email: users.find(u => u.id === s.ownerId)?.email }, status: s.subscriptionStatus || 'ACTIVE', subscription: { plan: 'FREE' }, createdAt: s.createdAt }));
}

export const payments = [
  { id: 'pay-1', amount: 2000, baridimobRef: 'BM123456', paymentProof: 'https://picsum.photos/seed/proof/400/300', subscription: { plan: 'FREE', tenant: { name: stores[0].name, owner: { email: users[1].email } } } },
];
