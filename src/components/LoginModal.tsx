import React, { useState } from 'react';
import { api } from '../services/api';

interface LoginModalProps {
  isOpen: boolean;
  onLoginSuccess: (user: any) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onLoginSuccess }) => {
  const [username, setUsername] = useState('john.mwangi');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await api.login(username, password);
      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-[#003b1b] text-white rounded-xl mx-auto flex items-center justify-center font-bold text-xl shadow-md">
            🌾
          </div>
          <h2 className="font-extrabold text-xl text-[#131b2e] tracking-tight">AgroFlow Sign In</h2>
          <p className="text-xs text-gray-500">Sign in to access your terminal session</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-800 text-xs rounded-lg border border-red-200 font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Username / Personnel ID:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006a61] focus:bg-white"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006a61] focus:bg-white"
            />
          </div>

          {/* Preset User Switcher for demo ease */}
          <div className="pt-1">
            <span className="text-[10px] text-gray-500 uppercase font-semibold block mb-1">Select Preset Role Credentials:</span>
            <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
              <button
                type="button"
                onClick={() => { setUsername('john.mwangi'); setPassword('admin123'); }}
                className="p-1.5 bg-emerald-50 text-emerald-900 rounded border border-emerald-200 hover:bg-emerald-100 font-semibold"
              >
                Manager
              </button>
              <button
                type="button"
                onClick={() => { setUsername('faith.wanjiru'); setPassword('admin123'); }}
                className="p-1.5 bg-blue-50 text-blue-900 rounded border border-blue-200 hover:bg-blue-100 font-semibold"
              >
                Cashier
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#003b1b] text-[#b1f2be] hover:bg-[#14532d] font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
