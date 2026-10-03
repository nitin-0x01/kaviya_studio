import React, { useState } from 'react';
import {
  Palette,
  Check,
  Sparkles,
  Type,
  Layout,
  Sun,
  Moon,
} from 'lucide-react';
import { StudioSettings } from '../../types';

interface AppearanceModuleProps {
  settings: StudioSettings;
  onSave: (updated: Partial<StudioSettings>) => Promise<void>;
  onNotify: (type: 'success' | 'error', message: string) => void;
}

export const AppearanceModule: React.FC<AppearanceModuleProps> = ({
  settings,
  onSave,
  onNotify,
}) => {
  const [formData, setFormData] = useState<StudioSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);

  const appearance = formData.appearance || {
    primaryColor: '#c5a059',
    accentColor: '#d4b470',
    backgroundColor: '#09090b',
    headingFont: 'Cormorant Garamond',
    bodyFont: 'Plus Jakarta Sans',
    borderRadius: 'md',
    themeMode: 'dark',
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({ appearance });
      onNotify('success', 'Visual style and appearance configuration saved.');
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to save appearance settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif text-[#f5eedc]">Website Appearance & Styling</h2>
          <p className="text-xs text-[#8e8c99]">
            Customize the luxurious brand colors, editorial serif typography, and border stylings.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] text-xs font-semibold uppercase tracking-wider transition-all shadow-md self-start sm:self-auto"
        >
          <Check className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Appearance'}</span>
        </button>
      </div>

      {/* Live Swatch Preview */}
      <div className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-5 space-y-3">
        <span className="text-xs uppercase font-mono tracking-wider text-[#8e8c99]">
          Luxury Palette Preview
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-lg bg-[#09090b] border border-[#222232] text-center">
            <div className="w-6 h-6 rounded-full bg-[#09090b] border border-[#444] mx-auto mb-2" />
            <span className="text-xs text-[#f5eedc] font-medium block">Charcoal Black</span>
            <span className="text-[10px] text-[#716f7c] font-mono">#09090B</span>
          </div>
          <div className="p-4 rounded-lg bg-[#14141d] border border-[#222232] text-center">
            <div className="w-6 h-6 rounded-full bg-[#c5a059] mx-auto mb-2 shadow" />
            <span className="text-xs text-[#f5eedc] font-medium block">Champagne Gold</span>
            <span className="text-[10px] text-[#c5a059] font-mono">{appearance.primaryColor}</span>
          </div>
          <div className="p-4 rounded-lg bg-[#14141d] border border-[#222232] text-center">
            <div className="w-6 h-6 rounded-full bg-[#d4b470] mx-auto mb-2 shadow" />
            <span className="text-xs text-[#f5eedc] font-medium block">Warm Ivory Accent</span>
            <span className="text-[10px] text-[#d4b470] font-mono">{appearance.accentColor}</span>
          </div>
          <div className="p-4 rounded-lg bg-[#14141d] border border-[#222232] text-center">
            <div className="w-6 h-6 rounded-full bg-[#8c6d3b] mx-auto mb-2 shadow" />
            <span className="text-xs text-[#f5eedc] font-medium block">Muted Bronze</span>
            <span className="text-[10px] text-[#8c6d3b] font-mono">#8C6D3B</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        <div className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-6 space-y-4 text-xs">
          <h3 className="text-sm font-serif text-[#f5eedc] border-b border-[#1f1f2d] pb-3">
            Color Palette & Fonts
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase font-mono text-[#8e8c99] mb-1">
                Primary Brand Color (Gold)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={appearance.primaryColor}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      appearance: { ...appearance, primaryColor: e.target.value },
                    })
                  }
                  className="w-10 h-9 bg-transparent border border-[#262638] rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={appearance.primaryColor}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      appearance: { ...appearance, primaryColor: e.target.value },
                    })
                  }
                  className="flex-1 bg-[#14141d] border border-[#262638] rounded px-3 py-2 text-[#f5eedc] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block uppercase font-mono text-[#8e8c99] mb-1">
                Accent Highlight Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={appearance.accentColor}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      appearance: { ...appearance, accentColor: e.target.value },
                    })
                  }
                  className="w-10 h-9 bg-transparent border border-[#262638] rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={appearance.accentColor}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      appearance: { ...appearance, accentColor: e.target.value },
                    })
                  }
                  className="flex-1 bg-[#14141d] border border-[#262638] rounded px-3 py-2 text-[#f5eedc] font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase font-mono text-[#8e8c99] mb-1">
                Heading Serif Typography
              </label>
              <select
                value={appearance.headingFont}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    appearance: { ...appearance, headingFont: e.target.value as any },
                  })
                }
                className="w-full bg-[#14141d] border border-[#262638] rounded px-3 py-2 text-[#f5eedc]"
              >
                <option value="Cormorant Garamond">Cormorant Garamond (International Editorial)</option>
                <option value="Cinzel">Cinzel (Regal Classical Roman)</option>
                <option value="Playfair Display">Playfair Display (Modern Serif)</option>
              </select>
            </div>

            <div>
              <label className="block uppercase font-mono text-[#8e8c99] mb-1">
                Body Sans-Serif Typography
              </label>
              <select
                value={appearance.bodyFont}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    appearance: { ...appearance, bodyFont: e.target.value as any },
                  })
                }
                className="w-full bg-[#14141d] border border-[#262638] rounded px-3 py-2 text-[#f5eedc]"
              >
                <option value="Plus Jakarta Sans">Plus Jakarta Sans (Crisp Modern)</option>
                <option value="Inter">Inter (Ultra Clean)</option>
                <option value="System">System Native</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase font-mono text-[#8e8c99] mb-1">
                UI Corner Radius
              </label>
              <select
                value={appearance.borderRadius}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    appearance: { ...appearance, borderRadius: e.target.value as any },
                  })
                }
                className="w-full bg-[#14141d] border border-[#262638] rounded px-3 py-2 text-[#f5eedc]"
              >
                <option value="sm">Subtle (sm - 4px)</option>
                <option value="md">Balanced (md - 8px / 12px)</option>
                <option value="lg">Smooth (lg - 16px)</option>
                <option value="none">Sharp Architectural (0px)</option>
              </select>
            </div>

            <div>
              <label className="block uppercase font-mono text-[#8e8c99] mb-1">
                Theme Display Mode
              </label>
              <div className="flex items-center gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#f5eedc]">
                  <input
                    type="radio"
                    name="themeMode"
                    value="dark"
                    checked={appearance.themeMode === 'dark'}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        appearance: { ...appearance, themeMode: 'dark' },
                      })
                    }
                    className="accent-[#c5a059]"
                  />
                  <Moon className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Cinematic Charcoal Dark (Default)</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
