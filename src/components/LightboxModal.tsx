import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Film } from 'lucide-react';
import { GalleryItem } from '../types';

interface LightboxModalProps {
  items: GalleryItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  items,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const currentItem = items[currentIndex];

  const handleNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      onNavigate(currentIndex + 1);
    } else {
      onNavigate(0); // loop back
    }
  }, [currentIndex, items.length, onNavigate]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    } else {
      onNavigate(items.length - 1); // loop to end
    }
  }, [currentIndex, items.length, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!isOpen || !currentItem) return null;

  // Convert youtube watch url to embed if needed
  const getEmbedUrl = (url?: string) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  const videoEmbed = getEmbedUrl(currentItem.videoUrl);

  return (
    <div
      className="fixed inset-0 z-50 bg-[#070709]/95 backdrop-blur-xl flex flex-col justify-between animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Gallery Lightbox"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 sm:px-8 border-b border-[#1c1c24] bg-[#0c0c0f]/80 z-10">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest text-[#c5a059] font-mono">
            {currentIndex + 1} of {items.length}
          </span>
          <span className="text-[#3b3b4a]">·</span>
          <span className="text-xs uppercase tracking-wider text-[#a8a6af] font-light">
            {currentItem.category}
          </span>
          {currentItem.isDemo && (
            <>
              <span className="text-[#3b3b4a]">·</span>
              <span className="text-[11px] text-[#7a7882] italic">Sample showcase</span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 text-[#a8a6af] hover:text-[#f5eedc] hover:bg-[#1a1a22] rounded transition-colors focus:outline-none"
          aria-label="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
        {/* Navigation Buttons */}
        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 sm:left-6 z-20 p-3 text-[#d4b470] hover:text-white bg-[#0e0e13]/70 hover:bg-[#1b1b24] border border-[#2a2a38] rounded-full transition-all active:scale-95 shadow-lg"
              aria-label="Previous photograph"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 sm:right-6 z-20 p-3 text-[#d4b470] hover:text-white bg-[#0e0e13]/70 hover:bg-[#1b1b24] border border-[#2a2a38] rounded-full transition-all active:scale-95 shadow-lg"
              aria-label="Next photograph"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Media Frame */}
        <div className="max-w-5xl max-h-[75vh] w-full flex items-center justify-center select-none">
          {videoEmbed ? (
            <div className="w-full aspect-video max-w-4xl bg-black rounded shadow-2xl overflow-hidden border border-[#2a2a38]">
              <iframe
                src={`${videoEmbed}?autoplay=1`}
                title={currentItem.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <img
              src={currentItem.imageUrl}
              alt={currentItem.title || currentItem.caption || 'Kaviya Studio Photograph'}
              className="max-h-[75vh] max-w-full object-contain rounded shadow-2xl transition-opacity duration-300"
            />
          )}
        </div>
      </div>

      {/* Bottom Metadata Bar */}
      <div className="p-4 sm:px-8 bg-[#0c0c0f]/90 border-t border-[#1c1c24] flex flex-col md:flex-row md:items-center justify-between gap-3 text-sm">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-serif text-[#f5eedc] font-medium">
              {currentItem.title}
            </h3>
            {currentItem.coupleOrClient && (
              <span className="text-xs text-[#c5a059] tracking-wider uppercase font-light">
                — {currentItem.coupleOrClient}
              </span>
            )}
          </div>
          {currentItem.caption && (
            <p className="text-xs sm:text-sm text-[#a8a6af] mt-1 max-w-3xl line-clamp-2">
              {currentItem.caption}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-[#7d7b86] shrink-0">
          {currentItem.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>{currentItem.location}</span>
            </span>
          )}
          {currentItem.date && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>{currentItem.date}</span>
            </span>
          )}
          {currentItem.videoUrl && (
            <span className="flex items-center gap-1 text-[#d4b470]">
              <Film className="w-3.5 h-3.5" />
              <span>Cinematic Video</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
