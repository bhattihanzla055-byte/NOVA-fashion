import React, { useState } from 'react';
import { Trash2, ArrowRight, ArrowLeft, ShoppingBag, ShieldCheck, Tag, Truck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discount,
    shipping,
    finalTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setActiveView,
  } = useShop();

  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; error: boolean } | null>(null);
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setLoadingCoupon(true);
    setCouponMessage(null);
    const res = await applyCoupon(couponCode);
    setLoadingCoupon(false);
    if (res.success) {
      setCouponMessage({ text: res.message, error: false });
      setCouponCode('');
    } else {
      setCouponMessage({ text: res.message, error: true });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-zinc-950 mb-3">
          Your Shopping Bag Is Empty
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto mb-8 leading-relaxed">
          Your luxury bag holds no items at this moment. Explore our latest seasonal arrivals and timeless tailoring pieces.
        </p>
        <button
          onClick={() => setActiveView('shop')}
          className="px-8 py-4 bg-zinc-950 hover:bg-zinc-800 text-white text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  const freeThreshold = 200;
  const remaining = Math.max(0, freeThreshold - subtotal);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="flex items-center justify-between pb-6 border-b border-zinc-200 mb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500 mb-1 block">
            Review Selection
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-zinc-950">
            Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
          </h1>
        </div>
        <button
          onClick={() => setActiveView('shop')}
          className="hidden sm:flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>
      </div>

      {/* Free Delivery Banner */}
      <div className="mb-8 p-4 bg-zinc-50 border border-zinc-200 flex items-center justify-between flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-3">
          <Truck className="w-5 h-5 text-zinc-800" />
          <div>
            {remaining > 0 ? (
              <span className="text-zinc-700">
                Add <strong className="text-zinc-950 font-bold">${remaining}</strong> more to your order for <strong className="text-zinc-950">Complimentary Express Global Delivery</strong>.
              </span>
            ) : (
              <span className="text-emerald-800 font-semibold">
                You qualify for Complimentary Express Delivery with worldwide tracking.
              </span>
            )}
          </div>
        </div>
        <div className="w-36 bg-zinc-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-zinc-950 h-full"
            style={{ width: `${Math.min(100, (subtotal / freeThreshold) * 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Itemized Table (8 cols) */}
        <div className="lg:col-span-8">
          <div className="border border-zinc-200 divide-y divide-zinc-200">
            <div className="hidden sm:grid grid-cols-12 px-6 py-3 bg-zinc-50 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
              <span className="col-span-6">Garment</span>
              <span className="col-span-2 text-center">Unit Price</span>
              <span className="col-span-2 text-center">Quantity</span>
              <span className="col-span-2 text-right">Subtotal</span>
            </div>

            {cart.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                
                {/* Product Info */}
                <div className="sm:col-span-6 flex gap-4">
                  <div className="w-20 h-26 bg-zinc-100 shrink-0 overflow-hidden border border-zinc-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-sm font-semibold text-zinc-950 leading-snug">
                      {item.name}
                    </h3>
                    <div className="text-xs text-zinc-500 mt-1 space-x-2">
                      <span>Size: <strong className="text-zinc-800">{item.size}</strong></span>
                      <span>·</span>
                      <span>Color: <strong className="text-zinc-800">{item.color}</strong></span>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="mt-3 text-xs text-zinc-400 hover:text-rose-600 flex items-center gap-1 transition-colors self-start cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

                {/* Unit Price */}
                <div className="sm:col-span-2 text-left sm:text-center">
                  <span className="text-xs text-zinc-500 sm:hidden">Price: </span>
                  <span className="text-xs font-semibold text-zinc-900 tabular-nums">
                    ${item.price.toLocaleString()}
                  </span>
                </div>

                {/* Quantity */}
                <div className="sm:col-span-2 flex items-center sm:justify-center">
                  <div className="flex items-center border border-zinc-300">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-xs text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold text-zinc-900 tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-xs text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Row Subtotal */}
                <div className="sm:col-span-2 text-right">
                  <span className="text-sm font-bold text-zinc-950 tabular-nums">
                    ${(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>

              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between items-center text-xs">
            <button
              onClick={clearCart}
              className="text-zinc-500 hover:text-rose-600 underline cursor-pointer"
            >
              Clear shopping bag
            </button>
            <span className="text-zinc-400 font-mono">Secure checkout session</span>
          </div>
        </div>

        {/* Order Summary Card (4 cols) */}
        <div className="lg:col-span-4 bg-zinc-50 p-6 sm:p-8 border border-zinc-200 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-950 pb-3 border-b border-zinc-200">
            Order Summary
          </h2>

          {/* Promo code */}
          <div>
            <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-2">
              Promotional Privilege Code
            </label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-white border border-zinc-300 text-xs">
                <div className="flex items-center gap-1.5 text-zinc-900">
                  <Tag className="w-4 h-4 text-emerald-700" />
                  <span><strong>{appliedCoupon.code}</strong> applied (-${discount})</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-zinc-500 hover:text-zinc-950 underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. NOVA10, WELCOME20"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-white border border-zinc-300 px-3 py-2 text-xs uppercase placeholder:normal-case focus:outline-none focus:border-zinc-950"
                />
                <button
                  type="submit"
                  disabled={loadingCoupon}
                  className="px-4 py-2 bg-zinc-950 text-white text-xs uppercase font-semibold hover:bg-zinc-800 disabled:opacity-50 cursor-pointer"
                >
                  {loadingCoupon ? '...' : 'Apply'}
                </button>
              </form>
            )}
            {couponMessage && (
              <p className={`text-xs mt-2 ${couponMessage.error ? 'text-rose-600' : 'text-emerald-700'}`}>
                {couponMessage.text}
              </p>
            )}
          </div>

          {/* Breakdown */}
          <div className="space-y-3 text-xs text-zinc-600 pt-3 border-t border-zinc-200">
            <div className="flex justify-between">
              <span>Garment Subtotal</span>
              <span className="font-semibold text-zinc-900 tabular-nums">${subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Promotional Discount</span>
                <span className="tabular-nums">-${discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Global Delivery</span>
              <span>{shipping === 0 ? <strong className="text-zinc-950 font-bold">Complimentary</strong> : `$${shipping}`}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-zinc-950 pt-3 border-t border-zinc-200">
              <span>Final Total</span>
              <span className="tabular-nums">${finalTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            onClick={() => setActiveView('checkout')}
            className="w-full py-4 bg-zinc-950 hover:bg-zinc-800 text-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="space-y-2 pt-2 text-[11px] text-zinc-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-zinc-700" />
              <span>Complimentary insured shipping on all orders</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-zinc-700" />
              <span>Tax and customs duties included at checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
