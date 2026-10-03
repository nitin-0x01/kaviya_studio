import React, { useState, useRef } from 'react';
import {
  HardDrive,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Database,
  FileJson,
  ShieldAlert,
} from 'lucide-react';
import { api } from '../../services/api';

interface BackupRestoreModuleProps {
  onRefreshAll: () => void;
  onNotify: (type: 'success' | 'error', message: string) => void;
}

export const BackupRestoreModule: React.FC<BackupRestoreModuleProps> = ({
  onRefreshAll,
  onNotify,
}) => {
  const [isRestoring, setIsRestoring] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadBackup = () => {
    window.location.href = '/api/admin/export-database';
    onNotify('success', 'Database JSON backup download started.');
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm('WARNING: Restoring this backup will replace current website data. Continue?')) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsRestoring(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      await api.restoreDatabase(parsed);
      onNotify('success', 'Database successfully restored from backup file.');
      onRefreshAll();
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to restore database. Invalid JSON format.');
    } finally {
      setIsRestoring(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleResetDemo = async () => {
    if (
      !window.confirm(
        'Are you sure you want to reset all website content, packages, services, and galleries to original default demo data?'
      )
    ) {
      return;
    }

    setIsResetting(true);
    try {
      await api.resetDatabase();
      onNotify('success', 'Database restored to pristine default state.');
      onRefreshAll();
    } catch {
      onNotify('error', 'Failed to reset database.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-serif text-[#f5eedc]">Backup, Restore & Data Safeguard</h2>
        <p className="text-xs text-[#8e8c99]">
          Export full JSON archives of your photography website, restore previous snapshots, or reset to defaults.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#c5a059]/10 text-[#c5a059] flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif text-[#f5eedc]">Export Database Snapshot</h3>
            <p className="text-xs text-[#8e8c99] leading-relaxed">
              Downloads a complete JSON file containing all client inquiries, wedding albums,
              services, packages, testimonials, blogs, and settings.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadBackup}
            className="w-full py-2.5 rounded-lg bg-[#14141d] hover:bg-[#1f1f2c] border border-[#2b2b3d] text-xs font-semibold text-[#f5eedc] flex items-center justify-center gap-2 transition-colors"
          >
            <FileJson className="w-4 h-4 text-[#c5a059]" />
            <span>Download Backup JSON</span>
          </button>
        </div>

        {/* Restore Card */}
        <div className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif text-[#f5eedc]">Restore from Backup File</h3>
            <p className="text-xs text-[#8e8c99] leading-relaxed">
              Upload a previously downloaded JSON file to immediately reinstate all portfolio
              galleries and website copy.
            </p>
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              disabled={isRestoring}
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 rounded-lg bg-[#14141d] hover:bg-[#1f1f2c] border border-[#2b2b3d] text-xs font-semibold text-[#f5eedc] flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <Upload className="w-4 h-4 text-sky-400" />
              <span>{isRestoring ? 'Restoring Data...' : 'Select Backup File'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dangerous Reset Zone */}
      <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-6 space-y-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-serif text-red-200">Reset Content to Default Demo State</h4>
            <p className="text-xs text-[#a59ea1] leading-relaxed">
              This replaces current services, packages, and gallery records with the original
              authentic Kaviya Studio demo collection. Admin logins and stored media files are preserved.
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={isResetting}
          onClick={handleResetDemo}
          className="px-4 py-2 bg-red-900/40 hover:bg-red-900/60 border border-red-700/60 text-red-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
          <span>{isResetting ? 'Resetting...' : 'Reset to Default Demo Data'}</span>
        </button>
      </div>
    </div>
  );
};
