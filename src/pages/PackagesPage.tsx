import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Calendar, Sparkles, Clock, Users, Camera, Film, Disc, ShieldCheck } from 'lucide-react';
import { PricingPackage } from '../types';

interface PackagesPageProps {
  packages: PricingPackage[];
}

export const PackagesPage: React.FC<PackagesPageProps> = ({ packages }) => {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#e4e2dd] pt-28 pb-24">
      {/* Header Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-14">
        <span className="text-xs uppercase tracking-[0.3em] text-[#c5a059] font-mono">
          Investment & Tiers
        </span>
        <h1 className="text-4xl sm:text-6xl font-serif text-[#f5eedc] mt-3 font-normal leading-tight">
          Curated Wedding & Event Packages
        </h1>
        <p className="mt-4 text-base text-[#a8a6af] font-light max-w-2xl mx-auto leading-relaxed">
          Transparent, all-inclusive photography and cinematic film collections designed for every
          scale of wedding celebration in Janakpur and surrounding regions.
        </p>
      </section>

      {/* Package Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-[#0f0f15] rounded-xl flex flex-col justify-between transition-all duration-300 p-8 border ${
                pkg.isPopular
                  ? 'border-[#c5a059] shadow-[0_0_30px_rgba(197,160,89,0.15)] bg-gradient-to-b from-[#14141d] to-[#0f0f15]'
                  : 'border-[#22222e] hover:border-[#38384a]'
              }`}
            >
              {/* Popular indicator ribbon */}
              {pkg.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#c5a059] text-[#09090b] text-[10px] uppercase font-mono font-bold tracking-widest rounded-full shadow-md">
                  Most Popular for Weddings
                </div>
              )}

              <div>
                {/* Header */}
                <div className="border-b border-[#1f1f2b] pb-6 mb-6">
                  <h2 className="text-2xl font-serif text-[#f5eedc] font-normal">
                    {pkg.name}
                  </h2>
                  <p className="text-xs text-[#a8a6af] mt-2 font-light min-h-[32px]">
                    {pkg.tagline}
                  </p>
                  <div className="mt-4">
                    <span className="text-2xl sm:text-3xl font-serif text-[#c5a059] font-medium">
                      {pkg.contactForPrice || !pkg.price ? 'Contact for pricing' : pkg.price}
                    </span>
                    {!pkg.contactForPrice && pkg.price && (
                      <span className="text-xs text-[#73717d] ml-1">/ celebration</span>
                    )}
                  </div>
                </div>

                {/* Key specs list */}
                <div className="space-y-3.5 text-xs text-[#c5c3cb] mb-8">
                  <div className="flex items-start gap-2.5">
                    <Users className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                    <span>{pkg.photographersCount}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                    <span>{pkg.hours}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Camera className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                    <span>{pkg.editedImages}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Disc className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                    <span>{pkg.album}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Film className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                    <span>{pkg.video}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                    <span>{pkg.drone}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                    <span className="font-mono text-[#d4b470]">{pkg.deliveryTime}</span>
                  </div>
                </div>

                {/* Features Checklist */}
                {pkg.features && pkg.features.length > 0 && (
                  <div className="border-t border-[#1a1a26] pt-6 mb-8">
                    <span className="text-[11px] uppercase tracking-wider text-[#7e7c88] font-mono block mb-3">
                      Included Highlights
                    </span>
                    <ul className="space-y-2 text-xs text-[#a8a6af]">
                      {pkg.features.map((feat, fidx) => (
                        <li key={fidx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#c5a059] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-[#1f1f2b]">
                <Link
                  to={`/booking?package=${encodeURIComponent(pkg.name)}`}
                  className={`w-full py-3 px-4 rounded text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    pkg.isPopular
                      ? 'bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] shadow-[0_2px_12px_rgba(197,160,89,0.25)]'
                      : 'bg-[#181822] hover:bg-[#252535] text-[#f5eedc] border border-[#2b2b3c]'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Select {pkg.name}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Transparency Note */}
        <div className="mt-16 bg-[#111117] border border-[#20202d] rounded-xl p-8 max-w-4xl mx-auto space-y-4 text-center">
          <h3 className="text-xl font-serif text-[#f5eedc]">
            Custom Quotations & Travel Guidelines
          </h3>
          <p className="text-xs sm:text-sm text-[#a8a6af] leading-relaxed max-w-2xl mx-auto font-light">
            Every ceremony is unique. To ensure fair and personalized rates, we provide detailed
            formal proposals once we understand your ritual timeline, venue locations, and required crew
            size. We do not invent arbitrary prices—the studio coordinator will calculate the exact quote for your dates.
          </p>
          <div className="pt-2 flex items-center justify-center gap-4 text-xs font-mono text-[#d4b470]">
            <span>No hidden post-processing charges</span>
            <span>·</span>
            <span>Travel included in Janakpur region</span>
          </div>
        </div>
      </section>
    </div>
  );
};
