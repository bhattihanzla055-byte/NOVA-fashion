import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';

export const CustomerReviews: React.FC = () => {
  const testimonials = [
    {
      name: 'Alexander Vance',
      role: 'Creative Director',
      city: 'London',
      quote: 'The Brixton Lambskin Bomber is unequivocally the finest leather garment in my wardrobe. The drape is architectural, and the bespoke matte silver zippers feel indestructible.',
      rating: 5,
      item: 'The Brixton Lambskin Bomber',
    },
    {
      name: 'Elena Rostova',
      role: 'Architect & Collector',
      city: 'Paris',
      quote: 'The 30 Momme mulberry silk has noticeable substance that eliminates clinging while skimming the silhouette with poise. Wore it to a private gallery opening and received endless inquiries.',
      rating: 5,
      item: 'Aura Bias-Cut Silk Evening Slip',
    },
    {
      name: 'Julian Sterling',
      role: 'Investment Principal',
      city: 'New York',
      quote: 'Exceptional tailoring. Delivered to Manhattan within 48 hours in luxury unboxing packaging with cedar garment hanger and dust cover. Truly an international luxury standard.',
      rating: 5,
      item: 'Atelier Double-Breasted Cashmere Trench',
    },
  ];

  return (
    <section className="bg-zinc-50 py-20 border-y border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500 mb-2 block">
            Client Voices & Press
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-950 mb-3">
            Acclaimed By Discerning Patrons
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600">
            Reviews from verified clients across Paris, London, Milan, and New York.
          </p>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-8 border border-zinc-200 flex flex-col justify-between shadow-xs transition-transform duration-300 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-zinc-300" />
                </div>
                
                <p className="text-xs text-zinc-700 leading-relaxed italic mb-6">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-950">{item.name}</h4>
                    <span className="text-[11px] text-zinc-500">
                      {item.role} · {item.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </div>
                </div>
                <span className="block text-[10px] text-zinc-400 mt-2 font-mono uppercase">
                  Purchased: {item.item}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Press Badges */}
        <div className="mt-16 pt-10 border-t border-zinc-200 flex flex-wrap items-center justify-center gap-8 sm:gap-16 text-zinc-400 font-serif text-lg tracking-widest uppercase">
          <span className="hover:text-zinc-900 transition-colors">VOGUE</span>
          <span className="hover:text-zinc-900 transition-colors">HARPER'S BAZAAR</span>
          <span className="hover:text-zinc-900 transition-colors">GQ INTERNATIONAL</span>
          <span className="hover:text-zinc-900 transition-colors">ELLE</span>
          <span className="hover:text-zinc-900 transition-colors">L'OFFICIEL</span>
        </div>
      </div>
    </section>
  );
};
