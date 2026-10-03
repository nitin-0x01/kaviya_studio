import {
  ActivityLog,
  AdminUser,
  Album,
  BlogPost,
  BookingInquiry,
  GalleryItem,
  MediaItem,
  PricingPackage,
  Service,
  StudioSettings,
  Testimonial,
} from '../types';
import {
  defaultSettings,
  defaultServices,
  defaultPackages,
  defaultGallery,
  defaultTestimonials,
  defaultAlbums,
  defaultBlogPosts,
} from '../data/defaultData';

const TOKEN_KEY = 'kaviya_studio_admin_token';

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function getAuthHeaders(includeContentType = true): HeadersInit {
  const token = getAdminToken();
  const headers: Record<string, string> = {};
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// ---------------- API CLIENT ----------------
export const api = {
  // Settings
  async getSettings(): Promise<StudioSettings> {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('Failed to load settings');
      return await res.json();
    } catch {
      return defaultSettings;
    }
  },

  async updateSettings(settings: Partial<StudioSettings>): Promise<StudioSettings> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update settings');
    }
    const data = await res.json();
    return data.settings;
  },

  // Media Library & Device File Uploads
  async uploadMedia(
    file: File,
    meta?: { title?: string; category?: string; albumId?: string; caption?: string }
  ): Promise<{ success: boolean; file: MediaItem; url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    if (meta?.title) formData.append('title', meta.title);
    if (meta?.category) formData.append('category', meta.category);
    if (meta?.albumId) formData.append('albumId', meta.albumId);
    if (meta?.caption) formData.append('caption', meta.caption);

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: getAuthHeaders(false), // FormData handles multipart boundary
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to upload media file');
    }
    return data;
  },

  async uploadBulkMedia(
    files: File[],
    meta?: { category?: string; albumId?: string }
  ): Promise<{ success: boolean; files: MediaItem[] }> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    if (meta?.category) formData.append('category', meta.category);
    if (meta?.albumId) formData.append('albumId', meta.albumId);

    const res = await fetch('/api/upload/bulk', {
      method: 'POST',
      headers: getAuthHeaders(false),
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to upload files in bulk');
    }
    return data;
  },

  async getMedia(params?: {
    search?: string;
    type?: string;
    category?: string;
    albumId?: string;
  }): Promise<{ items: MediaItem[]; totalCount: number; totalBytes: number; totalMegabytes: string }> {
    const q = new URLSearchParams();
    if (params?.search) q.append('search', params.search);
    if (params?.type && params.type !== 'all') q.append('type', params.type);
    if (params?.category && params.category !== 'all') q.append('category', params.category);
    if (params?.albumId && params.albumId !== 'all') q.append('albumId', params.albumId);

    const res = await fetch(`/api/media?${q.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load media library');
    return await res.json();
  },

  async updateMedia(id: string, data: Partial<MediaItem>): Promise<MediaItem> {
    const res = await fetch(`/api/media/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update media item');
    return await res.json();
  },

  async deleteMedia(id: string): Promise<boolean> {
    const res = await fetch(`/api/media/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.ok;
  },

  async bulkDeleteMedia(ids: string[]): Promise<boolean> {
    const res = await fetch('/api/media/bulk-delete', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ids }),
    });
    return res.ok;
  },

  async getStorageStatus(): Promise<any> {
    const res = await fetch('/api/admin/storage-status', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load storage status');
    return await res.json();
  },

  async verifyStorageSync(): Promise<any> {
    const res = await fetch('/api/admin/media/verify-sync', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to verify media sync');
    return await res.json();
  },

  // Albums
  async getAlbums(): Promise<Album[]> {
    try {
      const res = await fetch('/api/albums');
      if (!res.ok) throw new Error('Failed to load albums');
      return await res.json();
    } catch {
      return defaultAlbums;
    }
  },

  async createAlbum(data: Partial<Album>): Promise<Album> {
    const res = await fetch('/api/albums', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create album');
    return await res.json();
  },

  async updateAlbum(id: string, data: Partial<Album>): Promise<Album> {
    const res = await fetch(`/api/albums/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update album');
    return await res.json();
  },

  async deleteAlbum(id: string): Promise<boolean> {
    const res = await fetch(`/api/albums/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.ok;
  },

  // Blog & Articles
  async getBlogPosts(category?: string, tag?: string): Promise<BlogPost[]> {
    try {
      const q = new URLSearchParams();
      if (category && category !== 'all') q.append('category', category);
      if (tag) q.append('tag', tag);
      const res = await fetch(`/api/blog?${q.toString()}`);
      if (!res.ok) throw new Error('Failed to load blog posts');
      return await res.json();
    } catch {
      return defaultBlogPosts;
    }
  },

  async getBlogPost(slug: string): Promise<BlogPost> {
    const res = await fetch(`/api/blog/${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error('Article not found');
    return await res.json();
  },

  async getAdminBlogPosts(): Promise<BlogPost[]> {
    const res = await fetch('/api/admin/blog', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load blog posts');
    return await res.json();
  },

  async createBlogPost(data: Partial<BlogPost>): Promise<BlogPost> {
    const res = await fetch('/api/admin/blog', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create article');
    return await res.json();
  },

  async updateBlogPost(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
    const res = await fetch(`/api/admin/blog/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update article');
    return await res.json();
  },

  async deleteBlogPost(id: string): Promise<boolean> {
    const res = await fetch(`/api/admin/blog/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.ok;
  },

  // Services
  async getServices(): Promise<Service[]> {
    try {
      const res = await fetch('/api/services');
      if (!res.ok) throw new Error('Failed to load services');
      return await res.json();
    } catch {
      return defaultServices;
    }
  },

  async getAdminServices(): Promise<Service[]> {
    const res = await fetch('/api/admin/services', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load admin services');
    return await res.json();
  },

  async createService(data: Partial<Service>): Promise<Service> {
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create service');
    return await res.json();
  },

  async updateService(id: string, data: Partial<Service>): Promise<Service> {
    const res = await fetch(`/api/services/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update service');
    return await res.json();
  },

  async deleteService(id: string): Promise<boolean> {
    const res = await fetch(`/api/services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.ok;
  },

  // Packages
  async getPackages(): Promise<PricingPackage[]> {
    try {
      const res = await fetch('/api/packages');
      if (!res.ok) throw new Error('Failed to load packages');
      return await res.json();
    } catch {
      return defaultPackages;
    }
  },

  async getAdminPackages(): Promise<PricingPackage[]> {
    const res = await fetch('/api/admin/packages', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load admin packages');
    return await res.json();
  },

  async createPackage(data: Partial<PricingPackage>): Promise<PricingPackage> {
    const res = await fetch('/api/packages', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create package');
    return await res.json();
  },

  async updatePackage(id: string, data: Partial<PricingPackage>): Promise<PricingPackage> {
    const res = await fetch(`/api/packages/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update package');
    return await res.json();
  },

  async deletePackage(id: string): Promise<boolean> {
    const res = await fetch(`/api/packages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.ok;
  },

  // Gallery
  async getGallery(category?: string, featured?: boolean, albumId?: string): Promise<GalleryItem[]> {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (featured) params.append('featured', 'true');
      if (albumId && albumId !== 'all') params.append('albumId', albumId);
      const res = await fetch(`/api/gallery?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load gallery');
      return await res.json();
    } catch {
      let items = defaultGallery;
      if (category && category !== 'all') items = items.filter((i) => i.category === category);
      if (featured) items = items.filter((i) => i.isFeatured);
      if (albumId && albumId !== 'all') items = items.filter((i) => i.albumId === albumId);
      return items;
    }
  },

  async createGalleryItem(item: Partial<GalleryItem>): Promise<GalleryItem> {
    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to upload photo');
    }
    return await res.json();
  },

  async updateGalleryItem(id: string, item: Partial<GalleryItem>): Promise<GalleryItem> {
    const res = await fetch(`/api/gallery/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Failed to update item');
    return await res.json();
  },

  async deleteGalleryItem(id: string): Promise<boolean> {
    const res = await fetch(`/api/gallery/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.ok;
  },

  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    try {
      const res = await fetch('/api/testimonials');
      if (!res.ok) throw new Error('Failed to load testimonials');
      return await res.json();
    } catch {
      return defaultTestimonials.filter((t) => t.isApproved);
    }
  },

  async getAdminTestimonials(): Promise<Testimonial[]> {
    const res = await fetch('/api/admin/testimonials', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch testimonials');
    return await res.json();
  },

  async submitTestimonial(data: Partial<Testimonial>): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit review');
    }
    return await res.json();
  },

  async createAdminTestimonial(data: Partial<Testimonial>): Promise<Testimonial> {
    const res = await fetch('/api/admin/testimonials', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create testimonial');
    return await res.json();
  },

  async updateTestimonial(id: string, data: Partial<Testimonial>): Promise<Testimonial> {
    const res = await fetch(`/api/admin/testimonials/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update testimonial');
    return await res.json();
  },

  async deleteTestimonial(id: string): Promise<boolean> {
    const res = await fetch(`/api/admin/testimonials/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.ok;
  },

  // Bookings
  async submitBooking(data: Partial<BookingInquiry>): Promise<{
    success: boolean;
    referenceNumber: string;
    message: string;
    booking: BookingInquiry;
  }> {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to submit booking inquiry');
    }
    return result;
  },

  async createManualBooking(data: Partial<BookingInquiry>): Promise<BookingInquiry> {
    const res = await fetch('/api/admin/bookings', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add booking');
    return await res.json();
  },

  async trackBooking(ref: string): Promise<BookingInquiry> {
    const res = await fetch(`/api/bookings/track/${encodeURIComponent(ref)}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Booking reference not found');
    }
    return data;
  },

  async getAdminBookings(params?: {
    status?: string;
    search?: string;
    eventType?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<BookingInquiry[]> {
    const q = new URLSearchParams();
    if (params?.status && params.status !== 'all') q.append('status', params.status);
    if (params?.search) q.append('search', params.search);
    if (params?.eventType && params.eventType !== 'all') q.append('eventType', params.eventType);
    if (params?.dateFrom) q.append('dateFrom', params.dateFrom);
    if (params?.dateTo) q.append('dateTo', params.dateTo);

    const res = await fetch(`/api/admin/bookings?${q.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return await res.json();
  },

  async updateBooking(id: string, status?: string, adminNotes?: string): Promise<BookingInquiry> {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, adminNotes }),
    });
    if (!res.ok) throw new Error('Failed to update booking');
    return await res.json();
  },

  async deleteBooking(id: string): Promise<boolean> {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.ok;
  },

  async getAdminAnalytics(): Promise<any> {
    const res = await fetch('/api/admin/analytics', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return await res.json();
  },

  // Admin Users & Logs
  async getAdminUsers(): Promise<AdminUser[]> {
    const res = await fetch('/api/admin/users', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load users');
    return await res.json();
  },

  async createAdminUser(
    dataOrUsername: string | { username: string; password: string; email?: string; role: string },
    password?: string,
    email?: string,
    role?: string
  ): Promise<AdminUser> {
    const payload =
      typeof dataOrUsername === 'string'
        ? { username: dataOrUsername, password: password || '', email, role: role || 'content_manager' }
        : dataOrUsername;
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create user');
    }
    return await res.json();
  },

  async deleteAdminUser(id: string): Promise<boolean> {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.ok;
  },

  async getActivityLogs(): Promise<ActivityLog[]> {
    const res = await fetch('/api/admin/logs', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load activity logs');
    return await res.json();
  },

  // Auth
  async getAuthStatus(): Promise<{ initialized: boolean; username: string | null }> {
    try {
      const res = await fetch('/api/auth/status');
      if (!res.ok) return { initialized: false, username: null };
      return await res.json();
    } catch {
      return { initialized: false, username: null };
    }
  },

  async setupAdmin(
    username: string,
    password: string,
    email?: string
  ): Promise<{ success: boolean; token: string; user: any }> {
    const res = await fetch('/api/auth/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Setup failed');
    setAdminToken(data.token);
    return data;
  },

  async loginAdmin(username: string, password: string): Promise<{ success: boolean; token: string; user: any }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    setAdminToken(data.token);
    return data;
  },

  async logoutAdmin(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } finally {
      clearAdminToken();
    }
  },

  async getAdminMe(): Promise<{ authenticated: boolean; username: string; role: string }> {
    const token = getAdminToken();
    if (!token) return { authenticated: false, username: '', role: 'super_admin' };
    try {
      const res = await fetch('/api/auth/me', {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        clearAdminToken();
        return { authenticated: false, username: '', role: 'super_admin' };
      }
      return await res.json();
    } catch {
      return { authenticated: false, username: '', role: 'super_admin' };
    }
  },

  async resetDatabase(): Promise<void> {
    const res = await fetch('/api/admin/reset-database', {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to reset database');
  },

  async importDatabase(backupData: any): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/admin/import-database', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ backupData }),
    });
    if (!res.ok) throw new Error('Failed to import database backup');
    return await res.json();
  },

  async restoreDatabase(backupData: any): Promise<{ success: boolean; message: string }> {
    return this.importDatabase(backupData);
  },

  async updateAdminCredentials(
    currentPassword: string,
    newUsername?: string,
    newPassword?: string
  ): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/auth/update-credentials', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newUsername, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update credentials');
    return data;
  },
};
