import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  Check,
  Star,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Camera,
  Film,
  Disc,
} from 'lucide-react';
import { PricingPackage } from '../../types';
import { api } from '../../services/api';

interface PackagesModuleProps {
  packages: PricingPackage[];
  onRefresh: () => void;
  onNotify: (type: 'success' | 'error', message: string) => void;
}

export const PackagesModule: React.FC<PackagesModuleProps> = ({
  packages,
  onRefresh,
  onNotify,
}) => {
  const [editingPackage, setEditingPackage] = useState<Partial<PricingPackage> | null>(null);
  const [newFeatureText, setNewFeatureText] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage?.name) return;

    try {
      if (editingPackage.id) {
        await api.updatePackage(editingPackage.id, editingPackage);
        onNotify('success', `Package "${editingPackage.name}" updated.`);
      } else {
        await api.createPackage(editingPackage);
        onNotify('success', `New package "${editingPackage.name}" created.`);
      }
      setEditingPackage(null);
      onRefresh();
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to save package.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete package "${name}"?`)) return;
    try {
      await api.deletePackage(id);
      onNotify('success', 'Package removed.');
      onRefresh();
    } catch (err: any) {
      onNotify('error', 'Failed to delete package.');
    }
  };

  const handleTogglePopular = async (pkg: PricingPackage) => {
    try {
      await api.updatePackage(pkg.id, { isPopular: !pkg.isPopular });
      onNotify('success', pkg.isPopular ? 'Popular badge removed.' : 'Marked as Most Popular!');
      onRefresh();
    } catch (err: any) {
      onNotify('error', 'Failed to update badge.');
    }
  };

  const sortedPackages = [...packages].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif text-[#f5eedc]">Packages & Pricing Manager</h2>
          <p className="text-xs text-[#8e8c99]">
            Manage wedding coverage tiers, deliverables, and display pricing or "Contact for pricing".
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setEditingPackage({
              name: '',
              price: null,
              contactForPrice: true,
              tagline: 'Comprehensive wedding visual story.',
              photographersCount: '2 Lead Photographers',
              hours: 'Full Day (10-12 Hours)',
              editedImages: '400+ High-Res Edited Images',
              album: '1 Handcrafted Leather Album (30 Sheets)',
              video: '4K Cinematic Highlight Film (5-7 Mins)',
              drone: 'Included (Weather Permitting)',
              deliveryTime: '3-4 Weeks Final Delivery',
              features: [
                'Full wedding day coverage',
                'Traditional & candid photography',
                'Cinematic 4K teaser',
                'Handcrafted presentation box with USB',
              ],
              isPopular: false,
              order: packages.length + 1,
            })
          }
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] text-xs font-semibold uppercase tracking-wider transition-all shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Package</span>
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPackages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative bg-[#0e0e14] border rounded-2xl p-6 flex flex-col justify-between transition-all ${
              pkg.isPopular
                ? 'border-[#c5a059] shadow-lg shadow-[#c5a059]/5'
                : 'border-[#20202e] hover:border-[#35354a]'
            }`}
          >
            {pkg.isPopular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#c5a059] text-[#09090b] text-[10px] font-bold uppercase tracking-widest shadow-sm">
                Most Popular Choice
              </span>
            )}

            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-serif text-[#f5eedc] font-medium">{pkg.name}</h3>
                  <p className="text-xs text-[#8e8c99] mt-1">{pkg.tagline}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleTogglePopular(pkg)}
                  className={`p-1.5 rounded-full transition-colors ${
                    pkg.isPopular ? 'text-amber-400 bg-amber-500/10' : 'text-[#6b6976] hover:text-white'
                  }`}
                  title={pkg.isPopular ? 'Featured Badge Active' : 'Make Most Popular'}
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>
              </div>

              <div className="py-2 border-y border-[#1c1c2a]">
                <span className="text-xl font-bold font-mono text-[#f5eedc]">
                  {pkg.contactForPrice || !pkg.price ? 'Contact for pricing' : pkg.price}
                </span>
                <span className="text-[11px] text-[#716f7c] block mt-0.5">
                  Customizable based on dates and events
                </span>
              </div>

              {/* Spec list */}
              <div className="space-y-2 text-xs text-[#a5a3b0]">
                <div className="flex items-center gap-2">
                  <Camera className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>{pkg.photographersCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Film className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>{pkg.video}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Disc className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>{pkg.album}</span>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] uppercase font-mono text-[#716f7c]">Key Inclusions:</span>
                {pkg.features?.slice(0, 4).map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#e4e2dd]">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#1a1a26] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#716f7c]">Order: #{pkg.order}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPackage(pkg)}
                  className="p-1.5 rounded text-[#a5a3b0] hover:text-white hover:bg-[#1a1a26]"
                  title="Edit Package"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(pkg.id, pkg.name)}
                  className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-950/30"
                  title="Delete Package"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {editingPackage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#101017] border border-[#27273a] rounded-xl max-w-xl w-full p-6 space-y-4 my-8">
            <h3 className="text-base font-serif text-[#f5eedc]">
              {editingPackage.id ? `Edit Package: ${editingPackage.name}` : 'New Pricing Package'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-mono text-[#8e8c99] mb-1">Package Name</label>
                  <input
                    type="text"
                    required
                    value={editingPackage.name || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                    className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                    placeholder="e.g. Royal Vivah Grand"
                  />
                </div>

                <div>
                  <label className="block uppercase font-mono text-[#8e8c99] mb-1">Price Tag</label>
                  <input
                    type="text"
                    value={editingPackage.price || ''}
                    disabled={editingPackage.contactForPrice}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, price: e.target.value })
                    }
                    className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc] disabled:opacity-40"
                    placeholder="e.g. NPR 1,25,000"
                  />
                  <label className="flex items-center gap-1.5 mt-1 cursor-pointer text-[#a5a3b0]">
                    <input
                      type="checkbox"
                      checked={editingPackage.contactForPrice ?? true}
                      onChange={(e) =>
                        setEditingPackage({ ...editingPackage, contactForPrice: e.target.checked })
                      }
                      className="accent-[#c5a059]"
                    />
                    <span>Display "Contact for pricing"</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block uppercase font-mono text-[#8e8c99] mb-1">Tagline</label>
                <input
                  type="text"
                  value={editingPackage.tagline || ''}
                  onChange={(e) => setEditingPackage({ ...editingPackage, tagline: e.target.value })}
                  className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                  placeholder="e.g. The definitive visual experience for large wedding celebrations."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-mono text-[#8e8c99] mb-1">Crew Size</label>
                  <input
                    type="text"
                    value={editingPackage.photographersCount || ''}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, photographersCount: e.target.value })
                    }
                    className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                    placeholder="e.g. 2 Photographers + 2 Cinematographers"
                  />
                </div>

                <div>
                  <label className="block uppercase font-mono text-[#8e8c99] mb-1">Coverage Hours</label>
                  <input
                    type="text"
                    value={editingPackage.hours || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, hours: e.target.value })}
                    className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                    placeholder="e.g. Full Day Coverage"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-mono text-[#8e8c99] mb-1">Album Specs</label>
                  <input
                    type="text"
                    value={editingPackage.album || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, album: e.target.value })}
                    className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                    placeholder="e.g. 1 Leather Flush-Mount Album"
                  />
                </div>

                <div>
                  <label className="block uppercase font-mono text-[#8e8c99] mb-1">Video Deliverables</label>
                  <input
                    type="text"
                    value={editingPackage.video || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, video: e.target.value })}
                    className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                    placeholder="e.g. 4K Cinematic Teaser + Full Documentary"
                  />
                </div>
              </div>

              {/* Inclusions list */}
              <div>
                <label className="block uppercase font-mono text-[#8e8c99] mb-1">Inclusions</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {editingPackage.features?.map((f, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#181824] border border-[#29293a] text-xs text-[#f5eedc]"
                    >
                      <span>{f}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingPackage({
                            ...editingPackage,
                            features: editingPackage.features?.filter((_, idx) => idx !== i),
                          })
                        }
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    placeholder="e.g. Drone Aerial Shoot Included"
                    className="flex-1 bg-[#181824] border border-[#2b2b3f] rounded px-3 py-1.5 text-xs text-[#f5eedc]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newFeatureText.trim()) return;
                      setEditingPackage({
                        ...editingPackage,
                        features: [...(editingPackage.features || []), newFeatureText.trim()],
                      });
                      setNewFeatureText('');
                    }}
                    className="px-3 py-1.5 bg-[#252538] hover:bg-[#32324a] rounded text-xs text-[#f5eedc]"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-[#a5a3b0]">
                  <input
                    type="checkbox"
                    checked={editingPackage.isPopular || false}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, isPopular: e.target.checked })
                    }
                    className="accent-[#c5a059]"
                  />
                  <span>Mark as "Most Popular"</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#1e1e2d]">
                <button
                  type="button"
                  onClick={() => setEditingPackage(null)}
                  className="px-4 py-2 rounded bg-[#181824] text-[#a5a3b0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#c5a059] text-[#09090b] font-semibold"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
