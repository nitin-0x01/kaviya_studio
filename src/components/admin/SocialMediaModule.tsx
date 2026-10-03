import React, { useState } from 'react';
import {
  Share2,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  ExternalLink,
  Check,
  Globe,
} from 'lucide-react';
import { SocialLinks, StudioSettings } from '../../types';

interface SocialMediaModuleProps {
  settings: StudioSettings;
  onSave: (updated: Partial<StudioSettings>) => Promise<void>;
  onNotify: (type: 'success' | 'error', message: string) => void;
}

export const SocialMediaModule: React.FC<SocialMediaModuleProps> = ({
  settings,
  onSave,
  onNotify,
}) => {
  const [socials, setSocials] = useState<SocialLinks>(
    settings.socialLinks || {
      instagram: 'https://instagram.com/kaviyastudio',
      facebook: 'https://facebook.com/kaviyastudio',
      youtube: 'https://youtube.com/@kaviyastudio',
      whatsapp: 'https://wa.me/9779800000000',
      tiktok: '',
    }
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({ socialLinks: socials });
      onNotify('success', 'Social media channel links updated.');
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to save social links.');
    } finally {
      setIsSaving(false);
    }
  };

  const platforms = [
    {
      id: 'instagram',
      label: 'Instagram Profile',
      icon: Instagram,
      color: 'text-pink-400',
      value: socials.instagram,
      placeholder: 'https://instagram.com/kaviyastudio',
    },
    {
      id: 'facebook',
      label: 'Facebook Page',
      icon: Facebook,
      color: 'text-blue-400',
      value: socials.facebook,
      placeholder: 'https://facebook.com/kaviyastudio',
    },
    {
      id: 'youtube',
      label: 'YouTube Channel (Cinematics)',
      icon: Youtube,
      color: 'text-red-400',
      value: socials.youtube,
      placeholder: 'https://youtube.com/@kaviyastudio',
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp Business Chat',
      icon: MessageCircle,
      color: 'text-emerald-400',
      value: socials.whatsapp,
      placeholder: 'https://wa.me/9779800000000',
    },
    {
      id: 'tiktok',
      label: 'TikTok Reel Handle (Optional)',
      icon: Globe,
      color: 'text-cyan-400',
      value: socials.tiktok || '',
      placeholder: 'https://tiktok.com/@kaviyastudio',
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif text-[#f5eedc]">Social Media Manager</h2>
          <p className="text-xs text-[#8e8c99]">
            Connect your studio's Instagram, YouTube wedding films, and direct WhatsApp channel.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] text-xs font-semibold uppercase tracking-wider transition-all shadow-md self-start sm:self-auto"
        >
          <Check className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Social Links'}</span>
        </button>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-4">
        <div className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-serif text-[#f5eedc] border-b border-[#1f1f2d] pb-3">
            Connected Channels
          </h3>

          <div className="space-y-4 text-xs">
            {platforms.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.id}>
                  <label className="block uppercase font-mono text-[#8e8c99] mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${p.color}`} />
                      <span>{p.label}</span>
                    </span>
                    {p.value && (
                      <a
                        href={p.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-[#c5a059] hover:underline flex items-center gap-1 font-sans"
                      >
                        <span>Test Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </label>
                  <input
                    type="url"
                    value={p.value}
                    onChange={(e) =>
                      setSocials({ ...socials, [p.id]: e.target.value })
                    }
                    placeholder={p.placeholder}
                    className="w-full bg-[#14141d] border border-[#262638] rounded px-3 py-2 text-[#f5eedc] focus:outline-none focus:border-[#c5a059] font-mono"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
};
