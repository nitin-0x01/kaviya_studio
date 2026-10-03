import React, { useState } from 'react';
import {
  Upload,
  Plus,
  Trash2,
  Eye,
  Sliders,
  Sparkles,
  Layers,
  ArrowUp,
  ArrowDown,
  Check,
} from 'lucide-react';
import { StudioSettings } from '../../types';
import { MediaPickerModal } from '../MediaPickerModal';

interface HomepageModuleProps {
  settings: StudioSettings;
  onSave: (updated: Partial<StudioSettings>) => Promise<void>;
  onNotify: (type: 'success' | 'error', message: string) => void;
}

export const HomepageModule: React.FC<HomepageModuleProps> = ({ settings, onSave, onNotify }) => {
  const [formData, setFormData] = useState<StudioSettings>(settings);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const heroSlides = formData.heroSlides || [];
  const heroConfig = formData.heroConfig || {
    slideInterval: 6000,
    autoplay: true,
    overlayIntensity: 65,
    ctaPrimaryText: 'Book Your Session',
    ctaPrimaryLink: '/booking',
    ctaSecondaryText: 'Explore Our Portfolio',
    ctaSecondaryLink: '/portfolio',
  };

  const sections = formData.homepageSections || [
    { id: 'sec-hero', name: 'Hero Slideshow', isEnabled: true, order: 1 },
    { id: 'sec-intro', name: 'Creative Philosophy Intro', isEnabled: true, order: 2 },
    { id: 'sec-featured-works', name: 'Featured Wedding Gallery', isEnabled: true, order: 3 },
    { id: 'sec-services', name: 'Signature Services Grid', isEnabled: true, order: 4 },
    { id: 'sec-why-choose', name: 'Why Families Choose Us', isEnabled: true, order: 5 },
    { id: 'sec-testimonials', name: 'Client Testimonials', isEnabled: true, order: 6 },
    { id: 'sec-instagram', name: 'Instagram & Social Feed', isEnabled: true, order: 7 },
    { id: 'sec-cta', name: 'Bottom Booking Banner', isEnabled: true, order: 8 },
  ];

  const handleAddSlide = () => {
    const newSlide = {
      id: `hs-${Date.now()}`,
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=85&w=1920',
      title: 'New Slideshow Frame',
      subtitle: 'Capturing unforgettable memories in Janakpur.',
      category: 'Wedding',
    };
    setFormData({
      ...formData,
      heroSlides: [...heroSlides, newSlide],
    });
  };

  const handleDeleteSlide = (idx: number) => {
    if (heroSlides.length <= 1) {
      alert('Keep at least one hero slide.');
      return;
    }
    const updated = heroSlides.filter((_, i) => i !== idx);
    setFormData({ ...formData, heroSlides: updated });
  };

  const handleMoveSlide = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= heroSlides.length) return;
    const copy = [...heroSlides];
    const temp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = temp;
    setFormData({ ...formData, heroSlides: copy });
  };

  const handleToggleSection = (secId: string) => {
    const updated = sections.map((s) => (s.id === secId ? { ...s, isEnabled: !s.isEnabled } : s));
    setFormData({ ...formData, homepageSections: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      onNotify('success', 'Homepage configuration updated and live!');
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to save homepage settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1c1c28]">
        <div>
          <h2 className="text-xl font-serif text-[#f5eedc]">Homepage Visual Manager</h2>
          <p className="text-xs text-[#8c8a94]">
            Edit hero typography, upload slideshow slides from your local device, and toggle public sections.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 bg-[#c5a059] hover:bg-[#d4b470] disabled:opacity-50 text-[#09090b] text-xs font-semibold uppercase tracking-wider rounded transition-all shadow-md"
        >
          {isSaving ? 'Saving Changes...' : 'Save & Publish Homepage'}
        </button>
      </div>

      {/* Hero Content Text */}
      <div className="bg-[#101016] border border-[#222230] rounded-xl p-6 space-y-4">
        <h3 className="text-sm uppercase tracking-wider text-[#c5a059] font-mono font-medium">
          Hero Headlines & Call-To-Actions
        </h3>

        <div>
          <label className="block text-xs uppercase text-[#a8a6af] mb-1 font-medium">Main Headline *</label>
          <input
            type="text"
            value={formData.headline}
            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            className="w-full bg-[#161622] border border-[#272738] rounded px-3.5 py-2.5 text-sm text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
            required
          />
        </div>

        <div>
          <label className="block text-xs uppercase text-[#a8a6af] mb-1 font-medium">Subtitle *</label>
          <input
            type="text"
            value={formData.subHeadline}
            onChange={(e) => setFormData({ ...formData, subHeadline: e.target.value })}
            className="w-full bg-[#161622] border border-[#272738] rounded px-3.5 py-2.5 text-sm text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs uppercase text-[#a8a6af] mb-1 font-medium">Primary CTA Label</label>
            <input
              type="text"
              value={heroConfig.ctaPrimaryText}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  heroConfig: { ...heroConfig, ctaPrimaryText: e.target.value },
                })
              }
              className="w-full bg-[#161622] border border-[#272738] rounded px-3 py-2 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-[#a8a6af] mb-1 font-medium">Primary CTA Link</label>
            <input
              type="text"
              value={heroConfig.ctaPrimaryLink}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  heroConfig: { ...heroConfig, ctaPrimaryLink: e.target.value },
                })
              }
              className="w-full bg-[#161622] border border-[#272738] rounded px-3 py-2 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-[#a8a6af] mb-1 font-medium">Secondary CTA Label</label>
            <input
              type="text"
              value={heroConfig.ctaSecondaryText}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  heroConfig: { ...heroConfig, ctaSecondaryText: e.target.value },
                })
              }
              className="w-full bg-[#161622] border border-[#272738] rounded px-3 py-2 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-[#a8a6af] mb-1 font-medium">Secondary CTA Link</label>
            <input
              type="text"
              value={heroConfig.ctaSecondaryLink}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  heroConfig: { ...heroConfig, ctaSecondaryLink: e.target.value },
                })
              }
              className="w-full bg-[#161622] border border-[#272738] rounded px-3 py-2 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
            />
          </div>
        </div>

        {/* Sliders for Duration & Overlay */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#1c1c28]">
          <div>
            <div className="flex justify-between text-xs text-[#a8a6af] mb-1">
              <span>Darkness Overlay Intensity</span>
              <span className="font-mono text-[#c5a059]">{heroConfig.overlayIntensity}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="95"
              value={heroConfig.overlayIntensity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  heroConfig: { ...heroConfig, overlayIntensity: Number(e.target.value) },
                })
              }
              className="w-full accent-[#c5a059]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-[#a8a6af] mb-1">
              <span>Slideshow Transition Interval</span>
              <span className="font-mono text-[#c5a059]">{heroConfig.slideInterval / 1000}s</span>
            </div>
            <input
              type="range"
              min="3000"
              max="12000"
              step="1000"
              value={heroConfig.slideInterval}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  heroConfig: { ...heroConfig, slideInterval: Number(e.target.value) },
                })
              }
              className="w-full accent-[#c5a059]"
            />
          </div>
        </div>
      </div>

      {/* Hero Slideshow Manager (Add, upload image from device, delete) */}
      <div className="bg-[#101016] border border-[#222230] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm uppercase tracking-wider text-[#c5a059] font-mono font-medium">
            Hero Slideshow Frames ({heroSlides.length})
          </h3>
          <button
            type="button"
            onClick={handleAddSlide}
            className="px-3 py-1.5 bg-[#191924] hover:bg-[#252538] text-xs text-[#c5a059] rounded border border-[#2b2b3f] flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Slide Frame</span>
          </button>
        </div>

        <div className="space-y-3">
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.id || idx}
              className="p-4 bg-[#14141d] border border-[#252535] rounded-lg flex flex-col md:flex-row items-center gap-4"
            >
              {/* Slide preview image */}
              <div
                onClick={() => {
                  setActiveSlideIndex(idx);
                  setPickerOpen(true);
                }}
                className="relative aspect-video w-full md:w-44 rounded overflow-hidden bg-[#1d1d2b] border border-[#2e2e42] cursor-pointer group shrink-0"
                title="Click to change or upload image from device"
              >
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs text-[#c5a059]">
                  <Upload className="w-4 h-4 mr-1" /> Change
                </div>
              </div>

              {/* Slide text edit */}
              <div className="flex-1 space-y-2 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Slide Title..."
                    value={slide.title}
                    onChange={(e) => {
                      const copy = [...heroSlides];
                      copy[idx].title = e.target.value;
                      setFormData({ ...formData, heroSlides: copy });
                    }}
                    className="bg-[#181824] border border-[#2b2b3d] rounded px-3 py-1.5 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                  />
                  <input
                    type="text"
                    placeholder="Category Tag (e.g. Traditional Wedding)..."
                    value={slide.category}
                    onChange={(e) => {
                      const copy = [...heroSlides];
                      copy[idx].category = e.target.value;
                      setFormData({ ...formData, heroSlides: copy });
                    }}
                    className="bg-[#181824] border border-[#2b2b3d] rounded px-3 py-1.5 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Subtitle or description..."
                  value={slide.subtitle}
                  onChange={(e) => {
                    const copy = [...heroSlides];
                    copy[idx].subtitle = e.target.value;
                    setFormData({ ...formData, heroSlides: copy });
                  }}
                  className="w-full bg-[#181824] border border-[#2b2b3d] rounded px-3 py-1.5 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              {/* Order and delete */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMoveSlide(idx, 'up')}
                  className="p-1.5 bg-[#181824] hover:bg-[#252538] text-[#a8a6af] disabled:opacity-30 rounded"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === heroSlides.length - 1}
                  onClick={() => handleMoveSlide(idx, 'down')}
                  className="p-1.5 bg-[#181824] hover:bg-[#252538] text-[#a8a6af] disabled:opacity-30 rounded"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSlide(idx)}
                  className="p-1.5 bg-[#181824] hover:bg-red-950 text-red-400 rounded"
                  title="Remove Slide"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Homepage Sections Visibility Control */}
      <div className="bg-[#101016] border border-[#222230] rounded-xl p-6 space-y-4">
        <h3 className="text-sm uppercase tracking-wider text-[#c5a059] font-mono font-medium">
          Enable or Disable Homepage Sections
        </h3>
        <p className="text-xs text-[#8c8a94]">
          Toggle any section off if you want to temporarily hide it from the public homepage.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sections.map((sec) => (
            <div
              key={sec.id}
              onClick={() => handleToggleSection(sec.id)}
              className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                sec.isEnabled
                  ? 'bg-[#151520] border-[#c5a059]/40 text-[#f5eedc]'
                  : 'bg-[#0e0e13] border-[#222230] text-[#6a6875]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    sec.isEnabled ? 'bg-[#c5a059]' : 'bg-[#403e48]'
                  }`}
                />
                <span className="text-xs font-medium">{sec.name}</span>
              </div>
              <span className="text-[10px] font-mono uppercase">
                {sec.isEnabled ? 'Enabled' : 'Hidden'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Media Picker Modal for local file upload or library selection */}
      <MediaPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        accept="image"
        title="Select or Upload Hero Photograph"
        onSelect={(url) => {
          if (activeSlideIndex !== null) {
            const copy = [...heroSlides];
            copy[activeSlideIndex].image = url;
            setFormData({ ...formData, heroSlides: copy });
            onNotify('success', 'Hero slide photo updated.');
          }
        }}
      />
    </form>
  );
};
