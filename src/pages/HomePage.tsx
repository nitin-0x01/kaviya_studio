import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  ArrowRight,
  Play,
  Heart,
  Film,
  Sparkles,
  MapPin,
  ChevronRight,
  Instagram,
  Clock,
  Eye,
} from 'lucide-react';
import { StudioSettings, Service, GalleryItem, Testimonial } from '../types';
import { LightboxModal } from '../components/LightboxModal';

interface HomePageProps {
  settings: StudioSettings;
  services: Service[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  onOpenTrackModal?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  services,
  gallery,
  testimonials,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const heroSlides = settings.heroSlides || [];
  const heroConfig = settings.heroConfig || {
    slideInterval: 6000,
    autoplay: true,
    overlayIntensity: 65,
    ctaPrimaryText: 'Book Your Session',
    ctaPrimaryLink: '/booking',
    ctaSecondaryText: 'Explore Our Portfolio',
    ctaSecondaryLink: '/portfolio',
  };

  // Check section visibility from CMS
  const isSectionEnabled = (sectionId: string) => {
    if (!settings.homepageSections || settings.homepageSections.length === 0) return true;
    const found = settings.homepageSections.find((s) => s.id === sectionId);
    return found ? found.isEnabled : true;
  };

  // Hero slideshow timer
  useEffect(() => {
    if (heroSlides.length <= 1 || heroConfig.autoplay === false) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, heroConfig.slideInterval || 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length, heroConfig.autoplay, heroConfig.slideInterval]);

  const featuredGallery = gallery.filter((g) => g.isFeatured).slice(0, 6);
  const activeTestimonials = testimonials.filter((t) => t.isApproved).slice(0, 3);
  const featuredServices = services.slice(0, 4);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const cleanWhatsApp = (settings.whatsapp || '+977 981-0004918').replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen bg-[#09090b] text-[#e4e2dd]">
      {/* 1. CINEMATIC HERO SECTION */}
      {isSectionEnabled('sec-hero') && (
        <section className="relative h-[92vh] sm:h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Slideshow Background */}
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.id || idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
              style={{ transition: 'opacity 1.2s ease-in-out, transform 8s ease-out' }}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center"
              />
              {/* Dynamic Overlay from CMS */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-[#09090b]/60"
                style={{ opacity: (heroConfig.overlayIntensity ?? 65) / 100 }}
              />
              <div className="absolute inset-0 cinematic-vignette opacity-80" />
            </div>
          ))}

          {/* Hero Content */}
          <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
            {/* Category kicker */}
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#d4b470] mb-4 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>{settings.brandName || 'Kaviya Studio'} · Janakpur, Nepal</span>
            </div>

            <h1
              className="text-4xl sm:text-6xl lg:text-7xl font-serif text-[#f5eedc] font-normal tracking-tight leading-[1.1] max-w-4xl text-balance"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {settings.headline || 'Capturing Your Moments, Creating Your Memories.'}
            </h1>

            <p className="mt-5 text-base sm:text-xl text-[#c5c3cb] font-light max-w-2xl leading-relaxed tracking-wide">
              {settings.subHeadline || 'Timeless Wedding Photography & Cinematic Films based in Janakpur, Nepal.'}
            </p>

            {/* Hero CTAs (Configurable from CMS) */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                to={heroConfig.ctaPrimaryLink || '/booking'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#09090b] bg-[#c5a059] hover:bg-[#d4b470] active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(197,160,89,0.3)] rounded"
              >
                <Calendar className="w-4 h-4" />
                <span>{heroConfig.ctaPrimaryText || 'Book Your Session'}</span>
              </Link>

              <Link
                to={heroConfig.ctaSecondaryLink || '/portfolio'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-medium uppercase tracking-widest text-[#f5eedc] bg-[#14141c]/80 hover:bg-[#1f1f2b] border border-[#303040] hover:border-[#c5a059] active:scale-[0.98] transition-all rounded backdrop-blur-sm"
              >
                <span>{heroConfig.ctaSecondaryText || 'Explore Our Portfolio'}</span>
                <ArrowRight className="w-4 h-4 text-[#c5a059]" />
              </Link>
            </div>

            {/* Slide Indicator Dots */}
            {heroSlides.length > 1 && (
              <div className="mt-12 flex items-center gap-2">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1.5 transition-all rounded-full ${
                      index === currentSlide ? 'w-8 bg-[#c5a059]' : 'w-2 bg-[#424254]'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Quiet scroll indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2 text-xs uppercase tracking-widest text-[#72707c]">
            <span className="text-[10px] font-mono">Scroll to explore</span>
            <div className="w-[1px] h-6 bg-gradient-to-b from-[#c5a059] to-transparent animate-pulse" />
          </div>
        </section>
      )}

      {/* 2. ELEGANT INTRODUCTION & CREATIVE PHILOSOPHY */}
      {isSectionEnabled('sec-intro') && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="text-xs uppercase tracking-[0.25em] text-[#c5a059] font-mono font-medium">
                Creative Philosophy
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#f5eedc] font-normal leading-snug">
                Every sacred union is a masterpiece of emotion, heritage, and timeless grace.
              </h2>
              <p className="text-base text-[#a8a6af] leading-relaxed font-light">
                {settings.storyIntro ||
                  'Rooted in the cultural soul of Janakpur, Kaviya Studio merges cinematic visual storytelling with deep reverence for sacred marriage traditions. We do not simply photograph events; we preserve heirloom memories with timeless elegance, natural skin tones, and evocative lighting.'}
              </p>
              <p className="text-sm text-[#93919b] leading-relaxed font-light">
                {settings.philosophy ||
                  'From the emotional tears during Kanyadaan to the vibrant joy of your reception, our cameras document genuine moments unobtrusively, giving you photographs and films that will be cherished for generations.'}
              </p>

              <div className="pt-4 flex items-center gap-6">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#d4b470] hover:text-[#f5eedc] font-medium transition-colors"
                >
                  <span>Read our full story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[#3b3b4a]">·</span>
                <span className="text-xs text-[#7d7b86]">Based in {settings.address || 'Basahiya-24, Janakpur'}</span>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded overflow-hidden shadow-2xl border border-[#232330]">
                <img
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=85&w=800"
                  alt="Wedding ceremony captured by Kaviya Studio"
                  className="w-full aspect-[4/5] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-[#0d0d12]/90 backdrop-blur-md rounded border border-[#262635]">
                  <p className="text-xs text-[#c5a059] uppercase tracking-wider font-mono">
                    Authentic Moments
                  </p>
                  <p className="text-sm font-serif text-[#f5eedc] mt-0.5">
                    Natural skin tones & heartfelt documentary pacing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. FEATURED WEDDING PHOTOGRAPHS */}
      {isSectionEnabled('sec-featured-works') && (
        <section className="py-20 bg-[#0d0d11] border-y border-[#1a1a24]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#c5a059] font-mono">
                  Curated Portfolio
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif text-[#f5eedc] mt-2 font-normal">
                  Featured Wedding Stories
                </h2>
              </div>
              <Link
                to="/portfolio"
                className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#d4b470] hover:text-[#f5eedc] transition-colors"
              >
                <span>View All Albums</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredGallery.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => openLightbox(idx)}
                  className="group relative cursor-pointer overflow-hidden rounded bg-[#14141c] border border-[#22222e] hover:border-[#c5a059]/50 transition-all duration-300"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                    {item.videoUrl && (
                      <div className="absolute top-3 right-3 p-2 bg-[#09090b]/80 backdrop-blur rounded-full text-[#c5a059] border border-[#2a2a3a]">
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#09090b]/85 backdrop-blur text-xs uppercase tracking-wider text-[#d4b470] rounded border border-[#c5a059]/30">
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Photograph</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs text-[#71707c] mb-1.5">
                      <span className="uppercase tracking-wider text-[#c5a059] font-mono">
                        {item.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#71707c]" />
                        <span>{item.location}</span>
                      </span>
                    </div>
                    <h3 className="text-base font-serif text-[#f5eedc] font-medium group-hover:text-[#d4b470] transition-colors">
                      {item.title}
                    </h3>
                    {item.coupleOrClient && (
                      <p className="text-xs text-[#a8a6af] mt-1 font-light">
                        {item.coupleOrClient}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. SERVICES & DISCIPLINES */}
      {isSectionEnabled('sec-services') && (
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#c5a059] font-mono font-medium">
              Our Disciplines
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#f5eedc] mt-2 font-normal">
              Signature Photography & Film Services
            </h2>
            <p className="mt-4 text-sm text-[#a8a6af] leading-relaxed font-light">
              Comprehensive creative coverage customized to each unique ceremony, from traditional
              Maithili rituals to cinematic reception films.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((service) => (
              <div
                key={service.id}
                className="bg-[#101015] border border-[#21212d] hover:border-[#c5a059]/40 rounded overflow-hidden flex flex-col justify-between transition-all duration-300 group"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={service.coverImage}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101015] to-transparent opacity-80" />
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-serif text-[#f5eedc] font-medium group-hover:text-[#c5a059] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-[#a8a6af] leading-relaxed line-clamp-3 font-light">
                      {service.shortDescription || service.description}
                    </p>

                    <ul className="space-y-1.5 pt-2 text-xs text-[#8c8a94]">
                      {service.features.slice(0, 2).map((feat, fidx) => (
                        <li key={fidx} className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-[#c5a059]" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-[#1c1c27] mt-4 flex items-center justify-between">
                  <span className="text-xs text-[#c5a059] font-mono">
                    {service.contactForPrice ? 'Contact for pricing' : service.priceDisplay}
                  </span>
                  <Link
                    to={`/booking?service=${encodeURIComponent(service.title)}`}
                    className="text-xs uppercase tracking-wider text-[#d4b470] hover:text-[#f5eedc] inline-flex items-center gap-1 font-medium"
                  >
                    <span>Inquire</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-widest text-[#f5eedc] border border-[#2a2a38] hover:border-[#c5a059] rounded transition-colors"
            >
              <span>View All Services & Packages</span>
              <ArrowRight className="w-4 h-4 text-[#c5a059]" />
            </Link>
          </div>
        </section>
      )}

      {/* 5. WHY CHOOSE KAVIYA STUDIO */}
      {isSectionEnabled('sec-why-choose') && (
        <section className="py-20 bg-[#0c0c10] border-t border-[#191922]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#c5a059] font-mono">
                  Artistic Distinction
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif text-[#f5eedc] mt-2 font-normal">
                  Why Families Trust Kaviya Studio
                </h2>
                <p className="mt-4 text-sm text-[#a8a6af] leading-relaxed font-light">
                  Weddings in Janakpur are sacred milestones steeped in profound family sentiment and
                  age-old rituals. We blend cultural reverence with modern cinema technology.
                </p>

                <div className="mt-8 space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded bg-[#16161f] border border-[#272736] flex items-center justify-center text-[#c5a059] shrink-0">
                      <Film className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-serif text-[#f5eedc] font-medium">
                        Cinema-Grade Glass & Sensors
                      </h3>
                      <p className="text-xs text-[#9c9aa4] mt-1 leading-relaxed">
                        We shoot on high-dynamic-range cinema cameras and fast prime lenses, ensuring
                        rich shadows, lifelike highlights, and natural skin tones without artificial distortion.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded bg-[#16161f] border border-[#272736] flex items-center justify-center text-[#c5a059] shrink-0">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-serif text-[#f5eedc] font-medium">
                        Deep Respect for Sacred Rituals
                      </h3>
                      <p className="text-xs text-[#9c9aa4] mt-1 leading-relaxed">
                        Our photographers understand every nuance of Maithili, Hindu, and regional
                        wedding rites. We anticipate crucial moments without disrupting the holy ceremonies.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded bg-[#16161f] border border-[#272736] flex items-center justify-center text-[#c5a059] shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-serif text-[#f5eedc] font-medium">
                        Prompt Teaser Delivery
                      </h3>
                      <p className="text-xs text-[#9c9aa4] mt-1 leading-relaxed">
                        Receive your curated highlight photos and social media teaser reel within 72 hours
                        to share with distant loved ones while the excitement is still fresh.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=600"
                    alt="Bride portrait by Kaviya Studio"
                    className="rounded object-cover aspect-[3/4] border border-[#242434]"
                    loading="lazy"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=85&w=600"
                    alt="Couple pre-wedding shoot"
                    className="rounded object-cover aspect-[3/4] translate-y-8 border border-[#242434]"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. CLIENT TESTIMONIALS */}
      {isSectionEnabled('sec-testimonials') && (
        <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#c5a059] font-mono font-medium">
              Kind Words
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#f5eedc] mt-2 font-normal">
              Memories Cherished by Our Couples
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-[#111116] border border-[#222230] p-7 rounded flex flex-col justify-between hover:border-[#c5a059]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#c5a059] mb-4">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <span key={i} className="text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-xs text-[#a8a6af] leading-relaxed italic font-serif text-[15px]">
                    "{testimonial.quote}"
                  </p>
                </div>

                <div className="pt-6 border-t border-[#1b1b26] mt-6 flex items-center gap-3">
                  {testimonial.photoUrl ? (
                    <img
                      src={testimonial.photoUrl}
                      alt={testimonial.clientName}
                      className="w-9 h-9 rounded-full object-cover border border-[#c5a059]/40"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#1e1e2b] flex items-center justify-center text-[#c5a059] font-serif text-sm">
                      {testimonial.clientName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-semibold text-[#f5eedc]">
                      {testimonial.clientName}
                    </h4>
                    <p className="text-[11px] text-[#787682] font-mono">
                      {testimonial.eventType} · {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center flex items-center justify-center gap-4 text-xs">
            <Link
              to="/testimonials"
              className="text-[#d4b470] hover:text-[#f5eedc] uppercase tracking-wider font-medium"
            >
              Read All Reviews or Share Your Experience →
            </Link>
          </div>
        </section>
      )}

      {/* 7. INSTAGRAM PREVIEW */}
      {isSectionEnabled('sec-instagram') && (
        <section className="py-16 bg-[#0c0c10] border-t border-[#191922]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#a8a6af] mb-2 font-mono">
              <Instagram className="w-4 h-4 text-[#c5a059]" />
              <span>Follow Our Journey</span>
            </div>
            <h2 className="text-2xl font-serif text-[#f5eedc]">
              <a
                href={settings.socialLinks?.instagram || 'https://www.instagram.com/themicromax11'}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#c5a059] transition-colors inline-flex items-center gap-1.5"
              >
                <span>{settings.instagram || '@themicromax11'}</span>
              </a>
            </h2>
            <p className="text-xs text-[#7d7b86] mt-1">
              Behind the scenes, fresh ceremony reels, and latest captures from Janakpur.
            </p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {gallery.slice(0, 6).map((item, i) => (
                <a
                  key={i}
                  href={settings.socialLinks?.instagram || 'https://www.instagram.com/themicromax11'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square overflow-hidden rounded bg-[#16161f] border border-[#232330]"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[#09090b]/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[#c5a059]">
                    <Instagram className="w-5 h-5" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. FINAL BOOKING CTA BANNER */}
      {isSectionEnabled('sec-cta') && (
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#0f0f15] to-[#08080a] border-t border-[#1e1e2a]">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] text-[#c5a059] font-mono">
              Secure Your Wedding Date
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#f5eedc] font-normal leading-tight">
              Let Us Craft Heirloom Memories for Your Special Day
            </h2>
            <p className="text-sm sm:text-base text-[#a8a6af] font-light max-w-2xl mx-auto leading-relaxed">
              Popular dates during auspicious marriage seasons fill quickly. Reach out to verify studio
              crew availability and discuss tailored packages.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/booking"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] text-xs font-semibold uppercase tracking-widest rounded transition-all shadow-[0_4px_16px_rgba(197,160,89,0.25)]"
              >
                Start Booking Inquiry
              </Link>
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                  'Hello Kaviya Studio, I would like to inquire about wedding photography availability.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#14141c] hover:bg-[#1e1e2a] border border-[#2b2b3a] hover:border-[#c5a059] text-[#f5eedc] text-xs font-medium uppercase tracking-widest rounded transition-all"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div className="pt-6 text-xs text-[#71707c] flex items-center justify-center gap-6">
              <span>Direct Studio: {settings.phone || '+977 981-0004918'}</span>
              <span aria-hidden="true">·</span>
              <span>{settings.address || 'Basahiya-24, Janakpur'}</span>
            </div>
          </div>
        </section>
      )}

      {/* Lightbox for photographs */}
      <LightboxModal
        items={featuredGallery}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />
    </div>
  );
};
