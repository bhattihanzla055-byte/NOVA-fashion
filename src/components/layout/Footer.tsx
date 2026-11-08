import React from 'react';
import { ArrowUpRight, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const Footer: React.FC = () => {
  const { setActiveView, setIsTrackingModalOpen } = useShop();

  return (
    <footer className="bg-zinc-950 text-zinc-300 pt-16 pb-12 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-zinc-800">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wider">
              NOVA FASHION
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              An international luxury fashion house rooted in architectural minimalism, artisanal European tailoring, and sustainable natural fibers. Designed in Paris & Milan for the discerning modern silhouette.
            </p>
            <div className="pt-2 text-xs text-zinc-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                <span>Flagship Atelier: 18 Rue de la Paix, Paris, France</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                <span>concierge@novafashion.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-zinc-500" />
                <span>+33 1 42 68 55 00 · Concierge Hours: 9am - 8pm CET</span>
              </div>
            </div>
          </div>

          {/* Navigation Column 1: Collections */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-widest">
              Collections
            </h3>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button
                  onClick={() => setActiveView('shop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  New Autumn / Winter '26
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('shop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Men's Tailored Coats
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('shop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Women's Silk & Evening
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('shop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Italian Lambskin Outerwear
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('shop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Grade-A Mongolian Cashmere
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2: Client Care */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-widest">
              Client Concierge
            </h3>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button
                  onClick={() => setIsTrackingModalOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Track Your Shipment</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-500" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Complimentary Returns & Exchange
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Bespoke Sizing Consultation
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Ethical Sourcing & Fiber Traceability
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('admin')}
                  className="hover:text-white transition-colors cursor-pointer text-amber-500"
                >
                  Atelier Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Column 3: Boutiques */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-widest">
              Flagship Boutiques
            </h3>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <span className="text-white block font-medium">Paris Vendôme</span>
                <span>18 Rue de la Paix</span>
              </li>
              <li>
                <span className="text-white block font-medium">Milan Montenapoleone</span>
                <span>Via Monte Napoleone 8</span>
              </li>
              <li>
                <span className="text-white block font-medium">New York Madison</span>
                <span>740 Madison Avenue</span>
              </li>
              <li>
                <span className="text-white block font-medium">Tokyo Ginza</span>
                <span>6-10-1 Ginza, Chuo-ku</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Security */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span>© 2026 NOVA FASHION INTERNATIONAL S.A. All rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="hover:text-zinc-300 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-zinc-300 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-zinc-300 transition-colors cursor-pointer">Cookie Preferences</span>
            <span className="flex items-center gap-1 text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-zinc-400" />
              <span>Verified Merchant</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
