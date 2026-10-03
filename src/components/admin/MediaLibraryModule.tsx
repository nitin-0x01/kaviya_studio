import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Search,
  Filter,
  Trash2,
  Copy,
  Check,
  Eye,
  Film,
  Image as ImageIcon,
  HardDrive,
  AlertCircle,
  Loader2,
  Folder,
  Edit2,
  X,
  FileCheck,
  CheckCircle,
} from 'lucide-react';
import { api } from '../../services/api';
import { Album, MediaItem } from '../../types';

interface MediaLibraryModuleProps {
  albums: Album[];
  onNotify: (type: 'success' | 'error', message: string) => void;
}

export const MediaLibraryModule: React.FC<MediaLibraryModuleProps> = ({ albums, onNotify }) => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalMB, setTotalMB] = useState('0');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Selection & Bulk
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Uploading
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync audit
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [verifyingSync, setVerifyingSync] = useState(false);

  const handleVerifySync = async () => {
    setVerifyingSync(true);
    try {
      const res = await api.verifyStorageSync();
      setSyncStatus(res);
      if (res.healthy) {
        onNotify('success', `Storage in sync: All ${res.totalDatabaseRecords} media records verified.`);
      } else {
        onNotify('error', `Audit notice: ${res.missingCount} files unverified on disk.`);
      }
    } catch {
      onNotify('error', 'Failed to audit storage.');
    } finally {
      setVerifyingSync(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [filterType, filterCategory]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const data = await api.getMedia({
        type: filterType === 'all' ? undefined : filterType,
        category: filterCategory === 'all' ? undefined : filterCategory,
      });
      setMediaList(data.items);
      setTotalMB(data.totalMegabytes);
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to load media.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadProgress(25);

    try {
      if (files.length === 1) {
        setUploadProgress(60);
        const res = await api.uploadMedia(files[0]);
        setMediaList((prev) => [res.file, ...prev]);
        onNotify('success', `Uploaded: ${res.file.originalName}`);
      } else {
        setUploadProgress(50);
        const fileArr = Array.from(files);
        const res = await api.uploadBulkMedia(fileArr);
        setMediaList((prev) => [...res.files, ...prev]);
        onNotify('success', `Successfully uploaded ${res.files.length} files from your device.`);
      }
      setUploadProgress(100);
      loadMedia();
    } catch (err: any) {
      onNotify('error', err.message || 'Upload failed.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Permanently remove "${name}" from studio storage?`)) return;
    try {
      await api.deleteMedia(id);
      setMediaList((prev) => prev.filter((m) => m.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      if (previewMedia?.id === id) setPreviewMedia(null);
      if (editingMedia?.id === id) setEditingMedia(null);
      onNotify('success', 'Media deleted from disk and library.');
    } catch {
      onNotify('error', 'Failed to delete file.');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Permanently delete ${selectedIds.length} selected files from storage?`)) return;

    try {
      await api.bulkDeleteMedia(selectedIds);
      setMediaList((prev) => prev.filter((m) => !selectedIds.includes(m.id)));
      setSelectedIds([]);
      onNotify('success', 'Selected media deleted.');
    } catch {
      onNotify('error', 'Failed to delete selected files.');
    }
  };

  const copyUrl = (id: string, url: string) => {
    const fullUrl = url.startsWith('http') ? url : window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    onNotify('success', 'Public URL copied to clipboard.');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMedia) return;
    try {
      const updated = await api.updateMedia(editingMedia.id, editingMedia);
      setMediaList((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      setEditingMedia(null);
      onNotify('success', 'Media metadata updated.');
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to update metadata.');
    }
  };

  const filteredMedia = mediaList.filter((m) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      m.title.toLowerCase().includes(s) ||
      m.originalName.toLowerCase().includes(s) ||
      (m.caption && m.caption.toLowerCase().includes(s)) ||
      (m.category && m.category.toLowerCase().includes(s))
    );
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header & Storage Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1c1c28]">
        <div>
          <h2 className="text-xl font-serif text-[#f5eedc]">Studio Media Library & Device Uploads</h2>
          <p className="text-xs text-[#8c8a94]">
            Upload full-resolution photographs and cinematic videos directly from your local computer or phone.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleVerifySync}
            disabled={verifyingSync}
            className="px-3 py-1.5 bg-[#121218] hover:bg-[#1a1a24] text-xs text-[#a8a6af] border border-[#232332] rounded flex items-center gap-1.5 transition-colors font-mono"
            title="Verify database records match files on disk"
          >
            <CheckCircle className={`w-3.5 h-3.5 ${verifyingSync ? 'animate-spin text-[#c5a059]' : 'text-emerald-400'}`} />
            <span>{verifyingSync ? 'Auditing...' : 'Audit Sync'}</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#121218] border border-[#232332] rounded text-xs text-[#a8a6af] font-mono">
            <HardDrive className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Storage: {totalMB} MB used</span>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] text-xs font-semibold uppercase tracking-wider rounded flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload From Device</span>
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      {syncStatus && (
        <div className="p-3.5 rounded-lg bg-[#111119] border border-[#222232] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[#c5a059]" />
            <span className="text-[#f5eedc]">
              Database Audit: <strong>{syncStatus.totalDatabaseRecords}</strong> media records ·{' '}
              <strong className="text-emerald-400">{syncStatus.matchedOnDisk} verified</strong>
              {syncStatus.missingCount > 0 && (
                <span className="text-amber-400 ml-1">· {syncStatus.missingCount} files unverified</span>
              )}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSyncStatus(null)}
            className="text-[#716f7c] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hidden File Picker (supports multiple files, images & videos) */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/mp4,video/webm"
        onChange={(e) => handleUploadFiles(e.target.files)}
        className="hidden"
      />

      {/* Drag & Drop Upload Zone */}
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files) handleUploadFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-[#c5a059] bg-[#c5a059]/10'
            : 'border-[#262635] hover:border-[#c5a059]/50 bg-[#0f0f15]'
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-[#181824] border border-[#2b2b3b] text-[#c5a059] flex items-center justify-center mx-auto mb-2">
          {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
        </div>
        <h4 className="text-xs uppercase font-medium tracking-wider text-[#f5eedc]">
          {isUploading ? 'Transferring files to server storage...' : 'Drop photographs or videos here, or click to browse'}
        </h4>
        <p className="text-[11px] text-[#71707d] mt-1">
          Supports JPG, PNG, WEBP, AVIF, MP4, WEBM (Up to 60MB per file). Uploaded assets are available across the entire site.
        </p>

        {isUploading && (
          <div className="mt-3 max-w-xs mx-auto">
            <div className="w-full bg-[#20202c] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#c5a059] h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#111117] border border-[#20202c] rounded-lg">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#686672]" />
            <input
              type="text"
              placeholder="Search filename or caption..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#161622] border border-[#272738] rounded pl-8 pr-3 py-1.5 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#161622] border border-[#272738] rounded px-3 py-1.5 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
          >
            <option value="all">All File Formats</option>
            <option value="image">Images Only (JPG, PNG, WEBP)</option>
            <option value="video">Videos Only (MP4, WEBM)</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-[#161622] border border-[#272738] rounded px-3 py-1.5 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
          >
            <option value="all">All Categories</option>
            <option value="wedding">Weddings</option>
            <option value="pre-wedding">Pre-Wedding</option>
            <option value="traditional">Traditional Rituals</option>
            <option value="cinematic">Cinematic</option>
            <option value="portrait">Portraits</option>
          </select>
        </div>

        {/* Bulk delete action */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#c5a059]">
              {selectedIds.length} selected
            </span>
            <button
              type="button"
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/40 rounded text-xs flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid of Media Items */}
      {loading ? (
        <div className="py-24 text-center text-xs text-[#71707d] font-mono">
          Loading studio media assets...
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="py-24 text-center text-xs text-[#71707d] border border-[#1e1e2b] rounded-lg">
          No files match your query. Drag and drop new photographs or videos above.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {filteredMedia.map((m) => {
            const isSelected = selectedIds.includes(m.id);
            return (
              <div
                key={m.id}
                className={`group relative bg-[#101016] border rounded-lg overflow-hidden flex flex-col justify-between transition-all ${
                  isSelected ? 'border-[#c5a059] ring-2 ring-[#c5a059]/40' : 'border-[#222230] hover:border-[#38384a]'
                }`}
              >
                {/* Media frame */}
                <div
                  onClick={() => setPreviewMedia(m)}
                  className="aspect-square relative cursor-pointer overflow-hidden bg-[#161622]"
                >
                  {m.type === 'video' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#c5a059] bg-[#0c0c11]">
                      <Film className="w-8 h-8" />
                      <span className="text-[10px] mt-1 font-mono uppercase">Video</span>
                    </div>
                  ) : (
                    <img src={m.url} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  )}

                  <div className="absolute inset-0 bg-[#09090b]/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[#f5eedc]">
                    <Eye className="w-5 h-5" />
                  </div>
                </div>

                {/* Checkbox select */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedIds([...selectedIds, m.id]);
                    else setSelectedIds(selectedIds.filter((id) => id !== m.id));
                  }}
                  className="absolute top-2 left-2 rounded accent-[#c5a059] z-10 cursor-pointer"
                />

                {/* Metadata caption */}
                <div className="p-2.5">
                  <h4 className="text-[11px] font-medium text-[#f5eedc] truncate" title={m.title || m.originalName}>
                    {m.title || m.originalName}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-[#71707d] font-mono mt-0.5">
                    <span>{(m.size / (1024 * 1024)).toFixed(1)} MB</span>
                    <span className="uppercase">{m.type}</span>
                  </div>
                </div>

                {/* Quick actions bar */}
                <div className="p-1.5 border-t border-[#1c1c28] bg-[#0d0d12] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => copyUrl(m.id, m.url)}
                    className="p-1 text-[#a8a6af] hover:text-[#c5a059] rounded"
                    title="Copy Public URL"
                  >
                    {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingMedia(m)}
                      className="p-1 text-[#a8a6af] hover:text-[#f5eedc] rounded"
                      title="Edit Metadata"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(m.id, m.originalName)}
                      className="p-1 text-[#a8a6af] hover:text-red-400 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fullscreen Preview Modal */}
      {previewMedia && (
        <div
          className="fixed inset-0 z-50 bg-[#070709]/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setPreviewMedia(null)}
        >
          <div
            className="relative max-w-4xl max-h-[85vh] bg-[#101016] border border-[#272738] rounded-xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3.5 border-b border-[#212130] flex items-center justify-between">
              <span className="text-xs font-mono text-[#c5a059] truncate">{previewMedia.originalName}</span>
              <button
                type="button"
                onClick={() => setPreviewMedia(null)}
                className="text-[#71707d] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex items-center justify-center overflow-hidden bg-black max-h-[65vh]">
              {previewMedia.type === 'video' ? (
                <video src={previewMedia.url} controls className="max-h-[60vh] max-w-full rounded" />
              ) : (
                <img src={previewMedia.url} alt={previewMedia.title} className="max-h-[60vh] max-w-full object-contain" />
              )}
            </div>

            <div className="p-4 bg-[#14141d] border-t border-[#212130] text-xs text-[#a8a6af] flex items-center justify-between">
              <div>
                <p className="text-[#f5eedc] font-medium">{previewMedia.title}</p>
                <p className="text-[11px] text-[#6d6b77]">{previewMedia.url}</p>
              </div>
              <button
                type="button"
                onClick={() => copyUrl(previewMedia.id, previewMedia.url)}
                className="px-3 py-1.5 bg-[#1f1f2e] hover:bg-[#2c2c40] text-[#c5a059] rounded text-xs flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy URL</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Metadata Modal */}
      {editingMedia && (
        <div
          className="fixed inset-0 z-50 bg-[#070709]/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          role="dialog"
        >
          <form
            onSubmit={handleSaveEdit}
            className="bg-[#101016] border border-[#272738] rounded-xl w-full max-w-md p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#212130]">
              <h3 className="text-base font-serif text-[#f5eedc]">Edit Media Metadata</h3>
              <button type="button" onClick={() => setEditingMedia(null)} className="text-[#71707d] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs uppercase text-[#a8a6af] mb-1 font-medium">Title</label>
              <input
                type="text"
                value={editingMedia.title}
                onChange={(e) => setEditingMedia({ ...editingMedia, title: e.target.value })}
                className="w-full bg-[#151520] border border-[#272738] rounded px-3 py-2 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-[#a8a6af] mb-1 font-medium">Caption</label>
              <textarea
                rows={2}
                value={editingMedia.caption || ''}
                onChange={(e) => setEditingMedia({ ...editingMedia, caption: e.target.value })}
                className="w-full bg-[#151520] border border-[#272738] rounded px-3 py-2 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-[#a8a6af] mb-1 font-medium">Alternative Text (SEO)</label>
              <input
                type="text"
                value={editingMedia.altText || ''}
                onChange={(e) => setEditingMedia({ ...editingMedia, altText: e.target.value })}
                className="w-full bg-[#151520] border border-[#272738] rounded px-3 py-2 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-[#a8a6af] mb-1 font-medium">Category</label>
              <select
                value={editingMedia.category || 'general'}
                onChange={(e) => setEditingMedia({ ...editingMedia, category: e.target.value })}
                className="w-full bg-[#151520] border border-[#272738] rounded px-3 py-2 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
              >
                <option value="wedding">Wedding</option>
                <option value="pre-wedding">Pre-Wedding</option>
                <option value="traditional">Traditional Rituals</option>
                <option value="cinematic">Cinematic</option>
                <option value="portrait">Portrait</option>
                <option value="event">Event</option>
                <option value="general">General Asset</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase text-[#a8a6af] mb-1 font-medium">Assign to Album</label>
              <select
                value={editingMedia.albumId || ''}
                onChange={(e) => setEditingMedia({ ...editingMedia, albumId: e.target.value || undefined })}
                className="w-full bg-[#151520] border border-[#272738] rounded px-3 py-2 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
              >
                <option value="">None (Standalone Asset)</option>
                {albums.map((alb) => (
                  <option key={alb.id} value={alb.id}>
                    {alb.title} ({alb.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingMedia(null)}
                className="px-4 py-2 text-xs text-[#8c8a94] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] text-xs font-semibold uppercase tracking-wider rounded"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
