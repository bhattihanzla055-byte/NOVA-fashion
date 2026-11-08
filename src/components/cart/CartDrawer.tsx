import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    shipping,
    finalTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setActiveView,
  } = useShop();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ msg: string; isError: boolean } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 200;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setIsApplying(true);
    setCouponFeedback(null);
    const res = await applyCoupon(couponCodeInput);
    setIsApplying(false);
    if (res.success) {
      setCouponFeedback({ msg: res.message, isError: false });
      setCouponCodeInput('');
    } else {
      setCouponFeedback({ msg: res.message, isError: true });
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setActiveView('checkout');
  };

  const handleViewCartClick = () => {
    setIsCartOpen(false);
    setActiveView('cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-zinc-950" />
              <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-950">
                Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-zinc-950 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free shipping progress */}
          <div className="bg-zinc-50 px-6 py-3 border-b border-zinc-200">
            {remainingForFreeShipping > 0 ? (
              <p className="text-xs text-zinc-600 mb-1.5">
                Add <span className="font-semibold text-zinc-900">${remainingForFreeShipping}</span> more for{' '}
                <strong className="text-zinc-950">Complimentary Express Delivery</strong>
              </p>
            ) : (
              <p className="text-xs font-semibold text-emerald-800 mb-1.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                You've unlocked Complimentary Express Delivery!
              </p>
            )}
            <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-zinc-950 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-zinc-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-4 text-zinc-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-serif font-semibold text-zinc-950 mb-1">Your bag is empty</h3>
                <p className="text-xs text-zinc-500 max-w-xs mb-6">
                  Explore our modern luxury collections and discover timeless tailoring crafted for you.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActiveView('shop');
                  }}
                  className="px-6 py-3 bg-zinc-950 text-white text-xs uppercase tracking-widest font-semibold hover:bg-zinc-800 transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  <div className="w-20 h-26 bg-zinc-100 shrink-0 overflow-hidden rounded-xs border border-zinc-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-semibold text-zinc-950 tracking-tight leading-snug line-clamp-2">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-400 hover:text-zinc-950 transition-colors p-0.5 ml-2 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-2">
                        <span>Size: <strong className="text-zinc-800">{item.size}</strong></span>
                        <span>·</span>
                        <span>Color: <strong className="text-zinc-800">{item.color}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-zinc-300 rounded-xs">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold text-zinc-900 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-xs text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-zinc-950 tabular-nums">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Calculations */}
          {cart.length > 0 && (
            <div className="border-t border-zinc-200 px-6 py-5 bg-zinc-50 space-y-4">
              {/* Promo code form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-zinc-100 border border-zinc-200 px-3 py-2 rounded-xs text-xs">
                    <div className="flex items-center gap-1.5 text-zinc-800">
                      <Tag className="w-3.5 h-3.5 text-zinc-600" />
                      <span>Code: <strong>{appliedCoupon.code}</strong> applied (-${discount})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-zinc-500 hover:text-zinc-950 text-[11px] underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. NOVA10)"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      className="flex-1 bg-white border border-zinc-300 px-3 py-2 text-xs uppercase placeholder:normal-case placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900"
                    />
                    <button
                      type="submit"
                      disabled={isApplying}
                      className="px-4 py-2 bg-zinc-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isApplying ? '...' : 'Apply'}
                    </button>
                  </form>
                )}
                {couponFeedback && (
                  <p
                    className={`text-[11px] mt-1.5 ${
                      couponFeedback.isError ? 'text-rose-600' : 'text-emerald-700'
                    }`}
                  >
                    {couponFeedback.msg}
                  </p>
                )}
              </div>

              {/* Price summary */}
              <div className="space-y-1.5 text-xs text-zinc-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-900 tabular-nums">${subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span className="tabular-nums">-${discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{shipping === 0 ? <strong className="text-zinc-900">Complimentary</strong> : `$${shipping}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-zinc-950 pt-2 border-t border-zinc-200">
                  <span>Estimated Total</span>
                  <span className="tabular-nums">${finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3.5 bg-zinc-950 text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleViewCartClick}
                  className="w-full py-2.5 text-xs text-zinc-700 hover:text-zinc-950 uppercase tracking-widest font-semibold text-center border border-zinc-200 hover:border-zinc-400 transition-colors cursor-pointer"
                >
                  View Full Bag
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Encrypted 256-Bit SSL Checkout · Worldwide Concierge Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
