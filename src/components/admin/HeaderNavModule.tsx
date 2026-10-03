import React, { useState } from 'react';
import {
  Navigation,
  Upload,
  Plus,
  Trash2,
  Eye,
  Sliders,
  Check,
  ArrowUp,
  ArrowDown,
  Layers,
} from 'lucide-react';
import { NavItem, StudioSettings } from '../../types';
import { MediaPickerModal } from '../MediaPickerModal';
import { Logo } from '../Logo';

interface HeaderNavModuleProps {
  settings: StudioSettings;
  onSave: (updated: Partial<StudioSettings>) => Promise<void>;
  onNotify: (type: 'success' | 'error', message: string) => void;
}

export const HeaderNavModule: React.FC<HeaderNavModuleProps> = ({
  settings,
  onSave,
  onNotify,
}) => {
  const [formData, setFormData] = useState<StudioSettings>(settings);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const headerConfig = formData.headerConfig || {
    logoWidth: 160,
    isSticky: true,
    appearance: 'glass',
    navItems: [
      { id: 'nav-home', label: 'Home', path: '/', isVisible: true },
      { id: 'nav-about', label: 'About', path: '/about', isVisible: true },
      { id: 'nav-services', label: 'Services', path: '/services', isVisible: true },
      { id: 'nav-portfolio', label: 'Portfolio', path: '/portfolio', isVisible: true },
      { id: 'nav-packages', label: 'Packages', path: '/packages', isVisible: true },
      { id: 'nav-testimonials', label: 'Testimonials', path: '/testimonials', isVisible: true },
      { id: 'nav-contact', label: 'Contact', path: '/contact', isVisible: true },
    ],
  };

  const navItems = headerConfig.navItems || [];

  const handleToggleItem = (id: string) => {
    const updated = navItems.map((item) =>
      item.id === id ? { ...item, isVisible: !item.isVisible } : item
    );
    setFormData({
      ...formData,
      headerConfig: { ...headerConfig, navItems: updated },
    });
  };

  const handleUpdateItem = (id: string, label: string, path: string) => {
    const updated = navItems.map((item) =>
      item.id === id ? { ...item, label, path } : item
    );
    setFormData({
      ...formData,
      headerConfig: { ...headerConfig, navItems: updated },
    });
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= navItems.length) return;
    const items = [...navItems];
    const [moved] = items.splice(index, 1);
    items.splice(target, 0, moved);
    setFormData({
      ...formData,
      headerConfig: { ...headerConfig, navItems: items },
    });
  };

  const handleAddNavItem = () => {
    const newItem: NavItem = {
      id: `nav-${Date.now()}`,
      label: 'New Link',
      path: '/new-page',
      isVisible: true,
    };
    setFormData({
      ...formData,
      headerConfig: { ...headerConfig, navItems: [...navItems, newItem] },
    });
  };

  const handleDeleteNavItem = (id: string) => {
    const updated = navItems.filter((i) => i.id !== id);
    setFormData({
      ...formData,
      headerConfig: { ...headerConfig, navItems: updated },
    });
  };

  const handleSelectLogo = (url: string) => {
    setFormData({ ...formData, logoUrl: url });
    setPickerOpen(false);
    onNotify('success', 'Studio logo asset updated.');
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await onSave({
        logoUrl: formData.logoUrl,
        logoMotif: formData.logoMotif,
        headerConfig: formData.headerConfig,
      });
      onNotify('success', 'Header and navigation settings published to live website.');
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to save navigation.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif text-[#f5eedc]">Header & Navigation Manager</h2>
          <p className="text-xs text-[#8e8c99]">
            Configure top logo, navigation links, ordering, and sticky glassmorphic styling.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] text-xs font-semibold uppercase tracking-wider transition-all shadow-md self-start sm:self-auto"
        >
          <Check className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save & Publish Header'}</span>
        </button>
      </div>

      {/* Header Preview Bar */}
      <div className="bg-[#0c0c12] border border-[#222232] rounded-xl p-5 space-y-3">
        <span className="text-xs uppercase font-mono tracking-wider text-[#8e8c99]">
          Live Navbar Preview
        </span>
        <div className="bg-[#09090c]/90 border border-[#242436] rounded-lg px-6 py-4 flex items-center justify-between backdrop-blur-md">
          <Logo logoUrl={formData.logoUrl} size="sm" />
          <div className="hidden md:flex items-center gap-5 text-xs text-[#a5a3b0]">
            {navItems
              .filter((n) => n.isVisible)
              .map((n) => (
                <span key={n.id} className="hover:text-white transition-colors cursor-pointer">
                  {n.label}
                </span>
              ))}
          </div>
          <button className="px-3 py-1.5 rounded bg-[#c5a059] text-[#09090b] text-[11px] font-semibold uppercase tracking-wider">
            Book Session
          </button>
        </div>
      </div>

      {/* Logo Manager */}
      <div className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1f1f2d] pb-3">
          <div>
            <h3 className="text-sm font-serif text-[#f5eedc]">Official Studio Logo & Brand Asset</h3>
            <p className="text-[11px] text-[#716f7c]">
              Manage the master brand logo, upload local device replacements, adjust header display dimensions, or restore original.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 text-[10px] uppercase font-mono tracking-wider self-start sm:self-auto">
            Persistent Asset
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-5">
            <div className="p-4 bg-[#14141d] border border-[#262638] rounded-lg space-y-3">
              <label className="block text-xs uppercase font-mono text-[#c5a059] font-medium">
                Logo Source & Local Upload
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] text-xs font-semibold rounded transition-colors shadow-sm"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload / Choose Logo from Device</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, logoUrl: '/images/kaviya-studio-logo.jpg' });
                    onNotify('success', 'Restored to original official Kaviya Studio logo.');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1a1a26] hover:bg-[#232334] text-xs text-[#d6d4ce] border border-[#2f2f42] rounded transition-colors"
                >
                  <span>Restore Original Official Logo</span>
                </button>
              </div>

              <div className="text-[11px] text-[#8e8c99] space-y-1 pt-1">
                <p>• Current active path: <code className="text-[#f5eedc] bg-[#0c0c10] px-1.5 py-0.5 rounded font-mono">{formData.logoUrl || '/images/kaviya-studio-logo.jpg'}</code></p>
                <p>• Supports JPG, PNG, WEBP, and AVIF formats with automatic aspect-ratio preservation.</p>
              </div>
            </div>

            {/* Logo Dimensions */}
            <div className="p-4 bg-[#14141d] border border-[#262638] rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs uppercase font-mono text-[#8e8c99]">
                  Header Logo Display Width
                </label>
                <span className="text-xs font-mono text-[#c5a059] font-semibold">
                  {formData.headerConfig?.logoWidth || 160} px
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="260"
                step="5"
                value={formData.headerConfig?.logoWidth || 160}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    headerConfig: {
                      ...headerConfig,
                      logoWidth: parseInt(e.target.value, 10),
                    },
                  })
                }
                className="w-full accent-[#c5a059] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#6b6976] font-mono">
                <span>Compact (100px)</span>
                <span>Standard (160px)</span>
                <span>Prominent (260px)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 bg-[#09090d] border border-[#1f1f2d] rounded-xl flex flex-col items-center justify-center text-center space-y-3">
            <span className="text-[10px] uppercase font-mono text-[#716f7c] tracking-wider">
              Live Brand Preview
            </span>
            <div className="py-4 px-6 bg-[#0f0f15] border border-[#252535] rounded-lg w-full flex items-center justify-center">
              <Logo
                logoUrl={formData.logoUrl}
                size="lg"
                alt="Kaviya Studio official logo"
              />
            </div>
            <span className="text-[11px] text-[#a8a6af] font-light">
              Proportion-locked (no distortion or cropping)
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Items Manager */}
      <div className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[#1f1f2d] pb-3">
          <div>
            <h3 className="text-sm font-serif text-[#f5eedc]">Navigation Links & Ordering</h3>
            <p className="text-[11px] text-[#716f7c]">
              Reorder pages, modify display text, or hide menu items.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddNavItem}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1a1a26] hover:bg-[#232334] border border-[#2f2f42] text-xs text-[#c5a059]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Menu Item</span>
          </button>
        </div>

        <div className="space-y-2">
          {navItems.map((item, idx) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 bg-[#13131c] border border-[#222232] rounded-lg text-xs"
            >
              <div className="flex items-center gap-1 text-[#6b6976]">
                <button
                  type="button"
                  onClick={() => handleMove(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1 hover:text-white disabled:opacity-30"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(idx, 'down')}
                  disabled={idx === navItems.length - 1}
                  className="p-1 hover:text-white disabled:opacity-30"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <input
                type="text"
                value={item.label}
                onChange={(e) => handleUpdateItem(item.id, e.target.value, item.path)}
                className="w-36 bg-[#1a1a26] border border-[#2a2a3c] rounded px-2.5 py-1.5 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                placeholder="Label"
              />

              <input
                type="text"
                value={item.path}
                onChange={(e) => handleUpdateItem(item.id, item.label, e.target.value)}
                className="flex-1 bg-[#1a1a26] border border-[#2a2a3c] rounded px-2.5 py-1.5 text-xs text-[#a5a3b0] focus:outline-none focus:border-[#c5a059] font-mono"
                placeholder="URL Path e.g. /services"
              />

              <label className="flex items-center gap-1.5 cursor-pointer text-[#a5a3b0] text-[11px]">
                <input
                  type="checkbox"
                  checked={item.isVisible}
                  onChange={() => handleToggleItem(item.id)}
                  className="accent-[#c5a059]"
                />
                <span>Visible</span>
              </label>

              <button
                type="button"
                onClick={() => handleDeleteNavItem(item.id)}
                className="p-1.5 text-red-400 hover:text-red-300 rounded hover:bg-red-950/30"
                title="Remove item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Header Behavior Settings */}
      <div className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-serif text-[#f5eedc]">Navbar Behavior & Appearance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex items-center justify-between p-3.5 bg-[#13131c] border border-[#222232] rounded-lg cursor-pointer">
            <div>
              <span className="text-xs text-[#f5eedc] font-medium block">Sticky Header</span>
              <span className="text-[10px] text-[#716f7c]">Keep navbar visible while scrolling</span>
            </div>
            <input
              type="checkbox"
              checked={headerConfig.isSticky}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  headerConfig: { ...headerConfig, isSticky: e.target.checked },
                })
              }
              className="accent-[#c5a059] w-4 h-4"
            />
          </label>

          <div className="p-3.5 bg-[#13131c] border border-[#222232] rounded-lg">
            <span className="text-xs text-[#f5eedc] font-medium block mb-1">
              Scroll Background Style
            </span>
            <select
              value={headerConfig.appearance || 'glass'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  headerConfig: { ...headerConfig, appearance: e.target.value as any },
                })
              }
              className="w-full bg-[#1a1a26] border border-[#2a2a3c] rounded px-2.5 py-1 text-xs text-[#f5eedc]"
            >
              <option value="glass">Glassmorphic Charcoal Blur (Default)</option>
              <option value="dark">Solid Charcoal Black</option>
              <option value="transparent">Fully Transparent</option>
            </select>
          </div>
        </div>
      </div>

      {pickerOpen && (
        <MediaPickerModal
          isOpen={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelect={handleSelectLogo}
          title="Upload or Select Studio Logo"
          accept="image"
        />
      )}
    </div>
  );
};
