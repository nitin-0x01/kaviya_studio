import React, { useState } from 'react';
import {
  Columns,
  Check,
  Eye,
  Sliders,
} from 'lucide-react';
import { StudioSettings } from '../../types';

interface FooterModuleProps {
  settings: StudioSettings;
  onSave: (updated: Partial<StudioSettings>) => Promise<void>;
  onNotify: (type: 'success' | 'error', message: string) => void;
}

export const FooterModule: React.FC<FooterModuleProps> = ({
  settings,
  onSave,
  onNotify,
}) => {
  const [formData, setFormData] = useState<StudioSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);

  const footerConfig = formData.footerConfig || {
    bio: 'Kaviya Studio is Janakpur premier wedding photography and cinematic films collective, preserving sacred rituals and unforgettable human memories across Nepal.',
    copyrightText: '© 2026 Kaviya Studio. All rights reserved. Basahiya-24, Janakpur, Nepal.',
    showSocials: true,
    showHours: true,
    customNote: 'Crafted for timeless heritage weddings and unforgettable cinematic stories.',
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({ footerConfig });
      onNotify('success', 'Footer layout and content updated.');
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to save footer settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif text-[#f5eedc]">Footer Manager</h2>
          <p className="text-xs text-[#8e8c99]">
            Manage studio summary paragraph, copyright line, and social link visibility in the footer.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] text-xs font-semibold uppercase tracking-wider transition-all shadow-md self-start sm:self-auto"
        >
          <Check className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Footer'}</span>
        </button>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        <div className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-6 space-y-4 text-xs">
          <h3 className="text-sm font-serif text-[#f5eedc] border-b border-[#1f1f2d] pb-3">
            Footer Bio & Copy
          </h3>

          <div>
            <label className="block uppercase font-mono text-[#8e8c99] mb-1">
              Studio Summary (Bio)
            </label>
            <textarea
              rows={3}
              value={footerConfig.bio}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  footerConfig: { ...footerConfig, bio: e.target.value },
                })
              }
              className="w-full bg-[#14141d] border border-[#262638] rounded px-3 py-2 text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
            />
          </div>

          <div>
            <label className="block uppercase font-mono text-[#8e8c99] mb-1">
              Copyright Notice
            </label>
            <input
              type="text"
              value={footerConfig.copyrightText}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  footerConfig: { ...footerConfig, copyrightText: e.target.value },
                })
              }
              className="w-full bg-[#14141d] border border-[#262638] rounded px-3 py-2 text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
            />
          </div>

          <div>
            <label className="block uppercase font-mono text-[#8e8c99] mb-1">
              Custom Subtitle / Tagline Note
            </label>
            <input
              type="text"
              value={footerConfig.customNote || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  footerConfig: { ...footerConfig, customNote: e.target.value },
                })
              }
              className="w-full bg-[#14141d] border border-[#262638] rounded px-3 py-2 text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-2 p-3 bg-[#14141d] border border-[#262638] rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={footerConfig.showSocials}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footerConfig: { ...footerConfig, showSocials: e.target.checked },
                  })
                }
                className="accent-[#c5a059] w-4 h-4"
              />
              <span className="text-[#f5eedc]">Show Social Icons (Instagram, YouTube, FB)</span>
            </label>

            <label className="flex items-center gap-2 p-3 bg-[#14141d] border border-[#262638] rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={footerConfig.showHours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footerConfig: { ...footerConfig, showHours: e.target.checked },
                  })
                }
                className="accent-[#c5a059] w-4 h-4"
              />
              <span className="text-[#f5eedc]">Show Operating Hours in Footer</span>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};
