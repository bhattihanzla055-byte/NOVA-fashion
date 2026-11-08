import React from 'react';
import { CheckCircle2, Package, Truck, ArrowRight, Printer, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const OrderConfirmationPage: React.FC = () => {
  const { lastCreatedOrder, setActiveView, setIsTrackingModalOpen, setTrackingOrderNumber } = useShop();

  if (!lastCreatedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-serif font-bold text-zinc-950 mb-4">No Recent Order Found</h2>
        <button
          onClick={() => setActiveView('shop')}
          className="px-6 py-3 bg-zinc-950 text-white text-xs uppercase font-semibold"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  const order = lastCreatedOrder;

  const handleTrackClick = () => {
    setTrackingOrderNumber(order.orderNumber);
    setIsTrackingModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      
      {/* Success Badge & Headline */}
      <div className="text-center space-y-4 pb-12 border-b border-zinc-200">
        <div className="w-16 h-16 bg-zinc-950 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500 block">
          Order Confirmed & Atelier Dispatched
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-zinc-950">
          Thank You, {order.customer.fullName}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 max-w-lg mx-auto leading-relaxed">
          Your order has been officially received. Our master tailoring team has begun garment preparation and inspection. A receipt has been dispatched to <strong className="text-zinc-900">{order.customer.email}</strong>.
        </p>

        {/* Quick Order Number Box */}
        <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-zinc-50 border border-zinc-200 p-4 mt-6">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 block">Order Number</span>
            <span className="font-mono text-lg font-bold text-zinc-950">{order.orderNumber}</span>
          </div>
          <span className="hidden sm:inline text-zinc-300">|</span>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 block">Tracking Identifier</span>
            <span className="font-mono text-xs text-zinc-700">{order.trackingNumber}</span>
          </div>
          <button
            onClick={handleTrackClick}
            className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs uppercase font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Track Shipment</span>
          </button>
        </div>
      </div>

      {/* Order Details & Summary */}
      <div className="py-10 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-zinc-200">
        
        {/* Left: Destination & Payment */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-950 mb-2">
              Delivery Destination
            </h3>
            <p className="text-xs text-zinc-700 leading-relaxed font-mono">
              {order.customer.fullName}<br />
              {order.customer.address}<br />
              {order.customer.city}, {order.customer.postalCode}<br />
              {order.customer.country}<br />
              Tel: {order.customer.phone}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-950 mb-2">
              Payment Method
            </h3>
            <p className="text-xs text-zinc-700 capitalize">
              {order.paymentMethod === 'cod' && 'Cash on Delivery (Courier Collection)'}
              {order.paymentMethod === 'card' && 'Credit / Debit Card (Authorized)'}
              {order.paymentMethod === 'bank' && 'Direct Bank Wire Transfer'}
            </p>
            <span className="text-[11px] text-zinc-500 font-mono">Status: {order.paymentStatus.toUpperCase()}</span>
          </div>
        </div>

        {/* Right: Estimated Arrival */}
        <div className="bg-zinc-50 p-6 border border-zinc-200 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
              Estimated Delivery
            </span>
            <h4 className="text-xl font-serif font-bold text-zinc-950 mb-2">
              3 - 5 Business Days
            </h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Your garments will arrive in Nova bespoke presentation packaging with cedar garment covers and official certificate of authenticity.
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-200 flex items-center gap-2 text-xs text-zinc-500">
            <ShieldCheck className="w-4 h-4 text-zinc-700 shrink-0" />
            <span>Fully insured transit with doorstep signature verification</span>
          </div>
        </div>
      </div>

      {/* Itemized Garments List */}
      <div className="py-10 border-b border-zinc-200">
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-950 mb-4">
          Order Contents ({order.items.length})
        </h3>
        <div className="divide-y divide-zinc-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-4">
                <img src={item.image} alt="" className="w-14 h-18 object-cover border border-zinc-200" />
                <div>
                  <h4 className="font-semibold text-zinc-950 text-sm leading-snug">{item.name}</h4>
                  <span className="text-zinc-500 text-xs block mt-0.5">
                    Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                  </span>
                </div>
              </div>
              <span className="font-bold text-zinc-950 tabular-nums text-sm">
                ${(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Totals Breakdown */}
        <div className="mt-6 pt-4 border-t border-zinc-200 max-w-xs ml-auto space-y-2 text-xs text-zinc-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-zinc-900 tabular-nums">${order.subtotal.toLocaleString()}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Discount</span>
              <span className="tabular-nums">-${order.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{order.shipping === 0 ? 'Complimentary' : `$${order.shipping}`}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-zinc-950 pt-2 border-t border-zinc-200">
            <span>Total Paid</span>
            <span className="tabular-nums">${order.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => window.print()}
          className="px-5 py-2.5 border border-zinc-300 text-xs font-semibold uppercase tracking-wider text-zinc-700 hover:text-zinc-950 flex items-center gap-2 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Receipt</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('account')}
            className="px-6 py-3 border border-zinc-950 text-zinc-950 text-xs uppercase tracking-wider font-semibold hover:bg-zinc-100 cursor-pointer"
          >
            View In Account
          </button>
          <button
            onClick={() => setActiveView('shop')}
            className="px-6 py-3 bg-zinc-950 hover:bg-zinc-800 text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-2 cursor-pointer"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
