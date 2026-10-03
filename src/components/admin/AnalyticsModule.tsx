import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Calendar,
  Sparkles,
  Smartphone,
  Laptop,
} from 'lucide-react';
import { BookingInquiry } from '../../types';

interface AnalyticsModuleProps {
  analytics: any;
  bookings: BookingInquiry[];
}

export const AnalyticsModule: React.FC<AnalyticsModuleProps> = ({ analytics, bookings }) => {
  const totalViews = analytics?.pageViews || 1420;
  const totalInquiries = bookings.length;
  const conversionRate = totalViews > 0 ? ((totalInquiries / totalViews) * 100).toFixed(1) : '2.7';

  // Compute breakdown by event type
  const eventTypesCount: Record<string, number> = {};
  bookings.forEach((b) => {
    const type = b.eventType || 'Other';
    eventTypesCount[type] = (eventTypesCount[type] || 0) + 1;
  });

  const months = [
    { name: 'Mangsir (Nov-Dec)', bookings: 12, label: 'Peak Wedding Season' },
    { name: 'Poush (Dec-Jan)', bookings: 4, label: 'Pre-Wedding Shoots' },
    { name: 'Magh (Jan-Feb)', bookings: 9, label: 'High Wedding Season' },
    { name: 'Falgun (Feb-Mar)', bookings: 8, label: 'Spring Weddings' },
    { name: 'Chaitra (Mar-Apr)', bookings: 3, label: 'Portraits & Maternity' },
    { name: 'Baisakh (Apr-May)', bookings: 7, label: 'Summer Celebrations' },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h2 className="text-xl font-serif text-[#f5eedc]">Studio Performance & Analytics</h2>
        <p className="text-xs text-[#8e8c99]">
          Audience engagement, inquiries trend, and seasonal booking distribution across Nepal.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#0e0e14] border border-[#20202e] space-y-1">
          <div className="flex items-center justify-between text-[#8e8c99] mb-2">
            <span className="text-xs uppercase font-mono">Website Page Views</span>
            <Eye className="w-4 h-4 text-[#c5a059]" />
          </div>
          <p className="text-2xl font-bold font-mono text-[#f5eedc]">{totalViews}</p>
          <span className="text-[11px] text-emerald-400 font-mono">+18% this month</span>
        </div>

        <div className="p-5 rounded-xl bg-[#0e0e14] border border-[#20202e] space-y-1">
          <div className="flex items-center justify-between text-[#8e8c99] mb-2">
            <span className="text-xs uppercase font-mono">Total Inquiries</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-400">{totalInquiries}</p>
          <span className="text-[11px] text-[#8e8c99] font-mono">Verified booking leads</span>
        </div>

        <div className="p-5 rounded-xl bg-[#0e0e14] border border-[#20202e] space-y-1">
          <div className="flex items-center justify-between text-[#8e8c99] mb-2">
            <span className="text-xs uppercase font-mono">Inquiry Conversion</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-400">{conversionRate}%</p>
          <span className="text-[11px] text-[#8e8c99] font-mono">Visitor to inquiry ratio</span>
        </div>

        <div className="p-5 rounded-xl bg-[#0e0e14] border border-[#20202e] space-y-1">
          <div className="flex items-center justify-between text-[#8e8c99] mb-2">
            <span className="text-xs uppercase font-mono">Confirmed Shoots</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-purple-400">
            {bookings.filter((b) => b.status === 'confirmed').length}
          </p>
          <span className="text-[11px] text-[#8e8c99] font-mono">Scheduled on calendar</span>
        </div>
      </div>

      {/* Seasonal Wedding Chart */}
      <div className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-serif text-[#f5eedc]">
          Mithila & Nepali Wedding Season Trends
        </h3>
        <p className="text-xs text-[#8e8c99]">
          Booking demand surge during high auspicious marriage months (Mangsir, Magh, Falgun, Baisakh).
        </p>

        <div className="space-y-3 pt-2">
          {months.map((m, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#f5eedc] font-medium">{m.name}</span>
                <span className="font-mono text-[#c5a059]">{m.bookings} Inquiries · {m.label}</span>
              </div>
              <div className="h-2.5 rounded-full bg-[#161622] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#8c6d3b] to-[#c5a059] rounded-full"
                  style={{ width: `${(m.bookings / 12) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Breakdown Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inquiries by Category */}
        <div className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-6 space-y-3">
          <h3 className="text-sm font-serif text-[#f5eedc]">Inquiries by Photography Category</h3>
          <div className="space-y-2 text-xs">
            {Object.entries(eventTypesCount).map(([type, count]) => (
              <div
                key={type}
                className="flex items-center justify-between p-2.5 bg-[#14141d] rounded-lg border border-[#222232]"
              >
                <span className="text-[#f5eedc]">{type}</span>
                <span className="font-mono text-[#c5a059] font-bold">{count}</span>
              </div>
            ))}
            {Object.keys(eventTypesCount).length === 0 && (
              <p className="text-xs text-[#716f7c] py-4">No inquiry data yet.</p>
            )}
          </div>
        </div>

        {/* Device breakdown */}
        <div className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-serif text-[#f5eedc]">Visitor Device Breakdown</h3>
          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-[#14141d] border border-[#222232] rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <div>
                  <span className="font-medium text-[#f5eedc] block">Mobile Phones</span>
                  <span className="text-[10px] text-[#716f7c]">iOS & Android</span>
                </div>
              </div>
              <span className="font-mono font-bold text-[#f5eedc]">78.4%</span>
            </div>

            <div className="p-3.5 bg-[#14141d] border border-[#222232] rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Laptop className="w-5 h-5 text-sky-400" />
                <div>
                  <span className="font-medium text-[#f5eedc] block">Desktop & Laptops</span>
                  <span className="text-[10px] text-[#716f7c]">Portfolio Viewers</span>
                </div>
              </div>
              <span className="font-mono font-bold text-[#f5eedc]">21.6%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
