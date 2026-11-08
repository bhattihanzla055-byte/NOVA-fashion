import React, { useState } from 'react';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { HeroSection } from '../components/home/HeroSection';
import { ProductCard } from '../components/product/ProductCard';
import { SeasonalBanner } from '../components/home/SeasonalBanner';
import { CustomerReviews } from '../components/home/CustomerReviews';
import { NewsletterSection } from '../components/home/NewsletterSection';

export const HomePage: React.FC = () => {
  const { products, setActiveView } = useShop();
  const [activeTab, setActiveTab] = useState<'all' | 'men' | 'women'>('all');

  // Filter lists
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const mensCollection = products.filter((p) => p.category === 'men').slice(0, 4);
  const womensCollection = products.filter((p) => p.category === 'women').slice(0, 4);

  const filteredFeatured = products.filter((p) => {
    if (activeTab === 'all') return true;
    return p.category === activeTab;
  }).slice(0, 4);

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-zinc-200">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500 mb-1 block">
              Curated Selection
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950">
              New Arrivals
            </h2>
          </div>
          <button
            onClick={() => setActiveView('shop')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-800 hover:text-zinc-950 group cursor-pointer"
          >
            <span>View All Arrivals</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. Men's & Women's Dual Editorial Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Men's Card */}
          <div
            onClick={() => setActiveView('shop')}
            className="group relative h-[480px] sm:h-[560px] overflow-hidden bg-zinc-900 cursor-pointer"
          >
            <img
              src="/src/assets/images/product_men_tailored_overcoat_1794103593370.jpg"
              alt="Men's Collection"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <span className="text-xs uppercase tracking-[0.25em] text-zinc-300 block mb-2 font-medium">
                Sartorial Excellence
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-3">
                Men's Collection
              </h3>
              <p className="text-xs text-zinc-300 max-w-sm mb-4 leading-relaxed line-clamp-2">
                Virgin wool overcoats, lambskin leather bombers, and hand-loomed Scottish cashmere knitwear.
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white group-hover:underline underline-offset-4">
                <span>Shop Men's Tailoring</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Women's Card */}
          <div
            onClick={() => setActiveView('shop')}
            className="group relative h-[480px] sm:h-[560px] overflow-hidden bg-zinc-900 cursor-pointer"
          >
            <img
              src="/src/assets/images/product_women_silk_dress_1794103595165.jpg"
              alt="Women's Collection"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <span className="text-xs uppercase tracking-[0.25em] text-zinc-300 block mb-2 font-medium">
                Fluid Architecture
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-3">
                Women's Collection
              </h3>
              <p className="text-xs text-zinc-300 max-w-sm mb-4 leading-relaxed line-clamp-2">
                Double georgette silk slip gowns, double-breasted cashmere trenches, and high-waisted palazzo trousers.
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white group-hover:underline underline-offset-4">
                <span>Shop Women's Evening</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-zinc-200">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-zinc-800" />
              <span>Patron Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950">
              Best Sellers
            </h2>
          </div>
          <button
            onClick={() => setActiveView('shop')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-800 hover:text-zinc-950 group cursor-pointer"
          >
            <span>Explore Most Loved</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Promotional & Seasonal Banner */}
      <SeasonalBanner />

      {/* 6. Featured Products with Interactive Segmented Controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-zinc-200">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-zinc-800" />
              <span>Runway Spotlight</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950">
              Featured Garments
            </h2>
          </div>

          {/* Clean Segmented Control Tabs (Adhering to §1.A for functional filter controls) */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 border border-zinc-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              All Styles
            </button>
            <button
              onClick={() => setActiveTab('men')}
              className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'men'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Men
            </button>
            <button
              onClick={() => setActiveTab('women')}
              className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'women'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Women
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredFeatured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Customer Reviews & Press */}
      <CustomerReviews />

      {/* 8. Newsletter Subscription */}
      <NewsletterSection />
    </div>
  );
};
