import React from 'react';
import {
  Calendar,
  Layers,
  Image as ImageIcon,
  MessageSquare,
  BarChart3,
  HardDrive,
  Upload,
  Plus,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import {
  ActivityLog,
  BookingInquiry,
  GalleryItem,
  PricingPackage,
  Service,
  StudioSettings,
  Testimonial,
} from '../../types';
import { AdminModuleType } from './AdminSidebar';

interface DashboardOverviewModuleProps {
  bookings: BookingInquiry[];
  services: Service[];
  packages: PricingPackage[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  settings: StudioSettings;
  analytics: any;
  activityLogs: ActivityLog[];
  onNavigate: (module: AdminModuleType) => void;
  onOpenBookingModal: (booking: BookingInquiry) => void;
}

export const DashboardOverviewModule: React.FC<DashboardOverviewModuleProps> = ({
  bookings,
  services,
  packages,
  gallery,
  testimonials,
  settings,
  analytics,
  activityLogs,
  onNavigate,
  onOpenBookingModal,
}) => {
  const newBookings = bookings.filter((b) => b.status === 'new');
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const pendingReviews = testimonials.filter((t) => !t.isApproved);
  const featuredGallery = gallery.filter((g) => g.isFeatured);

  const kpis = [
    {
      label: 'New Inquiries',
      value: newBookings.length,
      sub: `${bookings.length} Total Received`,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      icon: Calendar,
      action: () => onNavigate('bookings'),
    },
    {
      label: 'Confirmed Shoots',
      value: confirmedBookings.length,
      sub: 'On Production Calendar',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      icon: Sparkles,
      action: () => onNavigate('bookings'),
    },
    {
      label: 'Portfolio Media',
      value: gallery.length,
      sub: `${featuredGallery.length} Featured on Home`,
      color: 'text-[#c5a059]',
      bgColor: 'bg-[#c5a059]/10',
      borderColor: 'border-[#c5a059]/20',
      icon: ImageIcon,
      action: () => onNavigate('gallery'),
    },
    {
      label: 'Client Testimonials',
      value: testimonials.length,
      sub: `${pendingReviews.length} Awaiting Approval`,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      icon: MessageSquare,
      action: () => onNavigate('testimonials'),
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header welcome banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#12121a] via-[#161622] to-[#12121a] border border-[#262638] rounded-2xl p-6 md:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/30 text-[#c5a059] text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Kaviya Studio CMS · Janakpur Master Portal</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif text-[#f5eedc]">
              Welcome back to your Studio Hub
            </h1>
            <p className="text-xs md:text-sm text-[#9593a1] max-w-2xl leading-relaxed">
              Manage client inquiries, update wedding galleries, adjust pricing packages, and publish
              cinematic films across your live website in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1a1a26] hover:bg-[#232334] border border-[#2b2b3d] text-xs font-medium text-[#e4e2dd] transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Preview Live Site</span>
              <ExternalLink className="w-3 h-3 text-[#7d7b88]" />
            </a>
            <button
              type="button"
              onClick={() => onNavigate('media')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] text-xs font-semibold uppercase tracking-wider transition-all shadow-md"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Media</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={kpi.action}
              className={`p-5 rounded-xl border ${kpi.borderColor} ${kpi.bgColor} cursor-pointer hover:scale-[1.01] transition-transform flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-[#9b99a6] font-mono">
                  {kpi.label}
                </span>
                <div className={`p-2 rounded-lg bg-[#0e0e15]/80 ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className={`text-3xl font-bold font-mono ${kpi.color}`}>{kpi.value}</span>
                <p className="text-[11px] text-[#8e8c99] mt-1">{kpi.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Launchpad & Shortcuts */}
      <div className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-5">
        <h3 className="text-xs uppercase font-mono tracking-wider text-[#8e8c99] mb-4">
          Quick Launchpad
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <button
            type="button"
            onClick={() => onNavigate('media')}
            className="flex flex-col items-center justify-center p-3.5 rounded-lg bg-[#14141d] hover:bg-[#1a1a26] border border-[#252535] text-center transition-colors group"
          >
            <Upload className="w-5 h-5 text-[#c5a059] mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-[#f5eedc]">Upload Device Files</span>
            <span className="text-[10px] text-[#716f7c]">Photos & 4K Video</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('bookings')}
            className="flex flex-col items-center justify-center p-3.5 rounded-lg bg-[#14141d] hover:bg-[#1a1a26] border border-[#252535] text-center transition-colors group"
          >
            <Calendar className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-[#f5eedc]">Bookings Manager</span>
            <span className="text-[10px] text-[#716f7c]">{newBookings.length} Inquiries pending</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('services')}
            className="flex flex-col items-center justify-center p-3.5 rounded-lg bg-[#14141d] hover:bg-[#1a1a26] border border-[#252535] text-center transition-colors group"
          >
            <Layers className="w-5 h-5 text-sky-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-[#f5eedc]">Edit Services</span>
            <span className="text-[10px] text-[#716f7c]">{services.length} Published</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('packages')}
            className="flex flex-col items-center justify-center p-3.5 rounded-lg bg-[#14141d] hover:bg-[#1a1a26] border border-[#252535] text-center transition-colors group"
          >
            <Sparkles className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-[#f5eedc]">Pricing Packages</span>
            <span className="text-[10px] text-[#716f7c]">{packages.length} Packages active</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('homepage')}
            className="flex flex-col items-center justify-center p-3.5 rounded-lg bg-[#14141d] hover:bg-[#1a1a26] border border-[#252535] text-center transition-colors group"
          >
            <Eye className="w-5 h-5 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-[#f5eedc]">Homepage Slides</span>
            <span className="text-[10px] text-[#716f7c]">Hero & Layout</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('backup')}
            className="flex flex-col items-center justify-center p-3.5 rounded-lg bg-[#14141d] hover:bg-[#1a1a26] border border-[#252535] text-center transition-colors group"
          >
            <HardDrive className="w-5 h-5 text-rose-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-[#f5eedc]">Backup / Restore</span>
            <span className="text-[10px] text-[#716f7c]">Export DB JSON</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Recent Inquiries + Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Inquiries */}
        <div className="lg:col-span-2 bg-[#0e0e14] border border-[#20202e] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-serif text-[#f5eedc]">Recent Wedding & Event Inquiries</h2>
              <p className="text-xs text-[#7d7b88]">Direct inquiries received from client website forms</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('bookings')}
              className="text-xs text-[#c5a059] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1f1f2e] text-[#716f7c] font-mono text-[10px] uppercase">
                  <th className="pb-3">Reference</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Event Type</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Quick Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171722]">
                {bookings.slice(0, 5).map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-[#14141d] cursor-pointer transition-colors"
                    onClick={() => onOpenBookingModal(b)}
                  >
                    <td className="py-3 font-mono font-medium text-[#f5eedc]">
                      {b.referenceNumber}
                    </td>
                    <td className="py-3">
                      <div className="font-medium text-[#f5eedc]">{b.fullName}</div>
                      <div className="text-[10px] text-[#716f7c]">{b.phone}</div>
                    </td>
                    <td className="py-3 font-mono text-[#a5a3b0]">{b.eventDate}</td>
                    <td className="py-3 text-[#a5a3b0]">{b.eventType}</td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                          b.status === 'new'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : b.status === 'confirmed'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <a
                        href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Namaste ${b.fullName}, this is Kaviya Studio regarding your inquiry ref ${b.referenceNumber}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#1f2c22] hover:bg-[#25392a] text-emerald-400 border border-emerald-800/40 text-[11px]"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-[#716f7c]">
                      No inquiries recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Activity Log & System Health */}
        <div className="space-y-6">
          {/* Activity Log */}
          <div className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase font-mono tracking-wider text-[#8e8c99]">
                Recent Audit Trail
              </h3>
              <Clock className="w-3.5 h-3.5 text-[#716f7c]" />
            </div>

            <div className="space-y-3">
              {activityLogs.slice(0, 6).map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-2.5 text-xs pb-2 border-b border-[#171722] last:border-b-0"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c5a059] mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[#f5eedc] font-medium truncate">{log.action}</p>
                    <p className="text-[10px] text-[#716f7c] truncate">
                      {log.module} {log.details ? `· ${log.details}` : ''}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-[#585662] shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
              {activityLogs.length === 0 && (
                <p className="text-xs text-[#716f7c] text-center py-4">No activity logged yet.</p>
              )}
            </div>
          </div>

          {/* Quick Studio Coordinates */}
          <div className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-5 space-y-3">
            <span className="text-xs uppercase font-mono tracking-wider text-[#8e8c99]">
              Studio Information
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#a5a3b0]">
                <span>Brand:</span>
                <span className="text-[#f5eedc] font-medium">{settings.brandName}</span>
              </div>
              <div className="flex justify-between text-[#a5a3b0]">
                <span>Location:</span>
                <span className="text-[#f5eedc] truncate max-w-[180px]">{settings.address}</span>
              </div>
              <div className="flex justify-between text-[#a5a3b0]">
                <span>Phone / WhatsApp:</span>
                <span className="text-[#c5a059] font-mono">{settings.phone}</span>
              </div>
              <div className="flex justify-between text-[#a5a3b0]">
                <span>Email:</span>
                <span className="text-[#f5eedc] font-mono truncate max-w-[180px]">
                  {settings.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
