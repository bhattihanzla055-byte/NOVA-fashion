import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Tag,
  Mail,
  Shield,
  RefreshCw,
  X,
  Eye,
} from 'lucide-react';
import { api } from '../services/api';
import { Product, Order, Coupon, NewsletterSubscriber, User } from '../types';
import { useShop } from '../context/ShopContext';

export const AdminDashboard: React.FC = () => {
  const { products, refreshProducts, setActiveView } = useShop();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'customers' | 'coupons' | 'subscribers'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Orders in admin
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Coupons in admin
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponValue, setNewCouponValue] = useState(15);
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponMin, setNewCouponMin] = useState(200);

  // Subscribers in admin
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);

  // Product Add / Edit Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodForm, setProdForm] = useState({
    name: '',
    category: 'men' as Product['category'],
    subcategory: 'Outerwear',
    price: 450,
    originalPrice: 550,
    stock: 15,
    description: '',
    composition: '100% Virgin Wool',
    fit: 'Modern tailored drape',
    care: 'Dry clean only',
    origin: 'Handcrafted in Milan, Italy',
    image1: '/src/assets/images/product_men_tailored_overcoat_1794103593370.jpg',
    image2: '/src/assets/images/banner_seasonal_campaign_1794103595731.jpg',
    sizes: ['S', 'M', 'L', 'XL'] as Product['sizes'],
    colors: [
      { name: 'Obsidian Black', hex: '#0a0a0a' },
      { name: 'Charcoal Heather', hex: '#262628' },
    ],
  });

  const loadAllAdminData = async () => {
    setLoadingStats(true);
    try {
      const [statsData, ordersData, couponsData, subsData] = await Promise.all([
        api.getStats(),
        api.getOrders(),
        api.getCoupons(),
        api.getReviews('prod-1'), // sanity
      ]);
      setStats(statsData);
      setOrders(ordersData);
      setCoupons(couponsData);
      const subsRes = await fetch('/api/subscribers').then((r) => r.json()).catch(() => []);
      setSubscribers(Array.isArray(subsRes) ? subsRes : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  // Update order status directly
  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      loadAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Create new coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    const created = await api.createCoupon({
      code: newCouponCode.trim(),
      discountType: newCouponType,
      value: Number(newCouponValue),
      minOrder: Number(newCouponMin),
      description: `${newCouponValue}${newCouponType === 'percentage' ? '%' : '$'} privilege discount on orders over $${newCouponMin}`,
    });
    setCoupons((prev) => [...prev, created]);
    setNewCouponCode('');
  };

  // Delete coupon
  const handleDeleteCoupon = async (id: string) => {
    await api.deleteCoupon(id);
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  // Product modal open
  const openNewProductModal = () => {
    setEditingProduct(null);
    setProdForm({
      name: '',
      category: 'men',
      subcategory: 'Outerwear',
      price: 490,
      originalPrice: 580,
      stock: 12,
      description: 'Handcrafted luxury tailoring with clean lines and bespoke finishing.',
      composition: '100% Virgin Wool & Silk Cupro Lining',
      fit: 'Structured modern silhouette',
      care: 'Specialist dry clean only',
      origin: 'Florence, Italy',
      image1: '/src/assets/images/product_men_tailored_overcoat_1794103593370.jpg',
      image2: '/src/assets/images/product_leather_bomber_1794103594721.jpg',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Obsidian Black', hex: '#0a0a0a' },
        { name: 'Camel Tan', hex: '#a68968' },
      ],
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setProdForm({
      name: product.name,
      category: product.category,
      subcategory: product.subcategory,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      stock: product.stock,
      description: product.description,
      composition: product.details.composition,
      fit: product.details.fit,
      care: product.details.care,
      origin: product.details.origin,
      image1: product.images[0] || '',
      image2: product.images[1] || product.images[0] || '',
      sizes: product.sizes,
      colors: product.colors,
    });
    setIsProductModalOpen(true);
  };

  // Save product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name.trim()) return;

    const payload: Partial<Product> = {
      name: prodForm.name,
      category: prodForm.category,
      subcategory: prodForm.subcategory,
      price: Number(prodForm.price),
      originalPrice: Number(prodForm.originalPrice),
      stock: Number(prodForm.stock),
      description: prodForm.description,
      details: {
        composition: prodForm.composition,
        fit: prodForm.fit,
        care: prodForm.care,
        origin: prodForm.origin,
      },
      images: [prodForm.image1, prodForm.image2].filter(Boolean),
      sizes: prodForm.sizes,
      colors: prodForm.colors,
    };

    if (editingProduct) {
      await api.updateProduct(editingProduct.id, payload);
    } else {
      await api.createProduct(payload);
    }

    await refreshProducts();
    await loadAllAdminData();
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you wish to delete this garment from the store catalog?')) {
      await api.deleteProduct(id);
      await refreshProducts();
      await loadAllAdminData();
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    return o.status === orderStatusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-10">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
              Live Atelier Director Suite
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-zinc-950">
            NOVA Admin Operations
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllAdminData}
            className="px-3.5 py-2 border border-zinc-300 text-xs font-semibold uppercase tracking-wider text-zinc-700 hover:border-zinc-950 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingStats ? 'animate-spin' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>
          <button
            onClick={() => setActiveView('shop')}
            className="px-4 py-2 bg-zinc-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Preview Storefront</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex border-b border-zinc-200 overflow-x-auto gap-8 text-xs font-semibold uppercase tracking-widest text-zinc-500">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'overview' ? 'border-zinc-950 text-zinc-950 font-bold' : 'border-transparent hover:text-zinc-950'
          }`}
        >
          Overview & Sales
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'products' ? 'border-zinc-950 text-zinc-950 font-bold' : 'border-transparent hover:text-zinc-950'
          }`}
        >
          Product Management ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'orders' ? 'border-zinc-950 text-zinc-950 font-bold' : 'border-transparent hover:text-zinc-950'
          }`}
        >
          Order Fulfillment ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`pb-3 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'coupons' ? 'border-zinc-950 text-zinc-950 font-bold' : 'border-transparent hover:text-zinc-950'
          }`}
        >
          Coupons & Discounts ({coupons.length})
        </button>
        <button
          onClick={() => setActiveTab('subscribers')}
          className={`pb-3 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'subscribers' ? 'border-zinc-950 text-zinc-950 font-bold' : 'border-transparent hover:text-zinc-950'
          }`}
        >
          Subscribers ({subscribers.length})
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-10">
          
          {/* KPI Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-6 border border-zinc-200">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
                Total Gross Sales
              </span>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950 tabular-nums">
                ${stats.totalRevenue.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+24.6% vs previous cycle</span>
              </span>
            </div>

            <div className="bg-white p-6 border border-zinc-200">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
                Active Client Orders
              </span>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950 tabular-nums">
                {stats.totalOrders}
              </div>
              <span className="text-[11px] text-zinc-500 font-medium mt-1">
                {stats.pendingOrdersCount} awaiting dispatch
              </span>
            </div>

            <div className="bg-white p-6 border border-zinc-200">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
                Cataloged Garments
              </span>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950 tabular-nums">
                {stats.totalProducts}
              </div>
              <span className="text-[11px] text-zinc-500 font-medium mt-1">
                Across 4 luxury categories
              </span>
            </div>

            <div className="bg-white p-6 border border-zinc-200">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
                Inventory Alerts
              </span>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-700 tabular-nums">
                {stats.lowStockCount}
              </div>
              <span className="text-[11px] text-amber-800 font-medium mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Garments with stock &lt; 10</span>
              </span>
            </div>
          </div>

          {/* Revenue Analytics Chart (Visual Bar Representation) */}
          <div className="bg-white p-6 sm:p-8 border border-zinc-200">
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-zinc-100">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-950">
                  Fiscal Revenue Performance
                </h3>
                <p className="text-xs text-zinc-500">Monthly gross volume and order velocity</p>
              </div>
              <span className="text-xs font-mono font-bold text-zinc-950">
                Average Order Value: $580
              </span>
            </div>

            {/* Bar chart */}
            <div className="grid grid-cols-6 gap-4 sm:gap-8 items-end h-48 pt-6">
              {stats.revenueAnalytics.map((item: any) => {
                const max = 50000;
                const heightPercent = Math.min(100, Math.round((item.revenue / max) * 100));
                return (
                  <div key={item.month} className="flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-[10px] font-mono text-zinc-500 tabular-nums">
                      ${Math.round(item.revenue / 1000)}k
                    </span>
                    <div
                      className="w-full bg-zinc-950 hover:bg-zinc-700 transition-all rounded-xs"
                      style={{ height: `${heightPercent}%` }}
                      title={`${item.month}: $${item.revenue.toLocaleString()} (${item.orders} orders)`}
                    />
                    <span className="text-xs font-semibold text-zinc-700">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Low Stock Watchlist */}
          {stats.lowStockProducts.length > 0 && (
            <div className="bg-amber-50/60 p-6 border border-amber-200">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-900">
                  Low Stock Inventory Advisory
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.lowStockProducts.map((p: Product) => (
                  <div key={p.id} className="bg-white p-3 border border-amber-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]} alt="" className="w-10 h-12 object-cover border border-zinc-200" />
                      <div>
                        <h4 className="font-semibold text-zinc-900 line-clamp-1">{p.name}</h4>
                        <span className="text-[11px] text-zinc-500 font-mono">${p.price}</span>
                      </div>
                    </div>
                    <span className="font-bold text-amber-700 bg-amber-50 px-2 py-1 border border-amber-200">
                      {p.stock} left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Tab 2: Products Management */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-serif font-bold text-zinc-950">Active Catalog Management</h2>
              <p className="text-xs text-zinc-500">Edit prices, upload images, update inventory and discounts</p>
            </div>
            <button
              onClick={openNewProductModal}
              className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Garment</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-zinc-200 bg-white">
            <table className="w-full text-xs text-left">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-700 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Garment</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price / Sale</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="w-10 h-13 object-cover border border-zinc-200" />
                        <div>
                          <span className="font-semibold text-zinc-950 block">{p.name}</span>
                          <span className="text-[11px] text-zinc-400 font-mono">Sizes: {p.sizes.join(', ')}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium uppercase text-[11px] text-zinc-600">
                      {p.category} · {p.subcategory}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-zinc-900 font-bold">
                      ${p.price}
                      {p.originalPrice && p.originalPrice > p.price && (
                        <span className="text-zinc-400 line-through text-[11px] ml-2">
                          ${p.originalPrice}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums">
                      <span className={`px-2 py-0.5 font-bold ${
                        p.stock < 10 ? 'bg-amber-100 text-amber-800' : 'text-zinc-900'
                      }`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-zinc-900">{p.rating} ★</span>
                      <span className="text-zinc-400 text-[11px]"> ({p.reviewsCount})</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditProductModal(p)}
                          className="p-1.5 text-zinc-600 hover:text-zinc-950 border border-zinc-200 hover:border-zinc-400 cursor-pointer"
                          title="Edit Garment"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-rose-600 hover:text-rose-800 border border-rose-200 hover:border-rose-400 cursor-pointer"
                          title="Delete Garment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-serif font-bold text-zinc-950">Client Order Fulfillment</h2>
              <p className="text-xs text-zinc-500">Update live shipment states and accept or cancel client orders</p>
            </div>

            {/* Filter by status */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 uppercase tracking-wider">Status:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-white border border-zinc-300 px-3 py-1.5 text-xs text-zinc-800 focus:outline-none"
              >
                <option value="all">All Orders ({orders.length})</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto border border-zinc-200 bg-white">
            <table className="w-full text-xs text-left">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-700 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Garments</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-zinc-50">
                    <td className="py-3 px-4 font-mono font-bold text-zinc-950">
                      {o.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-zinc-900 block">{o.customer.fullName}</span>
                      <span className="text-[11px] text-zinc-400 font-mono">{o.customer.email}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-zinc-800">{o.items.length} item(s)</span>
                      <span className="text-[11px] text-zinc-400 block line-clamp-1">
                        {o.items.map((i) => i.name).join(', ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold tabular-nums text-zinc-950">
                      ${o.total.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 capitalize font-mono text-[11px] text-zinc-600">
                      {o.paymentMethod.toUpperCase()} · {o.paymentStatus}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        o.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                        o.status === 'shipped' ? 'bg-sky-100 text-sky-800' :
                        o.status === 'processing' ? 'bg-amber-100 text-amber-800' :
                        o.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                        'bg-zinc-100 text-zinc-800'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                        className="bg-zinc-50 border border-zinc-300 px-2 py-1 text-xs text-zinc-800 font-semibold focus:outline-none cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Coupons */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Create coupon */}
          <div className="lg:col-span-5 bg-white p-6 border border-zinc-200">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-950 mb-4 pb-2 border-b border-zinc-100">
              Create Promotional Privilege
            </h3>
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. VIP25"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  className="w-full bg-zinc-50 border border-zinc-300 p-2.5 text-xs font-mono uppercase focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-1">
                    Discount Type
                  </label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full bg-zinc-50 border border-zinc-300 p-2.5 text-xs focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Cash ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-1">
                    Value
                  </label>
                  <input
                    type="number"
                    value={newCouponValue}
                    onChange={(e) => setNewCouponValue(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-300 p-2.5 text-xs font-mono focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-1">
                  Minimum Order ($)
                </label>
                <input
                  type="number"
                  value={newCouponMin}
                  onChange={(e) => setNewCouponMin(Number(e.target.value))}
                  className="w-full bg-zinc-50 border border-zinc-300 p-2.5 text-xs font-mono focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-zinc-950 text-white text-xs uppercase font-semibold tracking-wider hover:bg-zinc-800 cursor-pointer"
              >
                Create Discount Code
              </button>
            </form>
          </div>

          {/* Active coupon list */}
          <div className="lg:col-span-7 bg-white p-6 border border-zinc-200">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-950 mb-4 pb-2 border-b border-zinc-100">
              Active Privilege Codes ({coupons.length})
            </h3>
            <div className="divide-y divide-zinc-100">
              {coupons.map((c) => (
                <div key={c.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-zinc-950 text-sm">{c.code}</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                        {c.discountType === 'percentage' ? `${c.value}% OFF` : `$${c.value} OFF`}
                      </span>
                    </div>
                    <p className="text-zinc-500 text-[11px] mt-0.5">{c.description}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteCoupon(c.id)}
                    className="text-zinc-400 hover:text-rose-600 p-1 cursor-pointer"
                    title="Delete coupon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 5: Subscribers */}
      {activeTab === 'subscribers' && (
        <div className="bg-white p-6 border border-zinc-200 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-950">
                Nova Circle Newsletter Members
              </h2>
              <p className="text-xs text-zinc-500">Clients subscribed to private seasonal launches and lookbooks</p>
            </div>
            <button
              onClick={() => {
                const csv = 'Email,SubscribedAt\n' + subscribers.map((s) => `${s.email},${s.subscribedAt}`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'nova_fashion_subscribers.csv';
                a.click();
              }}
              className="px-3 py-1.5 border border-zinc-300 text-xs font-semibold uppercase hover:border-zinc-950 cursor-pointer"
            >
              Export CSV
            </button>
          </div>

          <div className="divide-y divide-zinc-100 text-xs font-mono">
            {subscribers.map((s) => (
              <div key={s.id} className="py-2.5 flex items-center justify-between">
                <span className="text-zinc-900">{s.email}</span>
                <span className="text-zinc-400 text-[11px]">
                  {new Date(s.subscribedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setIsProductModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />

          <div className="relative bg-white max-w-2xl w-full p-6 sm:p-8 rounded-xs shadow-2xl z-10 border border-zinc-200">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-zinc-950">
                  {editingProduct ? 'Edit Atelier Garment' : 'Add New Garment to Catalog'}
                </h3>
                <p className="text-xs text-zinc-500">Configure real-time pricing, stock, materials, and visuals</p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-950"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-1">
                    Garment Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={prodForm.name}
                    onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 p-2.5 text-xs text-zinc-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value as any })}
                    className="w-full bg-zinc-50 border border-zinc-300 p-2.5 text-xs text-zinc-900 focus:outline-none"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-1">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    value={prodForm.subcategory}
                    onChange={(e) => setProdForm({ ...prodForm, subcategory: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 p-2.5 text-xs text-zinc-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-1">
                    Selling Price ($) *
                  </label>
                  <input
                    type="number"
                    required
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    className="w-full bg-zinc-50 border border-zinc-300 p-2.5 text-xs font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-1">
                    Stock Units *
                  </label>
                  <input
                    type="number"
                    required
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                    className="w-full bg-zinc-50 border border-zinc-300 p-2.5 text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-1">
                  Primary Image URL
                </label>
                <input
                  type="text"
                  value={prodForm.image1}
                  onChange={(e) => setProdForm({ ...prodForm, image1: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 p-2.5 text-xs font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-1">
                  Editorial Description
                </label>
                <textarea
                  rows={2}
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 p-2.5 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-1">
                    Composition
                  </label>
                  <input
                    type="text"
                    value={prodForm.composition}
                    onChange={(e) => setProdForm({ ...prodForm, composition: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 p-2.5 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-1">
                    Atelier Origin
                  </label>
                  <input
                    type="text"
                    value={prodForm.origin}
                    onChange={(e) => setProdForm({ ...prodForm, origin: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 border border-zinc-300 text-xs uppercase font-semibold text-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white text-xs uppercase tracking-wider font-semibold"
                >
                  {editingProduct ? 'Save Changes' : 'Create Garment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
