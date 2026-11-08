import React, { useState, useEffect } from 'react';
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Clock,
  Truck,
  LogOut,
  Shield,
  Check,
  ChevronRight,
  Plus,
  Trash2,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { api } from '../services/api';
import { Order, Product } from '../types';
import { ProductCard } from '../components/product/ProductCard';

export const AccountPage: React.FC = () => {
  const {
    user,
    login,
    logout,
    switchUserRole,
    wishlist,
    products,
    setActiveView,
    setIsTrackingModalOpen,
    setTrackingOrderNumber,
    setLastCreatedOrder,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile' | 'addresses'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Auth form states
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [emailInput, setEmailInput] = useState('julian.sterling@luxury.io');
  const [passwordInput, setPasswordInput] = useState('••••••••');
  const [nameInput, setNameInput] = useState('Julian Sterling');
  const [authMsg, setAuthMsg] = useState<string | null>(null);

  // Profile edit states
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '+1 (555) 234-8901');
  const [profileSaved, setProfileSaved] = useState(false);

  // Load user orders
  useEffect(() => {
    if (user?.email) {
      setLoadingOrders(true);
      api.getOrders(user.role === 'admin' ? undefined : user.email)
        .then((data) => setOrders(data))
        .finally(() => setLoadingOrders(false));
    }
  }, [user]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    try {
      await login(emailInput, passwordInput);
      setAuthMsg(null);
    } catch {
      setAuthMsg('Unable to authenticate. Please check your credentials.');
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      user.name = profileName;
      user.phone = profilePhone;
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    }
  };

  const handleTrackOrder = (order: Order) => {
    setTrackingOrderNumber(order.orderNumber);
    setIsTrackingModalOpen(true);
  };

  const handleViewReceipt = (order: Order) => {
    setLastCreatedOrder(order);
    setActiveView('order-confirmation');
  };

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  // If not logged in, show elegant Luxury Auth Form
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500 mb-2 block">
            Atelier Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950">
            {authMode === 'login' && 'Sign In to Your Account'}
            {authMode === 'signup' && 'Create Your Nova Profile'}
            {authMode === 'forgot' && 'Reset Confidential Password'}
          </h1>
          <p className="text-xs text-zinc-500 mt-2">
            Access private order history, bespoke tailoring requests, and curated wishlist.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 border border-zinc-200 shadow-xs">
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 p-3 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-300 p-3 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950"
                required
              />
            </div>

            {authMode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                    Password
                  </label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setAuthMode('forgot')}
                      className="text-[11px] text-zinc-500 hover:text-zinc-950 underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 p-3 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950"
                  required
                />
              </div>
            )}

            {authMsg && <p className="text-xs text-rose-600">{authMsg}</p>}

            <button
              type="submit"
              className="w-full py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
            >
              {authMode === 'login' && 'Sign In'}
              {authMode === 'signup' && 'Create Profile'}
              {authMode === 'forgot' && 'Send Reset Instructions'}
            </button>
          </form>

          {/* Switch auth mode */}
          <div className="mt-6 pt-4 border-t border-zinc-100 text-center text-xs text-zinc-500">
            {authMode === 'login' ? (
              <p>
                New patron?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="font-semibold text-zinc-950 underline cursor-pointer"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="font-semibold text-zinc-950 underline cursor-pointer"
                >
                  Return to sign in
                </button>
              </p>
            )}
          </div>

          {/* Quick Demo Switcher */}
          <div className="mt-6 pt-4 border-t border-zinc-200 bg-zinc-50 -mx-6 -mb-6 p-4 text-center">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-2 font-medium">
              Instant Demo Sign In:
            </span>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => login('julian.sterling@luxury.io')}
                className="px-3 py-1.5 bg-white border border-zinc-300 text-xs text-zinc-800 hover:border-zinc-950 cursor-pointer"
              >
                Sign in as Customer
              </button>
              <button
                type="button"
                onClick={() => login('admin@novafashion.com')}
                className="px-3 py-1.5 bg-zinc-950 text-white text-xs hover:bg-zinc-800 flex items-center gap-1 cursor-pointer"
              >
                <Shield className="w-3 h-3 text-amber-400" />
                <span>Sign in as Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged In Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      
      {/* Account Header */}
      <div className="pb-8 border-b border-zinc-200 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500 mb-1 block">
            Client Portal
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-zinc-950">
            Welcome, {user.name}
          </h1>
          <p className="text-xs text-zinc-500 mt-1 font-mono">{user.email}</p>
        </div>

        <div className="flex items-center gap-3">
          {user.role === 'admin' ? (
            <button
              onClick={() => setActiveView('admin')}
              className="px-4 py-2 bg-amber-600 text-white text-xs uppercase tracking-wider font-semibold hover:bg-amber-700 flex items-center gap-1.5 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </button>
          ) : (
            <button
              onClick={() => switchUserRole('admin')}
              className="px-4 py-2 border border-zinc-300 text-zinc-700 text-xs uppercase tracking-wider font-semibold hover:border-zinc-950 flex items-center gap-1.5 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              <span>Switch to Admin View</span>
            </button>
          )}

          <button
            onClick={logout}
            className="px-4 py-2 border border-zinc-300 text-zinc-600 hover:text-zinc-950 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 mb-8 overflow-x-auto gap-8 text-xs font-semibold uppercase tracking-widest text-zinc-500">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'orders' ? 'border-zinc-950 text-zinc-950 font-bold' : 'border-transparent hover:text-zinc-950'
          }`}
        >
          Order History ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'wishlist' ? 'border-zinc-950 text-zinc-950 font-bold' : 'border-transparent hover:text-zinc-950'
          }`}
        >
          Wishlist ({wishlist.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'profile' ? 'border-zinc-950 text-zinc-950 font-bold' : 'border-transparent hover:text-zinc-950'
          }`}
        >
          Profile Settings
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'addresses' ? 'border-zinc-950 text-zinc-950 font-bold' : 'border-transparent hover:text-zinc-950'
          }`}
        >
          Saved Addresses
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {loadingOrders ? (
            <div className="py-12 text-center text-xs text-zinc-500">Loading order records...</div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center bg-zinc-50 border border-zinc-200 p-8">
              <ShoppingBag className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
              <h3 className="text-base font-serif font-bold text-zinc-950">No orders placed yet</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-6">
                When you purchase garments from Nova Fashion, your orders and tracking records will appear here.
              </p>
              <button
                onClick={() => setActiveView('shop')}
                className="px-6 py-2.5 bg-zinc-950 text-white text-xs uppercase tracking-wider font-semibold"
              >
                Shop Collection
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="border border-zinc-200 bg-white p-6 sm:p-8 space-y-4 shadow-xs">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-100 text-xs">
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase tracking-wider">Order Reference</span>
                    <span className="font-mono font-bold text-zinc-950 text-sm">{order.orderNumber}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase tracking-wider">Date Placed</span>
                    <span className="font-mono text-zinc-700">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase tracking-wider">Total</span>
                    <span className="font-bold text-zinc-950 tabular-nums text-sm">
                      ${order.total.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase tracking-wider">Status</span>
                    <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                      order.status === 'shipped' ? 'bg-sky-100 text-sky-800' :
                      order.status === 'processing' ? 'bg-amber-100 text-amber-800' :
                      'bg-zinc-100 text-zinc-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTrackOrder(order)}
                      className="px-3 py-1.5 bg-zinc-950 text-white text-xs uppercase font-semibold flex items-center gap-1.5 hover:bg-zinc-800 cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track</span>
                    </button>
                    <button
                      onClick={() => handleViewReceipt(order)}
                      className="px-3 py-1.5 border border-zinc-300 text-zinc-700 text-xs uppercase font-semibold hover:border-zinc-950 cursor-pointer"
                    >
                      Receipt
                    </button>
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-zinc-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt="" className="w-12 h-16 object-cover border border-zinc-200" />
                        <div>
                          <h4 className="font-semibold text-zinc-950">{item.name}</h4>
                          <span className="text-zinc-500 text-[11px] block">
                            Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-zinc-950 tabular-nums">
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Wishlist */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistProducts.length === 0 ? (
            <div className="py-16 text-center bg-zinc-50 border border-zinc-200 p-8">
              <Heart className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
              <h3 className="text-base font-serif font-bold text-zinc-950">Your Wishlist is Empty</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-6">
                Save your favorite luxury garments by clicking the heart icon on any product.
              </p>
              <button
                onClick={() => setActiveView('shop')}
                className="px-6 py-2.5 bg-zinc-950 text-white text-xs uppercase tracking-wider font-semibold"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {wishlistProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="max-w-xl bg-white p-6 sm:p-8 border border-zinc-200">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-950 mb-6 pb-2 border-b border-zinc-100">
            Personal Information
          </h3>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-1.5">
                Full Legal Name
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-300 p-3 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-1.5">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-zinc-100 border border-zinc-200 p-3 text-xs text-zinc-500 font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-1.5">
                Mobile Telephone (For Courier Telemetry)
              </label>
              <input
                type="tel"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-300 p-3 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950"
              />
            </div>

            {profileSaved && (
              <p className="text-xs text-emerald-700 flex items-center gap-1 font-semibold">
                <Check className="w-4 h-4" />
                <span>Profile preferences updated successfully.</span>
              </p>
            )}

            <button
              type="submit"
              className="px-6 py-3 bg-zinc-950 hover:bg-zinc-800 text-white text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

      {/* Tab 4: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-6 max-w-2xl">
          <div className="bg-white p-6 border border-zinc-200 flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-950">Primary Residence</span>
                <span className="text-[10px] uppercase font-semibold text-zinc-500 bg-zinc-100 px-1.5 py-0.5">
                  Default
                </span>
              </div>
              <p className="text-xs text-zinc-700 font-mono leading-relaxed">
                {user.savedAddresses?.[0]?.fullName || user.name}<br />
                {user.savedAddresses?.[0]?.address || '740 Park Avenue, Apt 11B'}<br />
                {user.savedAddresses?.[0]?.city || 'New York'}, {user.savedAddresses?.[0]?.postalCode || '10021'}<br />
                {user.savedAddresses?.[0]?.country || 'United States'}<br />
                {user.savedAddresses?.[0]?.phone || user.phone}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
