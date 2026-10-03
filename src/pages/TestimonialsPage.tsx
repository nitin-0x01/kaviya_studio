import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle2, AlertCircle, Quote } from 'lucide-react';
import { Testimonial } from '../types';
import { api } from '../services/api';

interface TestimonialsPageProps {
  testimonials: Testimonial[];
}

export const TestimonialsPage: React.FC<TestimonialsPageProps> = ({ testimonials }) => {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    eventType: 'Traditional Maithili Wedding',
    location: 'Janakpur, Nepal',
    quote: '',
    rating: 5,
    photoUrl: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName.trim() || !formData.quote.trim()) {
      setSubmitError('Please provide your name and your review message.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await api.submitTestimonial(formData);
      setSubmitSuccess(true);
      setTimeout(() => {
        setShowSubmitModal(false);
        setSubmitSuccess(false);
        setFormData({
          clientName: '',
          eventType: 'Traditional Maithili Wedding',
          location: 'Janakpur, Nepal',
          quote: '',
          rating: 5,
          photoUrl: '',
        });
      }, 3000);
    } catch (err: any) {
      setSubmitError(err.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#e4e2dd] pt-28 pb-24">
      {/* Header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-12">
        <span className="text-xs uppercase tracking-[0.3em] text-[#c5a059] font-mono">
          Client Words & Stories
        </span>
        <h1 className="text-4xl sm:text-6xl font-serif text-[#f5eedc] mt-3 font-normal leading-tight">
          Heartfelt Experiences from Couples & Families
        </h1>
        <p className="mt-4 text-base text-[#a8a6af] font-light max-w-2xl mx-auto leading-relaxed">
          The trust of our couples is our greatest reward. Read reflections from families across
          Janakpur and Nepal who invited Kaviya Studio to document their most sacred memories.
        </p>

        <div className="mt-8">
          <button
            type="button"
            onClick={() => setShowSubmitModal(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#14141d] hover:bg-[#1f1f2b] border border-[#2a2a3b] hover:border-[#c5a059] text-xs uppercase tracking-wider text-[#d4b470] rounded transition-colors"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Share Your Experience</span>
          </button>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-[#0f0f15] border border-[#21212d] hover:border-[#c5a059]/40 rounded-xl p-8 flex flex-col justify-between transition-all duration-300 relative group"
            >
              <Quote className="w-8 h-8 text-[#252535] group-hover:text-[#c5a059]/30 transition-colors absolute top-6 right-6" />

              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-[#c5a059] mb-4">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-sm font-serif text-[#e4e2dd] leading-relaxed italic text-[16px]">
                  "{item.quote}"
                </p>
              </div>

              {/* Client Info */}
              <div className="pt-6 border-t border-[#1a1a26] mt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.photoUrl ? (
                    <img
                      src={item.photoUrl}
                      alt={item.clientName}
                      className="w-10 h-10 rounded-full object-cover border border-[#c5a059]/30"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#181824] flex items-center justify-center text-[#c5a059] font-serif text-sm font-semibold">
                      {item.clientName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-semibold text-[#f5eedc]">
                      {item.clientName}
                    </h3>
                    <p className="text-[11px] text-[#787682] font-mono">
                      {item.eventType} · {item.location}
                    </p>
                  </div>
                </div>

                {item.isDemo && (
                  <span className="text-[10px] text-[#615f6a] font-mono italic">
                    Sample Review
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center text-xs text-[#71707c] max-w-xl mx-auto">
          Reviews are submitted by real couples and families and moderated by the Kaviya Studio
          management before publishing.
        </div>
      </section>

      {/* Share Experience Modal */}
      {showSubmitModal && (
        <div
          className="fixed inset-0 z-50 bg-[#070709]/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#101016] border border-[#272738] w-full max-w-lg rounded-xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-5">
            {submitSuccess ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-2xl font-serif text-[#f5eedc]">
                  Thank You for Your Review!
                </h3>
                <p className="text-xs text-[#a8a6af] leading-relaxed max-w-sm mx-auto">
                  Your words mean the world to us. Your review has been submitted for studio
                  moderation and will appear on our site shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#212130]">
                  <h3 className="text-base font-serif text-[#f5eedc]">
                    Share Your Experience with Kaviya Studio
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="text-[#787682] hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                </div>

                {submitError && (
                  <div className="p-3 bg-red-950/40 border border-red-800/40 rounded flex items-center gap-2 text-xs text-red-300">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#a8a6af] mb-1 font-medium">
                    Your Name (or Couple Names) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Aarav & Sunita"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full bg-[#161622] border border-[#28283a] rounded px-3 py-2 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#a8a6af] mb-1 font-medium">
                      Event Type
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Maithili Wedding"
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      className="w-full bg-[#161622] border border-[#28283a] rounded px-3 py-2 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#a8a6af] mb-1 font-medium">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Janakpur"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-[#161622] border border-[#28283a] rounded px-3 py-2 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#a8a6af] mb-1 font-medium">
                    Rating (Stars)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="text-lg p-1 text-[#c5a059]"
                      >
                        {star <= formData.rating ? '★' : '☆'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#a8a6af] mb-1 font-medium">
                    Your Testimonial *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your experience with our team, the photography quality, promptness, or emotional impact..."
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    className="w-full bg-[#161622] border border-[#28283a] rounded px-3 py-2 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 text-xs text-[#8c8a94] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-[#c5a059] hover:bg-[#d4b470] disabled:opacity-50 text-[#09090b] text-xs uppercase tracking-wider font-semibold rounded"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
