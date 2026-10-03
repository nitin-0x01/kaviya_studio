import React, { useState, useEffect } from 'react';
import {
  Lock,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Menu,
  X,
  Calendar,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  KeyRound,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';
import { api, getAdminToken, clearAdminToken } from '../services/api';
import {
  ActivityLog,
  AdminRole,
  Album,
  BookingInquiry,
  BookingStatus,
  GalleryItem,
  PricingPackage,
  Service,
  StudioSettings,
  Testimonial,
} from '../types';
import { defaultSettings } from '../data/defaultData';
import { Logo } from '../components/Logo';
import { AdminSidebar, AdminModuleType } from '../components/admin/AdminSidebar';
import { DashboardOverviewModule } from '../components/admin/DashboardOverviewModule';
import { HomepageModule } from '../components/admin/HomepageModule';
import { HeaderNavModule } from '../components/admin/HeaderNavModule';
import { AboutPageModule } from '../components/admin/AboutPageModule';
import { ServicesModule } from '../components/admin/ServicesModule';
import { GalleryModule } from '../components/admin/GalleryModule';
import { PackagesModule } from '../components/admin/PackagesModule';
import { BookingsModule } from '../components/admin/BookingsModule';
import { TestimonialsModule } from '../components/admin/TestimonialsModule';
import { ContactPageModule } from '../components/admin/ContactPageModule';
import { BlogModule } from '../components/admin/BlogModule';
import { SeoModule } from '../components/admin/SeoModule';
import { MediaLibraryModule } from '../components/admin/MediaLibraryModule';
import { SocialMediaModule } from '../components/admin/SocialMediaModule';
import { FooterModule } from '../components/admin/FooterModule';
import { AppearanceModule } from '../components/admin/AppearanceModule';
import { AdminUsersModule } from '../components/admin/AdminUsersModule';
import { WebsiteSettingsModule } from '../components/admin/WebsiteSettingsModule';
import { AnalyticsModule } from '../components/admin/AnalyticsModule';
import { BackupRestoreModule } from '../components/admin/BackupRestoreModule';

export const AdminDashboard: React.FC = () => {
  // Authentication state
  const [authStatus, setAuthStatus] = useState<{ initialized: boolean; username: string | null } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminUsername, setAdminUsername] = useState<string>('');
  const [adminRole, setAdminRole] = useState<AdminRole>('super_admin');
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Forms
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [setupForm, setSetupForm] = useState({ username: '', password: '', confirmPassword: '', email: '' });
  const [authError, setAuthError] = useState<string | null>(null);

  // Navigation module state
  const [activeModule, setActiveModule] = useState<AdminModuleType>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Core Studio Collections Data
  const [analytics, setAnalytics] = useState<any>(null);
  const [bookings, setBookings] = useState<BookingInquiry[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<StudioSettings>(defaultSettings);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);

  // Modal for quick inquiry viewing
  const [selectedBooking, setSelectedBooking] = useState<BookingInquiry | null>(null);

  // Toast feedback
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setAuthLoading(true);
    try {
      const status = await api.getAuthStatus();
      setAuthStatus(status);

      const token = getAdminToken();
      if (token) {
        const me = await api.getAdminMe();
        if (me.authenticated) {
          setIsAuthenticated(true);
          setAdminUsername(me.username);
          setAdminRole((me.role as AdminRole) || 'super_admin');
          loadAdminData();
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.error('Auth verification error:', e);
    } finally {
      setAuthLoading(false);
    }
  };

  const loadAdminData = async () => {
    setLoadingData(true);
    try {
      const [anData, bData, sData, pData, gData, aData, tData, setts, logs] = await Promise.all([
        api.getAdminAnalytics().catch(() => null),
        api.getAdminBookings().catch(() => []),
        api.getAdminServices().catch(() => []),
        api.getAdminPackages().catch(() => []),
        api.getGallery().catch(() => []),
        api.getAlbums().catch(() => []),
        api.getAdminTestimonials().catch(() => []),
        api.getSettings().catch(() => defaultSettings),
        api.getActivityLogs().catch(() => []),
      ]);

      if (anData) setAnalytics(anData);
      setBookings(bData);
      setServices(sData);
      setPackages(pData);
      setGallery(gData);
      setAlbums(aData);
      setTestimonials(tData);
      if (setts) setSettings(setts);
      setActivityLogs(logs);
    } catch (err: any) {
      showFeedback('error', 'Error refreshing studio records.');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (setupForm.password.length < 8) {
      setAuthError('Master password must be at least 8 characters.');
      return;
    }
    if (setupForm.password !== setupForm.confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    try {
      const res = await api.setupAdmin(setupForm.username, setupForm.password, setupForm.email);
      setIsAuthenticated(true);
      setAdminUsername(res.user.username);
      setAdminRole('super_admin');
      setAuthStatus({ initialized: true, username: res.user.username });
      loadAdminData();
      showFeedback('success', 'Master Administrator account successfully initialized.');
    } catch (err: any) {
      setAuthError(err.message || 'Setup initialization failed.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    try {
      const res = await api.loginAdmin(loginForm.username, loginForm.password);
      setIsAuthenticated(true);
      setAdminUsername(res.user.username);
      setAdminRole(res.user.role || 'super_admin');
      loadAdminData();
      showFeedback('success', `Welcome back, ${res.user.username}!`);
    } catch (err: any) {
      setAuthError(err.message || 'Invalid username or password.');
    }
  };

  const handleLogout = async () => {
    await api.logoutAdmin();
    clearAdminToken();
    setIsAuthenticated(false);
    setAdminUsername('');
    showFeedback('success', 'Signed out from management console.');
  };

  const handleSaveSettings = async (updated: Partial<StudioSettings>) => {
    const saved = await api.updateSettings(updated);
    setSettings(saved);
  };

  // Loading Screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#070709] flex items-center justify-center text-xs text-[#a8a6af] font-mono">
        Verifying Kaviya Studio administrator session...
      </div>
    );
  }

  // 1. FIRST-TIME MASTER SETUP WIZARD (If uninitialized)
  if (authStatus && !authStatus.initialized) {
    return (
      <div className="min-h-screen bg-[#070709] flex items-center justify-center p-4">
        <div className="bg-[#0f0f15] border border-[#272738] rounded-2xl max-w-md w-full p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <Logo size="lg" className="mx-auto" />
            <div className="pt-2">
              <span className="text-xs uppercase tracking-widest text-[#c5a059] font-mono">
                Initial Master Setup
              </span>
              <h1 className="text-2xl font-serif text-[#f5eedc] mt-1">Create Studio Admin Account</h1>
              <p className="text-xs text-[#8c8a94] leading-relaxed mt-1">
                Configure your secure administrator credentials to manage all images, bookings, and content for Kaviya Studio.
              </p>
            </div>
          </div>

          {authError && (
            <div className="p-3 bg-red-950/40 border border-red-800/40 rounded flex items-center gap-2 text-xs text-red-300">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSetup} className="space-y-4 text-xs">
            <div>
              <label className="block uppercase tracking-wider text-[#a8a6af] mb-1 font-medium">
                Admin Username
              </label>
              <input
                type="text"
                placeholder="e.g. kaviya_admin"
                value={setupForm.username}
                onChange={(e) => setSetupForm({ ...setupForm, username: e.target.value })}
                className="w-full bg-[#14141d] border border-[#28283a] rounded px-3.5 py-2.5 text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                required
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-[#a8a6af] mb-1 font-medium">
                Studio Email Address
              </label>
              <input
                type="email"
                placeholder="contact@kaviyastudio.com"
                value={setupForm.email}
                onChange={(e) => setSetupForm({ ...setupForm, email: e.target.value })}
                className="w-full bg-[#14141d] border border-[#28283a] rounded px-3.5 py-2.5 text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-[#a8a6af] mb-1 font-medium">
                Master Password (min 8 characters)
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={setupForm.password}
                onChange={(e) => setSetupForm({ ...setupForm, password: e.target.value })}
                className="w-full bg-[#14141d] border border-[#28283a] rounded px-3.5 py-2.5 text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                required
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-[#a8a6af] mb-1 font-medium">
                Confirm Master Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={setupForm.confirmPassword}
                onChange={(e) => setSetupForm({ ...setupForm, confirmPassword: e.target.value })}
                className="w-full bg-[#14141d] border border-[#28283a] rounded px-3.5 py-2.5 text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] text-xs font-semibold uppercase tracking-widest rounded transition-all shadow-md"
              >
                Complete Master Setup
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 2. ADMIN LOGIN SCREEN (If not authenticated)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070709] flex items-center justify-center p-4">
        <div className="bg-[#0f0f15] border border-[#272738] rounded-2xl max-w-md w-full p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <Logo size="lg" className="mx-auto" />
            <div className="pt-1">
              <span className="text-xs uppercase tracking-widest text-[#c5a059] font-mono">
                Restricted Admin Console
              </span>
              <h1 className="text-2xl font-serif text-[#f5eedc] mt-1">Kaviya Studio Portal</h1>
              <p className="text-xs text-[#8c8a94] mt-1">
                Sign in with your master administrator credentials.
              </p>
            </div>
          </div>

          {authError && (
            <div className="p-3 bg-red-950/40 border border-red-800/40 rounded flex items-center gap-2 text-xs text-red-300">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block uppercase tracking-wider text-[#a8a6af] mb-1 font-medium">
                Username
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full bg-[#14141d] border border-[#28283a] rounded px-3.5 py-2.5 text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                required
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-[#a8a6af] mb-1 font-medium">
                Password
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full bg-[#14141d] border border-[#28283a] rounded px-3.5 py-2.5 text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] text-xs font-semibold uppercase tracking-widest rounded transition-all shadow-md"
              >
                Sign In to Management Console
              </button>
            </div>
          </form>

          <div className="text-center pt-2">
            <a href="/" className="text-xs text-[#6e6c77] hover:text-[#d4b470] transition-colors">
              ← Return to public website
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 3. MASTER AUTHENTICATED MANAGEMENT CONSOLE
  const newBookingsCount = bookings.filter((b) => b.status === 'new').length;
  const pendingReviewsCount = testimonials.filter((t) => !t.isApproved).length;

  return (
    <div className="min-h-screen bg-[#070709] text-[#e4e2dd] flex flex-col font-sans selection:bg-[#c5a059] selection:text-black">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-xl text-xs flex items-center gap-2 border animate-in slide-in-from-top-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-700/60'
              : 'bg-red-950/90 text-red-200 border-red-700/60'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="bg-[#0b0b10] border-b border-[#1c1c28] px-4 md:px-6 py-3 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-1.5 text-[#a8a6af] hover:text-white rounded hover:bg-[#181824]"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <Logo size="xs" logoUrl={settings.logoUrl} alt="Kaviya Studio official logo" />
            <div>
              <h1 className="text-xs md:text-sm font-semibold text-[#f5eedc] tracking-wide">
                Kaviya Studio CMS
              </h1>
              <p className="text-[10px] text-[#71707c] font-mono hidden sm:block">
                Janakpurdham, Nepal · Master Portal
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#14141c] hover:bg-[#1f1f2b] text-xs text-[#a8a6af] hover:text-white rounded border border-[#262635] transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3 text-[#c5a059]" />
          </a>

          <button
            type="button"
            onClick={loadAdminData}
            disabled={loadingData}
            className="p-1.5 text-[#a8a6af] hover:text-white rounded hover:bg-[#181824]"
            title="Refresh Studio Records"
          >
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin text-[#c5a059]' : ''}`} />
          </button>

          <div className="h-4 w-[1px] bg-[#222232] hidden sm:block" />

          <div className="text-right hidden sm:block">
            <span className="text-xs text-[#f5eedc] block font-medium">{adminUsername}</span>
            <span className="text-[10px] font-mono text-[#c5a059] uppercase">{adminRole}</span>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace: Sidebar + Dynamic Module Component */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar
          activeModule={activeModule}
          onSelectModule={(mod) => {
            setActiveModule(mod);
            setMobileSidebarOpen(false);
          }}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onLogout={handleLogout}
          username={adminUsername}
          userRole={adminRole}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          newBookingsCount={newBookingsCount}
          pendingReviewsCount={pendingReviewsCount}
          logoUrl={settings.logoUrl}
        />

        {/* Viewport content area */}
        <main className="flex-1 bg-[#08080c] p-4 md:p-8 overflow-y-auto">
          {/* Breadcrumb indicator */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#716f7c] mb-6">
            <span>Admin</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#c5a059] uppercase">{activeModule}</span>
          </div>

          {/* Module Switcher Rendering */}
          {activeModule === 'overview' && (
            <DashboardOverviewModule
              bookings={bookings}
              services={services}
              packages={packages}
              gallery={gallery}
              testimonials={testimonials}
              settings={settings}
              analytics={analytics}
              activityLogs={activityLogs}
              onNavigate={(mod) => setActiveModule(mod)}
              onOpenBookingModal={(b) => setSelectedBooking(b)}
            />
          )}

          {activeModule === 'homepage' && (
            <HomepageModule
              settings={settings}
              onSave={handleSaveSettings}
              onNotify={showFeedback}
            />
          )}

          {activeModule === 'header' && (
            <HeaderNavModule
              settings={settings}
              onSave={handleSaveSettings}
              onNotify={showFeedback}
            />
          )}

          {activeModule === 'about' && (
            <AboutPageModule
              settings={settings}
              onSave={handleSaveSettings}
              onNotify={showFeedback}
            />
          )}

          {activeModule === 'services' && (
            <ServicesModule
              services={services}
              onRefresh={loadAdminData}
              onNotify={showFeedback}
            />
          )}

          {activeModule === 'gallery' && (
            <GalleryModule
              gallery={gallery}
              albums={albums}
              onRefresh={loadAdminData}
              onNotify={showFeedback}
            />
          )}

          {activeModule === 'packages' && (
            <PackagesModule
              packages={packages}
              onRefresh={loadAdminData}
              onNotify={showFeedback}
            />
          )}

          {activeModule === 'bookings' && (
            <BookingsModule
              bookings={bookings}
              onRefresh={loadAdminData}
              onNotify={showFeedback}
            />
          )}

          {activeModule === 'testimonials' && (
            <TestimonialsModule
              testimonials={testimonials}
              onRefresh={loadAdminData}
              onNotify={showFeedback}
            />
          )}

          {activeModule === 'contact' && (
            <ContactPageModule
              settings={settings}
              onSave={handleSaveSettings}
              onNotify={showFeedback}
            />
          )}

          {activeModule === 'blog' && (
            <BlogModule onNotify={showFeedback} />
          )}

          {activeModule === 'seo' && (
            <SeoModule
              settings={settings}
              onSave={handleSaveSettings}
              onNotify={showFeedback}
            />
          )}

          {activeModule === 'media' && (
            <MediaLibraryModule
              albums={albums}
              onNotify={showFeedback}
            />
          )}

          {activeModule === 'social' && (
            <SocialMediaModule
              settings={settings}
              onSave={handleSaveSettings}
              onNotify={showFeedback}
            />
          )}

          {activeModule === 'footer' && (
            <FooterModule
              settings={settings}
              onSave={handleSaveSettings}
              onNotify={showFeedback}
            />
          )}

          {activeModule === 'appearance' && (
            <AppearanceModule
              settings={settings}
              onSave={handleSaveSettings}
              onNotify={showFeedback}
            />
          )}

          {activeModule === 'users' && (
            <AdminUsersModule
              currentUsername={adminUsername}
              onNotify={showFeedback}
            />
          )}

          {activeModule === 'settings' && (
            <WebsiteSettingsModule
              settings={settings}
              onSave={handleSaveSettings}
              onNotify={showFeedback}
            />
          )}

          {activeModule === 'analytics' && (
            <AnalyticsModule
              analytics={analytics}
              bookings={bookings}
            />
          )}

          {activeModule === 'backup' && (
            <BackupRestoreModule
              onRefreshAll={loadAdminData}
              onNotify={showFeedback}
            />
          )}
        </main>
      </div>

      {/* Selected Booking Quick Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#101017] border border-[#272738] rounded-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#20202e] pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#c5a059] uppercase">
                  Reference: {selectedBooking.referenceNumber}
                </span>
                <h3 className="text-base font-serif text-[#f5eedc]">{selectedBooking.fullName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="text-[#716f7c] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 text-[#a5a3b0]">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#716f7c] block">Date:</span>
                  <span className="text-[#f5eedc] font-medium">{selectedBooking.eventDate}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#716f7c] block">Event:</span>
                  <span className="text-[#f5eedc] font-medium">{selectedBooking.eventType}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#716f7c] block">Phone:</span>
                  <span className="text-[#f5eedc] font-mono">{selectedBooking.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#716f7c] block">Location:</span>
                  <span className="text-[#f5eedc]">{selectedBooking.eventLocation}</span>
                </div>
              </div>

              {selectedBooking.additionalRequirements && (
                <div className="p-3 bg-[#161622] rounded-lg border border-[#262638]">
                  <span className="text-[10px] uppercase font-mono text-[#c5a059] block mb-1">
                    Client Notes:
                  </span>
                  <p className="text-[#e4e2dd]">{selectedBooking.additionalRequirements}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#20202e]">
              <a
                href={`https://wa.me/${selectedBooking.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Namaste ${selectedBooking.fullName}, Kaviya Studio regarding your inquiry ${selectedBooking.referenceNumber}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 text-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Open WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setSelectedBooking(null);
                  setActiveModule('bookings');
                }}
                className="text-xs text-[#c5a059] hover:underline"
              >
                Open in Full Bookings Manager →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
