import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, Truck, Package, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { api } from '../../services/api';
import { Order } from '../../types';

export const OrderTrackingModal: React.FC = () => {
  const {
    isTrackingModalOpen,
    setIsTrackingModalOpen,
    trackingOrderNumber,
    setTrackingOrderNumber,
  } = useShop();

  const [inputNumber, setInputNumber] = useState(trackingOrderNumber || 'NV-94021');
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isTrackingModalOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputNumber.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const order = await api.getOrder(inputNumber.trim());
      if (order) {
        setOrderData(order);
        setTrackingOrderNumber(order.orderNumber);
      } else {
        setError(`Order ${inputNumber} was not found. Please verify your order number.`);
        setOrderData(null);
      }
    } catch {
      setError('Unable to load order status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: 'placed', label: 'Order Confirmed', icon: CheckCircle2 },
    { key: 'processing', label: 'Tailoring & Packaging', icon: Package },
    { key: 'shipped', label: 'In Transit with Courier', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: Clock },
  ];

  const getStepStatus = (stepKey: string, status: Order['status']) => {
    if (status === 'delivered') return 'complete';
    if (status === 'shipped') {
      if (stepKey === 'delivered') return 'pending';
      return 'complete';
    }
    if (status === 'processing') {
      if (stepKey === 'placed') return 'complete';
      if (stepKey === 'processing') return 'current';
      return 'pending';
    }
    if (status === 'pending') {
      if (stepKey === 'placed') return 'current';
      return 'pending';
    }
    return 'pending';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div onClick={() => setIsTrackingModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />

      <div className="relative bg-white max-w-xl w-full p-6 sm:p-8 rounded-xs shadow-2xl z-10 border border-zinc-200">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
          <div>
            <h3 className="text-lg font-serif font-bold text-zinc-950">Concierge Order Tracking</h3>
            <p className="text-xs text-zinc-500">Live international shipment & tailoring telemetry</p>
          </div>
          <button
            onClick={() => setIsTrackingModalOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-zinc-950 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input */}
        <form onSubmit={handleSearch} className="my-6">
          <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-2">
            Enter Order Reference
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. NV-94021"
              value={inputNumber}
              onChange={(e) => setInputNumber(e.target.value)}
              className="flex-1 bg-zinc-50 border border-zinc-300 px-3.5 py-2.5 text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-zinc-900"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-zinc-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Track</span>
            </button>
          </div>
          <p className="text-[11px] text-zinc-400 mt-2">
            Demo order numbers: <button type="button" onClick={() => setInputNumber('NV-94021')} className="underline hover:text-zinc-900">NV-94021</button> (Delivered), <button type="button" onClick={() => setInputNumber('NV-94022')} className="underline hover:text-zinc-900">NV-94022</button> (Shipped), <button type="button" onClick={() => setInputNumber('NV-94023')} className="underline hover:text-zinc-900">NV-94023</button> (Processing)
          </p>
        </form>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700 mb-4">
            {error}
          </div>
        )}

        {/* Order Details Result */}
        {orderData && (
          <div className="space-y-6 pt-2 border-t border-zinc-200">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-50 p-4 border border-zinc-200 text-xs">
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase tracking-wider">Order No.</span>
                <span className="font-mono font-bold text-zinc-950 text-sm">{orderData.orderNumber}</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase tracking-wider">Tracking Code</span>
                <span className="font-mono text-zinc-800">{orderData.trackingNumber}</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase tracking-wider">Recipient</span>
                <span className="font-medium text-zinc-800">{orderData.customer.fullName}</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase tracking-wider">Current Status</span>
                <span className="font-bold text-zinc-950 capitalize">{orderData.status}</span>
              </div>
            </div>

            {/* Stepper */}
            <div>
              <span className="text-xs font-semibold text-zinc-900 uppercase tracking-widest block mb-4">
                Shipment Milestones
              </span>
              <div className="space-y-3">
                {orderData.timeline.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-950 mt-1 shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between font-semibold text-zinc-900">
                        <span>{item.status}</span>
                        <span className="text-zinc-400 font-mono text-[11px]">{item.time}</span>
                      </div>
                      <p className="text-zinc-500 text-[11px] mt-0.5">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items summary */}
            <div className="border-t border-zinc-200 pt-4">
              <span className="text-xs font-semibold text-zinc-900 uppercase tracking-widest block mb-3">
                Contents ({orderData.items.length})
              </span>
              <div className="divide-y divide-zinc-100">
                {orderData.items.map((it) => (
                  <div key={it.id} className="py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={it.image} alt="" className="w-10 h-12 object-cover border border-zinc-200" />
                      <div>
                        <span className="font-medium text-zinc-900">{it.name}</span>
                        <span className="text-zinc-400 block text-[11px]">
                          Qty: {it.quantity} · Size: {it.size} · {it.color}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-zinc-950 tabular-nums">
                      ${(it.price * it.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
