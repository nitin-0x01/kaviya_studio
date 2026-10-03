/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { api } from './services/api';
import {
  Album,
  GalleryItem,
  PricingPackage,
  Service,
  StudioSettings,
  Testimonial,
} from './types';
import { defaultSettings } from './data/defaultData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BookingTrackModal } from './components/BookingTrackModal';
import { HomePage } from './pages/HomePage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ServicesPage } from './pages/ServicesPage';
import { PackagesPage } from './pages/PackagesPage';
import { AboutPage } from './pages/AboutPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { BookingPage } from './pages/BookingPage';
import { ContactPage } from './pages/ContactPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFoundPage } from './pages/NotFoundPage';

// Scroll to top on navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Layout wrapper that hides standard Navbar and Footer on the /admin route
function Layout({
  children,
  settings,
  onOpenTrackModal,
}: {
  children: React.ReactNode;
  settings: StudioSettings;
  onOpenTrackModal: () => void;
}) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#09090b]">
      <Navbar onOpenTrackModal={onOpenTrackModal} settings={settings} whatsappNumber={settings.whatsapp} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}

export default function App() {
  const [settings, setSettings] = useState<StudioSettings>(defaultSettings);
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [trackModalOpen, setTrackModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [setts, srvs, pkgs, gals, albs, tests] = await Promise.all([
          api.getSettings().catch(() => defaultSettings),
          api.getServices().catch(() => []),
          api.getPackages().catch(() => []),
          api.getGallery().catch(() => []),
          api.getAlbums().catch(() => []),
          api.getTestimonials().catch(() => []),
        ]);
        if (setts) setSettings(setts);
        setServices(srvs);
        setPackages(pkgs);
        setGallery(gals);
        setAlbums(albs);
        setTestimonials(tests);
      } catch (err) {
        console.error('Error hydrating studio data:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout settings={settings} onOpenTrackModal={() => setTrackModalOpen(true)}>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                settings={settings}
                services={services}
                gallery={gallery}
                testimonials={testimonials}
                onOpenTrackModal={() => setTrackModalOpen(true)}
              />
            }
          />
          <Route path="/portfolio" element={<PortfolioPage gallery={gallery} albums={albums} />} />
          <Route path="/services" element={<ServicesPage services={services} />} />
          <Route path="/packages" element={<PackagesPage packages={packages} />} />
          <Route path="/about" element={<AboutPage settings={settings} />} />
          <Route
            path="/testimonials"
            element={<TestimonialsPage testimonials={testimonials} />}
          />
          <Route
            path="/booking"
            element={
              <BookingPage
                services={services}
                packages={packages}
                whatsappNumber={settings.whatsapp}
              />
            }
          />
          <Route path="/contact" element={<ContactPage settings={settings} />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>

      {/* Global Booking Status Quick Lookup Modal */}
      <BookingTrackModal
        isOpen={trackModalOpen}
        onClose={() => setTrackModalOpen(false)}
        whatsappNumber={settings.whatsapp}
      />
    </BrowserRouter>
  );
}
