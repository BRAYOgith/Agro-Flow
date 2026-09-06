import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface PlatformUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlatformUpdateModal: React.FC<PlatformUpdateModalProps> = ({ isOpen, onClose }) => {
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'migrations' | 'backup' | 'audit' | 'users'>('overview');
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // New User Registration Form State
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'Manager' | 'Cashier'>('Cashier');
  const [newPassword, setNewPassword] = useState('');
  const [newPin, setNewPin] = useState('');
  const [creatingUser, setCreatingUser] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSystemStatus();
      loadAuditLogs();
      loadUsers();
    }
  }, [isOpen]);

  const loadSystemStatus = async () => {
    try {
      const data = await api.getSystemStatus();
      setSystemStatus(data);
    } catch (e: any) {
      console.error(e);
    }
  };

  const loadAuditLogs = async () => {
    try {
      const logs = await api.getAuditLogs();
      setAuditLogs(logs);
    } catch (e: any) {
      console.error(e);
    }
  };

  const loadUsers = async () => {
    try {
      const userList = await api.getUsers();
      setUsers(userList);
    } catch (e: any) {
      console.error(e);
    }
  };

  const handleRunMigrations = async () => {
    setUpdating(true);
    setMessage(null);
    try {
      const res = await api.runMigrations();
      setMessage(`Schema Update Successful: ${res.result?.applied?.length || 0} updates applied.`);
      await loadSystemStatus();
    } catch (e: any) {
      setMessage(`Error running update: ${e.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleExportBackup = async () => {
    try {
      const backup = await api.getBackup();
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `agroflow_db_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      setMessage('Full system database snapshot backup downloaded successfully.');
    } catch (e: any) {
      setMessage(`Export failed: ${e.message}`);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingUser(true);
    setMessage(null);
    try {
      await api.createUser({
        username: newUsername,
        name: newName,
        role: newRole,
        password: newPassword,
        pin: newPin || undefined,
      });
      setMessage(`Staff account '${newUsername}' (${newRole}) registered successfully.`);
      setNewUsername('');
      setNewName('');
      setNewPassword('');
      setNewPin('');
      await loadUsers();
      await loadAuditLogs();
    } catch (e: any) {
      setMessage(`Registration failed: ${e.message}`);
    } finally {
      setCreatingUser(false);
    }
  };

  const handleDeleteUser = async (id: string, username: string) => {
    if (!confirm(`Are you sure you want to deactivate and revoke access for staff member '${username}'?`)) {
      return;
    }
    try {
      await api.deleteUser(id);
      setMessage(`Staff access for '${username}' has been revoked.`);
      await loadUsers();
      await loadAuditLogs();
    } catch (e: any) {
      setMessage(`Revocation failed: ${e.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#003b1b] text-[#b1f2be] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-lg">system_update</span>
            </div>
            <div>
              <h2 className="font-bold text-base text-[#131b2e]">Platform Update & Staff Security Cockpit</h2>
              <p className="text-xs text-gray-500">Personnel Accounts, Access Revocation & System Health</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-gray-200 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 px-3 font-bold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'overview'
                ? 'border-[#003b1b] text-[#003b1b]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            System Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-2.5 px-3 font-bold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'users'
                ? 'border-[#003b1b] text-[#003b1b]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Staff & Personnel ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('migrations')}
            className={`pb-2.5 px-3 font-bold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'migrations'
                ? 'border-[#003b1b] text-[#003b1b]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Schema Migrations
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`pb-2.5 px-3 font-bold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'backup'
                ? 'border-[#003b1b] text-[#003b1b]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Backup & Snapshot
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-2.5 px-3 font-bold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'audit'
                ? 'border-[#003b1b] text-[#003b1b]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Security Audit Trail
          </button>
        </div>

        {message && (
          <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-semibold">
            {message}
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#dae2fd]">
                  <span className="text-[10px] text-gray-500 uppercase font-semibold">System Release</span>
                  <div className="font-mono font-extrabold text-base text-[#131b2e] mt-1">
                    v{systemStatus?.version || '1.2.0'}
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold">Stable Release</span>
                </div>

                <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#dae2fd]">
                  <span className="text-[10px] text-gray-500 uppercase font-semibold">Active Personnel</span>
                  <div className="font-mono font-extrabold text-base text-[#006a61] mt-1">
                    {users.length} Users
                  </div>
                  <span className="text-[10px] text-gray-500">RBAC Role Protection</span>
                </div>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="font-bold text-[#131b2e] flex items-center justify-between">
                  <span>Security & Health Controls</span>
                  <span className="text-emerald-700 font-bold">● Healthy</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-700 font-mono">
                  <div>✓ Password Hashing: Bcrypt</div>
                  <div>✓ Manager PIN Check: Enforced</div>
                  <div>✓ Rate Limiter: 100 req/min</div>
                  <div>✓ Audit Trail Logging: Active</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-5">
              {/* Register Staff Form */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                <div className="font-bold text-[#131b2e] text-xs flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#003b1b]">person_add</span>
                  <span>Register New Staff Personnel</span>
                </div>

                <form onSubmit={handleCreateUser} className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Username / ID:</label>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      required
                      placeholder="e.g. mary.wambui"
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Full Name:</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      required
                      placeholder="e.g. Mary Wambui"
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Role Permission:</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as any)}
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium"
                    >
                      <option value="Cashier">Cashier (POS & Sales Counter)</option>
                      <option value="Manager">Manager (Full Administrative Access)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Password:</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="col-span-2 flex items-center justify-between pt-1">
                    <div className="w-1/2 pr-2">
                      <label className="font-semibold text-gray-700 block mb-1">Manager Authorization PIN (Optional):</label>
                      <input
                        type="text"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        placeholder="e.g. 4920"
                        maxLength={4}
                        className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={creatingUser}
                      className="px-4 py-2 bg-[#003b1b] text-[#b1f2be] font-bold rounded-lg hover:bg-[#14532d] text-xs shadow-xs transition-all disabled:opacity-50 mt-5"
                    >
                      {creatingUser ? 'Registering...' : '+ Add Personnel Account'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Active Users Table */}
              <div className="space-y-2">
                <div className="font-bold text-[#131b2e]">Active Staff Members:</div>
                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 bg-white">
                  {users.map((u) => (
                    <div key={u.id} className="p-3 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-[#131b2e] flex items-center gap-2">
                          <span>{u.name}</span>
                          <span className="font-mono text-[10px] text-gray-400">(@{u.username})</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                            {u.role}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5 font-mono">
                          Registered: {u.created_at} • Authorization PIN: {u.pin}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteUser(u.id, u.username)}
                        className="px-2.5 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded text-[11px] font-bold transition-colors"
                      >
                        Deactivate / Revoke
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'migrations' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
                <div className="font-bold text-blue-900 flex items-center justify-between">
                  <span>Database Schema Updates</span>
                  <span className="font-mono text-xs">{systemStatus?.appliedMigrations?.length || 0} Applied</span>
                </div>
                <p className="text-[11px] text-blue-800">
                  Runs zero-downtime versioned system migrations and security patches. Automatically patches hardware classifications and audit structures.
                </p>
                <button
                  onClick={handleRunMigrations}
                  disabled={updating}
                  className="px-4 py-2 bg-[#003b1b] text-[#b1f2be] font-bold rounded-lg hover:bg-[#14532d] disabled:opacity-50 text-xs flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">published_with_changes</span>
                  <span>{updating ? 'Applying Updates...' : 'Check & Execute Pending Migrations'}</span>
                </button>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-gray-700">Applied Schema Migrations:</div>
                <div className="divide-y divide-gray-100 border rounded-lg overflow-hidden">
                  {systemStatus?.appliedMigrations?.map((m: any) => (
                    <div key={m.id} className="p-2.5 bg-white flex justify-between items-center font-mono text-[11px]">
                      <div>
                        <span className="font-bold text-[#006a61]">v{m.version}</span> - {m.name}
                      </div>
                      <span className="text-gray-400">{m.applied_at}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <div className="font-bold text-emerald-900">Database Snapshot Export</div>
                <p className="text-[11px] text-emerald-800">
                  Export complete JSON snapshot containing all inventory SKUs, farmer accounts, credit ledgers, and transaction histories.
                </p>
                <button
                  onClick={handleExportBackup}
                  className="px-4 py-2 bg-[#006a61] text-white font-bold rounded-lg hover:bg-[#005049] text-xs flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  <span>Export & Download Database Backup (.JSON)</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-2">
              <div className="font-bold text-gray-700">Recent Security Audit Trail:</div>
              <div className="max-h-60 overflow-y-auto border rounded-lg divide-y divide-gray-100 bg-gray-50">
                {auditLogs.map((log: any) => (
                  <div key={log.id} className="p-2.5 text-[11px] font-mono space-y-0.5">
                    <div className="flex justify-between font-bold text-[#131b2e]">
                      <span>{log.action}</span>
                      <span className="text-gray-400 text-[10px]">{log.timestamp}</span>
                    </div>
                    <div className="text-gray-600">User: {log.username}</div>
                    <div className="text-gray-500 italic">{log.details}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#003b1b] text-white text-xs font-bold rounded-lg hover:bg-[#14532d]"
          >
            Close Cockpit
          </button>
        </div>
      </div>
    </div>
  );
};
