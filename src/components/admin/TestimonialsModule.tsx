import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Star,
  Upload,
  UserCheck,
  Search,
} from 'lucide-react';
import { Testimonial } from '../../types';
import { api } from '../../services/api';
import { MediaPickerModal } from '../MediaPickerModal';

interface TestimonialsModuleProps {
  testimonials: Testimonial[];
  onRefresh: () => void;
  onNotify: (type: 'success' | 'error', message: string) => void;
}

export const TestimonialsModule: React.FC<TestimonialsModuleProps> = ({
  testimonials,
  onRefresh,
  onNotify,
}) => {
  const [search, setSearch] = useState('');
  const [filterApproved, setFilterApproved] = useState<'all' | 'approved' | 'pending'>('all');
  const [editingReview, setEditingReview] = useState<Partial<Testimonial> | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const filtered = testimonials.filter((t) => {
    const matchSearch =
      !search ||
      t.clientName.toLowerCase().includes(search.toLowerCase()) ||
      t.quote.toLowerCase().includes(search.toLowerCase()) ||
      t.eventType.toLowerCase().includes(search.toLowerCase());

    const matchApproved =
      filterApproved === 'all' ||
      (filterApproved === 'approved' && t.isApproved) ||
      (filterApproved === 'pending' && !t.isApproved);

    return matchSearch && matchApproved;
  });

  const handleToggleApproval = async (item: Testimonial) => {
    try {
      const updated = await api.updateTestimonial(item.id, { isApproved: !item.isApproved });
      onNotify('success', updated.isApproved ? 'Testimonial approved & published!' : 'Testimonial unpublished.');
      onRefresh();
    } catch (err: any) {
      onNotify('error', 'Failed to update approval status.');
    }
  };

  const handleToggleFeatured = async (item: Testimonial) => {
    try {
      await api.updateTestimonial(item.id, { isFeatured: !item.isFeatured });
      onNotify('success', item.isFeatured ? 'Removed from home highlights.' : 'Featured on home page!');
      onRefresh();
    } catch (err: any) {
      onNotify('error', 'Failed to update featured status.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete review from "${name}"?`)) return;
    try {
      await api.deleteTestimonial(id);
      onNotify('success', 'Review deleted.');
      onRefresh();
    } catch (err: any) {
      onNotify('error', 'Failed to delete review.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview?.clientName || !editingReview?.quote) return;

    try {
      if (editingReview.id) {
        await api.updateTestimonial(editingReview.id, editingReview);
        onNotify('success', 'Review updated.');
      } else {
        await api.submitTestimonial({
          clientName: editingReview.clientName,
          eventType: editingReview.eventType || 'Wedding Photography',
          location: editingReview.location || 'Janakpur, Nepal',
          quote: editingReview.quote,
          rating: editingReview.rating || 5,
          photoUrl: editingReview.photoUrl,
        });
        onNotify('success', 'New client testimonial added.');
      }
      setEditingReview(null);
      onRefresh();
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to save review.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif text-[#f5eedc]">Testimonials Manager</h2>
          <p className="text-xs text-[#8e8c99]">
            Review, approve, and showcase feedback from wedding couples and families.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setEditingReview({
              clientName: '',
              eventType: 'Wedding Photography & Cinema',
              location: 'Janakpur, Nepal',
              quote: '',
              rating: 5,
              photoUrl: '',
              isApproved: true,
              isFeatured: false,
            })
          }
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] text-xs font-semibold uppercase tracking-wider transition-all shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#0e0e14] border border-[#20202e] rounded-xl p-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#716f7c]" />
          <input
            type="text"
            placeholder="Search by client name, quote, or event..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#14141d] border border-[#262638] rounded-lg text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
          />
        </div>

        <div className="flex items-center bg-[#14141d] border border-[#262638] rounded-lg p-1 text-xs">
          <button
            type="button"
            onClick={() => setFilterApproved('all')}
            className={`px-3 py-1 rounded transition-colors ${
              filterApproved === 'all' ? 'bg-[#c5a059] text-black font-semibold' : 'text-[#8e8c99]'
            }`}
          >
            All ({testimonials.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterApproved('approved')}
            className={`px-3 py-1 rounded transition-colors ${
              filterApproved === 'approved' ? 'bg-[#c5a059] text-black font-semibold' : 'text-[#8e8c99]'
            }`}
          >
            Approved ({testimonials.filter((t) => t.isApproved).length})
          </button>
          <button
            type="button"
            onClick={() => setFilterApproved('pending')}
            className={`px-3 py-1 rounded transition-colors ${
              filterApproved === 'pending' ? 'bg-[#c5a059] text-black font-semibold' : 'text-[#8e8c99]'
            }`}
          >
            Pending ({testimonials.filter((t) => !t.isApproved).length})
          </button>
        </div>
      </div>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-5 flex flex-col justify-between hover:border-[#35354a] transition-all space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {item.photoUrl ? (
                    <img
                      src={item.photoUrl}
                      alt={item.clientName}
                      className="w-11 h-11 rounded-full object-cover border border-[#c5a059]/40 shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-[#181824] border border-[#28283a] text-[#c5a059] flex items-center justify-center font-bold text-sm shrink-0">
                      {item.clientName[0]}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-medium text-[#f5eedc]">{item.clientName}</h4>
                    <p className="text-[11px] text-[#716f7c]">
                      {item.eventType} · {item.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#c5a059] text-[#c5a059]" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-[#a5a3b0] italic leading-relaxed">
                "{item.quote}"
              </p>
            </div>

            <div className="pt-3 border-t border-[#171722] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleApproval(item)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-mono uppercase font-semibold ${
                    item.isApproved
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                      : 'bg-amber-950/80 text-amber-400 border border-amber-800/40'
                  }`}
                >
                  {item.isApproved ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  <span>{item.isApproved ? 'Published' : 'Pending Review'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleFeatured(item)}
                  className={`p-1.5 rounded ${
                    item.isFeatured ? 'text-amber-400' : 'text-[#615f6e] hover:text-white'
                  }`}
                  title={item.isFeatured ? 'Featured on Home' : 'Feature on Home'}
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setEditingReview(item)}
                  className="p-1.5 rounded hover:bg-[#181824] text-[#a5a3b0] hover:text-white"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.clientName)}
                  className="p-1.5 rounded hover:bg-red-950/30 text-red-400"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-[#716f7c]">
            No testimonials match the filter.
          </div>
        )}
      </div>

      {/* Edit / Add Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#101017] border border-[#27273a] rounded-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-serif text-[#f5eedc]">
              {editingReview.id ? 'Edit Testimonial' : 'Add Testimonial'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-mono text-[#8e8c99] mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={editingReview.clientName || ''}
                  onChange={(e) => setEditingReview({ ...editingReview, clientName: e.target.value })}
                  className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                  placeholder="e.g. Shruti & Ritesh"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-mono text-[#8e8c99] mb-1">Event Type</label>
                  <input
                    type="text"
                    value={editingReview.eventType || ''}
                    onChange={(e) => setEditingReview({ ...editingReview, eventType: e.target.value })}
                    className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                    placeholder="e.g. Wedding Vivah"
                  />
                </div>

                <div>
                  <label className="block uppercase font-mono text-[#8e8c99] mb-1">Star Rating</label>
                  <select
                    value={editingReview.rating || 5}
                    onChange={(e) =>
                      setEditingReview({ ...editingReview, rating: Number(e.target.value) })
                    }
                    className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                  >
                    <option value={5}>5 Stars (★★★★★)</option>
                    <option value={4}>4 Stars (★★★★☆)</option>
                    <option value={3}>3 Stars (★★★☆☆)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase font-mono text-[#8e8c99] mb-1">Location</label>
                <input
                  type="text"
                  value={editingReview.location || ''}
                  onChange={(e) => setEditingReview({ ...editingReview, location: e.target.value })}
                  className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                  placeholder="e.g. Janakpur, Nepal"
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-[#8e8c99] mb-1">Client Photo</label>
                <div className="flex items-center gap-3">
                  {editingReview.photoUrl && (
                    <img
                      src={editingReview.photoUrl}
                      alt="Reviewer"
                      className="w-10 h-10 rounded-full object-cover border border-[#c5a059]"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1a1a26] border border-[#2b2b3f] text-[#f5eedc] rounded"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>Upload or Pick Photo</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block uppercase font-mono text-[#8e8c99] mb-1">Client Review Quote</label>
                <textarea
                  rows={3}
                  required
                  value={editingReview.quote || ''}
                  onChange={(e) => setEditingReview({ ...editingReview, quote: e.target.value })}
                  className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                  placeholder="Their personal experience with Kaviya Studio..."
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-[#a5a3b0]">
                  <input
                    type="checkbox"
                    checked={editingReview.isApproved ?? true}
                    onChange={(e) =>
                      setEditingReview({ ...editingReview, isApproved: e.target.checked })
                    }
                    className="accent-[#c5a059]"
                  />
                  <span>Approve & Publish Immediately</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1e1e2d]">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="px-4 py-2 rounded bg-[#181824] text-[#a5a3b0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#c5a059] text-[#09090b] font-semibold"
                >
                  Save Review
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
            if (editingReview) setEditingReview({ ...editingReview, photoUrl: url });
            setPickerOpen(false);
          }}
          title="Select Client Photo"
          accept="image"
        />
      )}
    </div>
  );
};
