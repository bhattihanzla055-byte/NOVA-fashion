import React from 'react';
import { ArrowRight, Sparkles, Shield, Compass, Feather } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const HeroSection: React.FC = () => {
  const { setActiveView } = useShop();

  return (
    <section className="relative bg-zinc-950 text-white overflow-hidden">
      {/* Hero Split Layout */}
      <div className="max-w-7xl mx-auto min-h-[82vh] grid grid-cols-1 lg:grid-cols-12 items-center">
        
        {/* Left Column: Editorial Headline & Actions */}
        <div className="lg:col-span-5 px-6 sm:px-12 py-16 lg:py-24 z-10 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400 mb-6">
            <span className="w-8 h-[1px] bg-zinc-400" />
            <span>Autumn / Winter '26 Collection</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-white leading-[1.05] mb-6 text-balance">
            WEAR YOUR STYLE
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed mb-8 max-w-md">
            Discover the latest fashion trends with premium quality clothing. Architectural silhouettes sculpted in pure cashmere, silk, and vegetable-tanned Italian leather.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={() => setActiveView('shop')}
              className="px-8 py-4 bg-white text-zinc-950 text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2.5 hover:bg-zinc-200 transition-colors shadow-lg cursor-pointer"
            >
              <span>SHOP NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveView('about')}
              className="px-8 py-4 bg-transparent text-white border border-zinc-700 text-xs uppercase tracking-widest font-semibold flex items-center justify-center hover:border-white transition-colors cursor-pointer"
            >
              <span>EXPLORE ATELIER</span>
            </button>
          </div>

          {/* Social Proof Metric in Hero */}
          <div className="mt-12 pt-8 border-t border-zinc-800/80 flex items-center gap-8 text-xs text-zinc-400">
            <div>
              <span className="font-serif text-2xl font-bold text-white block">100%</span>
              <span className="text-[11px] uppercase tracking-wider text-zinc-500">Natural Fibers</span>
            </div>
            <div className="h-8 w-[1px] bg-zinc-800" />
            <div>
              <span className="font-serif text-2xl font-bold text-white block">4.9 / 5.0</span>
              <span className="text-[11px] uppercase tracking-wider text-zinc-500">Client Rating</span>
            </div>
            <div className="h-8 w-[1px] bg-zinc-800" />
            <div>
              <span className="font-serif text-2xl font-bold text-white block">Paris & Milan</span>
              <span className="text-[11px] uppercase tracking-wider text-zinc-500">Design Ateliers</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero High-Fashion Visual */}
        <div className="lg:col-span-7 relative h-[500px] lg:h-full min-h-[550px] overflow-hidden bg-zinc-900">
          <img
            src="/src/assets/images/hero_fashion_luxury_1794103592653.jpg"
            alt="Nova Fashion Runway Trench Collection"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center lg:object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent lg:bg-gradient-to-r lg:from-zinc-950 lg:via-transparent lg:to-transparent opacity-80 lg:opacity-60" />
          
          <div className="absolute bottom-6 right-6 hidden sm:block bg-zinc-950/80 backdrop-blur-md border border-zinc-800 p-4 max-w-xs text-left">
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 block mb-1">Look No. 01 / Runway</span>
            <p className="text-xs font-serif text-white">The Atelier Double-Breasted Cashmere Trench in Midnight Charcoal</p>
          </div>
        </div>
      </div>

      {/* Trust & Craftsmanship Bar (Below Hero) */}
      <div className="border-t border-zinc-800 bg-zinc-900/60 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex items-center gap-3">
              <Feather className="w-5 h-5 text-zinc-400 shrink-0 hidden sm:block" />
              <div>
                <span className="text-xs font-semibold text-white uppercase tracking-wider block">Artisanal Tailoring</span>
                <span className="text-[11px] text-zinc-400">Crafted in Florence & Milan</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-zinc-400 shrink-0 hidden sm:block" />
              <div>
                <span className="text-xs font-semibold text-white uppercase tracking-wider block">Pure Noble Fibers</span>
                <span className="text-[11px] text-zinc-400">Mongolian Cashmere & Mulberry Silk</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Compass className="w-5 h-5 text-zinc-400 shrink-0 hidden sm:block" />
              <div>
                <span className="text-xs font-semibold text-white uppercase tracking-wider block">Express Global Delivery</span>
                <span className="text-[11px] text-zinc-400">Complimentary on orders $200+</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-zinc-400 shrink-0 hidden sm:block" />
              <div>
                <span className="text-xs font-semibold text-white uppercase tracking-wider block">Bespoke Concierge</span>
                <span className="text-[11px] text-zinc-400">30-day effortless exchanges</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
