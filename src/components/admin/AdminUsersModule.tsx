import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Trash2,
  KeyRound,
  ShieldCheck,
  Shield,
  Clock,
  Check,
  AlertCircle,
} from 'lucide-react';
import { ActivityLog, AdminRole, AdminUser } from '../../types';
import { api } from '../../services/api';

interface AdminUsersModuleProps {
  currentUsername: string;
  onNotify: (type: 'success' | 'error', message: string) => void;
}

export const AdminUsersModule: React.FC<AdminUsersModuleProps> = ({
  currentUsername,
  onNotify,
}) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);

  // New User Form
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'content_manager' as AdminRole,
  });

  // Change Password Form
  const [credForm, setCredForm] = useState({
    currentPassword: '',
    newUsername: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [credLoading, setCredLoading] = useState(false);

  useEffect(() => {
    loadUsers();
    loadLogs();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminUsers();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = async () => {
    try {
      const data = await api.getActivityLogs();
      setLogs(data);
    } catch (e) {}
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserForm.password.length < 8) {
      onNotify('error', 'Password must be at least 8 characters long.');
      return;
    }

    try {
      await api.createAdminUser(
        newUserForm.username,
        newUserForm.password,
        newUserForm.email,
        newUserForm.role
      );
      onNotify('success', `Created administrator account for ${newUserForm.username}`);
      setShowAddModal(false);
      setNewUserForm({
        username: '',
        email: '',
        password: '',
        role: 'content_manager',
      });
      loadUsers();
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to create user account.');
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (id === 'usr-master') {
      onNotify('error', 'Primary super administrator cannot be deleted.');
      return;
    }
    if (!window.confirm(`Revoke admin access for ${name}?`)) return;
    try {
      await api.deleteAdminUser(id);
      onNotify('success', 'User access revoked.');
      loadUsers();
    } catch (err: any) {
      onNotify('error', 'Failed to remove user.');
    }
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (credForm.newPassword && credForm.newPassword !== credForm.confirmPassword) {
      onNotify('error', 'New passwords do not match.');
      return;
    }

    setCredLoading(true);
    try {
      await api.updateAdminCredentials(
        credForm.currentPassword,
        credForm.newUsername || undefined,
        credForm.newPassword || undefined
      );
      onNotify('success', 'Administrator credentials updated successfully.');
      setCredForm({
        currentPassword: '',
        newUsername: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to update credentials.');
    } finally {
      setCredLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif text-[#f5eedc]">Admin Users & Roles</h2>
          <p className="text-xs text-[#8e8c99]">
            Manage authorized team accounts, security roles, and update master access credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] text-xs font-semibold uppercase tracking-wider transition-all shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Admin Account</span>
        </button>
      </div>

      {/* Users List */}
      <div className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-serif text-[#f5eedc] border-b border-[#1f1f2d] pb-3">
          Authorized Team Accounts
        </h3>

        <div className="divide-y divide-[#181824]">
          {users.map((u) => (
            <div key={u.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#181824] border border-[#28283a] text-[#c5a059] flex items-center justify-center font-bold">
                  {u.username[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#f5eedc]">{u.username}</span>
                    {u.id === 'usr-master' && (
                      <span className="px-2 py-0.5 rounded bg-[#c5a059]/20 text-[#c5a059] text-[10px] font-mono border border-[#c5a059]/30">
                        Primary Super Admin
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#716f7c] font-mono">{u.email || 'No email specified'}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="px-2.5 py-1 rounded bg-[#181824] border border-[#28283a] text-[11px] font-mono text-[#a5a3b0]">
                  {u.role}
                </span>

                {u.id !== 'usr-master' && (
                  <button
                    type="button"
                    onClick={() => handleDeleteUser(u.id, u.username)}
                    className="p-1.5 text-red-400 hover:text-red-300 rounded hover:bg-red-950/30"
                    title="Revoke access"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Change Master Credentials */}
      <div className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-xs uppercase font-mono text-[#8e8c99]">
          <KeyRound className="w-4 h-4 text-[#c5a059]" />
          <span>Update Your Credentials ({currentUsername})</span>
        </div>

        <form onSubmit={handleUpdateCredentials} className="space-y-4 text-xs max-w-lg">
          <div>
            <label className="block uppercase font-mono text-[#8e8c99] mb-1">
              Current Password (Required)
            </label>
            <input
              type="password"
              required
              value={credForm.currentPassword}
              onChange={(e) => setCredForm({ ...credForm, currentPassword: e.target.value })}
              className="w-full bg-[#14141d] border border-[#262638] rounded px-3 py-2 text-[#f5eedc]"
              placeholder="••••••••••••"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase font-mono text-[#8e8c99] mb-1">
                New Username (Optional)
              </label>
              <input
                type="text"
                value={credForm.newUsername}
                onChange={(e) => setCredForm({ ...credForm, newUsername: e.target.value })}
                placeholder="Leave blank to keep"
                className="w-full bg-[#14141d] border border-[#262638] rounded px-3 py-2 text-[#f5eedc]"
              />
            </div>

            <div>
              <label className="block uppercase font-mono text-[#8e8c99] mb-1">
                New Password (Optional)
              </label>
              <input
                type="password"
                value={credForm.newPassword}
                onChange={(e) => setCredForm({ ...credForm, newPassword: e.target.value })}
                placeholder="Min 8 characters"
                className="w-full bg-[#14141d] border border-[#262638] rounded px-3 py-2 text-[#f5eedc]"
              />
            </div>
          </div>

          {credForm.newPassword && (
            <div>
              <label className="block uppercase font-mono text-[#8e8c99] mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={credForm.confirmPassword}
                onChange={(e) => setCredForm({ ...credForm, confirmPassword: e.target.value })}
                className="w-full bg-[#14141d] border border-[#262638] rounded px-3 py-2 text-[#f5eedc]"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={credLoading}
            className="px-5 py-2 rounded bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] font-semibold tracking-wider uppercase text-[11px]"
          >
            {credLoading ? 'Saving...' : 'Update Password / Login'}
          </button>
        </form>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#101017] border border-[#27273a] rounded-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-serif text-[#f5eedc]">Create Admin Account</h3>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-mono text-[#8e8c99] mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={newUserForm.username}
                  onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                  className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-[#8e8c99] mb-1">Email</label>
                <input
                  type="email"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-[#8e8c99] mb-1">Password (min 8)</label>
                <input
                  type="password"
                  required
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-[#8e8c99] mb-1">Role / Permissions</label>
                <select
                  value={newUserForm.role}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, role: e.target.value as AdminRole })
                  }
                  className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                >
                  <option value="content_manager">Content Manager (Website & Blog)</option>
                  <option value="booking_manager">Booking Manager (Inquiries & Clients)</option>
                  <option value="gallery_manager">Gallery Manager (Media & Albums)</option>
                  <option value="super_admin">Super Administrator (Full System Access)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1e1e2d]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded bg-[#181824] text-[#a5a3b0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#c5a059] text-[#09090b] font-semibold"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
