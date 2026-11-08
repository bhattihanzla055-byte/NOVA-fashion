import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, setActiveView } = useShop();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase().trim();
    const matches = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
    setResults(matches);
  }, [query, products]);

  if (!isSearchOpen) return null;

  const handleSelectProduct = (product: Product) => {
    setIsSearchOpen(false);
    setActiveView('product-detail', { productId: product.id });
  };

  const quickSearches = ['Cashmere', 'Silk', 'Leather Bomber', 'Trench', 'Overcoat', 'Trousers'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-20 px-4">
      <div onClick={() => setIsSearchOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />

      <div className="relative bg-white max-w-2xl w-full rounded-xs shadow-2xl z-10 overflow-hidden border border-zinc-200">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-zinc-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search collections, outerwear, silks, tailored trousers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm sm:text-base text-zinc-950 placeholder:text-zinc-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-zinc-400 hover:text-zinc-900 cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 text-zinc-400 hover:text-zinc-950 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search Suggestions */}
        {!query && (
          <div className="p-6">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-3">
              Popular Searches
            </span>
            <div className="flex flex-wrap gap-2">
              {quickSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3 py-1.5 text-xs text-zinc-700 bg-zinc-100 hover:bg-zinc-950 hover:text-white transition-colors cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {query && (
          <div className="max-h-96 overflow-y-auto divide-y divide-zinc-100 p-2">
            {results.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 text-xs">
                No matching garments found for "{query}". Try searching for 'Cashmere' or 'Trench'.
              </div>
            ) : (
              results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  className="p-3 flex items-center gap-4 hover:bg-zinc-50 transition-colors cursor-pointer"
                >
                  <div className="w-14 h-18 bg-zinc-100 shrink-0 overflow-hidden border border-zinc-200">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400">
                      {product.category} · {product.subcategory}
                    </span>
                    <h4 className="text-xs font-semibold text-zinc-900 line-clamp-1">
                      {product.name}
                    </h4>
                    <span className="text-xs font-bold text-zinc-950 tabular-nums">
                      ${product.price.toLocaleString()}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400" />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
