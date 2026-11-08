import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, MapPin, Check, Send, ChevronDown } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'Bespoke Sizing Consultation',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
      setForm({ name: '', email: '', subject: 'Bespoke Sizing Consultation', message: '' });
      setTimeout(() => setStatus('idle'), 4000);
    }, 750);
  };

  const faqs = [
    {
      q: 'How does Nova Fashion handle international delivery and customs duties?',
      a: 'We offer complimentary express delivery via DHL on all orders over $200. All import duties, taxes, and customs clearance fees are prepaid by Nova Fashion—there are zero hidden charges upon arrival.',
    },
    {
      q: 'What is your return and bespoke exchange policy?',
      a: 'We provide 30-day complimentary worldwide returns and exchanges. Every package includes a prepaid return DHL courier airway bill. Garments must remain unworn with security tags intact.',
    },
    {
      q: 'Can I request private atelier tailoring or custom sizing?',
      a: 'Yes. Our Paris and Milan ateliers provide bespoke garment alterations and adjustments for private clients. Please contact our concierge team with your order reference and requirements.',
    },
    {
      q: 'Are all garments produced sustainably?',
      a: 'All our virgin wool, cashmere, and mulberry silks are 100% natural and sourced from certified European mills. We produce in strictly limited runs of 150 pieces per style to eradicate overproduction.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500 mb-2 block">
          Client Concierge
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-zinc-950 mb-3">
          Contact Our Concierge
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-light">
          Whether you require bespoke sizing guidance, private appointment booking at our flagship salons, or garment tracking support, our dedicated concierge team is at your service.
        </p>
      </div>

      {/* Main Grid: Form (7 cols) + Direct Channels (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 border border-zinc-200">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-950 mb-6 pb-2 border-b border-zinc-100">
            Send An Inquiry
          </h2>

          {status === 'success' ? (
            <div className="p-8 bg-zinc-50 border border-zinc-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-base font-serif font-bold text-zinc-950">Inquiry Received</h3>
              <p className="text-xs text-zinc-600 max-w-md mx-auto">
                Thank you for contacting Nova Fashion. A dedicated concierge specialist will respond to your inquiry within 4 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Julian Sterling"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 p-3 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="julian@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 p-3 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-1.5">
                  Subject / Nature of Inquiry
                </label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 p-3 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950"
                >
                  <option value="Bespoke Sizing Consultation">Bespoke Sizing Consultation</option>
                  <option value="Private Atelier Appointment">Private Atelier Appointment (Paris / Milan)</option>
                  <option value="Order Tracking Assistance">Order Tracking & Delivery Inquiry</option>
                  <option value="Press & Editorial Inquiries">Press & Editorial Inquiries</option>
                  <option value="Other Concierge Request">Other Concierge Request</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-1.5">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Detail your request or order reference number..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 p-3 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-4 bg-zinc-950 hover:bg-zinc-800 text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                {status === 'sending' ? (
                  <span>Transmitting...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Confidential Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Direct Channels & Flagship Boutiques */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Quick Channels Card */}
          <div className="bg-zinc-50 p-6 sm:p-8 border border-zinc-200 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-950 pb-2 border-b border-zinc-200">
              Direct Concierge Channels
            </h3>

            {/* WhatsApp */}
            <a
              href="https://wa.me/33142685500?text=Hello%20Nova%20Fashion%20Concierge,%20I%20would%20like%20assistance%20with%20my%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-white border border-zinc-200 hover:border-emerald-600 transition-colors group cursor-pointer"
            >
              <div className="w-10 h-10 bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-zinc-950 group-hover:text-emerald-700 block">
                  WhatsApp VIP Concierge
                </span>
                <span className="text-[11px] text-zinc-500">Live chat with styling advisor (+33 1 42 68 55 00)</span>
              </div>
            </a>

            {/* Email */}
            <div className="flex items-center gap-3 p-3 bg-white border border-zinc-200">
              <div className="w-10 h-10 bg-zinc-100 text-zinc-900 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-zinc-950 block">Email Client Care</span>
                <a href="mailto:concierge@novafashion.com" className="text-[11px] text-zinc-600 hover:underline">
                  concierge@novafashion.com
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3 p-3 bg-white border border-zinc-200">
              <div className="w-10 h-10 bg-zinc-100 text-zinc-900 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-zinc-950 block">Telephone Hotline</span>
                <span className="text-[11px] text-zinc-600 font-mono">+33 1 42 68 55 00 (CET 9am - 8pm)</span>
              </div>
            </div>
          </div>

          {/* Flagship Boutiques */}
          <div className="bg-white p-6 sm:p-8 border border-zinc-200 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-950 pb-2 border-b border-zinc-100">
              Global Boutiques & Ateliers
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-zinc-950 block">Paris Atelier Vendôme</strong>
                  <span className="text-zinc-500">18 Rue de la Paix, 75002 Paris, France</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-zinc-950 block">Milan Montenapoleone</strong>
                  <span className="text-zinc-500">Via Monte Napoleone 8, 20121 Milano, Italy</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-zinc-950 block">New York Madison</strong>
                  <span className="text-zinc-500">740 Madison Ave, New York, NY 10065</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-zinc-950 block">Tokyo Ginza Maison</strong>
                  <span className="text-zinc-500">6-10-1 Ginza, Chuo-ku, Tokyo 104-0061</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Concierge FAQ Accordion */}
      <section className="pt-8 border-t border-zinc-200">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif font-bold text-zinc-950">
              Frequently Clarified Concierge Questions
            </h2>
          </div>

          <div className="divide-y divide-zinc-200 border border-zinc-200 bg-white">
            {faqs.map((faq, i) => (
              <div key={i} className="p-4 sm:p-6">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left gap-4 cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-semibold text-zinc-950">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-500 transition-transform ${
                      activeFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeFaq === i && (
                  <p className="mt-3 text-xs text-zinc-600 leading-relaxed pt-2 border-t border-zinc-100">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
