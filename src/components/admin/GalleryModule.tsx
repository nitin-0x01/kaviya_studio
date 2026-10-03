import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Film,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Search,
  Filter,
  Check,
  Star,
  Eye,
  FolderPlus,
  Folder,
} from 'lucide-react';
import { Album, GalleryItem } from '../../types';
import { api } from '../../services/api';
import { MediaPickerModal } from '../MediaPickerModal';

interface GalleryModuleProps {
  gallery: GalleryItem[];
  albums: Album[];
  onRefresh: () => void;
  onNotify: (type: 'success' | 'error', message: string) => void;
}

export const GalleryModule: React.FC<GalleryModuleProps> = ({
  gallery,
  albums,
  onRefresh,
  onNotify,
}) => {
  const [activeTab, setActiveTab] = useState<'items' | 'albums'>('items');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [albumFilter, setAlbumFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Item edit state
  const [editingItem, setEditingItem] = useState<Partial<GalleryItem> | null>(null);
  // Album edit state
  const [editingAlbum, setEditingAlbum] = useState<Partial<Album> | null>(null);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<'item_image' | 'item_video' | 'album_cover'>('item_image');

  const filteredItems = gallery.filter((item) => {
    const matchCat = categoryFilter === 'all' || item.category === categoryFilter;
    const matchAlbum = albumFilter === 'all' || item.albumId === albumFilter;
    const matchSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.coupleOrClient.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchAlbum && matchSearch;
  });

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title || !editingItem?.imageUrl) {
      onNotify('error', 'Title and media image/thumbnail are required.');
      return;
    }

    try {
      if (editingItem.id) {
        await api.updateGalleryItem(editingItem.id, editingItem);
        onNotify('success', 'Gallery item updated.');
      } else {
        await api.createGalleryItem(editingItem);
        onNotify('success', 'New gallery asset added to portfolio.');
      }
      setEditingItem(null);
      onRefresh();
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to save gallery item.');
    }
  };

  const handleDeleteItem = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}" from portfolio?`)) return;
    try {
      await api.deleteGalleryItem(id);
      onNotify('success', 'Item removed from gallery.');
      onRefresh();
    } catch (err: any) {
      onNotify('error', 'Failed to delete item.');
    }
  };

  const handleToggleFeatured = async (item: GalleryItem) => {
    try {
      await api.updateGalleryItem(item.id, { isFeatured: !item.isFeatured });
      onNotify('success', item.isFeatured ? 'Removed from home highlights.' : 'Featured on home page!');
      onRefresh();
    } catch (err: any) {
      onNotify('error', 'Failed to update featured state.');
    }
  };

  // Album actions
  const handleSaveAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlbum?.title) return;

    try {
      if (editingAlbum.id) {
        await api.updateAlbum(editingAlbum.id, editingAlbum);
        onNotify('success', `Album "${editingAlbum.title}" updated.`);
      } else {
        await api.createAlbum(editingAlbum);
        onNotify('success', `Album "${editingAlbum.title}" created.`);
      }
      setEditingAlbum(null);
      onRefresh();
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to save album.');
    }
  };

  const handleDeleteAlbum = async (id: string, title: string) => {
    if (!window.confirm(`Delete album "${title}"? Photos inside will become unassigned.`)) return;
    try {
      await api.deleteAlbum(id);
      onNotify('success', 'Album deleted.');
      onRefresh();
    } catch (err: any) {
      onNotify('error', 'Failed to delete album.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header with Tab switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif text-[#f5eedc]">Portfolio & Gallery Manager</h2>
          <p className="text-xs text-[#8e8c99]">
            Organize photographs, cinematic video reels, and wedding album collections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#13131c] border border-[#222232] rounded-lg p-1">
            <button
              type="button"
              onClick={() => setActiveTab('items')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                activeTab === 'items' ? 'bg-[#c5a059] text-[#09090b]' : 'text-[#8e8c99] hover:text-white'
              }`}
            >
              Photographs & Films ({gallery.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('albums')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                activeTab === 'albums' ? 'bg-[#c5a059] text-[#09090b]' : 'text-[#8e8c99] hover:text-white'
              }`}
            >
              Albums ({albums.length})
            </button>
          </div>

          {activeTab === 'items' ? (
            <button
              type="button"
              onClick={() =>
                setEditingItem({
                  title: '',
                  coupleOrClient: '',
                  category: 'wedding',
                  imageUrl:
                    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=85&w=1200',
                  aspectRatio: 'landscape',
                  location: 'Janakpur, Nepal',
                  isFeatured: false,
                  date: new Date().toISOString().split('T')[0],
                  caption: '',
                })
              }
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] text-xs font-semibold uppercase tracking-wider shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Media</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                setEditingAlbum({
                  title: '',
                  slug: '',
                  description: '',
                  category: 'wedding',
                  coverImage:
                    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
                  isFeatured: false,
                  isPublished: true,
                })
              }
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] text-xs font-semibold uppercase tracking-wider shadow-md"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Create Album</span>
            </button>
          )}
        </div>
      </div>

      {/* ITEMS VIEW */}
      {activeTab === 'items' && (
        <div className="space-y-5">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#0e0e14] border border-[#20202e] rounded-xl p-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#716f7c]" />
              <input
                type="text"
                placeholder="Search by title, couple name, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#14141d] border border-[#262638] rounded-lg text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#14141d] border border-[#262638] rounded-lg px-3 py-2 text-xs text-[#f5eedc] focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="wedding">Wedding</option>
                <option value="pre-wedding">Pre-Wedding</option>
                <option value="traditional">Traditional</option>
                <option value="cinematic">Cinematic</option>
                <option value="portrait">Portrait</option>
                <option value="event">Event</option>
              </select>

              <select
                value={albumFilter}
                onChange={(e) => setAlbumFilter(e.target.value)}
                className="bg-[#14141d] border border-[#262638] rounded-lg px-3 py-2 text-xs text-[#f5eedc] focus:outline-none"
              >
                <option value="all">All Albums</option>
                {albums.map((alb) => (
                  <option key={alb.id} value={alb.id}>
                    {alb.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Media Items Masonry / Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative bg-[#0e0e14] border border-[#20202e] rounded-xl overflow-hidden flex flex-col hover:border-[#3a3a4e] transition-all"
              >
                <div className="relative aspect-square overflow-hidden bg-[#161622]">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {item.videoUrl && (
                    <div className="absolute top-2 left-2 p-1 rounded-full bg-black/70 text-[#c5a059]">
                      <Film className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(item)}
                    className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-colors ${
                      item.isFeatured ? 'bg-amber-500 text-black' : 'bg-black/60 text-[#a5a3b0] hover:text-white'
                    }`}
                    title={item.isFeatured ? 'Featured on Home (Click to remove)' : 'Feature on Home'}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </button>

                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingItem(item)}
                      className="p-1.5 rounded bg-black/80 text-white hover:bg-black"
                      title="Edit"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id, item.title)}
                      className="p-1.5 rounded bg-red-950/80 text-red-300 hover:bg-red-900"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="p-3 space-y-1">
                  <h4 className="text-xs font-medium text-[#f5eedc] truncate">{item.title}</h4>
                  <p className="text-[10px] text-[#716f7c] truncate">
                    {item.coupleOrClient || item.location}
                  </p>
                  <span className="inline-block text-[9px] uppercase font-mono text-[#c5a059]">
                    {item.category}
                  </span>
                </div>
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="col-span-full py-16 text-center text-xs text-[#716f7c]">
                No photographs or videos match this filter. Click "Add Media" to upload.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ALBUMS VIEW */}
      {activeTab === 'albums' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {albums.map((alb) => {
            const itemCount = gallery.filter((g) => g.albumId === alb.id).length;
            return (
              <div
                key={alb.id}
                className="bg-[#0e0e14] border border-[#20202e] rounded-xl overflow-hidden flex flex-col justify-between hover:border-[#35354a] transition-all group"
              >
                <div>
                  <div className="relative h-40 overflow-hidden bg-[#161622]">
                    <img
                      src={alb.coverImage}
                      alt={alb.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e14] via-transparent to-transparent" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] uppercase font-mono text-[#c5a059]">
                      {alb.category}
                    </span>
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#f5eedc]">
                      {itemCount} Assets
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-serif text-[#f5eedc] font-medium">{alb.title}</h3>
                    <p className="text-xs text-[#8e8c99] line-clamp-2 leading-relaxed">
                      {alb.description || 'Dedicated wedding story collection.'}
                    </p>
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-[#1a1a26] bg-[#0c0c11] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#716f7c]">/{alb.slug}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingAlbum(alb)}
                      className="p-1.5 rounded hover:bg-[#1a1a26] text-[#a5a3b0] hover:text-white"
                      title="Edit Album"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAlbum(alb.id, alb.title)}
                      className="p-1.5 rounded hover:bg-red-950/30 text-red-400"
                      title="Delete Album"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {albums.length === 0 && (
            <div className="col-span-full py-16 text-center text-xs text-[#716f7c]">
              No albums created yet. Click "Create Album" above.
            </div>
          )}
        </div>
      )}

      {/* Edit / Add Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#101017] border border-[#27273a] rounded-xl max-w-xl w-full p-6 space-y-4 my-8">
            <h3 className="text-base font-serif text-[#f5eedc]">
              {editingItem.id ? 'Edit Portfolio Asset' : 'Add Media to Portfolio'}
            </h3>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-mono text-[#8e8c99] mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={editingItem.title || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                    placeholder="e.g. Royal Vivah at Vivah Mandap"
                  />
                </div>

                <div>
                  <label className="block uppercase font-mono text-[#8e8c99] mb-1">Couple / Client Name</label>
                  <input
                    type="text"
                    value={editingItem.coupleOrClient || ''}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, coupleOrClient: e.target.value })
                    }
                    className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                    placeholder="e.g. Ritesh & Shruti"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase font-mono text-[#8e8c99] mb-1">Photograph / Thumbnail</label>
                <div className="flex items-center gap-3">
                  {editingItem.imageUrl && (
                    <img
                      src={editingItem.imageUrl}
                      alt="Preview"
                      className="w-16 h-12 object-cover rounded border border-[#2b2b3f]"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setPickerTarget('item_image');
                      setPickerOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-[#1a1a26] border border-[#2b2b3f] text-[#f5eedc] rounded"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>Upload Local File / Pick Image</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-mono text-[#8e8c99] mb-1">Category</label>
                  <select
                    value={editingItem.category || 'wedding'}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, category: e.target.value as any })
                    }
                    className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                  >
                    <option value="wedding">Wedding</option>
                    <option value="pre-wedding">Pre-Wedding</option>
                    <option value="traditional">Traditional</option>
                    <option value="cinematic">Cinematic</option>
                    <option value="portrait">Portrait</option>
                    <option value="event">Event</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase font-mono text-[#8e8c99] mb-1">Assign to Album</label>
                  <select
                    value={editingItem.albumId || ''}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, albumId: e.target.value || undefined })
                    }
                    className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                  >
                    <option value="">No Album (Standalone)</option>
                    {albums.map((alb) => (
                      <option key={alb.id} value={alb.id}>
                        {alb.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-mono text-[#8e8c99] mb-1">Location</label>
                  <input
                    type="text"
                    value={editingItem.location || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                    className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                    placeholder="e.g. Janakpurdham, Nepal"
                  />
                </div>

                <div>
                  <label className="block uppercase font-mono text-[#8e8c99] mb-1">Aspect Ratio</label>
                  <select
                    value={editingItem.aspectRatio || 'landscape'}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, aspectRatio: e.target.value as any })
                    }
                    className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                  >
                    <option value="landscape">Landscape (16:9)</option>
                    <option value="portrait">Portrait (4:5 / 9:16)</option>
                    <option value="square">Square (1:1)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase font-mono text-[#8e8c99] mb-1">
                  Video URL (Optional for Cinematic Films)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingItem.videoUrl || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, videoUrl: e.target.value })}
                    className="flex-1 bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc] font-mono text-[11px]"
                    placeholder="e.g. /uploads/video.mp4 or YouTube / Vimeo link"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPickerTarget('item_video');
                      setPickerOpen(true);
                    }}
                    className="px-3 py-2 bg-[#252538] hover:bg-[#32324a] rounded text-[#f5eedc] whitespace-nowrap"
                  >
                    Choose Video
                  </button>
                </div>
              </div>

              <div>
                <label className="block uppercase font-mono text-[#8e8c99] mb-1">Caption / Story Notes</label>
                <textarea
                  rows={2}
                  value={editingItem.caption || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, caption: e.target.value })}
                  className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                  placeholder="Atmospheric quote or description..."
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-[#a5a3b0]">
                  <input
                    type="checkbox"
                    checked={editingItem.isFeatured || false}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, isFeatured: e.target.checked })
                    }
                    className="accent-[#c5a059]"
                  />
                  <span>Feature in Homepage Spotlight</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#1e1e2d]">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded bg-[#181824] text-[#a5a3b0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#c5a059] text-[#09090b] font-semibold"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit / Add Album Modal */}
      {editingAlbum && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#101017] border border-[#27273a] rounded-xl max-w-md w-full p-6 space-y-4 my-8">
            <h3 className="text-base font-serif text-[#f5eedc]">
              {editingAlbum.id ? 'Edit Album' : 'Create New Wedding Album'}
            </h3>

            <form onSubmit={handleSaveAlbum} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-mono text-[#8e8c99] mb-1">Album Title</label>
                <input
                  type="text"
                  required
                  value={editingAlbum.title || ''}
                  onChange={(e) => setEditingAlbum({ ...editingAlbum, title: e.target.value })}
                  className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                  placeholder="e.g. Royal Mithila Wedding"
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-[#8e8c99] mb-1">Cover Image</label>
                <div className="flex items-center gap-3">
                  {editingAlbum.coverImage && (
                    <img
                      src={editingAlbum.coverImage}
                      alt="Cover"
                      className="w-16 h-10 object-cover rounded border border-[#2b2b3f]"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setPickerTarget('album_cover');
                      setPickerOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-[#1a1a26] border border-[#2b2b3f] text-[#f5eedc] rounded"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>Upload or Pick Cover</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block uppercase font-mono text-[#8e8c99] mb-1">Category</label>
                <select
                  value={editingAlbum.category || 'wedding'}
                  onChange={(e) => setEditingAlbum({ ...editingAlbum, category: e.target.value as any })}
                  className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                >
                  <option value="wedding">Wedding</option>
                  <option value="pre-wedding">Pre-Wedding</option>
                  <option value="traditional">Traditional</option>
                  <option value="cinematic">Cinematic</option>
                  <option value="portrait">Portrait</option>
                  <option value="event">Event</option>
                </select>
              </div>

              <div>
                <label className="block uppercase font-mono text-[#8e8c99] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingAlbum.description || ''}
                  onChange={(e) => setEditingAlbum({ ...editingAlbum, description: e.target.value })}
                  className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#1e1e2d]">
                <button
                  type="button"
                  onClick={() => setEditingAlbum(null)}
                  className="px-4 py-2 rounded bg-[#181824] text-[#a5a3b0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#c5a059] text-[#09090b] font-semibold"
                >
                  Save Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      {pickerOpen && (
        <MediaPickerModal
          isOpen={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelect={(url) => {
            if (pickerTarget === 'item_image' && editingItem) {
              setEditingItem({ ...editingItem, imageUrl: url });
            } else if (pickerTarget === 'item_video' && editingItem) {
              setEditingItem({ ...editingItem, videoUrl: url });
            } else if (pickerTarget === 'album_cover' && editingAlbum) {
              setEditingAlbum({ ...editingAlbum, coverImage: url });
            }
            setPickerOpen(false);
          }}
          title={pickerTarget === 'item_video' ? 'Select Cinematic Video' : 'Select Photograph'}
          accept={pickerTarget === 'item_video' ? 'video' : 'image'}
        />
      )}
    </div>
  );
};
