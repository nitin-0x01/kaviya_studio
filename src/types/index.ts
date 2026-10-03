export type BookingStatus =
  | 'new'
  | 'contacted'
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export interface BookingInquiry {
  id: string;
  referenceNumber: string;
  fullName: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  preferredPackage: string;
  estimatedBudget?: string;
  additionalRequirements?: string;
  preferredContactMethod: 'whatsapp' | 'phone' | 'email';
  status: BookingStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  description: string;
  shortDescription: string;
  features: string[];
  deliverables: string[];
  priceDisplay: string;
  contactForPrice: boolean;
  featured: boolean;
  category: string;
  order?: number;
  isPublished?: boolean;
}

export interface PricingPackage {
  id: string;
  name: string;
  price: string | null;
  contactForPrice: boolean;
  tagline: string;
  photographersCount: string;
  hours: string;
  editedImages: string;
  album: string;
  video: string;
  drone: string;
  deliveryTime: string;
  features: string[];
  isPopular: boolean;
  order: number;
  isEnabled?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  coupleOrClient: string;
  category: 'wedding' | 'pre-wedding' | 'traditional' | 'cinematic' | 'portrait' | 'event';
  imageUrl: string;
  thumbnailUrl?: string;
  aspectRatio: 'landscape' | 'portrait' | 'square';
  location: string;
  isFeatured: boolean;
  videoUrl?: string;
  date: string;
  caption: string;
  isDemo?: boolean;
  albumId?: string;
  altText?: string;
  order?: number;
}

export interface Album {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  category: 'wedding' | 'pre-wedding' | 'traditional' | 'cinematic' | 'portrait' | 'event';
  isFeatured: boolean;
  isPublished: boolean;
  order: number;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  type: 'image' | 'video';
  title: string;
  caption?: string;
  altText?: string;
  category?: string;
  albumId?: string;
  uploadedAt: string;
  dimensions?: { width: number; height: number };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  isPublished: boolean;
  publishedAt: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  eventType: string;
  location: string;
  quote: string;
  rating: number;
  photoUrl?: string;
  date: string;
  isApproved: boolean;
  isFeatured: boolean;
  isDemo: boolean;
  order?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  experienceYears?: string;
  order?: number;
}

export interface SocialLinks {
  instagram: string;
  facebook: string;
  youtube: string;
  whatsapp: string;
  tiktok?: string;
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  isVisible: boolean;
  isExternal?: boolean;
}

export interface StudioSettings {
  brandName: string;
  tagline: string;
  headline: string;
  subHeadline: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  businessHours: { days: string; hours: string }[];
  heroSlides: {
    id: string;
    image: string;
    title: string;
    subtitle: string;
    category: string;
  }[];
  heroConfig?: {
    slideInterval: number;
    autoplay: boolean;
    overlayIntensity: number; // 0 to 100
    ctaPrimaryText: string;
    ctaPrimaryLink: string;
    ctaSecondaryText: string;
    ctaSecondaryLink: string;
    videoUrl?: string;
  };
  homepageSections?: {
    id: string;
    name: string;
    title?: string;
    subtitle?: string;
    isEnabled: boolean;
    order: number;
  }[];
  headerConfig?: {
    logoWidth: number;
    isSticky: boolean;
    navItems: NavItem[];
    appearance: 'transparent' | 'dark' | 'glass';
  };
  footerConfig?: {
    bio: string;
    copyrightText: string;
    showSocials: boolean;
    showHours: boolean;
    customNote?: string;
  };
  appearance?: {
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
    headingFont: 'Cinzel' | 'Cormorant Garamond' | 'Playfair Display' | 'Serif';
    bodyFont: 'Plus Jakarta Sans' | 'Inter' | 'System';
    borderRadius: 'none' | 'sm' | 'md' | 'lg';
    themeMode: 'dark' | 'light';
  };
  socialLinks?: SocialLinks;
  storyIntro: string;
  philosophy: string;
  approach: string;
  logoUrl?: string;
  logoMotif: 'phoenix_lens' | 'classic_aperture' | 'minimal_monogram';
  seo: {
    title: string;
    metaDescription: string;
    keywords: string;
    ogImage?: string;
    canonicalUrl?: string;
  };
  integrations: {
    emailServiceConfigured: boolean;
    emailServiceNote: string;
    whatsappApiConfigured: boolean;
    whatsappApiNote: string;
  };
  team: TeamMember[];
}

export type AdminRole = 'super_admin' | 'content_manager' | 'booking_manager' | 'gallery_manager';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: AdminRole;
  createdAt: string;
  lastLogin?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  username: string;
  action: string;
  module: string;
  details?: string;
}
