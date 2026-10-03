import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Check,
  Search,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { Service } from '../../types';
import { api } from '../../services/api';
import { MediaPickerModal } from '../MediaPickerModal';

interface ServicesModuleProps {
  services: Service[];
  onRefresh: () => void;
  onNotify: (type: 'success' | 'error', message: string) => void;
}

export const ServicesModule: React.FC<ServicesModuleProps> = ({
  services,
  onRefresh,
  onNotify,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [newDeliverableText, setNewDeliverableText] = useState('');

  const filtered = services.filter((s) => {
    const matchCat = categoryFilter === 'all' || s.category === categoryFilter;
    const matchSearch =
      !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title) return;

    try {
      if (editingService.id) {
        await api.updateService(editingService.id, editingService);
        onNotify('success', `Service "${editingService.title}" updated.`);
      } else {
        await api.createService(editingService);
        onNotify('success', `New service "${editingService.title}" created.`);
      }
      setEditingService(null);
      onRefresh();
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to save service.');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Permanently delete service "${title}"?`)) return;
    try {
      await api.deleteService(id);
      onNotify('success', 'Service deleted.');
      onRefresh();
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to delete service.');
    }
  };

  const handleTogglePublish = async (service: Service) => {
    try {
      await api.updateService(service.id, { isPublished: !service.isPublished });
      onNotify(
        'success',
        service.isPublished ? `"${service.title}" hidden from site.` : `"${service.title}" published!`
      );
      onRefresh();
    } catch (err: any) {
      onNotify('error', 'Failed to toggle service visibility.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif text-[#f5eedc]">Services Manager</h2>
          <p className="text-xs text-[#8e8c99]">
            Add, update, and manage photography and cinematic videography offerings.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setEditingService({
              title: '',
              slug: '',
              category: 'wedding',
              coverImage:
                'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
              shortDescription: '',
              description: '',
              features: ['Multiple 4K Cinema Cameras', 'Drone Aerial Footage', 'Color Graded Film'],
              deliverables: ['Cinematic Teaser', 'Full Length Video Documentary', 'Raw Footage Storage'],
              priceDisplay: 'Contact for pricing',
              contactForPrice: true,
              featured: false,
              isPublished: true,
            })
          }
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] text-xs font-semibold uppercase tracking-wider transition-all shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#0e0e14] border border-[#20202e] rounded-xl p-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#716f7c]" />
          <input
            type="text"
            placeholder="Search services by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#14141d] border border-[#262638] rounded-lg text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-[#716f7c]" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#14141d] border border-[#262638] rounded-lg px-3 py-2 text-xs text-[#f5eedc] focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="wedding">Wedding</option>
            <option value="pre-wedding">Pre-Wedding</option>
            <option value="portrait">Portrait</option>
            <option value="event">Event</option>
            <option value="maternity">Maternity & Baby</option>
          </select>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((service) => (
          <div
            key={service.id}
            className="bg-[#0e0e14] border border-[#20202e] rounded-xl overflow-hidden flex flex-col justify-between hover:border-[#35354a] transition-all group"
          >
            <div>
              <div className="relative h-44 overflow-hidden bg-[#161622]">
                <img
                  src={service.coverImage}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e14] via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] uppercase font-mono text-[#c5a059] border border-[#c5a059]/30">
                    {service.category}
                  </span>
                  {service.featured && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/80 text-[10px] font-semibold text-black">
                      Featured
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleTogglePublish(service)}
                  className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-sm ${
                    service.isPublished !== false
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/50'
                      : 'bg-zinc-900/80 text-zinc-400 border border-zinc-700/50'
                  }`}
                  title={service.isPublished !== false ? 'Published (Click to hide)' : 'Hidden (Click to publish)'}
                >
                  {service.isPublished !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="text-base font-serif text-[#f5eedc] font-medium">{service.title}</h3>
                <p className="text-xs text-[#8e8c99] line-clamp-2 leading-relaxed">
                  {service.shortDescription || service.description}
                </p>

                <div className="pt-2">
                  <span className="text-xs font-mono text-[#c5a059] block">
                    {service.contactForPrice ? 'Contact for pricing' : service.priceDisplay}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-[#1a1a26] bg-[#0c0c11] flex items-center justify-between">
              <span className="text-[10px] text-[#716f7c] font-mono">
                {service.deliverables?.length || 0} deliverables
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingService(service)}
                  className="p-1.5 rounded text-[#a5a3b0] hover:text-white hover:bg-[#1a1a26]"
                  title="Edit Service"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(service.id, service.title)}
                  className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-950/30"
                  title="Delete Service"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-[#716f7c]">
            No services match the criteria.
          </div>
        )}
      </div>

      {/* Edit / Add Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#101017] border border-[#27273a] rounded-xl max-w-2xl w-full p-6 space-y-5 my-8">
            <h3 className="text-base font-serif text-[#f5eedc]">
              {editingService.id ? `Edit Service: ${editingService.title}` : 'Add New Service'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-mono text-[#8e8c99] mb-1">Service Title</label>
                  <input
                    type="text"
                    required
                    value={editingService.title || ''}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                    className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                    placeholder="e.g. Wedding Cinematic Films"
                  />
                </div>

                <div>
                  <label className="block uppercase font-mono text-[#8e8c99] mb-1">Category</label>
                  <select
                    value={editingService.category || 'wedding'}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                    className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                  >
                    <option value="wedding">Wedding</option>
                    <option value="pre-wedding">Pre-Wedding</option>
                    <option value="portrait">Portrait</option>
                    <option value="event">Event</option>
                    <option value="maternity">Maternity & Baby</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase font-mono text-[#8e8c99] mb-1">Cover Image</label>
                <div className="flex items-center gap-3">
                  {editingService.coverImage && (
                    <img
                      src={editingService.coverImage}
                      alt="Cover"
                      className="w-16 h-10 object-cover rounded border border-[#2b2b3f]"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-[#1a1a26] border border-[#2b2b3f] text-[#f5eedc] rounded"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>Upload from Device / Pick Media</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block uppercase font-mono text-[#8e8c99] mb-1">Short Description</label>
                <input
                  type="text"
                  value={editingService.shortDescription || ''}
                  onChange={(e) =>
                    setEditingService({ ...editingService, shortDescription: e.target.value })
                  }
                  className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                  placeholder="One sentence summary for cards..."
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-[#8e8c99] mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={editingService.description || ''}
                  onChange={(e) =>
                    setEditingService({ ...editingService, description: e.target.value })
                  }
                  className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                  placeholder="Complete overview of what the client experiences..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-mono text-[#8e8c99] mb-1">Price Display</label>
                  <input
                    type="text"
                    value={editingService.priceDisplay || ''}
                    disabled={editingService.contactForPrice}
                    onChange={(e) =>
                      setEditingService({ ...editingService, priceDisplay: e.target.value })
                    }
                    className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc] disabled:opacity-40"
                    placeholder="e.g. NPR 65,000 / Day"
                  />
                  <label className="flex items-center gap-1.5 mt-1.5 cursor-pointer text-[#a5a3b0]">
                    <input
                      type="checkbox"
                      checked={editingService.contactForPrice ?? true}
                      onChange={(e) =>
                        setEditingService({ ...editingService, contactForPrice: e.target.checked })
                      }
                      className="accent-[#c5a059]"
                    />
                    <span>Display "Contact for pricing"</span>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-[#a5a3b0] pt-2">
                    <input
                      type="checkbox"
                      checked={editingService.featured || false}
                      onChange={(e) =>
                        setEditingService({ ...editingService, featured: e.target.checked })
                      }
                      className="accent-[#c5a059]"
                    />
                    <span>Featured on Home Page</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-[#a5a3b0]">
                    <input
                      type="checkbox"
                      checked={editingService.isPublished ?? true}
                      onChange={(e) =>
                        setEditingService({ ...editingService, isPublished: e.target.checked })
                      }
                      className="accent-[#c5a059]"
                    />
                    <span>Publish live to website</span>
                  </label>
                </div>
              </div>

              {/* Deliverables tags */}
              <div>
                <label className="block uppercase font-mono text-[#8e8c99] mb-1">Deliverables</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {editingService.deliverables?.map((d, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#181824] border border-[#29293a] text-xs text-[#f5eedc]"
                    >
                      <span>{d}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingService({
                            ...editingService,
                            deliverables: editingService.deliverables?.filter((_, idx) => idx !== i),
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
                    value={newDeliverableText}
                    onChange={(e) => setNewDeliverableText(e.target.value)}
                    placeholder="Add deliverable (e.g. 4K Drone Teaser)"
                    className="flex-1 bg-[#181824] border border-[#2b2b3f] rounded px-3 py-1.5 text-xs text-[#f5eedc]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newDeliverableText.trim()) return;
                      setEditingService({
                        ...editingService,
                        deliverables: [...(editingService.deliverables || []), newDeliverableText.trim()],
                      });
                      setNewDeliverableText('');
                    }}
                    className="px-3 py-1.5 bg-[#252538] hover:bg-[#32324a] rounded text-xs text-[#f5eedc]"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#1e1e2d]">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded bg-[#181824] text-[#a5a3b0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#c5a059] text-[#09090b] font-semibold"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {pickerOpen && (
        <MediaPickerModal
          isOpen={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelect={(url) => {
            if (editingService) setEditingService({ ...editingService, coverImage: url });
            setPickerOpen(false);
          }}
          title="Select Cover Image"
          accept="image"
        />
      )}
    </div>
  );
};
