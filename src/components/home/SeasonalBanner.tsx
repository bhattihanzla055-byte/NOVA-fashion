import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const SeasonalBanner: React.FC = () => {
  const { setActiveView } = useShop();

  return (
    <section className="relative bg-zinc-950 py-12 lg:py-20 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-xs overflow-hidden border border-zinc-800">
          {/* Background Campaign Image */}
          <div className="relative h-[480px] sm:h-[540px] w-full">
            <img
              src="/src/assets/images/banner_seasonal_campaign_1794103595731.jpg"
              alt="Nova Fashion Seasonal Campaign"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
          </div>

          {/* Banner Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-300 mb-4 block">
              Editorial Campaign · Fall / Winter 2026
            </span>

            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight mb-4">
              Architectural Form & Modern Monochromes
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light mb-8 max-w-lg">
              Explore sharp silhouettes, double-faced cashmere tailoring, and sculptural trousers designed to move fluidly between urban landscapes and evening galas.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setActiveView('shop')}
                className="px-7 py-3.5 bg-white text-zinc-950 text-xs uppercase tracking-widest font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>EXPLORE SEASONAL EDIT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-xs text-zinc-400 italic">
                Limited atelier run of 150 pieces per style
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
