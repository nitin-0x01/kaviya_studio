import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, Calendar, MapPin, MessageCircle, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { BookingInquiry } from '../types';

interface BookingTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber?: string;
}

export const BookingTrackModal: React.FC<BookingTrackModalProps> = ({
  isOpen,
  onClose,
  whatsappNumber = '+977 981-0004918',
}) => {
  const [referenceInput, setReferenceInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingInquiry | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceInput.trim()) return;

    setIsLoading(true);
    setError(null);
    setBooking(null);

    try {
      const data = await api.trackBooking(referenceInput.trim());
      setBooking(data);
    } catch (err: any) {
      setError(err.message || 'Booking reference not found. Please verify and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-700/50';
      case 'completed':
        return 'text-blue-400 bg-blue-950/60 border-blue-700/50';
      case 'contacted':
        return 'text-amber-300 bg-amber-950/60 border-amber-700/50';
      case 'pending':
        return 'text-orange-400 bg-orange-950/60 border-orange-700/50';
      case 'cancelled':
        return 'text-red-400 bg-red-950/60 border-red-700/50';
      default:
        return 'text-[#d4b470] bg-[#1d1a12] border-[#c5a059]/40';
    }
  };

  const cleanWhatsApp = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div
      className="fixed inset-0 z-50 bg-[#070709]/85 backdrop-blur-md flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#0f0f14] border border-[#262634] w-full max-w-lg rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#21212d] bg-[#14141c]">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#c5a059]" />
            <h3 className="text-sm uppercase tracking-widest font-serif text-[#f5eedc] font-semibold">
              Track Booking Inquiry
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#888691] hover:text-white p-1 rounded"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input form */}
        <div className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label
                htmlFor="refNum"
                className="block text-xs uppercase tracking-wider text-[#a8a6af] mb-1.5 font-medium"
              >
                Booking Reference Number
              </label>
              <div className="flex gap-2">
                <input
                  id="refNum"
                  type="text"
                  placeholder="e.g. KS-2026-1042"
                  value={referenceInput}
                  onChange={(e) => setReferenceInput(e.target.value.toUpperCase())}
                  className="flex-1 bg-[#181822] border border-[#2e2e40] rounded px-3.5 py-2.5 text-sm text-[#f5eedc] uppercase placeholder:normal-case placeholder:text-[#585663] focus:outline-none focus:border-[#c5a059]"
                />
                <button
                  type="submit"
                  disabled={isLoading || !referenceInput.trim()}
                  className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#d4b470] disabled:opacity-50 text-[#09090b] text-xs font-semibold uppercase tracking-wider rounded transition-colors"
                >
                  {isLoading ? 'Checking...' : 'Track'}
                </button>
              </div>
              <p className="text-[11px] text-[#6c6a75] mt-1.5">
                Check your booking inquiry confirmation screen or WhatsApp message for your reference code.
              </p>
            </div>
          </form>

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 bg-red-950/40 border border-red-800/40 rounded flex items-start gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Booking Found Card */}
          {booking && (
            <div className="mt-5 p-4 bg-[#14141d] border border-[#29293a] rounded space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#21212f]">
                <div>
                  <span className="text-[11px] text-[#71707d] uppercase tracking-wider font-mono">
                    Reference
                  </span>
                  <p className="text-base font-semibold text-[#f5eedc] font-mono">
                    {booking.referenceNumber}
                  </p>
                </div>
                <div
                  className={`px-2.5 py-1 text-xs uppercase tracking-wider font-medium rounded border ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {booking.status.replace('-', ' ')}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#6c6a75] uppercase tracking-wider text-[10px]">Client</span>
                  <p className="text-[#d8d6ce] font-medium">{booking.fullName}</p>
                </div>
                <div>
                  <span className="text-[#6c6a75] uppercase tracking-wider text-[10px]">Event Type</span>
                  <p className="text-[#d8d6ce] font-medium">{booking.eventType}</p>
                </div>
                <div>
                  <span className="text-[#6c6a75] uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#c5a059]" /> Event Date
                  </span>
                  <p className="text-[#d8d6ce] font-medium">{booking.eventDate}</p>
                </div>
                <div>
                  <span className="text-[#6c6a75] uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#c5a059]" /> Location
                  </span>
                  <p className="text-[#d8d6ce] font-medium">{booking.eventLocation}</p>
                </div>
              </div>

              {/* Status explanation */}
              <div className="pt-2 text-xs text-[#a8a6af] bg-[#0c0c11] p-3 rounded border border-[#1e1e2b]">
                {booking.status === 'new' && (
                  <p className="flex items-center gap-1.5 text-amber-300/90">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Inquiry received. The Kaviya Studio coordination team is checking event calendar availability.</span>
                  </p>
                )}
                {booking.status === 'contacted' && (
                  <p className="flex items-center gap-1.5 text-blue-300/90">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Our studio has initiated contact via your preferred channel to discuss specific details and packages.</span>
                  </p>
                )}
                {booking.status === 'pending' && (
                  <p className="flex items-center gap-1.5 text-orange-300/90">
                    <Clock className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span>Session terms and package selection are pending final confirmation and date lock.</span>
                  </p>
                )}
                {booking.status === 'confirmed' && (
                  <p className="flex items-center gap-1.5 text-emerald-300/90">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Booking confirmed! Studio gear and photography crew are officially assigned for your celebration.</span>
                  </p>
                )}
                {booking.status === 'completed' && (
                  <p className="flex items-center gap-1.5 text-blue-300/90">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Event photography and post-production deliverables completed.</span>
                  </p>
                )}
                {booking.status === 'cancelled' && (
                  <p className="text-red-300/90">
                    This inquiry has been closed or cancelled. Please reach out to our team if you wish to reopen it.
                  </p>
                )}
              </div>

              {/* Direct WhatsApp Follow-up */}
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                  `Hello Kaviya Studio, I am following up on my booking inquiry reference ${booking.referenceNumber} for ${booking.eventDate}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs uppercase tracking-wider font-semibold rounded transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp regarding Ref #{booking.referenceNumber}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
