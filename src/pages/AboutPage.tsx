import React from 'react';
import { ArrowRight, Feather, ShieldCheck, Sparkles, Globe } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AboutPage: React.FC = () => {
  const { setActiveView } = useShop();

  return (
    <div className="space-y-16 lg:space-y-24 py-10 lg:py-16">
      
      {/* Hero Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500 mb-2 block">
          The Atelier Heritage
        </span>
        <h1 className="text-3xl sm:text-6xl font-serif font-bold text-zinc-950 mb-6 tracking-tight">
          Quiet Elegance, Architectural Form
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl mx-auto font-light">
          Founded in Paris with production ateliers in Milan and Florence, NOVA FASHION was born from a singular conviction: luxury is not excess, but the disciplined harmony of raw materiality and sublime cut.
        </p>
      </section>

      {/* Visual Break with Generated Campaign Asset */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-900 border border-zinc-200">
          <img
            src="/src/assets/images/banner_seasonal_campaign_1794103595731.jpg"
            alt="Nova Fashion Atelier Story"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 text-white max-w-md">
            <span className="text-[10px] uppercase tracking-widest text-zinc-300 block mb-1">Lookbook No. 14 / Architecture & Cut</span>
            <p className="text-sm font-serif">Monolithic tailoring captured across brutalist concrete facades in Paris.</p>
          </div>
        </div>
      </section>

      {/* Brand Story & Philosophy (2 Column Editorial) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500 mb-2 block">
              Chapter 01
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-zinc-950 leading-tight">
              A Rejection of Fleeting Trends
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-6 text-xs sm:text-sm text-zinc-700 leading-relaxed">
            <p>
              In an era dominated by hyper-accelerated fast fashion and manufactured hype, NOVA FASHION exists as an antidote. We construct garments destined to outlive seasons, cultivating silhouettes that remain as commanding a decade from today as they were on the debut runway.
            </p>
            <p>
              Every seam, pocket welt, and shoulder construction is tested against principles of architectural proportion. We work exclusively with certified family-run mills across Biella, Como, and Hawick who have preserved ancestral weaving traditions for centuries.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Pillars of NOVA FASHION */}
      <section className="bg-zinc-50 py-16 border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500 mb-1 block">
              Our Commitments
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950">
              The Four Pillars of Our Craft
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 border border-zinc-200 space-y-3">
              <Feather className="w-6 h-6 text-zinc-950" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-950">
                1. Traceable Noble Fibers
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Grade-A Mongolian Cashmere, 30 Momme heavy mulberry silk, and cruelty-free certified Merino wool with full fiber transparency.
              </p>
            </div>

            <div className="bg-white p-6 border border-zinc-200 space-y-3">
              <ShieldCheck className="w-6 h-6 text-zinc-950" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-950">
                2. Bespoke Quality
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Finished with horn button closures, cupro linings, hand-pick-stitched lapels, and custom matte silver hardware.
              </p>
            </div>

            <div className="bg-white p-6 border border-zinc-200 space-y-3">
              <Sparkles className="w-6 h-6 text-zinc-950" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-950">
                3. Limited Atelier Batches
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                We produce in deliberate runs of 150 pieces per style to prevent deadstock waste and preserve exclusivity.
              </p>
            </div>

            <div className="bg-white p-6 border border-zinc-200 space-y-3">
              <Globe className="w-6 h-6 text-zinc-950" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-950">
                4. Circular Responsibility
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Plastic-free packaging, reusable cedar dust protection bags, and lifelong garment restoration services at our flagship boutiques.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-zinc-950 mb-4">
          Experience The Autumn / Winter Collection
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 mb-8 max-w-md mx-auto">
          Explore handcrafted coats, fluid silks, and tailored outerwear made for life.
        </p>
        <button
          onClick={() => setActiveView('shop')}
          className="px-8 py-4 bg-zinc-950 hover:bg-zinc-800 text-white text-xs uppercase tracking-widest font-bold inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Shop The Collection</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

    </div>
  );
};
