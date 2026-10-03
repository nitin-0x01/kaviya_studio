import React, { useState } from 'react';
import {
  Search,
  Globe,
  Upload,
  Check,
  Share2,
  FileCode,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { StudioSettings } from '../../types';
import { MediaPickerModal } from '../MediaPickerModal';

interface SeoModuleProps {
  settings: StudioSettings;
  onSave: (updated: Partial<StudioSettings>) => Promise<void>;
  onNotify: (type: 'success' | 'error', message: string) => void;
}

export const SeoModule: React.FC<SeoModuleProps> = ({ settings, onSave, onNotify }) => {
  const [formData, setFormData] = useState<StudioSettings>(settings);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const seo = formData.seo || {
    title: 'Kaviya Studio | Timeless Wedding Photography & Cinematic Films | Janakpur, Nepal',
    metaDescription:
      'Janakpur premier wedding photography and cinematic videography studio. Capturing authentic Mithila traditions, royal weddings, and timeless emotional moments.',
    keywords:
      'wedding photography janakpur, nepali wedding photographer, mithila vivah photography, cinematic wedding film nepal, kaviya studio',
    ogImage:
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=85&w=1200',
    canonicalUrl: 'https://kaviyastudio.com',
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({ seo });
      onNotify('success', 'Search Engine Optimization tags updated.');
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to update SEO tags.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif text-[#f5eedc]">SEO & Metadata Manager</h2>
          <p className="text-xs text-[#8e8c99]">
            Configure search engine titles, social media OpenGraph cards, and schema visibility.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] text-xs font-semibold uppercase tracking-wider transition-all shadow-md self-start sm:self-auto"
        >
          <Check className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save SEO Tags'}</span>
        </button>
      </div>

      {/* Google Search Engine Preview Card */}
      <div className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-mono tracking-wider text-[#8e8c99]">
            Google Search Result Preview
          </span>
          <span className="text-[10px] font-mono text-[#716f7c]">Search Snippet</span>
        </div>

        <div className="bg-[#14141d] border border-[#242436] rounded-lg p-4 space-y-1 max-w-2xl font-sans">
          <div className="text-[11px] text-[#22c55e] truncate font-mono">
            {seo.canonicalUrl || 'https://kaviyastudio.com'}
          </div>
          <h4 className="text-sm md:text-base text-[#60a5fa] hover:underline cursor-pointer font-medium leading-snug">
            {seo.title}
          </h4>
          <p className="text-xs text-[#a5a3b0] leading-relaxed line-clamp-2">
            {seo.metaDescription}
          </p>
        </div>
      </div>

      {/* Social Media OpenGraph Card Preview */}
      <div className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-mono tracking-wider text-[#8e8c99]">
            Social Media Share Preview (WhatsApp, Facebook, Twitter)
          </span>
          <Share2 className="w-4 h-4 text-[#716f7c]" />
        </div>

        <div className="bg-[#14141d] border border-[#242436] rounded-xl overflow-hidden max-w-md">
          {seo.ogImage && (
            <img
              src={seo.ogImage}
              alt="OG Preview"
              className="w-full h-44 object-cover"
            />
          )}
          <div className="p-4 space-y-1">
            <span className="text-[10px] uppercase font-mono text-[#716f7c]">
              kaviyastudio.com
            </span>
            <h5 className="text-xs font-semibold text-[#f5eedc] truncate">{seo.title}</h5>
            <p className="text-[11px] text-[#a5a3b0] line-clamp-2 leading-relaxed">
              {seo.metaDescription}
            </p>
          </div>
        </div>
      </div>

      {/* SEO Form */}
      <form onSubmit={handleSaveAll} className="space-y-6">
        <div className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-6 space-y-4 text-xs">
          <h3 className="text-sm font-serif text-[#f5eedc] border-b border-[#1f1f2d] pb-3">
            Search Tags Configuration
          </h3>

          <div>
            <label className="block uppercase font-mono text-[#8e8c99] mb-1">
              Global Meta Title (Max ~65 characters)
            </label>
            <input
              type="text"
              required
              value={seo.title}
              onChange={(e) =>
                setFormData({ ...formData, seo: { ...seo, title: e.target.value } })
              }
              className="w-full bg-[#14141d] border border-[#262638] rounded px-3 py-2 text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
            />
            <span className="text-[10px] text-[#716f7c] font-mono mt-1 block">
              Character count: {seo.title?.length || 0}
            </span>
          </div>

          <div>
            <label className="block uppercase font-mono text-[#8e8c99] mb-1">
              Meta Description (Recommended ~155 characters)
            </label>
            <textarea
              rows={3}
              required
              value={seo.metaDescription}
              onChange={(e) =>
                setFormData({ ...formData, seo: { ...seo, metaDescription: e.target.value } })
              }
              className="w-full bg-[#14141d] border border-[#262638] rounded px-3 py-2 text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
            />
            <span className="text-[10px] text-[#716f7c] font-mono mt-1 block">
              Character count: {seo.metaDescription?.length || 0}
            </span>
          </div>

          <div>
            <label className="block uppercase font-mono text-[#8e8c99] mb-1">
              Keywords (Comma separated)
            </label>
            <input
              type="text"
              value={seo.keywords}
              onChange={(e) =>
                setFormData({ ...formData, seo: { ...seo, keywords: e.target.value } })
              }
              className="w-full bg-[#14141d] border border-[#262638] rounded px-3 py-2 text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
              placeholder="wedding photographer, janakpur, cinematic film..."
            />
          </div>

          <div>
            <label className="block uppercase font-mono text-[#8e8c99] mb-1">
              OpenGraph Social Share Image (1200x630 recommended)
            </label>
            <div className="flex items-center gap-3">
              {seo.ogImage && (
                <img
                  src={seo.ogImage}
                  alt="OG Card"
                  className="w-16 h-10 object-cover rounded border border-[#28283a]"
                />
              )}
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-2 bg-[#1a1a26] border border-[#2b2b3f] text-[#f5eedc] rounded"
              >
                <Upload className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Upload or Select OG Image</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block uppercase font-mono text-[#8e8c99] mb-1">Canonical URL</label>
            <input
              type="url"
              value={seo.canonicalUrl || ''}
              onChange={(e) =>
                setFormData({ ...formData, seo: { ...seo, canonicalUrl: e.target.value } })
              }
              className="w-full bg-[#14141d] border border-[#262638] rounded px-3 py-2 text-[#f5eedc] font-mono"
            />
          </div>
        </div>

        {/* Indexing Files info */}
        <div className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-5 space-y-3">
          <span className="text-xs uppercase font-mono tracking-wider text-[#8e8c99]">
            Search Engine Files
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#13131c] border border-[#222232] rounded-lg flex items-center justify-between hover:border-[#c5a059] transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#c5a059]" />
                <span>View robots.txt</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#716f7c]" />
            </a>

            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#13131c] border border-[#222232] rounded-lg flex items-center justify-between hover:border-[#c5a059] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>View sitemap.xml</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#716f7c]" />
            </a>
          </div>
        </div>
      </form>

      {pickerOpen && (
        <MediaPickerModal
          isOpen={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelect={(url) => {
            setFormData({ ...formData, seo: { ...seo, ogImage: url } });
            setPickerOpen(false);
          }}
          title="Select Social Share Image"
          accept="image"
        />
      )}
    </div>
  );
};
