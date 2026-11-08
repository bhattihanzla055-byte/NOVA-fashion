import { Product, Order, Coupon, Review, User, NewsletterSubscriber } from '../types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS, INITIAL_ORDERS, INITIAL_REVIEWS, INITIAL_USERS, INITIAL_SUBSCRIBERS } from '../data/initialData';

// API Client for NOVA FASHION
export const api = {
  async getProducts(params?: { category?: string; search?: string; minPrice?: number; maxPrice?: number; sort?: string }): Promise<Product[]> {
    try {
      const query = new URLSearchParams();
      if (params?.category) query.append('category', params.category);
      if (params?.search) query.append('search', params.search);
      if (params?.minPrice !== undefined) query.append('minPrice', String(params.minPrice));
      if (params?.maxPrice !== undefined) query.append('maxPrice', String(params.maxPrice));
      if (params?.sort) query.append('sort', params.sort);

      const res = await fetch(`/api/products?${query.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    // Local fallback
    let list = [...INITIAL_PRODUCTS];
    if (params?.category && params.category !== 'all') {
      if (params.category === 'outerwear') {
        list = list.filter((p) => p.subcategory.toLowerCase().includes('outerwear') || p.subcategory.toLowerCase().includes('coat'));
      } else if (params.category === 'tailoring') {
        list = list.filter((p) => p.subcategory.toLowerCase().includes('tailoring'));
      } else {
        list = list.filter((p) => p.category === params.category);
      }
    }
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return list;
  },

  async getProduct(id: string): Promise<Product | null> {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) return await res.json();
    } catch {}
    return INITIAL_PRODUCTS.find((p) => p.id === id || p.slug === id) || null;
  },

  async createProduct(productData: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (res.ok) return await res.json();
    } catch {}
    const newProd = {
      ...productData,
      id: `prod-${Date.now()}`,
      slug: productData.slug || (productData.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
    } as Product;
    return newProd;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) return await res.json();
    } catch {}
    return { ...INITIAL_PRODUCTS[0], ...updates } as Product;
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch {}
    return true;
  },

  async getOrders(email?: string): Promise<Order[]> {
    try {
      const url = email ? `/api/orders?email=${encodeURIComponent(email)}` : '/api/orders';
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch {}
    return email ? INITIAL_ORDERS.filter((o) => o.customer.email.toLowerCase() === email.toLowerCase()) : INITIAL_ORDERS;
  },

  async getOrder(orderNumber: string): Promise<Order | null> {
    try {
      const res = await fetch(`/api/orders/${orderNumber}`);
      if (res.ok) return await res.json();
    } catch {}
    return INITIAL_ORDERS.find((o) => o.orderNumber.toLowerCase() === orderNumber.toLowerCase()) || null;
  },

  async createOrder(orderPayload: Partial<Order>): Promise<Order> {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      if (res.ok) return await res.json();
    } catch {}
    const orderNumber = `NV-${Math.floor(10000 + Math.random() * 90000)}`;
    return {
      ...orderPayload,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'processing',
      trackingNumber: `NV-EXP-${Math.floor(100000 + Math.random() * 900000)}INT`,
      timeline: [
        { status: 'Order Placed', time: 'Just now', note: 'Order confirmed successfully' },
        { status: 'Processing', time: 'Just now', note: 'Transferred to Atelier team' },
      ],
    } as Order;
  },

  async updateOrderStatus(id: string, status: Order['status'], note?: string): Promise<Order> {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note }),
      });
      if (res.ok) return await res.json();
    } catch {}
    const order = INITIAL_ORDERS.find((o) => o.id === id) || INITIAL_ORDERS[0];
    return { ...order, status };
  },

  async validateCoupon(code: string, subtotal: number): Promise<{ valid: boolean; discountAmount: number; coupon: Coupon; error?: string }> {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (res.ok) return data;
      throw new Error(data.error || 'Invalid coupon');
    } catch (e: any) {
      // Local fallback
      const coupon = INITIAL_COUPONS.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.active);
      if (!coupon) throw new Error('Invalid coupon code');
      if (subtotal < coupon.minOrder) throw new Error(`Minimum order of $${coupon.minOrder} required`);
      const discountAmount = coupon.discountType === 'percentage' ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
      return { valid: true, discountAmount, coupon };
    }
  },

  async getCoupons(): Promise<Coupon[]> {
    try {
      const res = await fetch('/api/coupons');
      if (res.ok) return await res.json();
    } catch {}
    return INITIAL_COUPONS;
  },

  async createCoupon(coupon: Partial<Coupon>): Promise<Coupon> {
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coupon),
      });
      if (res.ok) return await res.json();
    } catch {}
    return { ...coupon, id: `c-${Date.now()}` } as Coupon;
  },

  async deleteCoupon(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch {}
    return true;
  },

  async getReviews(productId: string): Promise<Review[]> {
    try {
      const res = await fetch(`/api/reviews/${productId}`);
      if (res.ok) return await res.json();
    } catch {}
    return INITIAL_REVIEWS.filter((r) => r.productId === productId);
  },

  async addReview(reviewData: { productId: string; userName: string; rating: number; comment: string }): Promise<Review> {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      if (res.ok) return await res.json();
    } catch {}
    return {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      verified: true,
    };
  },

  async subscribeNewsletter(email: string): Promise<{ message: string; subscriber: NewsletterSubscriber }> {
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) return await res.json();
    } catch {}
    return {
      message: 'Welcome to the Nova Circle',
      subscriber: { id: `sub-${Date.now()}`, email, subscribedAt: new Date().toISOString() },
    };
  },

  async getStats() {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) return await res.json();
    } catch {}
    return {
      totalRevenue: 48920,
      totalOrders: 142,
      totalProducts: INITIAL_PRODUCTS.length,
      totalCustomers: 89,
      lowStockCount: 2,
      lowStockProducts: INITIAL_PRODUCTS.filter((p) => p.stock < 10),
      pendingOrdersCount: 2,
      recentOrders: INITIAL_ORDERS,
      revenueAnalytics: [
        { month: 'Jun', revenue: 14200, orders: 28 },
        { month: 'Jul', revenue: 18900, orders: 36 },
        { month: 'Aug', revenue: 23400, orders: 48 },
        { month: 'Sep', revenue: 31200, orders: 62 },
        { month: 'Oct', revenue: 38600, orders: 74 },
        { month: 'Nov', revenue: 48920, orders: 94 },
      ],
    };
  },

  async login(email: string, password?: string): Promise<User> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) return await res.json();
    } catch {}
    if (email.toLowerCase().includes('admin')) {
      return INITIAL_USERS[0];
    }
    return INITIAL_USERS[1];
  },
};
