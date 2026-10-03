import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, MessageCircle, Lock, ArrowUpRight, Youtube, Facebook } from 'lucide-react';
import { Logo } from './Logo';
import { StudioSettings } from '../types';

interface FooterProps {
  settings?: StudioSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const currentYear = new Date().getFullYear();
  const phone = settings?.phone || '+977 981-0004918';
  const whatsapp = settings?.whatsapp || '+977 981-0004918';
  const email = settings?.email || 'kabiyastudio@gmail.com';
  const instagram = settings?.instagram || '@themicromax11';
  const address = settings?.address || 'Basahiya-24, Janakpur, Nepal';

  const cleanWhatsApp = whatsapp.replace(/[^0-9]/g, '');
  const cleanPhone = phone.replace(/[^0-9+]/g, '');

  const footerBio =
    settings?.footerConfig?.bio ||
    'Crafting timeless heirloom photographs and cinematic films. Honoring sacred cultural traditions and authentic emotions in Janakpur and across Nepal.';

  const copyrightText =
    settings?.footerConfig?.copyrightText ||
    `© ${currentYear} Kaviya Studio. All rights reserved. Janakpur, Nepal.`;

  return (
    <footer className="bg-[#070709] border-t border-[#1f1f28] text-[#9c9aa3] pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-[#1c1c24]">
          {/* Column 1 & 2: Brand & Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block group focus:outline-none" title="Kaviya Studio Homepage">
              <Logo size="lg" logoUrl={settings?.logoUrl} />
            </Link>
            <p className="text-sm leading-relaxed text-[#a8a6af] max-w-sm pt-2 font-light">
              {footerBio}
            </p>
            {settings?.footerConfig?.showSocials !== false && (
              <div className="flex items-center gap-3 pt-2">
                <a
                  href={`https://wa.me/${cleanWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded bg-[#121217] border border-[#242430] flex items-center justify-center text-[#d4b470] hover:text-white hover:border-[#c5a059] transition-all"
                  title="Chat on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href={settings?.socialLinks?.instagram || 'https://www.instagram.com/themicromax11'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded bg-[#121217] border border-[#242430] flex items-center justify-center text-[#d4b470] hover:text-white hover:border-[#c5a059] transition-all"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                {settings?.socialLinks?.facebook && (
                  <a
                    href={settings.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded bg-[#121217] border border-[#242430] flex items-center justify-center text-[#d4b470] hover:text-white hover:border-[#c5a059] transition-all"
                    title="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {settings?.socialLinks?.youtube && (
                  <a
                    href={settings.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded bg-[#121217] border border-[#242430] flex items-center justify-center text-[#d4b470] hover:text-white hover:border-[#c5a059] transition-all"
                    title="YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
                <a
                  href={`mailto:${email}`}
                  className="w-9 h-9 rounded bg-[#121217] border border-[#242430] flex items-center justify-center text-[#d4b470] hover:text-white hover:border-[#c5a059] transition-all"
                  title="Email Us"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>

          {/* Column 3: Quick Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#f5eedc] font-semibold mb-4 font-mono">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/portfolio" className="hover:text-[#f5eedc] transition-colors">
                  Portfolio Gallery
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#f5eedc] transition-colors">
                  Photography Services
                </Link>
              </li>
              <li>
                <Link to="/packages" className="hover:text-[#f5eedc] transition-colors">
                  Wedding Packages
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#f5eedc] transition-colors">
                  About Studio & Team
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#f5eedc] transition-colors">
                  Journal & Stories
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="hover:text-[#f5eedc] transition-colors">
                  Client Experiences
                </Link>
              </li>
              <li>
                <Link to="/booking" className="hover:text-[#c5a059] text-[#c5a059] transition-colors">
                  Book Your Date
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Studio Info */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#f5eedc] font-semibold mb-4 font-mono">
              Studio Location
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#c5a059] shrink-0" />
                <a href={`tel:${cleanPhone}`} className="hover:text-white transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#c5a059] shrink-0" />
                <a
                  href={`https://wa.me/${cleanWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: {whatsapp}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#c5a059] shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors break-all">
                  {email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Instagram className="w-4 h-4 text-[#c5a059] shrink-0" />
                <a
                  href={settings?.socialLinks?.instagram || 'https://www.instagram.com/themicromax11'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>{instagram}</span>
                  <ArrowUpRight className="w-3 h-3 text-[#c5a059]" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Business Hours */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#f5eedc] font-semibold mb-4 font-mono">
              Visiting Hours
            </h4>
            <div className="space-y-2 text-sm text-[#8c8a92]">
              {settings?.businessHours ? (
                settings.businessHours.map((bh, idx) => (
                  <div key={idx}>
                    <p className="text-[#d8d6ce] text-xs uppercase tracking-wider font-medium">{bh.days}</p>
                    <p className="text-xs">{bh.hours}</p>
                  </div>
                ))
              ) : (
                <>
                  <div>
                    <p className="text-[#d8d6ce] text-xs uppercase tracking-wider font-medium">Mon – Fri</p>
                    <p className="text-xs">08:00 AM – 08:00 PM</p>
                  </div>
                  <div>
                    <p className="text-[#d8d6ce] text-xs uppercase tracking-wider font-medium">Sat – Sun</p>
                    <p className="text-xs">08:00 AM – 09:00 PM</p>
                  </div>
                </>
              )}
              <div className="pt-2 border-t border-[#1c1c24]">
                <p className="text-[#c5a059] text-xs font-serif italic">
                  {settings?.footerConfig?.customNote || 'Available for destination weddings across Janakpur & Nepal.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6a6872]">
          <div className="flex items-center gap-2">
            <span>{copyrightText}</span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-[#5e5c65] hover:text-[#d4b470] transition-colors"
              title="Secure Studio Administration"
            >
              <Lock className="w-3 h-3" />
              <span>Studio Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
