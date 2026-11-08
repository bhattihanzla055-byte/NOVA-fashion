import React, { useState, useEffect } from 'react';
import {
  Star,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ShoppingBag,
  ArrowRight,
  ChevronRight,
  Ruler,
  Share2,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { api } from '../services/api';
import { Product, Review } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { SizeGuideModal } from '../components/product/SizeGuideModal';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProductId,
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setActiveView,
    addRecentlyViewed,
    user,
  } = useShop();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<Product['sizes'][number]>(product?.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors[0]?.name || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState(user?.name || '');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Sync state when product changes
  useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
      setSelectedSize(product.sizes[0] || 'M');
      setSelectedColor(product.colors[0]?.name || 'Standard');
      setActiveImageIndex(0);
      setQuantity(1);

      // Load reviews
      api.getReviews(product.id).then(setReviews);
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-serif">Product Not Found</h2>
        <button onClick={() => setActiveView('shop')} className="mt-4 px-6 py-2 bg-zinc-950 text-white text-xs">
          Return to Shop
        </button>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setActiveView('checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;
    setIsSubmittingReview(true);
    try {
      const created = await api.addReview({
        productId: product.id,
        userName: newReviewAuthor.trim() || 'Verified Client',
        rating: newReviewRating,
        comment: newReviewComment.trim(),
      });
      setReviews((prev) => [created, ...prev]);
      setShowReviewSuccess(true);
      setNewReviewComment('');
      setTimeout(() => setShowReviewSuccess(false), 3000);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Related products (same category or general)
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.isFeatured))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-wider mb-8">
        <button onClick={() => setActiveView('home')} className="hover:text-zinc-950 cursor-pointer">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
        <button onClick={() => setActiveView('shop')} className="hover:text-zinc-950 cursor-pointer capitalize">
          {product.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
        <span className="text-zinc-900 font-semibold truncate">{product.name}</span>
      </nav>

      {/* Main PDP Grid (Contiguous Purchase Module §2.A) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start pb-16 border-b border-zinc-200">
        
        {/* Gallery Column (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image View with Subtle Zoom */}
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100 border border-zinc-200">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
            />
            {product.isNew && (
              <span className="absolute top-4 left-4 bg-zinc-950 text-white text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1">
                New Season
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-xs rounded-full hover:bg-white text-zinc-800 transition-colors shadow-sm cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className={`w-4.5 h-4.5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

          {/* Thumbnail Bar */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 sm:w-24 aspect-[3/4] shrink-0 border-2 transition-all cursor-pointer overflow-hidden ${
                    activeImageIndex === idx
                      ? 'border-zinc-950 ring-1 ring-zinc-950'
                      : 'border-zinc-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Purchase Module Column (5 cols on lg) - Sticky on Desktop */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          
          {/* Meta & Title */}
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-500 uppercase tracking-widest mb-2">
              <span>{product.subcategory} · Atelier Edit</span>
              <div className="flex items-center gap-1 text-zinc-900 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="tabular-nums">{product.rating.toFixed(1)}</span>
                <span className="text-zinc-400">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950 leading-tight">
              {product.name}
            </h1>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-2xl font-bold text-zinc-950 tabular-nums">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-base text-zinc-400 line-through tabular-nums">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    Save ${product.originalPrice - product.price}
                  </span>
                </>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Color Selection */}
          <div className="pt-2">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-950">
                Color Palette
              </span>
              <span className="text-xs text-zinc-600 font-medium">{selectedColor}</span>
            </div>
            <div className="flex items-center gap-2.5">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`w-7 h-7 rounded-full transition-all cursor-pointer border ${
                    selectedColor === c.name
                      ? 'ring-2 ring-zinc-950 ring-offset-2 scale-110'
                      : 'border-zinc-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Size Selection & Sizing Guide */}
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-950">
                Garment Size
              </span>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-xs text-zinc-600 hover:text-zinc-950 flex items-center gap-1 underline cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`py-2 text-xs font-semibold uppercase tracking-wider border text-center transition-colors cursor-pointer ${
                    selectedSize === s
                      ? 'bg-zinc-950 text-white border-zinc-950'
                      : 'border-zinc-300 text-zinc-800 hover:border-zinc-950'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Indicator & Quantity */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-950">
                Quantity
              </span>
              <div className="flex items-center border border-zinc-300">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-zinc-900 tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                  className="px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <span className="text-xs text-zinc-500 font-medium">
              {product.stock < 8 ? (
                <span className="text-amber-700 font-semibold">Low stock: Only {product.stock} available</span>
              ) : (
                <span className="text-emerald-700 font-semibold">In Stock · Ready to dispatch</span>
              )}
            </span>
          </div>

          {/* CTAs: Add to Cart & Buy Now */}
          <div className="space-y-2.5 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full py-4 bg-zinc-950 hover:bg-zinc-800 text-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Added to Shopping Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="w-full py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <span>Instant Buy Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Delivery & Assurance Guarantees */}
          <div className="pt-4 border-t border-zinc-200 space-y-3 text-xs text-zinc-600">
            <div className="flex items-start gap-3">
              <Truck className="w-4 h-4 text-zinc-950 shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-950 block">Complimentary Global Express</strong>
                <span>Free delivery on orders $200+. Dispatched via DHL Express in 24 hours.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <RotateCcw className="w-4 h-4 text-zinc-950 shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-950 block">30-Day Bespoke Returns</strong>
                <span>Prepaid return label and concierge exchange service included.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-zinc-950 shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-950 block">Artisanal Authentication</strong>
                <span>Includes personalized Nova certificate of provenance and cedar dust garment bag.</span>
              </div>
            </div>
          </div>

          {/* Technical Specifications / Details */}
          <div className="pt-4 border-t border-zinc-200">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-950 mb-3">
              Garment Specifications
            </h3>
            <dl className="divide-y divide-zinc-100 text-xs">
              <div className="py-2 flex justify-between">
                <dt className="text-zinc-500">Composition</dt>
                <dd className="font-medium text-zinc-900">{product.details.composition}</dd>
              </div>
              <div className="py-2 flex justify-between">
                <dt className="text-zinc-500">Silhouette Fit</dt>
                <dd className="font-medium text-zinc-900">{product.details.fit}</dd>
              </div>
              <div className="py-2 flex justify-between">
                <dt className="text-zinc-500">Atelier Origin</dt>
                <dd className="font-medium text-zinc-900">{product.details.origin}</dd>
              </div>
              <div className="py-2 flex justify-between">
                <dt className="text-zinc-500">Care Instructions</dt>
                <dd className="font-medium text-zinc-900">{product.details.care}</dd>
              </div>
            </dl>
          </div>

        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="py-16 border-b border-zinc-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-zinc-200">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500 mb-1 block">
                Verified Feedback
              </span>
              <h2 className="text-2xl font-serif font-bold text-zinc-950">
                Customer Reviews ({reviews.length})
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <span className="text-sm font-bold text-zinc-950">{product.rating.toFixed(1)} out of 5.0</span>
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-6 mb-12">
            {reviews.length === 0 ? (
              <p className="text-xs text-zinc-500 italic py-4">Be the first to review this garment.</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="p-6 bg-zinc-50 border border-zinc-200 rounded-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-950">{rev.userName}</span>
                      {rev.verified && (
                        <span className="text-[10px] uppercase font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-400 font-mono">{rev.date}</span>
                  </div>

                  <div className="flex gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>

                  <p className="text-xs text-zinc-700 leading-relaxed pt-1">
                    "{rev.comment}"
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Write a Review Form */}
          <div className="bg-white p-6 sm:p-8 border border-zinc-200">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-950 mb-1">
              Write A Client Review
            </h3>
            <p className="text-xs text-zinc-500 mb-6">
              Share your perspective on the tailoring, fabric texture, and fit.
            </p>

            {showReviewSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Thank you. Your review has been recorded and published.</span>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Julian Sterling"
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-1.5">
                      Rating Score
                    </label>
                    <div className="flex items-center gap-2 py-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewReviewRating(star)}
                          className="p-1 cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= newReviewRating
                                ? 'fill-amber-500 text-amber-500'
                                : 'text-zinc-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-semibold text-zinc-800 ml-2">
                        {newReviewRating} Star{newReviewRating > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-1.5">
                    Your Experience & Comments
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe how the garment drapes, quality of finishing, and sizing feedback..."
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 p-3 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview || !newReviewComment.trim()}
                  className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white text-xs uppercase tracking-widest font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="pt-16">
        <div className="flex justify-between items-end mb-8 pb-3 border-b border-zinc-200">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500 mb-1 block">
              Curated Complements
            </span>
            <h2 className="text-2xl font-serif font-bold text-zinc-950">
              You May Also Appreciate
            </h2>
          </div>
          <button
            onClick={() => setActiveView('shop')}
            className="text-xs font-semibold uppercase tracking-wider text-zinc-800 hover:text-zinc-950 underline"
          >
            Explore All
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Sizing Guide Modal */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
};
