import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Check,
  Plus,
  Trash2,
  Navigation,
} from 'lucide-react';
import { StudioSettings } from '../../types';

interface ContactPageModuleProps {
  settings: StudioSettings;
  onSave: (updated: Partial<StudioSettings>) => Promise<void>;
  onNotify: (type: 'success' | 'error', message: string) => void;
}

export const ContactPageModule: React.FC<ContactPageModuleProps> = ({
  settings,
  onSave,
  onNotify,
}) => {
  const [formData, setFormData] = useState<StudioSettings>(settings);
  const [hours, setHours] = useState(
    formData.businessHours || [
      { days: 'Monday – Friday', hours: '09:00 AM – 07:00 PM' },
      { days: 'Saturday', hours: '10:00 AM – 06:00 PM' },
      { days: 'Sunday', hours: 'Studio Consultations by Appointment' },
    ]
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleHourChange = (index: number, field: 'days' | 'hours', val: string) => {
    const updated = [...hours];
    updated[index][field] = val;
    setHours(updated);
  };

  const handleAddHour = () => {
    setHours([...hours, { days: 'New Slot', hours: '09:00 AM – 05:00 PM' }]);
  };

  const handleDeleteHour = (index: number) => {
    setHours(hours.filter((_, i) => i !== index));
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        address: formData.address,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        email: formData.email,
        businessHours: hours,
      });
      onNotify('success', 'Contact details and operating hours saved.');
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to update contact info.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif text-[#f5eedc]">Contact Page & Coordinates</h2>
          <p className="text-xs text-[#8e8c99]">
            Manage studio address in Janakpur, direct telephone, WhatsApp line, and consultation hours.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] text-xs font-semibold uppercase tracking-wider transition-all shadow-md self-start sm:self-auto"
        >
          <Check className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Coordinates'}</span>
        </button>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* Core Details */}
        <div className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-serif text-[#f5eedc] border-b border-[#1f1f2d] pb-3">
            Physical Location & Direct Lines
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block uppercase font-mono text-[#8e8c99] mb-1">
                Studio Physical Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#c5a059]" />
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#14141d] border border-[#262638] rounded text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                  placeholder="e.g. Basahiya-24, Janakpurdham, Nepal"
                />
              </div>
            </div>

            <div>
              <label className="block uppercase font-mono text-[#8e8c99] mb-1">
                Primary Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#c5a059]" />
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#14141d] border border-[#262638] rounded text-[#f5eedc] focus:outline-none focus:border-[#c5a059] font-mono"
                  placeholder="+977 9800000000"
                />
              </div>
            </div>

            <div>
              <label className="block uppercase font-mono text-[#8e8c99] mb-1">
                WhatsApp Business Line
              </label>
              <div className="relative">
                <MessageCircle className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                <input
                  type="text"
                  required
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#14141d] border border-[#262638] rounded text-[#f5eedc] focus:outline-none focus:border-[#c5a059] font-mono"
                  placeholder="+977 9800000000"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block uppercase font-mono text-[#8e8c99] mb-1">
                Official Studio Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#c5a059]" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#14141d] border border-[#262638] rounded text-[#f5eedc] focus:outline-none focus:border-[#c5a059] font-mono"
                  placeholder="contact@kaviyastudio.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Studio Consultation Hours */}
        <div className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1f1f2d] pb-3">
            <div>
              <h3 className="text-sm font-serif text-[#f5eedc]">Operating & Consultation Hours</h3>
              <p className="text-[11px] text-[#716f7c]">
                Displayed on the website footer and contact page.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddHour}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1a1a26] border border-[#2d2d40] text-xs text-[#c5a059]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Schedule Row</span>
            </button>
          </div>

          <div className="space-y-3">
            {hours.map((slot, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs">
                <input
                  type="text"
                  value={slot.days}
                  onChange={(e) => handleHourChange(idx, 'days', e.target.value)}
                  className="w-48 bg-[#14141d] border border-[#262638] rounded px-3 py-2 text-[#f5eedc]"
                  placeholder="e.g. Monday – Friday"
                />
                <input
                  type="text"
                  value={slot.hours}
                  onChange={(e) => handleHourChange(idx, 'hours', e.target.value)}
                  className="flex-1 bg-[#14141d] border border-[#262638] rounded px-3 py-2 text-[#f5eedc]"
                  placeholder="e.g. 09:00 AM – 07:00 PM"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteHour(idx)}
                  className="p-2 text-red-400 hover:text-red-300 rounded hover:bg-red-950/30"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
