import React, { useState } from 'react';
import { Mail, Check, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please provide a valid email address');
      return;
    }
    setStatus('loading');
    try {
      const res = await api.subscribeNewsletter(email);
      setStatus('success');
      setMessage(`${res.message}. Use code NOVA10 at checkout for 10% off your first purchase.`);
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <section className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500 mb-2 block">
          Private Client Privilege
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-zinc-950 mb-4 tracking-tight">
          Join The Nova Circle
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600 max-w-lg mx-auto leading-relaxed mb-8">
          Receive confidential runway previews, private bespoke atelier access, and 10% privilege on your debut order with code <strong className="text-zinc-950">NOVA10</strong>.
        </p>

        {status === 'success' ? (
          <div className="bg-zinc-50 border border-zinc-200 p-6 max-w-md mx-auto text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
              <Check className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-zinc-950">Privilege Activated</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                className="w-full bg-zinc-50 border border-zinc-300 pl-10 pr-4 py-3.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-8 py-3.5 bg-zinc-950 text-white text-xs uppercase tracking-widest font-semibold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{status === 'loading' ? 'Joining...' : 'Subscribe'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="text-xs text-rose-600 mt-3">{message}</p>
        )}

        <p className="text-[11px] text-zinc-400 mt-4">
          By subscribing, you agree to receive communications regarding Nova Fashion collections. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};
