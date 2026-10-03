import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Calendar, Sparkles, Filter } from 'lucide-react';
import { Service } from '../types';

interface ServicesPageProps {
  services: Service[];
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ services }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'wedding', label: 'Weddings & Engagements' },
    { id: 'pre-wedding', label: 'Pre-Wedding' },
    { id: 'cinematic', label: 'Cinematic Films' },
    { id: 'portrait', label: 'Portraits' },
    { id: 'event', label: 'Events & Birthdays' },
  ];

  const filteredServices =
    activeFilter === 'all'
      ? services
      : services.filter(
          (s) =>
            s.category === activeFilter ||
            (activeFilter === 'wedding' && (s.category === 'wedding' || s.category === 'custom')) ||
            (activeFilter === 'event' && (s.category === 'event' || s.category === 'maternity'))
        );

  return (
    <div className="min-h-screen bg-[#09090b] text-[#e4e2dd] pt-28 pb-24">
      {/* Header Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-12">
        <span className="text-xs uppercase tracking-[0.3em] text-[#c5a059] font-mono">
          Creative Disciplines
        </span>
        <h1 className="text-4xl sm:text-6xl font-serif text-[#f5eedc] mt-3 font-normal leading-tight">
          Photography & Cinematic Videography Services
        </h1>
        <p className="mt-4 text-base text-[#a8a6af] font-light max-w-2xl mx-auto leading-relaxed">
          From intimate traditional rituals in Janakpur to grand multi-day celebrations. Every service
          is tailored to capture genuine emotion and heirloom visual quality.
        </p>

        {/* Filter Bar (Zero-Pill Discipline: Functional Interactive Segmented Control) */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveFilter(cat.id)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition-colors rounded ${
                activeFilter === cat.id
                  ? 'bg-[#c5a059] text-[#09090b] font-semibold shadow-md'
                  : 'bg-[#14141c] text-[#a8a6af] hover:text-[#f5eedc] border border-[#232330]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Services List */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {filteredServices.map((service, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={service.id}
              id={service.slug}
              className="bg-[#0f0f15] border border-[#21212d] rounded-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 hover:border-[#c5a059]/40 transition-all duration-300"
            >
              {/* Media column */}
              <div
                className={`lg:col-span-5 ${
                  isEven ? 'lg:order-1' : 'lg:order-2'
                } relative rounded overflow-hidden aspect-[4/3] bg-[#161622] border border-[#232332]`}
              >
                <img
                  src={service.coverImage}
                  alt={service.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="uppercase tracking-widest text-[#c5a059] font-mono text-[11px] bg-[#09090b]/80 px-2.5 py-1 rounded">
                    {service.category}
                  </span>
                  <span className="text-[#f5eedc] font-mono bg-[#09090b]/80 px-2.5 py-1 rounded">
                    {service.contactForPrice ? 'Contact for pricing' : service.priceDisplay}
                  </span>
                </div>
              </div>

              {/* Text content column */}
              <div
                className={`lg:col-span-7 space-y-5 ${
                  isEven ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif text-[#f5eedc] font-normal">
                    {service.title}
                  </h2>
                  <p className="mt-2 text-sm text-[#a8a6af] leading-relaxed font-light">
                    {service.description}
                  </p>
                </div>

                {/* Features & Deliverables */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <h3 className="text-xs uppercase tracking-wider text-[#d4b470] font-mono font-medium">
                      Coverage Highlights
                    </h3>
                    <ul className="space-y-1.5 text-xs text-[#9d9ba5]">
                      {service.features.map((feat, fidx) => (
                        <li key={fidx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#c5a059] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xs uppercase tracking-wider text-[#d4b470] font-mono font-medium">
                      What You Receive
                    </h3>
                    <ul className="space-y-1.5 text-xs text-[#9d9ba5]">
                      {service.deliverables.map((del, didx) => (
                        <li key={didx} className="flex items-start gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-[#c5a059] shrink-0 mt-0.5" />
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="pt-4 border-t border-[#1e1e2c] flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-[#71707c] uppercase tracking-wider block font-mono">
                      Pricing Status
                    </span>
                    <span className="text-sm font-medium text-[#f5eedc]">
                      {service.contactForPrice ? 'Contact for custom quote' : service.priceDisplay}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      to={`/packages`}
                      className="px-4 py-2.5 text-xs uppercase tracking-wider text-[#d4b470] hover:text-[#f5eedc] transition-colors"
                    >
                      Compare Packages
                    </Link>
                    <Link
                      to={`/booking?service=${encodeURIComponent(service.title)}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] text-xs font-semibold uppercase tracking-wider rounded transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Service</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Custom Consultation Notice */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 text-center">
        <div className="p-8 bg-[#121218] border border-[#21212d] rounded-lg space-y-3">
          <h3 className="text-xl font-serif text-[#f5eedc]">
            Need a Bespoke Multi-Day Itinerary?
          </h3>
          <p className="text-xs sm:text-sm text-[#a8a6af] leading-relaxed max-w-xl mx-auto font-light">
            Whether your celebration spans across Janakpur Dham, Kathmandu, or cross-border
            destinations, we customize multi-day photography, drone coverage, and video crews to your
            exact ritual itinerary.
          </p>
          <div className="pt-2">
            <Link
              to="/booking?service=Custom%20Photography%20Packages"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#c5a059] hover:text-[#d4b470] font-semibold"
            >
              <span>Build Custom Package</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
