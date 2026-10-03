import React, { useState } from 'react';
import { LayoutGrid, Grid, Play, MapPin, Eye, Film, Search, Folder } from 'lucide-react';
import { Album, GalleryItem } from '../types';
import { LightboxModal } from '../components/LightboxModal';

interface PortfolioPageProps {
  gallery: GalleryItem[];
  albums?: Album[];
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ gallery, albums = [] }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('all');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'masonry'>('masonry');
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const categories = [
    { id: 'all', label: 'All Works' },
    { id: 'wedding', label: 'Weddings' },
    { id: 'pre-wedding', label: 'Pre-Wedding' },
    { id: 'traditional', label: 'Traditional Rituals' },
    { id: 'cinematic', label: 'Cinematic Films' },
    { id: 'portrait', label: 'Portraits' },
    { id: 'event', label: 'Celebrations' },
  ];

  // Published albums only
  const publishedAlbums = albums.filter((a) => a.isPublished !== false);

  // Filtering
  const filteredItems = gallery.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' || item.category === activeCategory;
    const matchesAlbum =
      selectedAlbumId === 'all' || item.albumId === selectedAlbumId;
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.coupleOrClient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.caption.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesAlbum && matchesSearch;
  });

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#e4e2dd] pt-28 pb-24">
      {/* Header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-8">
        <span className="text-xs uppercase tracking-[0.3em] text-[#c5a059] font-mono">
          Visual Archive
        </span>
        <h1 className="text-4xl sm:text-6xl font-serif text-[#f5eedc] mt-3 font-normal leading-tight">
          Portfolio & Cinematic Gallery
        </h1>
        <p className="mt-4 text-base text-[#a8a6af] font-light max-w-2xl mx-auto leading-relaxed">
          Moments frozen in time, stories told in movement and light. Explore our wedding stories,
          pre-wedding poetry, and cultural rituals captured across Janakpur and beyond.
        </p>

        {/* Featured Albums Carousel / Cards */}
        {publishedAlbums.length > 0 && selectedAlbumId === 'all' && (
          <div className="mt-12 text-left">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-[#c5a059] font-mono flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5" />
                <span>Featured Collections</span>
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {publishedAlbums.map((alb) => (
                <div
                  key={alb.id}
                  onClick={() => setSelectedAlbumId(alb.id)}
                  className="group relative cursor-pointer aspect-[16/10] rounded-lg overflow-hidden border border-[#242434] hover:border-[#c5a059] transition-all bg-[#14141d]"
                >
                  <img
                    src={alb.coverImage}
                    alt={alb.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5">
                    <span className="text-[9px] uppercase font-mono text-[#c5a059] block">
                      {alb.category}
                    </span>
                    <h3 className="text-xs font-serif text-[#f5eedc] font-medium truncate">
                      {alb.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter Controls & Layout Toggle */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#1f1f2b] pb-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSelectedAlbumId('all');
                }}
                className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-medium rounded transition-colors ${
                  activeCategory === cat.id && selectedAlbumId === 'all'
                    ? 'bg-[#c5a059] text-[#09090b] font-semibold'
                    : 'text-[#9c9aa5] hover:text-[#f5eedc] hover:bg-[#14141c]'
                }`}
              >
                {cat.label}
              </button>
            ))}

            {selectedAlbumId !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedAlbumId('all')}
                className="px-3 py-1 text-xs bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/40 rounded flex items-center gap-1"
              >
                <span>Album: {albums.find((a) => a.id === selectedAlbumId)?.title}</span>
                <span className="font-bold">✕</span>
              </button>
            )}
          </div>

          {/* Search & Layout View switch */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-48">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#686672]" />
              <input
                type="text"
                placeholder="Search gallery..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#13131a] border border-[#242433] rounded pl-8 pr-3 py-1.5 text-xs text-[#f5eedc] placeholder:text-[#5d5b68] focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#13131a] border border-[#242433] rounded p-0.5">
              <button
                type="button"
                onClick={() => setLayoutMode('masonry')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  layoutMode === 'masonry'
                    ? 'bg-[#222230] text-[#c5a059]'
                    : 'text-[#6a6875] hover:text-white'
                }`}
                title="Dynamic Masonry Layout"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('grid')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  layoutMode === 'grid'
                    ? 'bg-[#222230] text-[#c5a059]'
                    : 'text-[#6a6875] hover:text-white'
                }`}
                title="Uniform Grid Layout"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Presentation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredItems.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-base text-[#a8a6af] font-serif">
              No photographs found matching your filter criteria.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all');
                setSelectedAlbumId('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 text-xs uppercase tracking-wider text-[#c5a059] border border-[#c5a059]/40 rounded hover:bg-[#c5a059]/10"
            >
              Reset Filters
            </button>
          </div>
        ) : layoutMode === 'grid' ? (
          /* Uniform Grid Mode */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => openLightbox(index)}
                className="group relative cursor-pointer overflow-hidden rounded bg-[#101016] border border-[#20202c] hover:border-[#c5a059]/50 transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-70 group-hover:opacity-85 transition-opacity" />

                  {item.videoUrl && (
                    <div className="absolute top-3 right-3 p-2 bg-[#09090b]/80 backdrop-blur rounded-full text-[#c5a059] border border-[#2a2a3a]">
                      <Play className="w-4 h-4 fill-current" />
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#09090b]/85 backdrop-blur text-xs uppercase tracking-wider text-[#d4b470] rounded border border-[#c5a059]/30">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{item.videoUrl ? 'Watch Film' : 'View High-Res'}</span>
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between text-[11px] text-[#787682] mb-1 font-mono">
                    <span className="uppercase text-[#c5a059]">{item.category}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#787682]" />
                      <span>{item.location}</span>
                    </span>
                  </div>
                  <h3 className="text-sm font-serif text-[#f5eedc] font-medium group-hover:text-[#d4b470] transition-colors">
                    {item.title}
                  </h3>
                  {item.coupleOrClient && (
                    <p className="text-xs text-[#a8a6af] mt-0.5 font-light">
                      {item.coupleOrClient}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Masonry Columns Mode */
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredItems.map((item, index) => {
              const isTall = item.aspectRatio === 'portrait';
              return (
                <div
                  key={item.id}
                  onClick={() => openLightbox(index)}
                  className="break-inside-avoid group relative cursor-pointer overflow-hidden rounded bg-[#101016] border border-[#20202c] hover:border-[#c5a059]/50 transition-all duration-300"
                >
                  <div className={`overflow-hidden relative ${isTall ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                    {item.videoUrl && (
                      <div className="absolute top-3 right-3 p-2 bg-[#09090b]/80 backdrop-blur rounded-full text-[#c5a059] border border-[#2a2a3a]">
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#09090b]/85 backdrop-blur text-xs uppercase tracking-wider text-[#d4b470] rounded border border-[#c5a059]/30">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{item.videoUrl ? 'Watch Film' : 'View High-Res'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between text-[11px] text-[#787682] mb-1 font-mono">
                      <span className="uppercase text-[#c5a059]">{item.category}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#787682]" />
                        <span>{item.location}</span>
                      </span>
                    </div>
                    <h3 className="text-sm font-serif text-[#f5eedc] font-medium group-hover:text-[#d4b470] transition-colors">
                      {item.title}
                    </h3>
                    {item.coupleOrClient && (
                      <p className="text-xs text-[#a8a6af] mt-0.5 font-light">
                        {item.coupleOrClient}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Lightbox Component */}
      <LightboxModal
        items={filteredItems}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />
    </div>
  );
};
