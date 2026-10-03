import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, CalendarCheck, Search, MessageCircle } from 'lucide-react';
import { Logo } from './Logo';
import { StudioSettings } from '../types';

interface NavbarProps {
  onOpenTrackModal?: () => void;
  settings?: StudioSettings;
  whatsappNumber?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTrackModal, settings }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const defaultLinks = [
    { id: '1', label: 'Home', path: '/', isVisible: true },
    { id: '2', label: 'Portfolio', path: '/portfolio', isVisible: true },
    { id: '3', label: 'Services', path: '/services', isVisible: true },
    { id: '4', label: 'Packages', path: '/packages', isVisible: true },
    { id: '5', label: 'About', path: '/about', isVisible: true },
    { id: '6', label: 'Stories', path: '/blog', isVisible: true },
    { id: '7', label: 'Reviews', path: '/testimonials', isVisible: true },
    { id: '8', label: 'Contact', path: '/contact', isVisible: true },
  ];

  const navLinks = settings?.headerConfig?.navItems
    ? settings.headerConfig.navItems.filter((i) => i.isVisible !== false)
    : defaultLinks;

  const isSticky = settings?.headerConfig?.isSticky ?? true;
  const whatsappNumber = settings?.whatsapp || '+9779810004918';
  const cleanWhatsAppNumber = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <>
      <header
        className={`${
          isSticky ? 'fixed top-0 left-0 right-0' : 'relative'
        } z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0a0a0c]/94 backdrop-blur-md border-b border-[#292934]/60 py-3 shadow-2xl'
            : 'bg-gradient-to-b from-[#0a0a0c]/85 via-[#0a0a0c]/40 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Zone 1: Brand Wordmark / Logo */}
            <Link
              to="/"
              className="group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c5a059]"
            >
              <Logo size="md" logoUrl={settings?.logoUrl} />
            </Link>

            {/* Zone 2: Navigation Links (Clean Text with subtle hover underline, Zero-Pill) */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.id || link.path}
                    to={link.path}
                    className={`relative text-xs tracking-widest uppercase transition-colors duration-200 py-1 ${
                      isActive
                        ? 'text-[#f5eedc] font-medium'
                        : 'text-[#9c9aa5] hover:text-[#f5eedc]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#c5a059]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Zone 3: Actions */}
            <div className="hidden sm:flex items-center space-x-3">
              {onOpenTrackModal && (
                <button
                  type="button"
                  onClick={onOpenTrackModal}
                  className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#d4b470] hover:text-[#f5eedc] py-2 px-2.5 transition-colors focus:outline-none"
                  title="Track Booking Status"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Track Status</span>
                </button>
              )}

              <a
                href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(
                  'Hello Kaviya Studio, I would like to inquire about wedding photography and films.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:flex items-center gap-1.5 text-xs text-[#d4b470] hover:text-[#f5eedc] py-2 px-3 transition-colors border border-[#a78140]/30 hover:border-[#c5a059] rounded"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <Link
                to="/booking"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#09090b] bg-[#c5a059] hover:bg-[#d4b470] active:scale-[0.98] transition-all shadow-[0_2px_12px_rgba(197,160,89,0.25)] rounded"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Book Session</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center space-x-2 lg:hidden">
              <Link
                to="/booking"
                className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-[#09090b] bg-[#c5a059] rounded"
              >
                Book
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#e4e2dd] hover:text-[#c5a059] focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#09090b]/98 backdrop-blur-xl flex flex-col justify-between p-6 lg:hidden animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-[#292934]">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="focus:outline-none">
                <Logo size="sm" logoUrl={settings?.logoUrl} />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#a3a2a7] hover:text-white"
                aria-label="Close Menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col space-y-4 py-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.id || link.path}
                    to={link.path}
                    className={`text-lg uppercase tracking-widest py-2 transition-colors ${
                      isActive ? 'text-[#c5a059] font-semibold' : 'text-[#d6d4ce] hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex flex-col space-y-3 pt-6 border-t border-[#292934]">
            {onOpenTrackModal && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTrackModal();
                }}
                className="flex items-center justify-center gap-2 py-3 px-4 text-xs tracking-wider uppercase text-[#c5a059] border border-[#c5a059]/40 rounded hover:bg-[#c5a059]/10"
              >
                <Search className="w-4 h-4" />
                <span>Track Booking Status</span>
              </button>
            )}

            <a
              href={`https://wa.me/${cleanWhatsAppNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 text-xs tracking-wider uppercase text-emerald-400 border border-emerald-500/30 rounded hover:bg-emerald-500/10"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Direct WhatsApp Chat</span>
            </a>

            <Link
              to="/booking"
              className="flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold tracking-wider uppercase text-[#09090b] bg-[#c5a059] rounded"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book Your Session</span>
            </Link>

            <div className="pt-2 text-center text-xs text-[#717078]">
              {settings?.address || 'Janakpur, Nepal'} · {settings?.phone || '+977 981-0004918'}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
