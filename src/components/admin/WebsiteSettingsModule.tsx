import React, { useState } from 'react';
import {
  Settings,
  Check,
  Building,
  Sparkles,
  Bell,
  Mail,
  MessageCircle,
} from 'lucide-react';
import { StudioSettings } from '../../types';

interface WebsiteSettingsModuleProps {
  settings: StudioSettings;
  onSave: (updated: Partial<StudioSettings>) => Promise<void>;
  onNotify: (type: 'success' | 'error', message: string) => void;
}

export const WebsiteSettingsModule: React.FC<WebsiteSettingsModuleProps> = ({
  settings,
  onSave,
  onNotify,
}) => {
  const [formData, setFormData] = useState<StudioSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        brandName: formData.brandName,
        tagline: formData.tagline,
        headline: formData.headline,
        subHeadline: formData.subHeadline,
        integrations: formData.integrations,
      });
      onNotify('success', 'Studio brand configuration saved.');
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif text-[#f5eedc]">Website & Studio Settings</h2>
          <p className="text-xs text-[#8e8c99]">
            Manage foundational brand identity, hero slogans, and notification bridges.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] text-xs font-semibold uppercase tracking-wider transition-all shadow-md self-start sm:self-auto"
        >
          <Check className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        <div className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-6 space-y-4 text-xs">
          <h3 className="text-sm font-serif text-[#f5eedc] border-b border-[#1f1f2d] pb-3">
            Brand Identity & Slogans
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase font-mono text-[#8e8c99] mb-1">
                Studio Brand Name
              </label>
              <input
                type="text"
                required
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full bg-[#14141d] border border-[#262638] rounded px-3 py-2 text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div>
              <label className="block uppercase font-mono text-[#8e8c99] mb-1">Brand Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-[#14141d] border border-[#262638] rounded px-3 py-2 text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
              />
            </div>
          </div>

          <div>
            <label className="block uppercase font-mono text-[#8e8c99] mb-1">Hero Main Headline</label>
            <input
              type="text"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              className="w-full bg-[#14141d] border border-[#262638] rounded px-3 py-2 text-[#f5eedc]"
            />
          </div>

          <div>
            <label className="block uppercase font-mono text-[#8e8c99] mb-1">Hero Subtitle</label>
            <input
              type="text"
              value={formData.subHeadline}
              onChange={(e) => setFormData({ ...formData, subHeadline: e.target.value })}
              className="w-full bg-[#14141d] border border-[#262638] rounded px-3 py-2 text-[#f5eedc]"
            />
          </div>
        </div>

        {/* Client Alerts & Notification Bridges */}
        <div className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-6 space-y-4 text-xs">
          <h3 className="text-sm font-serif text-[#f5eedc] border-b border-[#1f1f2d] pb-3">
            Inquiry Dispatch & WhatsApp Notifications
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-[#14141d] border border-[#242436] rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <MessageCircle className="w-4 h-4" />
                <span>Instant WhatsApp Click-to-Chat</span>
              </div>
              <p className="text-[11px] text-[#8e8c99] leading-relaxed">
                When clients submit a booking inquiry, both the confirmation screen and admin portal
                generate direct 1-click WhatsApp message links with their unique booking reference number.
              </p>
            </div>

            <div className="p-4 bg-[#14141d] border border-[#242436] rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-medium">
                <Mail className="w-4 h-4" />
                <span>Email Notifications Dispatch</span>
              </div>
              <p className="text-[11px] text-[#8e8c99] leading-relaxed">
                Client submissions are automatically stored in the secure database. You can configure
                standard SMTP or Cloud Run transactional email relays for automated client receipt emails.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
