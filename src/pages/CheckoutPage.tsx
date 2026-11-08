import React, { useState } from 'react';
import { ShieldCheck, Lock, CreditCard, Banknote, Building2, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { api } from '../services/api';
import { OrderCustomer } from '../types';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    subtotal,
    discount,
    appliedCoupon,
    shipping,
    finalTotal,
    clearCart,
    setActiveView,
    setLastCreatedOrder,
    user,
  } = useShop();

  // Form fields
  const [formData, setFormData] = useState<OrderCustomer>({
    fullName: user?.name || 'Julian Sterling',
    email: user?.email || 'julian.sterling@luxury.io',
    phone: user?.phone || '+1 (555) 234-8901',
    address: user?.savedAddresses?.[0]?.address || '740 Park Avenue, Apt 11B',
    city: user?.savedAddresses?.[0]?.city || 'New York',
    postalCode: user?.savedAddresses?.[0]?.postalCode || '10021',
    country: 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'bank'>('card');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8920');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('382');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-serif font-bold text-zinc-950 mb-4">No Items to Checkout</h2>
        <p className="text-xs text-zinc-500 mb-6">Your shopping bag is empty. Please select garments before checkout.</p>
        <button
          onClick={() => setActiveView('shop')}
          className="px-6 py-3 bg-zinc-950 text-white text-xs uppercase tracking-wider font-semibold"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.address.trim()) errs.address = 'Delivery address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.postalCode.trim()) errs.postalCode = 'Postal code is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const order = await api.createOrder({
        customer: formData,
        items: cart,
        subtotal,
        discount,
        couponCode: appliedCoupon?.code,
        shipping,
        total: finalTotal,
        paymentMethod,
      });

      setLastCreatedOrder(order);
      clearCart();
      setActiveView('order-confirmation');
    } catch (err) {
      console.error(err);
      alert('Unable to process order. Please verify connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      {/* Header */}
      <div className="pb-6 border-b border-zinc-200 mb-8 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500 mb-1 block">
            Encrypted Order Dispatch
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-zinc-950">
            Bespoke Checkout
          </h1>
        </div>
        <button
          onClick={() => setActiveView('cart')}
          className="text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bag</span>
        </button>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Form: Delivery & Payment (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section 1: Customer Contact */}
          <div className="bg-white p-6 sm:p-8 border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-950">
                1. Recipient Information
              </h2>
              <span className="text-xs text-zinc-400 font-mono">Step 1 of 3</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Julian Sterling"
                  className={`w-full bg-zinc-50 border p-3 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 ${
                    formErrors.fullName ? 'border-rose-500' : 'border-zinc-300'
                  }`}
                />
                {formErrors.fullName && <p className="text-[11px] text-rose-600 mt-1">{formErrors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="julian.sterling@luxury.io"
                  className={`w-full bg-zinc-50 border p-3 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 ${
                    formErrors.email ? 'border-rose-500' : 'border-zinc-300'
                  }`}
                />
                {formErrors.email && <p className="text-[11px] text-rose-600 mt-1">{formErrors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5">
                  Phone Number (For Courier) *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 234-8901"
                  className={`w-full bg-zinc-50 border p-3 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 ${
                    formErrors.phone ? 'border-rose-500' : 'border-zinc-300'
                  }`}
                />
                {formErrors.phone && <p className="text-[11px] text-rose-600 mt-1">{formErrors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div className="bg-white p-6 sm:p-8 border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-950">
                2. Shipping Destination
              </h2>
              <span className="text-xs text-zinc-400 font-mono">Step 2 of 3</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5">
                  Street Address & Apartment / Suite *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="740 Park Avenue, Apt 11B"
                  className={`w-full bg-zinc-50 border p-3 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 ${
                    formErrors.address ? 'border-rose-500' : 'border-zinc-300'
                  }`}
                />
                {formErrors.address && <p className="text-[11px] text-rose-600 mt-1">{formErrors.address}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="New York"
                    className={`w-full bg-zinc-50 border p-3 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 ${
                      formErrors.city ? 'border-rose-500' : 'border-zinc-300'
                    }`}
                  />
                  {formErrors.city && <p className="text-[11px] text-rose-600 mt-1">{formErrors.city}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="10021"
                    className={`w-full bg-zinc-50 border p-3 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 ${
                      formErrors.postalCode ? 'border-rose-500' : 'border-zinc-300'
                    }`}
                  />
                  {formErrors.postalCode && <p className="text-[11px] text-rose-600 mt-1">{formErrors.postalCode}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5">
                    Country
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 p-3 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950"
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="France">France</option>
                    <option value="Italy">Italy</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Japan">Japan</option>
                    <option value="Germany">Germany</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="bg-white p-6 sm:p-8 border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-950">
                3. Payment Method
              </h2>
              <span className="text-xs text-zinc-400 font-mono">Step 3 of 3</span>
            </div>

            <div className="space-y-3">
              {/* Option 1: Credit / Debit Card */}
              <label
                className={`p-4 border block cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-zinc-950 bg-zinc-50/70 ring-1 ring-zinc-950'
                    : 'border-zinc-200 hover:border-zinc-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="accent-zinc-950"
                    />
                    <CreditCard className="w-4 h-4 text-zinc-950" />
                    <div>
                      <span className="text-xs font-bold text-zinc-950 block">Credit / Debit Card</span>
                      <span className="text-[11px] text-zinc-500">Instant authorization via 256-Bit SSL</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 text-[10px] font-mono text-zinc-400">
                    <span>VISA</span>
                    <span>·</span>
                    <span>MC</span>
                    <span>·</span>
                    <span>AMEX</span>
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <div className="mt-4 pt-4 border-t border-zinc-200 space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white border border-zinc-300 p-2.5 text-xs font-mono text-zinc-900 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                          Expiry MM/YY
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-white border border-zinc-300 p-2.5 text-xs font-mono text-zinc-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                          Security CVC
                        </label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full bg-white border border-zinc-300 p-2.5 text-xs font-mono text-zinc-900 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </label>

              {/* Option 2: Cash on Delivery (COD) */}
              <label
                className={`p-4 border block cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-zinc-950 bg-zinc-50/70 ring-1 ring-zinc-950'
                    : 'border-zinc-200 hover:border-zinc-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-zinc-950"
                  />
                  <Banknote className="w-4 h-4 text-zinc-950" />
                  <div>
                    <span className="text-xs font-bold text-zinc-950 block">Cash on Delivery (COD)</span>
                    <span className="text-[11px] text-zinc-500">Pay cash directly to the courier upon garment delivery</span>
                  </div>
                </div>
                {paymentMethod === 'cod' && (
                  <p className="mt-3 text-[11px] text-zinc-600 bg-white p-3 border border-zinc-200 leading-relaxed">
                    Our concierge courier will contact your phone ({formData.phone || 'provided above'}) prior to arrival. Please ensure exact payment is ready upon signature.
                  </p>
                )}
              </label>

              {/* Option 3: Direct Bank Wire Transfer */}
              <label
                className={`p-4 border block cursor-pointer transition-all ${
                  paymentMethod === 'bank'
                    ? 'border-zinc-950 bg-zinc-50/70 ring-1 ring-zinc-950'
                    : 'border-zinc-200 hover:border-zinc-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'bank'}
                    onChange={() => setPaymentMethod('bank')}
                    className="accent-zinc-950"
                  />
                  <Building2 className="w-4 h-4 text-zinc-950" />
                  <div>
                    <span className="text-xs font-bold text-zinc-950 block">Direct Bank Wire Transfer</span>
                    <span className="text-[11px] text-zinc-500">Bespoke international client wire to Nova Private Treasury</span>
                  </div>
                </div>
                {paymentMethod === 'bank' && (
                  <div className="mt-3 p-3 bg-white border border-zinc-200 text-xs font-mono space-y-1 text-zinc-800">
                    <p><strong>Bank:</strong> BNP Paribas Private Banking, Paris</p>
                    <p><strong>Beneficiary:</strong> NOVA FASHION S.A.</p>
                    <p><strong>IBAN:</strong> FR76 3000 4000 8900 1234 5678 901</p>
                    <p><strong>SWIFT/BIC:</strong> BNPAFRPAXXX</p>
                    <p className="text-[10px] text-zinc-500 font-sans mt-2">
                      Please use your Order Number as payment reference once placed.
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5 bg-zinc-50 p-6 sm:p-8 border border-zinc-200 lg:sticky lg:top-24 space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-zinc-200">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-950">
              Garments in Order ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h2>
            <button
              type="button"
              onClick={() => setActiveView('cart')}
              className="text-xs text-zinc-500 hover:text-zinc-950 underline"
            >
              Edit Bag
            </button>
          </div>

          {/* Items preview */}
          <div className="divide-y divide-zinc-200 max-h-72 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt="" className="w-12 h-16 object-cover border border-zinc-200 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-zinc-950 leading-snug line-clamp-1">{item.name}</h4>
                    <span className="text-zinc-500 block text-[11px]">
                      Size: {item.size} · {item.color} · Qty: {item.quantity}
                    </span>
                  </div>
                </div>
                <span className="font-bold text-zinc-950 tabular-nums shrink-0">
                  ${(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing calculations */}
          <div className="space-y-2.5 pt-4 border-t border-zinc-200 text-xs text-zinc-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-zinc-900 tabular-nums">${subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Discount ({appliedCoupon?.code})</span>
                <span className="tabular-nums">-${discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Express Insured Shipping</span>
              <span>{shipping === 0 ? <strong className="text-zinc-950">Complimentary</strong> : `$${shipping}`}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-zinc-950 pt-3 border-t border-zinc-200">
              <span>Total Payable</span>
              <span className="tabular-nums">${finalTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-zinc-950 hover:bg-zinc-800 text-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-colors shadow-lg cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Authorizing Order...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Authorize & Place Order</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="p-3 bg-white border border-zinc-200 text-[11px] text-zinc-500 space-y-1.5">
            <div className="flex items-center gap-2 text-zinc-800 font-medium">
              <ShieldCheck className="w-4 h-4 text-zinc-950" />
              <span>Nova Concierge Delivery Commitment</span>
            </div>
            <p className="leading-relaxed">
              Every garment is individually inspected by our Parisian atelier, packed with signature garment covers, and tracked in real-time.
            </p>
          </div>
        </div>

      </form>
    </div>
  );
};
