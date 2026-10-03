import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Film, Award, Heart, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { StudioSettings } from '../types';

interface AboutPageProps {
  settings: StudioSettings;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings }) => {
  const team = settings.team || [];
  const cleanWhatsApp = (settings.whatsapp || '+977 981-0004918').replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen bg-[#09090b] text-[#e4e2dd] pt-28 pb-20">
      {/* Header Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-16">
        <span className="text-xs uppercase tracking-[0.3em] text-[#c5a059] font-mono">
          About Kaviya Studio
        </span>
        <h1 className="text-4xl sm:text-6xl font-serif text-[#f5eedc] mt-3 font-normal leading-tight">
          Crafting Visual Heirlooms Rooted in Heritage & Love
        </h1>
        <p className="mt-4 text-base sm:text-lg text-[#a8a6af] font-light max-w-2xl mx-auto leading-relaxed">
          Based in Basahiya-24, Janakpur, Nepal. We blend classical fine-art sensitivity with modern
          cinema storytelling to preserve life’s most profound celebrations.
        </p>
      </section>

      {/* Brand Story & Visual Collage */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.2em] text-[#c5a059] font-mono">
              Our Journey & Origins
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#f5eedc] leading-snug">
              Born from a love for Janakpur’s timeless architecture and sacred traditions.
            </h2>
            <p className="text-sm text-[#a8a6af] leading-relaxed font-light">
              {settings.storyIntro ||
                'Janakpur is renowned worldwide as a center of Mithila culture, sacred devotion, and grand marriage rituals commemorating the eternal bond of Sita and Rama. Kaviya Studio was founded with a distinct mission: to bring international-standard cinematic videography and fine-art photography to families in Nepal.'}
            </p>
            <p className="text-sm text-[#a8a6af] leading-relaxed font-light">
              {settings.philosophy ||
                'We recognized that traditional wedding documentation often felt rushed or overly staged. Our visual language is fundamentally different: we seek quiet glances, tears of joy during Kanyadaan, the majestic rustle of silk sarees, and spontaneous laughter with cherished elders.'}
            </p>

            <div className="p-4 bg-[#121217] border border-[#21212c] rounded space-y-2">
              <p className="text-xs text-[#c5a059] uppercase tracking-wider font-mono">
                Verified Studio Location
              </p>
              <p className="text-sm text-[#d8d6ce] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#c5a059] shrink-0" />
                <span>{settings.address || 'Basahiya-24, Janakpur, Nepal'}</span>
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=85&w=800"
                alt="Traditional ceremony by Kaviya Studio"
                className="w-full aspect-[3/4] object-cover rounded border border-[#242434]"
              />
              <img
                src="https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=85&w=800"
                alt="Cinematic wedding moment"
                className="w-full aspect-[3/4] object-cover rounded translate-y-6 border border-[#242434]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Creative Philosophy & Equipment Philosophy */}
      <section className="bg-[#0d0d12] border-y border-[#1c1c26] py-20 my-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.25em] text-[#c5a059] font-mono">
              The Craft
            </span>
            <h2 className="text-3xl font-serif text-[#f5eedc] mt-2">
              Our Photographic Approach & Principles
            </h2>
            {settings.approach && (
              <p className="mt-3 text-xs sm:text-sm text-[#a8a6af] font-light leading-relaxed">
                {settings.approach}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-[#13131a] border border-[#222230] rounded space-y-3">
              <div className="w-10 h-10 rounded bg-[#1c1c28] flex items-center justify-center text-[#c5a059]">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif text-[#f5eedc]">Organic Color & True Skin Tones</h3>
              <p className="text-xs text-[#9c9aa5] leading-relaxed font-light">
                We reject harsh artificial filters. Our custom color grading embraces warmth, rich
                shadows, and truthful South Asian skin tones that stay natural decades into the future.
              </p>
            </div>

            <div className="p-6 bg-[#13131a] border border-[#222230] rounded space-y-3">
              <div className="w-10 h-10 rounded bg-[#1c1c28] flex items-center justify-center text-[#c5a059]">
                <Film className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif text-[#f5eedc]">Cinematic Pacing & Hi-Fi Audio</h3>
              <p className="text-xs text-[#9c9aa5] leading-relaxed font-light">
                Wedding films are more than pretty montages. We mic the priest, the couple, and parents
                with wireless audio kits so sacred mantras and touching speeches are crystal clear.
              </p>
            </div>

            <div className="p-6 bg-[#13131a] border border-[#222230] rounded space-y-3">
              <div className="w-10 h-10 rounded bg-[#1c1c28] flex items-center justify-center text-[#c5a059]">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif text-[#f5eedc]">Unobtrusive Reverence</h3>
              <p className="text-xs text-[#9c9aa5] leading-relaxed font-light">
                We stay light on our feet, never blocking the view of guests or interrupting the sacred
                rhythm of the ceremonies. You enjoy your marriage while we immortalize it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Profiles (Admin-Editable, No Invented Credentials) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-[#c5a059] font-mono">
            Artists Behind The Lens
          </span>
          <h2 className="text-3xl font-serif text-[#f5eedc] mt-2">
            Meet the Kaviya Studio Team
          </h2>
          <p className="mt-2 text-xs text-[#8c8a94] font-light">
            Dedicated visual storytellers devoted to perfection and emotional honesty. Profiles are
            maintained directly by the studio management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div
              key={member.id}
              className="bg-[#121217] border border-[#22222f] rounded overflow-hidden flex flex-col justify-between group hover:border-[#c5a059]/40 transition-colors"
            >
              <div>
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-transparent to-transparent opacity-80" />
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-serif text-[#f5eedc] font-medium">
                      {member.name}
                    </h3>
                    {member.experienceYears && (
                      <span className="text-[11px] font-mono text-[#c5a059]">
                        {member.experienceYears}
                      </span>
                    )}
                  </div>
                  <p className="text-xs uppercase tracking-wider text-[#d4b470] font-mono text-[11px]">
                    {member.role}
                  </p>
                  <p className="text-xs text-[#9d9ba5] leading-relaxed pt-1 font-light">
                    {member.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Discussion CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 text-center">
        <div className="p-8 sm:p-12 bg-gradient-to-b from-[#13131a] to-[#0c0c10] border border-[#242435] rounded-xl space-y-5">
          <span className="text-xs uppercase tracking-[0.25em] text-[#c5a059] font-mono">
            Begin the Conversation
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif text-[#f5eedc]">
            Have an upcoming wedding or celebration in Janakpur?
          </h2>
          <p className="text-xs sm:text-sm text-[#a8a6af] max-w-xl mx-auto leading-relaxed font-light">
            We would love to welcome you to our studio in Basahiya or arrange a consultation call to
            hear your plans, understand your vision, and customize a coverage package.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/booking"
              className="px-6 py-3 bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] text-xs font-semibold uppercase tracking-widest rounded transition-all"
            >
              Inquire About Dates
            </Link>
            <a
              href={`https://wa.me/${cleanWhatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#191924] hover:bg-[#222232] text-[#f5eedc] text-xs uppercase tracking-widest rounded border border-[#2e2e42] transition-colors"
            >
              Message on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
