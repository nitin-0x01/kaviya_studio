import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  Edit2,
  MessageCircle,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  MapPin,
  CalendarCheck,
  AlertCircle,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { BookingInquiry, BookingStatus } from '../../types';
import { api } from '../../services/api';

interface BookingsModuleProps {
  bookings: BookingInquiry[];
  onRefresh: () => void;
  onNotify: (type: 'success' | 'error', message: string) => void;
}

export const BookingsModule: React.FC<BookingsModuleProps> = ({ bookings, onRefresh, onNotify }) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [selectedBooking, setSelectedBooking] = useState<BookingInquiry | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);

  // Manual Form
  const [manualForm, setManualForm] = useState<Partial<BookingInquiry>>({
    fullName: '',
    phone: '+977 ',
    email: '',
    eventType: 'Wedding Photography & Cinema',
    eventDate: new Date().toISOString().split('T')[0],
    eventLocation: 'Janakpur, Nepal',
    preferredPackage: 'Premium Wedding Package',
    status: 'contacted',
    adminNotes: 'Inquiry received via walk-in or telephone.',
  });

  const handleStatusChange = async (id: string, status: BookingStatus, notes?: string) => {
    try {
      const updated = await api.updateBooking(id, status, notes);
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking(updated);
      }
      onRefresh();
      onNotify('success', `Inquiry status changed to ${status}.`);
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to update status.');
    }
  };

  const handleDelete = async (id: string, ref: string) => {
    if (!window.confirm(`Permanently delete booking inquiry ${ref}?`)) return;
    try {
      await api.deleteBooking(id);
      if (selectedBooking?.id === id) setSelectedBooking(null);
      onRefresh();
      onNotify('success', 'Inquiry deleted.');
    } catch {
      onNotify('error', 'Failed to delete inquiry.');
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.fullName?.trim() || !manualForm.phone?.trim()) {
      alert('Client name and phone are required.');
      return;
    }
    try {
      await api.createManualBooking(manualForm);
      setShowManualModal(false);
      onRefresh();
      onNotify('success', 'Manual inquiry added to calendar.');
      setManualForm({
        fullName: '',
        phone: '+977 ',
        email: '',
        eventType: 'Wedding Photography & Cinema',
        eventDate: new Date().toISOString().split('T')[0],
        eventLocation: 'Janakpur, Nepal',
        preferredPackage: 'Premium Wedding Package',
        status: 'contacted',
        adminNotes: '',
      });
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to create booking.');
    }
  };

  const filtered = bookings.filter((b) => {
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchType = eventTypeFilter === 'all' || b.eventType === eventTypeFilter;
    const matchSearch =
      !search ||
      b.fullName.toLowerCase().includes(search.toLowerCase()) ||
      b.referenceNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search) ||
      b.eventLocation.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchType && matchSearch;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'new':
        return 'bg-amber-950 text-amber-300 border-amber-800/40';
      case 'confirmed':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800/40';
      case 'completed':
        return 'bg-blue-950 text-blue-300 border-blue-800/40';
      case 'cancelled':
        return 'bg-red-950 text-red-300 border-red-800/40';
      default:
        return 'bg-[#1e1e2d] text-[#a8a6af] border-[#303046]';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1c1c28]">
        <div>
          <h2 className="text-xl font-serif text-[#f5eedc]">Customer Inquiries & Calendar Management</h2>
          <p className="text-xs text-[#8c8a94]">
            Manage client reservations, change workflow statuses, take private coordinator notes, and export CSV logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/api/admin/bookings/export-csv"
            download
            className="px-3.5 py-2 bg-[#14141d] hover:bg-[#1e1e2c] border border-[#272738] rounded text-xs text-[#d4b470] flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>

          <button
            type="button"
            onClick={() => setShowManualModal(true)}
            className="px-4 py-2 bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] text-xs font-semibold uppercase tracking-wider rounded flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Manual Inquiry</span>
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#111117] border border-[#20202c] rounded-lg">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#686672]" />
            <input
              type="text"
              placeholder="Search by client name, ref, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#161622] border border-[#272738] rounded pl-8 pr-3 py-1.5 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#161622] border border-[#272738] rounded px-3 py-1.5 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
          >
            <option value="all">All Statuses ({bookings.length})</option>
            <option value="new">New Inquiry ({bookings.filter((b) => b.status === 'new').length})</option>
            <option value="contacted">Contacted</option>
            <option value="pending">Pending Confirmation</option>
            <option value="confirmed">Confirmed ({bookings.filter((b) => b.status === 'confirmed').length})</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="bg-[#161622] border border-[#272738] rounded px-3 py-1.5 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
          >
            <option value="all">All Ceremony Types</option>
            <option value="Wedding Photography & Cinema">Wedding Photography & Cinema</option>
            <option value="Pre-Wedding Shoot">Pre-Wedding Shoot</option>
            <option value="Traditional Maithili Rituals">Traditional Maithili Rituals</option>
            <option value="Engagement / Ring Ceremony">Engagement / Ring Ceremony</option>
            <option value="Birthday & Jubilee">Birthday & Jubilee</option>
            <option value="Portrait Session">Portrait Session</option>
          </select>
        </div>

        <div className="flex items-center gap-1 bg-[#161622] border border-[#272738] p-0.5 rounded">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              viewMode === 'table' ? 'bg-[#252538] text-[#c5a059]' : 'text-[#7d7b86]'
            }`}
          >
            Table View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              viewMode === 'calendar' ? 'bg-[#252538] text-[#c5a059]' : 'text-[#7d7b86]'
            }`}
          >
            Calendar View
          </button>
        </div>
      </div>

      {/* Main Viewport: Table vs Calendar */}
      {viewMode === 'table' ? (
        <div className="bg-[#101016] border border-[#222230] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#14141e] border-b border-[#20202c] text-[#71707d] uppercase font-mono text-[10px]">
                  <th className="p-3.5">Reference</th>
                  <th className="p-3.5">Client & Contact</th>
                  <th className="p-3.5">Event Details</th>
                  <th className="p-3.5">Package & Budget</th>
                  <th className="p-3.5">Workflow Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#191924]">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[#73717d]">
                      No inquiries match the current filter.
                    </td>
                  </tr>
                ) : (
                  filtered.map((b) => (
                    <tr key={b.id} className="hover:bg-[#14141d] transition-colors">
                      <td className="p-3.5 font-mono font-bold text-[#f5eedc]">
                        {b.referenceNumber}
                      </td>
                      <td className="p-3.5">
                        <p className="font-medium text-[#d8d6ce]">{b.fullName}</p>
                        <p className="text-[11px] text-[#787682]">{b.phone}</p>
                        <p className="text-[10px] text-[#5e5c66]">{b.email}</p>
                      </td>
                      <td className="p-3.5">
                        <p className="font-mono text-[#d4b470]">{b.eventDate}</p>
                        <p className="text-[11px] text-[#a8a6af]">{b.eventType}</p>
                        <p className="text-[10px] text-[#6d6b77]">{b.eventLocation}</p>
                      </td>
                      <td className="p-3.5">
                        <p className="text-[#a8a6af]">{b.preferredPackage}</p>
                        {b.estimatedBudget && (
                          <span className="text-[10px] text-[#63616d]">Budget: {b.estimatedBudget}</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <select
                          value={b.status}
                          onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                          className={`px-2.5 py-1 text-[11px] font-mono uppercase rounded border bg-[#12121a] focus:outline-none ${getStatusBadge(
                            b.status
                          )}`}
                        >
                          <option value="new">New Inquiry</option>
                          <option value="contacted">Contacted</option>
                          <option value="pending">Pending Confirmation</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => setSelectedBooking(b)}
                          className="px-2.5 py-1 bg-[#1a1a26] hover:bg-[#252538] text-[#c5a059] rounded"
                        >
                          Details & Notes
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(b.id, b.referenceNumber)}
                          className="p-1 text-[#6e6c77] hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Calendar Schedule Overview */
        <div className="bg-[#101016] border border-[#222230] rounded-xl p-6 space-y-4">
          <h3 className="text-sm uppercase tracking-wider text-[#c5a059] font-mono font-medium">
            Chronological Wedding & Event Timeline
          </h3>
          <div className="space-y-3">
            {[...filtered]
              .sort((a, b) => a.eventDate.localeCompare(b.eventDate))
              .map((b) => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBooking(b)}
                  className="p-4 bg-[#14141d] border border-[#232332] hover:border-[#c5a059] rounded-lg cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="px-3 py-2 bg-[#1b1b28] border border-[#2a2a3e] rounded text-center shrink-0">
                      <span className="text-[10px] text-[#787682] uppercase block font-mono">Date</span>
                      <span className="text-sm font-mono font-bold text-[#c5a059]">{b.eventDate}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-[#f5eedc]">{b.fullName} ({b.referenceNumber})</h4>
                      <p className="text-xs text-[#a8a6af]">{b.eventType} · {b.eventLocation}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 text-[10px] font-mono uppercase rounded border ${getStatusBadge(b.status)}`}>
                      {b.status}
                    </span>
                    <span className="text-xs text-[#d4b470] font-mono">{b.preferredPackage}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Selected Booking Detail & Outreach Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 bg-[#070709]/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          role="dialog"
        >
          <div className="bg-[#101016] border border-[#272738] rounded-xl w-full max-w-xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#212130]">
              <div>
                <span className="text-[10px] text-[#71707d] uppercase font-mono">Inquiry Dossier</span>
                <h3 className="text-xl font-serif text-[#f5eedc]">Ref: {selectedBooking.referenceNumber}</h3>
              </div>
              <button type="button" onClick={() => setSelectedBooking(null)} className="text-[#787682] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#656370] uppercase text-[10px]">Client</span>
                <p className="text-[#f5eedc] font-medium">{selectedBooking.fullName}</p>
              </div>
              <div>
                <span className="text-[#656370] uppercase text-[10px]">Phone</span>
                <p className="text-[#f5eedc] font-medium">{selectedBooking.phone}</p>
              </div>
              <div>
                <span className="text-[#656370] uppercase text-[10px]">Email</span>
                <p className="text-[#f5eedc] font-medium">{selectedBooking.email}</p>
              </div>
              <div>
                <span className="text-[#656370] uppercase text-[10px]">Preferred Channel</span>
                <p className="text-emerald-400 uppercase font-mono">{selectedBooking.preferredContactMethod}</p>
              </div>
              <div>
                <span className="text-[#656370] uppercase text-[10px]">Ceremony Date</span>
                <p className="text-[#f5eedc] font-medium">{selectedBooking.eventDate}</p>
              </div>
              <div>
                <span className="text-[#656370] uppercase text-[10px]">Location</span>
                <p className="text-[#f5eedc] font-medium">{selectedBooking.eventLocation}</p>
              </div>
            </div>

            {selectedBooking.additionalRequirements && (
              <div className="p-3 bg-[#151520] rounded border border-[#222230]">
                <span className="text-[10px] uppercase font-mono text-[#c5a059] block mb-1">
                  Client Wishes & Itinerary:
                </span>
                <p className="text-xs text-[#d8d6ce]">{selectedBooking.additionalRequirements}</p>
              </div>
            )}

            {/* Private Coordinator Internal Notes */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#a8a6af] mb-1 font-medium">
                Coordinator Private Notes
              </label>
              <textarea
                rows={3}
                defaultValue={selectedBooking.adminNotes || ''}
                onBlur={(e) => handleStatusChange(selectedBooking.id, selectedBooking.status, e.target.value)}
                placeholder="Internal coordinator notes (e.g. advance payment, assigned photographers, camera body list)..."
                className="w-full bg-[#151520] border border-[#272738] rounded px-3 py-2 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
              />
              <span className="text-[10px] text-[#615f6a]">Auto-saves on blur.</span>
            </div>

            {/* Direct Outreach Shortcuts */}
            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href={`https://wa.me/${selectedBooking.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello ${selectedBooking.fullName}, this is Kaviya Studio regarding your wedding inquiry #${selectedBooking.referenceNumber} for ${selectedBooking.eventDate}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Client</span>
              </a>
              <a
                href={`tel:${selectedBooking.phone}`}
                className="px-3 py-2 bg-[#1d1d2b] hover:bg-[#28283a] text-[#f5eedc] text-xs rounded border border-[#303044] flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Client</span>
              </a>
              <a
                href={`mailto:${selectedBooking.email}`}
                className="px-3 py-2 bg-[#1d1d2b] hover:bg-[#28283a] text-[#f5eedc] text-xs rounded border border-[#303044] flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Client</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Manual Inquiry Add Modal */}
      {showManualModal && (
        <div
          className="fixed inset-0 z-50 bg-[#070709]/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          role="dialog"
        >
          <form
            onSubmit={handleManualSubmit}
            className="bg-[#101016] border border-[#272738] rounded-xl w-full max-w-lg p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#212130]">
              <h3 className="text-base font-serif text-[#f5eedc]">Add Walk-In / Manual Inquiry</h3>
              <button type="button" onClick={() => setShowManualModal(false)} className="text-[#787682] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase text-[#a8a6af] mb-1 font-medium">Client Name *</label>
                <input
                  type="text"
                  required
                  value={manualForm.fullName}
                  onChange={(e) => setManualForm({ ...manualForm, fullName: e.target.value })}
                  className="w-full bg-[#151520] border border-[#272738] rounded px-3 py-2 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-[#a8a6af] mb-1 font-medium">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={manualForm.phone}
                  onChange={(e) => setManualForm({ ...manualForm, phone: e.target.value })}
                  className="w-full bg-[#151520] border border-[#272738] rounded px-3 py-2 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-[#a8a6af] mb-1 font-medium">Email</label>
                <input
                  type="email"
                  value={manualForm.email}
                  onChange={(e) => setManualForm({ ...manualForm, email: e.target.value })}
                  className="w-full bg-[#151520] border border-[#272738] rounded px-3 py-2 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-[#a8a6af] mb-1 font-medium">Event Date</label>
                <input
                  type="date"
                  value={manualForm.eventDate}
                  onChange={(e) => setManualForm({ ...manualForm, eventDate: e.target.value })}
                  className="w-full bg-[#151520] border border-[#272738] rounded px-3 py-2 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase text-[#a8a6af] mb-1 font-medium">Ceremony Location</label>
              <input
                type="text"
                value={manualForm.eventLocation}
                onChange={(e) => setManualForm({ ...manualForm, eventLocation: e.target.value })}
                className="w-full bg-[#151520] border border-[#272738] rounded px-3 py-2 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-[#a8a6af] mb-1 font-medium">Internal Notes</label>
              <textarea
                rows={3}
                value={manualForm.adminNotes}
                onChange={(e) => setManualForm({ ...manualForm, adminNotes: e.target.value })}
                className="w-full bg-[#151520] border border-[#272738] rounded px-3 py-2 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowManualModal(false)}
                className="px-4 py-2 text-xs text-[#8c8a94] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] text-xs font-semibold uppercase tracking-wider rounded"
              >
                Create Booking
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
