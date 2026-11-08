import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, X, Search, RotateCcw } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/product/ProductCard';

export const ShopPage: React.FC = () => {
  const { products } = useShop();

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'price-low' | 'price-high'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Available Filter Options
  const categories = [
    { id: 'all', label: 'All Collections' },
    { id: 'men', label: "Men's Tailoring" },
    { id: 'women', label: "Women's Collection" },
    { id: 'outerwear', label: 'Outerwear & Coats' },
    { id: 'tailoring', label: 'Suits & Trousers' },
    { id: 'accessories', label: 'Leather Bags & Goods' },
  ];

  const sizes = ['all', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const colors = [
    { id: 'all', label: 'All Colors', hex: '' },
    { id: 'black', label: 'Black / Obsidian', hex: '#0a0a0a' },
    { id: 'charcoal', label: 'Charcoal Grey', hex: '#262628' },
    { id: 'cream', label: 'Ecru / Cream', hex: '#eae5dc' },
    { id: 'camel', label: 'Camel Tan', hex: '#a68968' },
    { id: 'espresso', label: 'Deep Espresso', hex: '#231c19' },
  ];

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'outerwear') {
          const match = p.subcategory.toLowerCase().includes('outerwear') || p.subcategory.toLowerCase().includes('coat') || p.subcategory.toLowerCase().includes('bomber');
          if (!match) return false;
        } else if (selectedCategory === 'tailoring') {
          const match = p.subcategory.toLowerCase().includes('tailor') || p.subcategory.toLowerCase().includes('trouser') || p.subcategory.toLowerCase().includes('blazer');
          if (!match) return false;
        } else if (p.category !== selectedCategory) {
          return false;
        }
      }

      // Size
      if (selectedSize !== 'all' && !p.sizes.includes(selectedSize as any)) {
        return false;
      }

      // Color
      if (selectedColor !== 'all') {
        const hasColor = p.colors.some((c) => c.name.toLowerCase().includes(selectedColor.toLowerCase()));
        if (!hasColor) return false;
      }

      // Price
      if (p.price > maxPrice) {
        return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, selectedCategory, selectedSize, selectedColor, maxPrice, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('all');
    setSelectedColor('all');
    setMaxPrice(1500);
    setSearchQuery('');
    setSortBy('newest');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedSize !== 'all' ||
    selectedColor !== 'all' ||
    maxPrice < 1500 ||
    searchQuery.trim() !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      
      {/* Catalog Header */}
      <div className="pb-8 border-b border-zinc-200">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500 mb-2 block">
          Ready-To-Wear & Bespoke Tailoring
        </span>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-zinc-950">
            The Complete Collection
          </h1>
          <span className="text-xs text-zinc-500 uppercase tracking-widest font-mono">
            Showing {filteredProducts.length} of {products.length} Designs
          </span>
        </div>
      </div>

      {/* Control Bar: Search, Mobile Filter Toggle, and Sort */}
      <div className="py-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-zinc-200 mb-8">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by garment, fabric, or style..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-300 pl-10 pr-4 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-900 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Right tools: Mobile Filter Button & Sort Selector */}
        <div className="flex items-center gap-3 justify-between md:justify-end">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden px-4 py-2 border border-zinc-300 text-xs font-semibold uppercase tracking-wider text-zinc-800 flex items-center gap-2 hover:bg-zinc-100"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Refine ({[selectedCategory !== 'all', selectedSize !== 'all', selectedColor !== 'all'].filter(Boolean).length})</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-zinc-500 hover:text-zinc-950 flex items-center gap-1.5 underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 uppercase tracking-wider hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-zinc-300 px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:border-zinc-950 cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="rating">Client Rating</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar (Desktop) + Product Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 items-start">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-8 pr-6 border-r border-zinc-200">
          
          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-950 mb-4 pb-2 border-b border-zinc-100">
              Collections
            </h3>
            <div className="space-y-1.5 text-xs">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`w-full text-left py-1.5 px-2 transition-colors cursor-pointer flex justify-between items-center ${
                    selectedCategory === c.id
                      ? 'bg-zinc-950 text-white font-semibold'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                  }`}
                >
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sizing Filter */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-950 mb-4 pb-2 border-b border-zinc-100">
              Sizes
            </h3>
            <div className="grid grid-cols-4 gap-1.5">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`py-2 text-xs font-semibold uppercase tracking-wider border text-center transition-colors cursor-pointer ${
                    selectedSize === s
                      ? 'bg-zinc-950 text-white border-zinc-950'
                      : 'border-zinc-300 text-zinc-700 hover:border-zinc-950'
                  }`}
                >
                  {s === 'all' ? 'All' : s}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-950 mb-4 pb-2 border-b border-zinc-100">
              Color Palette
            </h3>
            <div className="space-y-1.5">
              {colors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedColor(c.id)}
                  className={`w-full flex items-center justify-between py-1.5 px-2 text-xs transition-colors cursor-pointer ${
                    selectedColor === c.id ? 'bg-zinc-100 font-semibold text-zinc-950' : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {c.hex && (
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-zinc-300"
                        style={{ backgroundColor: c.hex }}
                      />
                    )}
                    <span>{c.label}</span>
                  </div>
                  {selectedColor === c.id && <span className="text-[10px] text-zinc-500">Active</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-zinc-100">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-950">
                Max Price
              </h3>
              <span className="text-xs font-bold text-zinc-950 tabular-nums">
                ${maxPrice}
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="1500"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-zinc-950 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-zinc-400 mt-2">
              <span>$200</span>
              <span>$1,500</span>
            </div>
          </div>

        </aside>

        {/* Product Grid (3 Columns on Desktop) */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-24 bg-zinc-50 border border-zinc-200 p-8">
              <SlidersHorizontal className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
              <h3 className="text-base font-serif font-bold text-zinc-950 mb-1">
                No matching garments found
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-6">
                Try widening your search terms, adjusting size, or resetting price filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-zinc-950 text-white text-xs uppercase tracking-wider font-semibold hover:bg-zinc-800"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div onClick={() => setIsMobileFilterOpen(false)} className="fixed inset-0 bg-black/60" />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white p-6 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-950">
                    Filter Garments
                  </h3>
                  <button onClick={() => setIsMobileFilterOpen(false)} className="p-1">
                    <X className="w-5 h-5 text-zinc-500" />
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-950 block mb-3">
                    Collection
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCategory(c.id)}
                        className={`px-3 py-1.5 text-xs font-semibold uppercase ${
                          selectedCategory === c.id
                            ? 'bg-zinc-950 text-white'
                            : 'bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-950 block mb-3">
                    Size
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`py-1.5 text-xs font-semibold uppercase border text-center ${
                          selectedSize === s
                            ? 'bg-zinc-950 text-white border-zinc-950'
                            : 'border-zinc-300 text-zinc-700'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max Price */}
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-bold text-zinc-950 uppercase">Max Price</span>
                    <span className="font-bold tabular-nums">${maxPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="1500"
                    step="50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-zinc-950"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-200 flex gap-2">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-3 text-xs uppercase font-semibold border border-zinc-300 text-zinc-700"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-3 bg-zinc-950 text-white text-xs uppercase font-semibold"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
