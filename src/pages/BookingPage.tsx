import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Phone,
  Mail,
  Copy,
  Check,
  Search,
} from 'lucide-react';
import { api } from '../services/api';
import { BookingInquiry, PricingPackage, Service } from '../types';

interface BookingPageProps {
  services: Service[];
  packages: PricingPackage[];
  whatsappNumber?: string;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  services,
  packages,
  whatsappNumber = '+977 981-0004918',
}) => {
  const [searchParams] = useSearchParams();
  const preSelectedPackage = searchParams.get('package') || '';
  const preSelectedService = searchParams.get('service') || '';

  const [activeTab, setActiveTab] = useState<'inquire' | 'track'>('inquire');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '+977 ',
    email: '',
    eventType: preSelectedService || 'Wedding Photography & Cinema',
    eventDate: '',
    eventLocation: 'Janakpur, Nepal',
    preferredPackage: preSelectedPackage || 'Premium Wedding Package',
    estimatedBudget: '',
    additionalRequirements: '',
    preferredContactMethod: 'whatsapp' as 'whatsapp' | 'phone' | 'email',
    honeypot: '', // Spam bot trap
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedBooking, setSubmittedBooking] = useState<BookingInquiry | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Track Tab State
  const [trackRef, setTrackRef] = useState('');
  const [trackedBooking, setTrackedBooking] = useState<BookingInquiry | null>(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState<string | null>(null);

  useEffect(() => {
    if (preSelectedPackage) {
      setFormData((prev) => ({ ...prev, preferredPackage: preSelectedPackage }));
    }
    if (preSelectedService) {
      setFormData((prev) => ({ ...prev, eventType: preSelectedService }));
    }
  }, [preSelectedPackage, preSelectedService]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      errors.fullName = 'Full name is required (at least 3 characters)';
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      errors.phone = 'Valid phone number with country code is required';
    }
    if (!formData.email.trim() || !formData.email.includes('@') || !formData.email.includes('.')) {
      errors.email = 'Valid email address is required';
    }
    if (!formData.eventDate) {
      errors.eventDate = 'Event date is required';
    } else {
      const selected = new Date(formData.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        errors.eventDate = 'Event date cannot be in the past';
      }
    }
    if (!formData.eventLocation.trim()) {
      errors.eventLocation = 'Ceremony venue or location is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return; // bot trapped

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await api.submitBooking(formData);
      setSubmittedBooking(res.booking);
    } catch (err: any) {
      setSubmitError(err.message || 'Submission failed. Please check your network and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackRef.trim()) return;

    setTrackLoading(true);
    setTrackError(null);
    setTrackedBooking(null);

    try {
      const data = await api.trackBooking(trackRef.trim());
      setTrackedBooking(data);
    } catch (err: any) {
      setTrackError(err.message || 'Booking reference code not found.');
    } finally {
      setTrackLoading(false);
    }
  };

  const copyReference = () => {
    if (!submittedBooking?.referenceNumber) return;
    navigator.clipboard.writeText(submittedBooking.referenceNumber);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  const cleanWhatsApp = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen bg-[#09090b] text-[#e4e2dd] pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center pb-8">
          <span className="text-xs uppercase tracking-[0.3em] text-[#c5a059] font-mono">
            Booking & Reservation
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#f5eedc] mt-2 font-normal">
            Inquire About Your Wedding Date
          </h1>
          <p className="mt-3 text-sm text-[#a8a6af] font-light max-w-xl mx-auto leading-relaxed">
            Reserve your date with Kaviya Studio. We take limited celebrations each season to give
            every family our undivided creative focus.
          </p>

          {/* Mode Switch Tabs */}
          <div className="mt-8 inline-flex items-center p-1 bg-[#14141c] border border-[#232330] rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('inquire')}
              className={`px-5 py-2 text-xs uppercase tracking-wider font-medium rounded transition-colors ${
                activeTab === 'inquire'
                  ? 'bg-[#c5a059] text-[#09090b] font-semibold'
                  : 'text-[#9c9aa5] hover:text-[#f5eedc]'
              }`}
            >
              New Date Inquiry
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('track')}
              className={`px-5 py-2 text-xs uppercase tracking-wider font-medium rounded transition-colors flex items-center gap-1.5 ${
                activeTab === 'track'
                  ? 'bg-[#c5a059] text-[#09090b] font-semibold'
                  : 'text-[#9c9aa5] hover:text-[#f5eedc]'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track Existing Booking</span>
            </button>
          </div>
        </div>

        {/* TAB 1: NEW INQUIRY FORM */}
        {activeTab === 'inquire' && (
          <div>
            {submittedBooking ? (
              /* Success / Confirmation Screen */
              <div className="bg-[#0f0f15] border border-[#272738] rounded-xl p-8 sm:p-12 shadow-2xl space-y-6 text-center animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest text-[#c5a059] font-mono">
                    Inquiry Submitted Successfully
                  </span>
                  <h2 className="text-3xl font-serif text-[#f5eedc]">
                    Thank You, {submittedBooking.fullName}
                  </h2>
                  <p className="text-sm text-[#a8a6af] max-w-lg mx-auto leading-relaxed font-light">
                    Your inquiry has been placed into our review queue. Please note: this submission is
                    a reservation request and does not automatically guarantee date lock until our studio
                    confirms team availability with you.
                  </p>
                </div>

                {/* Reference Box */}
                <div className="bg-[#14141d] border border-[#2a2a3c] rounded-lg p-5 max-w-md mx-auto space-y-2">
                  <span className="text-[11px] uppercase tracking-wider text-[#7e7c88] font-mono block">
                    Your Unique Booking Reference
                  </span>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl font-mono font-bold tracking-widest text-[#f5eedc]">
                      {submittedBooking.referenceNumber}
                    </span>
                    <button
                      type="button"
                      onClick={copyReference}
                      className="p-2 bg-[#1f1f2c] hover:bg-[#2b2b3d] text-[#c5a059] rounded transition-colors"
                      title="Copy Reference Number"
                    >
                      {copiedRef ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-[#6d6b77]">
                    Save this reference code to check your status or quote it when calling our studio.
                  </p>
                </div>

                {/* Event Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#121219] p-4 rounded max-w-2xl mx-auto border border-[#1e1e2b] text-left">
                  <div>
                    <span className="text-[#686672] uppercase tracking-wider text-[10px] block">Event Date</span>
                    <span className="font-medium text-[#d8d6ce]">{submittedBooking.eventDate}</span>
                  </div>
                  <div>
                    <span className="text-[#686672] uppercase tracking-wider text-[10px] block">Location</span>
                    <span className="font-medium text-[#d8d6ce]">{submittedBooking.eventLocation}</span>
                  </div>
                  <div>
                    <span className="text-[#686672] uppercase tracking-wider text-[10px] block">Package</span>
                    <span className="font-medium text-[#d8d6ce]">{submittedBooking.preferredPackage}</span>
                  </div>
                  <div>
                    <span className="text-[#686672] uppercase tracking-wider text-[10px] block">Current Status</span>
                    <span className="font-medium text-amber-400 uppercase font-mono text-[11px]">
                      {submittedBooking.status}
                    </span>
                  </div>
                </div>

                {/* Instant WhatsApp Action */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                      `Hello Kaviya Studio, I just submitted an inquiry on your website with Reference Code: ${submittedBooking.referenceNumber} for my wedding on ${submittedBooking.eventDate}. I would like to discuss package options.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs uppercase tracking-wider font-semibold rounded flex items-center justify-center gap-2 transition-colors shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Instant Chat on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedBooking(null);
                      setFormData((prev) => ({
                        ...prev,
                        fullName: '',
                        email: '',
                        additionalRequirements: '',
                      }));
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-[#171722] hover:bg-[#20202e] text-[#a8a6af] hover:text-[#f5eedc] text-xs uppercase tracking-wider rounded border border-[#2b2b3b] transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              /* The Booking Inquiry Form */
              <form
                onSubmit={handleSubmit}
                className="bg-[#0f0f15] border border-[#21212d] rounded-xl p-6 sm:p-10 shadow-2xl space-y-6"
                noValidate
              >
                {/* Honeypot anti-spam field */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                {submitError && (
                  <div className="p-4 bg-red-950/40 border border-red-800/40 rounded flex items-start gap-3 text-xs text-red-300">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#a8a6af] mb-1.5 font-medium">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar Jha"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`w-full bg-[#14141c] border ${
                        formErrors.fullName ? 'border-red-500' : 'border-[#262635]'
                      } rounded px-3.5 py-2.5 text-sm text-[#f5eedc] focus:outline-none focus:border-[#c5a059]`}
                    />
                    {formErrors.fullName && (
                      <p className="text-[11px] text-red-400 mt-1">{formErrors.fullName}</p>
                    )}
                  </div>

                  {/* Phone with Country Code */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#a8a6af] mb-1.5 font-medium">
                      Phone Number (with Country Code) *
                    </label>
                    <input
                      type="tel"
                      placeholder="+977 981-XXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full bg-[#14141c] border ${
                        formErrors.phone ? 'border-red-500' : 'border-[#262635]'
                      } rounded px-3.5 py-2.5 text-sm text-[#f5eedc] focus:outline-none focus:border-[#c5a059]`}
                    />
                    {formErrors.phone && (
                      <p className="text-[11px] text-red-400 mt-1">{formErrors.phone}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#a8a6af] mb-1.5 font-medium">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full bg-[#14141c] border ${
                        formErrors.email ? 'border-red-500' : 'border-[#262635]'
                      } rounded px-3.5 py-2.5 text-sm text-[#f5eedc] focus:outline-none focus:border-[#c5a059]`}
                    />
                    {formErrors.email && (
                      <p className="text-[11px] text-red-400 mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  {/* Event Type */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#a8a6af] mb-1.5 font-medium">
                      Event Category *
                    </label>
                    <select
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      className="w-full bg-[#14141c] border border-[#262635] rounded px-3.5 py-2.5 text-sm text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                    >
                      <option value="Wedding Photography & Cinema">Wedding Photography & Cinema</option>
                      <option value="Pre-Wedding Shoot">Pre-Wedding Shoot</option>
                      <option value="Traditional Maithili Rituals">Traditional Maithili Rituals</option>
                      <option value="Engagement / Ring Ceremony">Engagement / Ring Ceremony</option>
                      <option value="Reception Celebration">Reception Celebration</option>
                      <option value="Birthday & Jubilee">Birthday & Jubilee</option>
                      <option value="Maternity & Baby Milestone">Maternity & Baby Milestone</option>
                      <option value="Portrait Session">Portrait Session</option>
                      <option value="Corporate / Cultural Event">Corporate / Cultural Event</option>
                      <option value="Custom Multi-Day Celebration">Custom Multi-Day Celebration</option>
                    </select>
                  </div>

                  {/* Event Date */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#a8a6af] mb-1.5 font-medium">
                      Anticipated Event Date *
                    </label>
                    <input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className={`w-full bg-[#14141c] border ${
                        formErrors.eventDate ? 'border-red-500' : 'border-[#262635]'
                      } rounded px-3.5 py-2.5 text-sm text-[#f5eedc] focus:outline-none focus:border-[#c5a059]`}
                    />
                    {formErrors.eventDate && (
                      <p className="text-[11px] text-red-400 mt-1">{formErrors.eventDate}</p>
                    )}
                  </div>

                  {/* Event Location */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#a8a6af] mb-1.5 font-medium">
                      Event Location / Venue *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Janakpur Dham, Basahiya, Kathmandu, etc."
                      value={formData.eventLocation}
                      onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                      className={`w-full bg-[#14141c] border ${
                        formErrors.eventLocation ? 'border-red-500' : 'border-[#262635]'
                      } rounded px-3.5 py-2.5 text-sm text-[#f5eedc] focus:outline-none focus:border-[#c5a059]`}
                    />
                    {formErrors.eventLocation && (
                      <p className="text-[11px] text-red-400 mt-1">{formErrors.eventLocation}</p>
                    )}
                  </div>

                  {/* Preferred Package */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#a8a6af] mb-1.5 font-medium">
                      Preferred Package
                    </label>
                    <select
                      value={formData.preferredPackage}
                      onChange={(e) => setFormData({ ...formData, preferredPackage: e.target.value })}
                      className="w-full bg-[#14141c] border border-[#262635] rounded px-3.5 py-2.5 text-sm text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                    >
                      {packages.map((pkg) => (
                        <option key={pkg.id} value={pkg.name}>
                          {pkg.name} ({pkg.contactForPrice || !pkg.price ? 'Custom Quote' : pkg.price})
                        </option>
                      ))}
                      <option value="Undecided / Need Recommendation">
                        Undecided / Need Studio Recommendation
                      </option>
                    </select>
                  </div>

                  {/* Estimated Budget (Optional) */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#a8a6af] mb-1.5 font-medium">
                      Estimated Budget Range (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NPR 50,000 - 150,000"
                      value={formData.estimatedBudget}
                      onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                      className="w-full bg-[#14141c] border border-[#262635] rounded px-3.5 py-2.5 text-sm text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>

                {/* Additional Requirements */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#a8a6af] mb-1.5 font-medium">
                    Ceremony Itinerary & Specific Wishes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your celebration: traditional rituals (Haldi, Mehendi, Swayamvar), multi-venue requirements, drone interest, or special family memories you want highlighted..."
                    value={formData.additionalRequirements}
                    onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                    className="w-full bg-[#14141c] border border-[#262635] rounded px-3.5 py-2.5 text-sm text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                {/* Preferred Contact Method */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#a8a6af] mb-2 font-medium">
                    Preferred Follow-Up Method
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
                      { id: 'phone', label: 'Phone Call', icon: Phone },
                      { id: 'email', label: 'Email', icon: Mail },
                    ].map((method) => {
                      const Icon = method.icon;
                      const isSelected = formData.preferredContactMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              preferredContactMethod: method.id as any,
                            })
                          }
                          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded text-xs uppercase tracking-wider font-medium border transition-colors ${
                            isSelected
                              ? 'bg-[#c5a059] text-[#09090b] border-[#c5a059]'
                              : 'bg-[#14141c] text-[#a8a6af] border-[#252535] hover:text-[#f5eedc]'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{method.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-[#1f1f2b] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-[#73717d]">
                    <span className="text-[#c5a059]">*</span> We never share your personal details.
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#c5a059] hover:bg-[#d4b470] disabled:opacity-50 text-[#09090b] text-xs font-semibold uppercase tracking-widest rounded transition-all shadow-[0_4px_16px_rgba(197,160,89,0.25)] flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{isSubmitting ? 'Submitting Inquiry...' : 'Submit Booking Inquiry'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: TRACK EXISTING BOOKING */}
        {activeTab === 'track' && (
          <div className="bg-[#0f0f15] border border-[#21212d] rounded-xl p-6 sm:p-10 shadow-2xl space-y-6">
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-center">
                <Search className="w-8 h-8 text-[#c5a059] mx-auto mb-2" />
                <h3 className="text-xl font-serif text-[#f5eedc]">
                  Look Up Your Inquiry Status
                </h3>
                <p className="text-xs text-[#8c8a94] mt-1 font-light">
                  Enter your unique reference number (e.g. KS-2026-1042) to check the current review stage.
                </p>
              </div>

              <form onSubmit={handleTrackSubmit} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="KS-2026-XXXX"
                    value={trackRef}
                    onChange={(e) => setTrackRef(e.target.value.toUpperCase())}
                    className="flex-1 bg-[#14141c] border border-[#29293a] rounded px-3.5 py-2.5 text-sm text-[#f5eedc] uppercase placeholder:normal-case focus:outline-none focus:border-[#c5a059]"
                  />
                  <button
                    type="submit"
                    disabled={trackLoading || !trackRef.trim()}
                    className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#d4b470] disabled:opacity-50 text-[#09090b] text-xs font-semibold uppercase tracking-wider rounded transition-colors"
                  >
                    {trackLoading ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </form>

              {trackError && (
                <div className="p-3 bg-red-950/40 border border-red-800/40 rounded flex items-start gap-2 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <span>{trackError}</span>
                </div>
              )}

              {trackedBooking && (
                <div className="mt-6 p-5 bg-[#14141d] border border-[#272738] rounded-lg space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-[#212130]">
                    <div>
                      <span className="text-[10px] text-[#71707d] uppercase tracking-wider font-mono">
                        Reference Code
                      </span>
                      <p className="text-lg font-mono font-bold text-[#f5eedc]">
                        {trackedBooking.referenceNumber}
                      </p>
                    </div>
                    <span className="px-3 py-1 text-xs font-mono uppercase rounded bg-[#1e1a12] text-[#d4b470] border border-[#c5a059]/40">
                      {trackedBooking.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-[#a8a6af]">
                    <div className="flex justify-between">
                      <span className="text-[#686672]">Client Name:</span>
                      <span className="text-[#d8d6ce] font-medium">{trackedBooking.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#686672]">Event Type:</span>
                      <span className="text-[#d8d6ce] font-medium">{trackedBooking.eventType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#686672]">Event Date:</span>
                      <span className="text-[#d8d6ce] font-medium">{trackedBooking.eventDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#686672]">Location:</span>
                      <span className="text-[#d8d6ce] font-medium">{trackedBooking.eventLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#686672]">Package:</span>
                      <span className="text-[#d8d6ce] font-medium">{trackedBooking.preferredPackage}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#1e1e2d]">
                    <a
                      href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                        `Hello Kaviya Studio, following up on inquiry reference ${trackedBooking.referenceNumber}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs uppercase tracking-wider font-semibold rounded flex items-center justify-center gap-2 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat on WhatsApp about this inquiry</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
