import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, User, Menu, X, Shield, Truck } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const Navbar: React.FC = () => {
  const {
    cart,
    wishlist,
    user,
    setIsCartOpen,
    activeView,
    setActiveView,
    setIsSearchOpen,
    setIsTrackingModalOpen,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavClick = (view: string) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* 1. Announcement Bar */}
      <div className="bg-zinc-950 text-zinc-300 text-[11px] tracking-widest uppercase font-medium py-2 px-4 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-zinc-400" />
            <span>Complimentary Global Express Delivery on orders over $200</span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={() => setIsTrackingModalOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Track Order
            </button>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">
              Code: <strong className="text-white tracking-wider">NOVA10</strong> for 10% Off
            </span>
          </div>
        </div>
      </div>

      {/* 2. Top Navigation Bar (Adhering strictly to Top Bar Contract) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single Text Element Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-zinc-950 whitespace-nowrap shrink-0 hover:opacity-85 transition-opacity cursor-pointer text-left"
          >
            NOVA FASHION
          </button>

          {/* Zone 2: 4-5 Clean Single-Line Text Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-zinc-700">
            <button
              onClick={() => handleNavClick('shop')}
              className={`hover:text-zinc-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'shop' ? 'text-zinc-950 font-bold underline underline-offset-8 decoration-1' : ''
              }`}
            >
              Shop All
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className="hover:text-zinc-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Men
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className="hover:text-zinc-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Women
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`hover:text-zinc-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'about' ? 'text-zinc-950 font-bold underline underline-offset-8 decoration-1' : ''
              }`}
            >
              Atelier Story
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`hover:text-zinc-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'contact' ? 'text-zinc-950 font-bold underline underline-offset-8 decoration-1' : ''
              }`}
            >
              Concierge
            </button>
          </nav>

          {/* Zone 3: Interactive Affordances & Primary Action */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search Collection"
              className="p-2 text-zinc-800 hover:text-zinc-950 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => handleNavClick('account')}
              aria-label="Wishlist"
              className="p-2 text-zinc-800 hover:text-zinc-950 hover:bg-zinc-100 rounded-full transition-colors relative cursor-pointer hidden sm:block"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-zinc-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* User Account / Admin Switch */}
            <button
              onClick={() => handleNavClick('account')}
              aria-label="Customer Account"
              className="p-2 text-zinc-800 hover:text-zinc-950 hover:bg-zinc-100 rounded-full transition-colors relative cursor-pointer"
              title={user ? `Signed in as ${user.name}` : 'Sign In'}
            >
              <User className="w-5 h-5" />
              {user?.role === 'admin' && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-amber-600 rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* Admin Portal Quick Link */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded border transition-colors cursor-pointer ${
                activeView === 'admin'
                  ? 'bg-zinc-950 text-white border-zinc-950'
                  : 'text-zinc-700 border-zinc-300 hover:border-zinc-900 hover:text-zinc-950'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>

            {/* Shopping Bag Trigger (Primary Action) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center p-2.5 bg-zinc-950 text-white hover:bg-zinc-800 transition-colors rounded-sm cursor-pointer"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              <span className="ml-2 text-xs font-semibold tabular-nums">
                {totalCartCount}
              </span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-900 hover:bg-zinc-100 rounded cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-zinc-200 px-6 py-6 space-y-4">
            <div className="flex flex-col space-y-4 text-sm font-semibold uppercase tracking-widest text-zinc-900">
              <button
                onClick={() => handleNavClick('home')}
                className="text-left py-2 border-b border-zinc-100"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('shop')}
                className="text-left py-2 border-b border-zinc-100"
              >
                Shop All Collection
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className="text-left py-2 border-b border-zinc-100"
              >
                Atelier Story
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className="text-left py-2 border-b border-zinc-100"
              >
                Concierge & Contact
              </button>
              <button
                onClick={() => handleNavClick('account')}
                className="text-left py-2 border-b border-zinc-100 flex items-center justify-between"
              >
                <span>My Account & Wishlist</span>
                <span className="text-xs text-zinc-500">{wishlist.length} saved</span>
              </button>
              <button
                onClick={() => handleNavClick('admin')}
                className="text-left py-2 border-b border-zinc-100 text-amber-700 flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </button>
            </div>
            <div className="pt-2">
              <button
                onClick={() => {
                  setIsTrackingModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 text-xs uppercase tracking-wider font-semibold border border-zinc-300 text-zinc-800 rounded"
              >
                Track An Order
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
