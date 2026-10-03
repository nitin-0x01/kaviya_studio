import React, { useState } from 'react';
import {
  Info,
  Check,
  Plus,
  Trash2,
  Edit2,
  Upload,
  User,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { StudioSettings, TeamMember } from '../../types';
import { MediaPickerModal } from '../MediaPickerModal';

interface AboutPageModuleProps {
  settings: StudioSettings;
  onSave: (updated: Partial<StudioSettings>) => Promise<void>;
  onNotify: (type: 'success' | 'error', message: string) => void;
}

export const AboutPageModule: React.FC<AboutPageModuleProps> = ({
  settings,
  onSave,
  onNotify,
}) => {
  const [formData, setFormData] = useState<StudioSettings>(settings);
  const [team, setTeam] = useState<TeamMember[]>(settings.team || []);
  const [editingMember, setEditingMember] = useState<Partial<TeamMember> | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerContext, setPickerContext] = useState<'member_photo' | 'supporting_image'>('member_photo');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember?.name || !editingMember?.role) return;

    if (editingMember.id) {
      setTeam((prev) =>
        prev.map((m) => (m.id === editingMember.id ? ({ ...m, ...editingMember } as TeamMember) : m))
      );
    } else {
      const newMember: TeamMember = {
        id: `team-${Date.now()}`,
        name: editingMember.name,
        role: editingMember.role,
        bio: editingMember.bio || '',
        photo:
          editingMember.photo ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
        experienceYears: editingMember.experienceYears || '5+ Years',
      };
      setTeam((prev) => [...prev, newMember]);
    }
    setEditingMember(null);
    onNotify('success', 'Team member updated in list. Click "Save & Publish" to persist.');
  };

  const handleDeleteMember = (id: string) => {
    if (!window.confirm('Remove this team member from About Us page?')) return;
    setTeam((prev) => prev.filter((m) => m.id !== id));
  };

  const handleMediaSelect = (url: string) => {
    if (pickerContext === 'member_photo' && editingMember) {
      setEditingMember({ ...editingMember, photo: url });
    }
    setPickerOpen(false);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await onSave({
        storyIntro: formData.storyIntro,
        philosophy: formData.philosophy,
        approach: formData.approach,
        team,
      });
      onNotify('success', 'About Us page content successfully updated.');
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to save about content.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif text-[#f5eedc]">About Page Manager</h2>
          <p className="text-xs text-[#8e8c99]">
            Edit Kaviya Studio's brand story, philosophy, photography approach, and crew profiles.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] text-xs font-semibold uppercase tracking-wider transition-all shadow-md self-start sm:self-auto"
        >
          <Check className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save & Publish About Page'}</span>
        </button>
      </div>

      {/* Brand Narrative Fields */}
      <div className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-6 space-y-6">
        <h3 className="text-sm font-serif text-[#f5eedc] border-b border-[#1f1f2d] pb-3">
          Brand Narrative & Philosophy
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-mono text-[#8e8c99] mb-1.5">
              Brand Story Introduction
            </label>
            <textarea
              rows={3}
              value={formData.storyIntro}
              onChange={(e) => setFormData({ ...formData, storyIntro: e.target.value })}
              className="w-full bg-[#14141d] border border-[#262638] rounded-lg p-3 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
              placeholder="The origins and vision of Kaviya Studio..."
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-mono text-[#8e8c99] mb-1.5">
              Creative Philosophy
            </label>
            <textarea
              rows={3}
              value={formData.philosophy}
              onChange={(e) => setFormData({ ...formData, philosophy: e.target.value })}
              className="w-full bg-[#14141d] border border-[#262638] rounded-lg p-3 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
              placeholder="Our artistic philosophy toward light, shadow, and unforced emotions..."
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-mono text-[#8e8c99] mb-1.5">
              Photography & Videography Approach
            </label>
            <textarea
              rows={3}
              value={formData.approach}
              onChange={(e) => setFormData({ ...formData, approach: e.target.value })}
              className="w-full bg-[#14141d] border border-[#262638] rounded-lg p-3 text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
              placeholder="How we interact with families, couples, and wedding guests..."
            />
          </div>
        </div>
      </div>

      {/* Team Profiles Manager */}
      <div className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[#1f1f2d] pb-3">
          <div>
            <h3 className="text-sm font-serif text-[#f5eedc]">Photographers & Team Profiles</h3>
            <p className="text-[11px] text-[#716f7c]">
              Showcase your lead cinematographers, wedding directors, and editors.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setEditingMember({
                name: '',
                role: 'Lead Cinematographer',
                bio: '',
                experienceYears: '6+ Years',
                photo:
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
              })
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1a1a26] hover:bg-[#232334] border border-[#2f2f42] text-xs text-[#c5a059]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Team Member</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.map((member) => (
            <div
              key={member.id}
              className="bg-[#13131c] border border-[#222232] rounded-xl p-4 flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-14 h-14 rounded-full object-cover border border-[#c5a059]/40 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-serif text-[#f5eedc] truncate">{member.name}</h4>
                  <p className="text-[11px] text-[#c5a059] font-medium">{member.role}</p>
                  <p className="text-[10px] text-[#716f7c] font-mono">{member.experienceYears}</p>
                </div>
              </div>

              <p className="text-xs text-[#8e8c99] line-clamp-2 mt-3 mb-4">{member.bio}</p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1c1c2a]">
                <button
                  type="button"
                  onClick={() => setEditingMember(member)}
                  className="p-1.5 rounded hover:bg-[#1f1f2e] text-[#a5a3b0] hover:text-white"
                  title="Edit Profile"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteMember(member.id)}
                  className="p-1.5 rounded hover:bg-red-950/30 text-red-400"
                  title="Delete Member"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {team.length === 0 && (
            <div className="col-span-full py-8 text-center text-xs text-[#716f7c]">
              No team profiles added yet. Click "Add Team Member" above.
            </div>
          )}
        </div>
      </div>

      {/* Edit / Add Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#101017] border border-[#29293c] rounded-xl max-w-md w-full p-6 space-y-4">
            <h4 className="text-base font-serif text-[#f5eedc]">
              {editingMember.id ? 'Edit Team Member' : 'New Team Member'}
            </h4>

            <form onSubmit={handleSaveMember} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-mono text-[#8e8c99] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingMember.name || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-[#8e8c99] mb-1">Role / Specialization</label>
                <input
                  type="text"
                  required
                  value={editingMember.role || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  placeholder="e.g. Lead Wedding Photographer & Colorist"
                  className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-[#8e8c99] mb-1">Experience Years</label>
                <input
                  type="text"
                  value={editingMember.experienceYears || ''}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, experienceYears: e.target.value })
                  }
                  placeholder="e.g. 7+ Years Experience"
                  className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-[#8e8c99] mb-1">Profile Photo</label>
                <div className="flex items-center gap-3">
                  {editingMember.photo && (
                    <img
                      src={editingMember.photo}
                      alt="Preview"
                      className="w-10 h-10 rounded-full object-cover border border-[#c5a059]"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setPickerContext('member_photo');
                      setPickerOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1a1a26] border border-[#2d2d40] text-[#f5eedc]"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>Upload or Select Photo</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block uppercase font-mono text-[#8e8c99] mb-1">Bio / Profile Description</label>
                <textarea
                  rows={3}
                  value={editingMember.bio || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  placeholder="Brief background, style, and passion..."
                  className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-3 py-1.5 rounded bg-[#1a1a26] text-[#a5a3b0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#c5a059] text-[#09090b] font-semibold"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {pickerOpen && (
        <MediaPickerModal
          isOpen={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelect={handleMediaSelect}
          title="Select Profile Photo"
          accept="image"
        />
      )}
    </div>
  );
};
