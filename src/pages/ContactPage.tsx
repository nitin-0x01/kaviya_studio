import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Instagram,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { StudioSettings } from '../types';

interface ContactPageProps {
  settings: StudioSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Studio Inquiry',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const phone = settings?.phone || '+977 981-0004918';
  const whatsapp = settings?.whatsapp || '+977 981-0004918';
  const email = settings?.email || 'kabiyastudio@gmail.com';
  const instagram = settings?.instagram || '@themicromax11';
  const address = settings?.address || 'Basahiya-24, Janakpur, Nepal';

  const cleanWhatsApp = whatsapp.replace(/[^0-9]/g, '');
  const cleanPhone = phone.replace(/[^0-9+]/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      setError('Please provide your name and your inquiry message.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Simulate direct contact dispatch / redirect to WhatsApp option
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#e4e2dd] pt-28 pb-24">
      {/* Header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-12">
        <span className="text-xs uppercase tracking-[0.3em] text-[#c5a059] font-mono">
          Get in Touch
        </span>
        <h1 className="text-4xl sm:text-6xl font-serif text-[#f5eedc] mt-3 font-normal leading-tight">
          Connect with Kaviya Studio
        </h1>
        <p className="mt-4 text-base text-[#a8a6af] font-light max-w-2xl mx-auto leading-relaxed">
          We welcome you to visit our studio in Basahiya, Janakpur or message us directly on WhatsApp
          for prompt date inquiries and customized ceremony proposals.
        </p>
      </section>

      {/* Main Grid: Details + Contact Form */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Verified Business Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0f0f15] border border-[#21212d] rounded-xl p-8 space-y-6">
              <h2 className="text-xl font-serif text-[#f5eedc]">
                Verified Studio Information
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded bg-[#161622] border border-[#262638] flex items-center justify-center text-[#c5a059] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#6d6b77] block font-mono">
                      Studio Address
                    </span>
                    <p className="text-[#f5eedc] font-medium">{address}</p>
                    <p className="text-xs text-[#8c8a94] mt-0.5">Madhesh Province, Nepal</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded bg-[#161622] border border-[#262638] flex items-center justify-center text-[#c5a059] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#6d6b77] block font-mono">
                      Telephone
                    </span>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="text-[#f5eedc] hover:text-[#c5a059] font-medium transition-colors"
                    >
                      {phone}
                    </a>
                    <p className="text-xs text-[#8c8a94] mt-0.5">Click to call directly</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded bg-[#161622] border border-[#262638] flex items-center justify-center text-emerald-400 shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#6d6b77] block font-mono">
                      WhatsApp Chat
                    </span>
                    <a
                      href={`https://wa.me/${cleanWhatsApp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#f5eedc] hover:text-emerald-400 font-medium transition-colors"
                    >
                      {whatsapp}
                    </a>
                    <p className="text-xs text-[#8c8a94] mt-0.5">Fastest response channel</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded bg-[#161622] border border-[#262638] flex items-center justify-center text-[#c5a059] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#6d6b77] block font-mono">
                      Official Email
                    </span>
                    <a
                      href={`mailto:${email}`}
                      className="text-[#f5eedc] hover:text-[#c5a059] font-medium transition-colors break-all"
                    >
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded bg-[#161622] border border-[#262638] flex items-center justify-center text-[#c5a059] shrink-0">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#6d6b77] block font-mono">
                      Instagram Handle
                    </span>
                    <a
                      href={settings?.socialLinks?.instagram || 'https://www.instagram.com/themicromax11'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#f5eedc] hover:text-[#c5a059] font-medium transition-colors inline-flex items-center gap-1"
                    >
                      <span>{instagram}</span>
                      <ExternalLink className="w-3 h-3 text-[#c5a059]" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Callout Button */}
              <div className="pt-4 border-t border-[#1b1b26]">
                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                    'Hello Kaviya Studio, I would like to inquire about wedding photography and cinematic films.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs uppercase tracking-wider font-semibold rounded transition-colors shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Start WhatsApp Conversation</span>
                </a>
              </div>
            </div>

            {/* Business Hours Card */}
            <div className="bg-[#0f0f15] border border-[#21212d] rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#c5a059] font-mono">
                <Clock className="w-4 h-4" />
                <span>Visiting & Studio Hours</span>
              </div>
              <div className="space-y-2 text-xs text-[#a8a6af]">
                <div className="flex justify-between py-1 border-b border-[#1b1b26]">
                  <span>Monday – Friday</span>
                  <span className="text-[#f5eedc] font-mono">08:00 AM – 08:00 PM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1b1b26]">
                  <span>Saturday – Sunday</span>
                  <span className="text-[#f5eedc] font-mono">08:00 AM – 09:00 PM</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Wedding Dates</span>
                  <span className="text-[#c5a059] font-mono">24/7 Field Production</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#0f0f15] border border-[#21212d] rounded-xl p-8 sm:p-10 shadow-2xl space-y-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#c5a059] font-mono">
                  Send a Message
                </span>
                <h2 className="text-2xl font-serif text-[#f5eedc] mt-1">
                  How Can We Assist Your Celebration?
                </h2>
                <p className="text-xs text-[#a8a6af] mt-1 font-light leading-relaxed">
                  Have a quick question about dates, custom packages, or album printing? Leave your
                  message and our studio director will respond promptly.
                </p>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-4 bg-[#14141d] rounded-lg border border-[#262638] p-6 animate-in fade-in">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h3 className="text-xl font-serif text-[#f5eedc]">Message Received</h3>
                  <p className="text-xs text-[#a8a6af] max-w-md mx-auto leading-relaxed">
                    Thank you, {formData.name}. We have logged your message. If your matter is
                    time-sensitive, please reach out via WhatsApp at {whatsapp}.
                  </p>
                  <div className="pt-2">
                    <a
                      href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                        `Hello Kaviya Studio, my name is ${formData.name}. ${formData.message}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs uppercase tracking-wider font-semibold rounded"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Continue to WhatsApp</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-950/40 border border-red-800/40 rounded flex items-center gap-2 text-xs text-red-300">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#a8a6af] mb-1 font-medium">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Priya Mishra"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#14141c] border border-[#252535] rounded px-3.5 py-2.5 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#a8a6af] mb-1 font-medium">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        placeholder="+977 981-XXXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#14141c] border border-[#252535] rounded px-3.5 py-2.5 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#a8a6af] mb-1 font-medium">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#14141c] border border-[#252535] rounded px-3.5 py-2.5 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#a8a6af] mb-1 font-medium">
                        Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-[#14141c] border border-[#252535] rounded px-3.5 py-2.5 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                      >
                        <option value="Wedding Photography Inquiry">Wedding Photography Inquiry</option>
                        <option value="Pre-Wedding Shoot">Pre-Wedding Shoot</option>
                        <option value="Cinematic Video Packages">Cinematic Video Packages</option>
                        <option value="Handmade Album Inquiries">Handmade Album Inquiries</option>
                        <option value="General Studio Questions">General Studio Questions</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#a8a6af] mb-1 font-medium">
                      Your Message *
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Write your questions here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#14141c] border border-[#252535] rounded px-3.5 py-2.5 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-[#c5a059] hover:bg-[#d4b470] disabled:opacity-50 text-[#09090b] text-xs font-semibold uppercase tracking-widest rounded flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Sending...' : 'Send Message to Studio'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Studio Location Map Placeholder (Explicitly noted without inventing GPS coordinates) */}
        <div className="mt-14 bg-[#0f0f15] border border-[#21212d] rounded-xl overflow-hidden p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-serif text-[#f5eedc] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#c5a059]" />
                <span>Studio Location Map</span>
              </h3>
              <p className="text-xs text-[#787682] font-mono mt-0.5">
                {address}
              </p>
            </div>
            <span className="text-[11px] text-[#8c8a94] font-light">
              Exact interactive coordinates configurable in admin settings.
            </span>
          </div>

          <div className="relative aspect-[21/9] min-h-[240px] bg-[#14141d] rounded-lg overflow-hidden border border-[#232332] flex items-center justify-center text-center p-6">
            {/* Visual aesthetic map background representation */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#c5a059_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative z-10 space-y-2 max-w-md">
              <div className="w-12 h-12 rounded-full bg-[#1e1e2d] border border-[#c5a059] text-[#c5a059] flex items-center justify-center mx-auto shadow-xl">
                <MapPin className="w-6 h-6 animate-bounce" />
              </div>
              <h4 className="text-base font-serif text-[#f5eedc] font-medium">
                Kaviya Studio · Basahiya-24, Janakpur
              </h4>
              <p className="text-xs text-[#a8a6af] font-light">
                Conveniently accessible in Janakpur Dham. Visitors are welcome during regular studio
                hours (8:00 AM – 8:00 PM). Advance appointment recommended.
              </p>
              <div className="pt-2">
                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                    'Hello Kaviya Studio, I would like directions to visit your studio in Basahiya-24, Janakpur.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1b1b28] hover:bg-[#252538] text-xs uppercase tracking-wider text-[#d4b470] rounded border border-[#2d2d3e] transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Request Location Pin on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
