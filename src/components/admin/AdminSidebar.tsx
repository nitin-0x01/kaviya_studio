import React from 'react';
import {
  LayoutDashboard,
  Home,
  Navigation,
  Info,
  Layers,
  Image as ImageIcon,
  DollarSign,
  Calendar,
  MessageSquare,
  Phone,
  BookOpen,
  Search,
  HardDrive,
  Share2,
  Columns,
  Palette,
  Users,
  Settings,
  BarChart3,
  Archive,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
  X,
} from 'lucide-react';
import { AdminRole } from '../../types';
import { Logo } from '../Logo';

export type AdminModuleType =
  | 'overview'
  | 'homepage'
  | 'header'
  | 'about'
  | 'services'
  | 'gallery'
  | 'packages'
  | 'bookings'
  | 'testimonials'
  | 'contact'
  | 'blog'
  | 'seo'
  | 'media'
  | 'social'
  | 'footer'
  | 'appearance'
  | 'users'
  | 'settings'
  | 'analytics'
  | 'backup';

interface AdminSidebarProps {
  activeModule: AdminModuleType;
  onSelectModule: (module: AdminModuleType) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
  userRole?: AdminRole;
  username: string;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  newBookingsCount: number;
  pendingReviewsCount: number;
  logoUrl?: string;
}

interface MenuItem {
  id: AdminModuleType;
  label: string;
  icon: any;
  badge?: string;
}

interface MenuGroup {
  group: string;
  items: MenuItem[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeModule,
  onSelectModule,
  isCollapsed,
  onToggleCollapse,
  onLogout,
  username,
  mobileOpen,
  onCloseMobile,
  newBookingsCount,
  pendingReviewsCount,
  logoUrl,
}) => {
  const menuGroups: MenuGroup[] = [
    {
      group: 'Core',
      items: [
        { id: 'overview' as AdminModuleType, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'analytics' as AdminModuleType, label: 'Analytics', icon: BarChart3 },
      ],
    },
    {
      group: 'Inquiries & Clients',
      items: [
        {
          id: 'bookings' as AdminModuleType,
          label: 'Bookings & Inquiries',
          icon: Calendar,
          badge: newBookingsCount > 0 ? `${newBookingsCount} new` : undefined,
        },
        {
          id: 'testimonials' as AdminModuleType,
          label: 'Testimonials',
          icon: MessageSquare,
          badge: pendingReviewsCount > 0 ? `${pendingReviewsCount}` : undefined,
        },
      ],
    },
    {
      group: 'Media & Portfolio',
      items: [
        { id: 'media' as AdminModuleType, label: 'Media Library', icon: HardDrive },
        { id: 'gallery' as AdminModuleType, label: 'Portfolio & Albums', icon: ImageIcon },
      ],
    },
    {
      group: 'Content & Pages',
      items: [
        { id: 'homepage' as AdminModuleType, label: 'Homepage Manager', icon: Home },
        { id: 'header' as AdminModuleType, label: 'Header & Navigation', icon: Navigation },
        { id: 'about' as AdminModuleType, label: 'About Page', icon: Info },
        { id: 'services' as AdminModuleType, label: 'Services Manager', icon: Layers },
        { id: 'packages' as AdminModuleType, label: 'Packages & Pricing', icon: DollarSign },
        { id: 'blog' as AdminModuleType, label: 'Blog & Articles', icon: BookOpen },
        { id: 'contact' as AdminModuleType, label: 'Contact Page', icon: Phone },
        { id: 'social' as AdminModuleType, label: 'Social Media', icon: Share2 },
        { id: 'footer' as AdminModuleType, label: 'Footer Manager', icon: Columns },
      ],
    },
    {
      group: 'System & Branding',
      items: [
        { id: 'appearance' as AdminModuleType, label: 'Appearance & Style', icon: Palette },
        { id: 'seo' as AdminModuleType, label: 'SEO Manager', icon: Search },
        { id: 'users' as AdminModuleType, label: 'Admin Users & Roles', icon: Users },
        { id: 'settings' as AdminModuleType, label: 'Website Settings', icon: Settings },
        { id: 'backup' as AdminModuleType, label: 'Backup & Restore', icon: Archive },
      ],
    },
  ];

  const content = (
    <div className="flex flex-col h-full bg-[#0a0a0e] text-[#e4e2dd] border-r border-[#1a1a24]">
      {/* Brand Header */}
      <div className={`p-4 border-b border-[#181822] flex items-center justify-between ${isCollapsed ? 'p-2.5 justify-center' : ''}`}>
        <div className={`flex items-center gap-2.5 overflow-hidden ${isCollapsed ? 'justify-center' : ''}`}>
          <Logo
            logoUrl={logoUrl}
            size={isCollapsed ? 'xs' : 'sm'}
            collapsed={isCollapsed}
            alt="Kaviya Studio official logo"
          />
          {!isCollapsed && (
            <div className="truncate min-w-0">
              <h2 className="text-xs uppercase tracking-widest font-serif text-[#f5eedc] font-semibold truncate">
                Kaviya CMS
              </h2>
              <span className="text-[10px] text-[#71707c] font-mono block truncate">
                Admin: {username}
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          className={`hidden md:flex p-1.5 text-[#7a7884] hover:text-[#f5eedc] rounded hover:bg-[#151520] transition-colors ${isCollapsed ? 'hidden' : ''}`}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {isCollapsed && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden md:flex p-1 text-[#7a7884] hover:text-[#f5eedc] rounded hover:bg-[#151520] transition-colors mt-2"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="button"
          onClick={onCloseMobile}
          className="md:hidden p-1.5 text-[#7a7884] hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav items list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        {menuGroups.map((grp) => (
          <div key={grp.group} className="space-y-1">
            {!isCollapsed && (
              <span className="text-[9px] uppercase tracking-wider text-[#63616d] font-mono font-semibold px-2 block mb-1">
                {grp.group}
              </span>
            )}
            {grp.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectModule(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-xs transition-colors relative group ${
                    isActive
                      ? 'bg-[#c5a059] text-[#09090b] font-semibold shadow-sm'
                      : 'text-[#9c9aa5] hover:text-[#f5eedc] hover:bg-[#14141c]'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}

                  {item.badge && (
                    <span
                      className={`ml-auto text-[9px] font-mono px-1.5 py-0.2 rounded-full uppercase ${
                        isActive
                          ? 'bg-[#09090b] text-[#c5a059]'
                          : 'bg-amber-950 text-amber-300 border border-amber-800/40'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="p-3 border-t border-[#181822] space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#8c8a94] hover:text-[#f5eedc] hover:bg-[#14141c] rounded transition-colors"
          title="Open Public Website"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          {!isCollapsed && <span>View Live Site</span>}
        </a>

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded transition-colors"
          title="Log Out"
        >
          <LogOut className="w-3.5 h-3.5" />
          {!isCollapsed && <span>Log Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block transition-all duration-300 h-screen sticky top-0 shrink-0 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="relative w-72 max-w-[80vw] h-full z-10">{content}</div>
        </div>
      )}
    </>
  );
};
