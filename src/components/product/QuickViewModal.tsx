import React, { useState } from 'react';
import { X, Star, Heart, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setActiveView,
  } = useShop();

  const [selectedSize, setSelectedSize] = useState<Product['sizes'][number] | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!quickViewProduct) return null;

  const currentSize = selectedSize || quickViewProduct.sizes[0] || 'M';
  const currentColor = selectedColor || quickViewProduct.colors[0]?.name || 'Standard';
  const isFavorited = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, currentSize, currentColor, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setQuickViewProduct(null);
    }, 1200);
  };

  const handleViewFullDetails = () => {
    setQuickViewProduct(null);
    setActiveView('product-detail', { productId: quickViewProduct.id });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      <div
        onClick={() => setQuickViewProduct(null)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-white max-w-3xl w-full rounded-xs shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 text-zinc-500 hover:text-zinc-950 transition-colors bg-white/80 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Image Gallery */}
        <div className="md:w-1/2 bg-zinc-100 flex flex-col">
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <img
              src={quickViewProduct.images[activeImageIndex] || quickViewProduct.images[0]}
              alt={quickViewProduct.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
            />
          </div>
          {quickViewProduct.images.length > 1 && (
            <div className="flex gap-2 p-3 bg-zinc-50 border-t border-zinc-200 overflow-x-auto">
              {quickViewProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-18 shrink-0 overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx ? 'border-zinc-950' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Actions */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-500 uppercase tracking-widest mb-1.5">
              <span>{quickViewProduct.subcategory}</span>
              <div className="flex items-center gap-1 text-zinc-900 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{quickViewProduct.rating.toFixed(1)}</span>
                <span className="text-zinc-400">({quickViewProduct.reviewsCount})</span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-950 mb-2">
              {quickViewProduct.name}
            </h2>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-xl font-bold text-zinc-950 tabular-nums">
                ${quickViewProduct.price.toLocaleString()}
              </span>
              {quickViewProduct.originalPrice && quickViewProduct.originalPrice > quickViewProduct.price && (
                <span className="text-sm text-zinc-400 line-through tabular-nums">
                  ${quickViewProduct.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed mb-6 line-clamp-3">
              {quickViewProduct.description}
            </p>

            {/* Color Swatches */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-2">
                Color: <span className="text-zinc-600 font-normal">{currentColor}</span>
              </label>
              <div className="flex items-center gap-2">
                {quickViewProduct.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                      currentColor === c.name ? 'ring-2 ring-zinc-950 ring-offset-2' : 'border-zinc-300'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-2">
                Size
              </label>
              <div className="flex flex-wrap gap-2">
                {quickViewProduct.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider border transition-colors cursor-pointer ${
                      currentSize === s
                        ? 'bg-zinc-950 text-white border-zinc-950'
                        : 'bg-white text-zinc-700 border-zinc-300 hover:border-zinc-950'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-zinc-300">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold text-zinc-900 tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(quickViewProduct.stock || 10, quantity + 1))}
                  className="px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-zinc-500">
                {quickViewProduct.stock > 0 ? `${quickViewProduct.stock} pieces in stock` : 'Out of stock'}
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-zinc-200">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={quickViewProduct.stock === 0}
                className="flex-1 py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>
              <button
                onClick={() => toggleWishlist(quickViewProduct.id)}
                className={`p-3.5 border transition-colors cursor-pointer ${
                  isFavorited ? 'border-zinc-950 text-rose-500 bg-zinc-50' : 'border-zinc-300 text-zinc-600 hover:border-zinc-950'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleViewFullDetails}
              className="w-full py-2.5 text-xs text-zinc-700 hover:text-zinc-950 uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View Complete Product Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
