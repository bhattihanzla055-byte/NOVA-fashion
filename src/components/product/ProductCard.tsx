import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Star, Check } from 'lucide-react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    setActiveView,
    addRecentlyViewed,
  } = useShop();

  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Product['sizes'][number]>(product.sizes[0] || 'M');
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleCardClick = () => {
    addRecentlyViewed(product);
    setActiveView('product-detail', { productId: product.id });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    const defaultColor = product.colors[0]?.name || 'Standard';
    addToCart(product, selectedSize, defaultColor, 1);
    setIsAdding(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      className="group relative flex flex-col bg-white cursor-pointer select-none transition-all duration-300"
    >
      {/* Image Container with 3:4 Aspect Ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100">
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover object-top transition-transform duration-700 ease-out ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        />

        {/* Subtle Editorial Tag (No pill capsules) */}
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-zinc-950 text-white text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5">
            New Season
          </span>
        )}
        {!product.isNew && product.isBestSeller && (
          <span className="absolute top-3 left-3 bg-zinc-900/80 backdrop-blur-xs text-white text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5">
            Best Seller
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
            isFavorited
              ? 'bg-zinc-950 text-rose-500 shadow-md'
              : 'bg-white/90 text-zinc-700 hover:text-zinc-950 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Quick View and Quick Add Overlay Buttons */}
        <div
          className={`absolute inset-x-3 bottom-3 flex flex-col gap-1.5 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          {/* Size Selector Strip */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-1 bg-white/95 backdrop-blur-xs py-1 px-2 border border-zinc-200"
          >
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`text-[10px] font-semibold px-1.5 py-0.5 transition-colors cursor-pointer ${
                  selectedSize === s
                    ? 'bg-zinc-950 text-white'
                    : 'text-zinc-700 hover:text-zinc-950'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={handleQuickView}
              className="flex-1 py-2 bg-white/95 backdrop-blur-xs hover:bg-white text-zinc-900 text-[11px] font-semibold uppercase tracking-wider border border-zinc-200 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
            <button
              onClick={handleQuickAdd}
              disabled={isAdding || product.stock === 0}
              className="flex-1 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{product.stock === 0 ? 'Sold Out' : 'Quick Add'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Card Metadata */}
      <div className="pt-3 pb-1 flex flex-col space-y-1">
        {/* Unboxed category & rating */}
        <div className="flex items-center justify-between text-[11px] text-zinc-500 uppercase tracking-wider">
          <span>{product.subcategory}</span>
          <div className="flex items-center gap-1 text-zinc-800 font-medium">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span className="tabular-nums">{product.rating.toFixed(1)}</span>
            <span className="text-zinc-400">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Product Title */}
        <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-zinc-700 transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-sm font-bold text-zinc-950 tabular-nums">
            ${product.price.toLocaleString()}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-zinc-400 line-through tabular-nums">
              ${product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
