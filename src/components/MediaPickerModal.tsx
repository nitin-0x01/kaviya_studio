import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Film,
  Search,
  Check,
  Loader2,
  HardDrive,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { MediaItem } from '../types';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, media?: MediaItem) => void;
  title?: string;
  accept?: 'image' | 'video' | 'all';
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = 'Select or Upload Media',
  accept = 'all',
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'library' | 'url'>('upload');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [externalUrl, setExternalUrl] = useState('');

  // Uploading state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const data = await api.getMedia({ type: accept === 'all' ? undefined : accept });
      setMediaItems(data.items);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(20);

    const file = files[0];

    // Client-side validation
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jpg'];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    const isValid =
      accept === 'image'
        ? validImageTypes.includes(file.type)
        : accept === 'video'
        ? validVideoTypes.includes(file.type)
        : [...validImageTypes, ...validVideoTypes].includes(file.type);

    if (!isValid) {
      setUploadError(`Invalid file format (${file.type}). Allowed: JPG, PNG, WEBP, AVIF, MP4, WEBM`);
      setIsUploading(false);
      return;
    }

    if (file.size > 60 * 1024 * 1024) {
      setUploadError('File size exceeds 60MB limit.');
      setIsUploading(false);
      return;
    }

    try {
      setUploadProgress(60);
      const res = await api.uploadMedia(file, { title: file.name });
      setUploadProgress(100);
      setMediaItems((prev) => [res.file, ...prev]);
      onSelect(res.url, res.file);
      onClose();
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const filteredItems = mediaItems.filter((item) => {
    if (accept !== 'all' && item.type !== accept) return false;
    if (!search) return true;
    return (
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.originalName.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-[#070709]/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#101016] border border-[#272738] rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-[#212130] bg-[#14141e]">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-[#c5a059]" />
            <h3 className="text-sm uppercase tracking-wider font-serif text-[#f5eedc] font-semibold">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#71707d] hover:text-white p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[#1c1c28] bg-[#0c0c11]">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-[#c5a059] text-[#c5a059]'
                : 'border-transparent text-[#8c8a94] hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload From Device</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'library'
                ? 'border-[#c5a059] text-[#c5a059]'
                : 'border-transparent text-[#8c8a94] hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Studio Media Library ({mediaItems.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-medium border-b-2 transition-colors ${
              activeTab === 'url'
                ? 'border-[#c5a059] text-[#c5a059]'
                : 'border-transparent text-[#8c8a94] hover:text-white'
            }`}
          >
            External URL
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* TAB 1: UPLOAD FROM LOCAL DEVICE */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept={accept === 'image' ? 'image/*' : accept === 'video' ? 'video/*' : 'image/*,video/*'}
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-[#c5a059] bg-[#c5a059]/10'
                    : 'border-[#28283a] hover:border-[#c5a059]/50 bg-[#14141d]'
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-[#1e1e2d] border border-[#2b2b3f] flex items-center justify-center mx-auto text-[#c5a059] mb-3">
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-[#c5a059]" />
                  ) : (
                    <Upload className="w-6 h-6" />
                  )}
                </div>

                <h4 className="text-sm font-medium text-[#f5eedc]">
                  {isUploading ? 'Uploading to persistent server...' : 'Click or drag & drop files from your device'}
                </h4>
                <p className="text-xs text-[#7d7b86] mt-1 max-w-sm mx-auto">
                  Supports JPG, PNG, WEBP, AVIF, MP4, and WEBM. Files are permanently stored in the
                  studio database and served directly to your website.
                </p>

                {isUploading && (
                  <div className="mt-4 max-w-xs mx-auto">
                    <div className="w-full bg-[#20202c] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[#c5a059] h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-[#a8a6af] font-mono mt-1 block">
                      {uploadProgress}% processed
                    </span>
                  </div>
                )}
              </div>

              {uploadError && (
                <div className="p-3 bg-red-950/40 border border-red-800/40 rounded flex items-center gap-2 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SELECT FROM MEDIA LIBRARY */}
          {activeTab === 'library' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#686672]" />
                  <input
                    type="text"
                    placeholder="Search by filename or title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#14141c] border border-[#252535] rounded pl-8 pr-3 py-1.5 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>

              {loading ? (
                <div className="py-12 text-center text-xs text-[#71707d] font-mono">
                  Loading media library...
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#71707d]">
                  No media items match your search. Upload new files from your device.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[45vh] overflow-y-auto pr-1">
                  {filteredItems.map((item) => {
                    const isSelected = selectedItem?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`relative group aspect-square rounded-lg overflow-hidden cursor-pointer border transition-all bg-[#151520] ${
                          isSelected
                            ? 'border-[#c5a059] ring-2 ring-[#c5a059]/40'
                            : 'border-[#262635] hover:border-[#444458]'
                        }`}
                      >
                        {item.type === 'video' ? (
                          <div className="w-full h-full flex flex-col items-center justify-center text-[#c5a059] bg-[#0c0c11]">
                            <Film className="w-6 h-6" />
                            <span className="text-[9px] mt-1 font-mono uppercase">Video</span>
                          </div>
                        ) : (
                          <img
                            src={item.url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        )}

                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#c5a059] text-[#09090b] flex items-center justify-center shadow">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}

                        <div className="absolute inset-x-0 bottom-0 p-1.5 bg-[#09090b]/80 backdrop-blur-xs text-[10px] text-[#f5eedc] truncate font-mono">
                          {item.title || item.originalName}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EXTERNAL URL */}
          {activeTab === 'url' && (
            <div className="space-y-4 max-w-lg mx-auto py-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#a8a6af] mb-1 font-medium">
                  Paste Media URL
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... or CDN link"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  className="w-full bg-[#14141c] border border-[#252535] rounded px-3.5 py-2.5 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              {externalUrl && (
                <div className="aspect-video max-h-48 overflow-hidden rounded border border-[#272738] bg-[#14141c]">
                  <img
                    src={externalUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 px-6 border-t border-[#212130] bg-[#14141e] flex items-center justify-between">
          <span className="text-xs text-[#71707d]">
            {activeTab === 'library' && selectedItem
              ? `Selected: ${selectedItem.title}`
              : 'Choose an asset to apply to your section'}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#8c8a94] hover:text-white"
            >
              Cancel
            </button>

            {activeTab === 'library' && (
              <button
                type="button"
                disabled={!selectedItem}
                onClick={() => {
                  if (selectedItem) {
                    onSelect(selectedItem.url, selectedItem);
                    onClose();
                  }
                }}
                className="px-5 py-2 bg-[#c5a059] hover:bg-[#d4b470] disabled:opacity-50 text-[#09090b] text-xs uppercase tracking-wider font-semibold rounded"
              >
                Use Selected Media
              </button>
            )}

            {activeTab === 'url' && (
              <button
                type="button"
                disabled={!externalUrl.trim()}
                onClick={() => {
                  if (externalUrl.trim()) {
                    onSelect(externalUrl.trim());
                    onClose();
                  }
                }}
                className="px-5 py-2 bg-[#c5a059] hover:bg-[#d4b470] disabled:opacity-50 text-[#09090b] text-xs uppercase tracking-wider font-semibold rounded"
              >
                Use URL
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
