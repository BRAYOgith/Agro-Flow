'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface DarajaSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsSaved?: () => void;
}

export const DarajaSettingsModal: React.FC<DarajaSettingsModalProps> = ({
  isOpen,
  onClose,
  onSettingsSaved,
}) => {
  const [darajaType, setDarajaType] = useState<'BuyGoods' | 'Paybill'>('BuyGoods');
  const [shortcode, setShortcode] = useState<string>('592019');
  const [consumerKey, setConsumerKey] = useState<string>('');
  const [consumerSecret, setConsumerSecret] = useState<string>('');
  const [passkey, setPasskey] = useState<string>('');
  const [managerPin, setManagerPin] = useState<string>('');

  const [existingMasked, setExistingMasked] = useState<{
    consumerKeyMasked: string;
    consumerSecretMasked: string;
    passkeyMasked: string;
    isConfigured: boolean;
  } | null>(null);

  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    try {
      const data = await api.getDarajaSettings();
      setDarajaType(data.darajaType || 'BuyGoods');
      setShortcode(data.shortcode || '592019');
      setExistingMasked({
        consumerKeyMasked: data.consumerKeyMasked,
        consumerSecretMasked: data.consumerSecretMasked,
        passkeyMasked: data.passkeyMasked,
        isConfigured: data.isConfigured,
      });
    } catch (err: any) {
      console.error('Failed to load Daraja settings', err);
    }
  };

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setStatusMessage(null);
    try {
      const res = await api.testDarajaSettings(shortcode);
      setStatusMessage({ text: res.message, isError: false });
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Test handshake failed', isError: true });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managerPin || managerPin.trim() === '') {
      setStatusMessage({ text: 'Manager PIN is required to save credentials.', isError: true });
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await api.saveDarajaSettings({
        shortcode,
        darajaType,
        consumerKey: consumerKey || undefined,
        consumerSecret: consumerSecret || undefined,
        passkey: passkey || undefined,
        pin: managerPin,
      });

      setStatusMessage({ text: res.message, isError: false });
      setConsumerKey('');
      setConsumerSecret('');
      setPasskey('');
      setManagerPin('');
      await loadSettings();
      if (onSettingsSaved) onSettingsSaved();
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Failed to save credentials', isError: true });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-[#dae2fd] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-2xl text-[#003b1b] p-2 bg-[#f2f3ff] rounded-xl">
              phone_android
            </span>
            <div>
              <h3 className="font-playfair font-bold text-lg text-[#131b2e]">Safaricom M-Pesa Till Setup</h3>
              <p className="text-xs text-gray-500">Configure your store&apos;s own Till Number &amp; Daraja API Keys</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 text-base">✕</button>
        </div>

        {/* Security Notice */}
        <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
          <div className="font-bold flex items-center gap-1 text-emerald-900">
            <span className="material-symbols-outlined text-sm">enhanced_encryption</span>
            <span>AES-256-GCM Enterprise Encrypted Storage</span>
          </div>
          <p className="leading-relaxed">
            All consumer secrets and passkeys are encrypted at rest with AES-256-GCM before saving. When farmers pay at your counter, the funds flow <strong>directly into your own Till Number</strong>. AgroFlow never touches customer sales cash.
          </p>
        </div>

        {statusMessage && (
          <div
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between ${
              statusMessage.isError
                ? 'bg-red-50 text-red-800 border-red-200'
                : 'bg-emerald-50 text-emerald-900 border-emerald-200'
            }`}
          >
            <span>{statusMessage.text}</span>
            <button onClick={() => setStatusMessage(null)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-3.5 text-xs">
          {/* Account Type */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">M-Pesa Business Account Type:</label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                  darajaType === 'BuyGoods'
                    ? 'border-[#003b1b] bg-emerald-50/60 font-bold text-[#003b1b]'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="darajaType"
                  value="BuyGoods"
                  checked={darajaType === 'BuyGoods'}
                  onChange={() => setDarajaType('BuyGoods')}
                  className="text-[#003b1b] focus:ring-[#006a61]"
                />
                <span>Buy Goods (Till Number)</span>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                  darajaType === 'Paybill'
                    ? 'border-[#003b1b] bg-emerald-50/60 font-bold text-[#003b1b]'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="darajaType"
                  value="Paybill"
                  checked={darajaType === 'Paybill'}
                  onChange={() => setDarajaType('Paybill')}
                  className="text-[#003b1b] focus:ring-[#006a61]"
                />
                <span>Paybill Account</span>
              </label>
            </div>
          </div>

          {/* Till / Shortcode */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">Store Till Number / Shortcode *</label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="e.g., 592019"
                value={shortcode}
                onChange={(e) => setShortcode(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold font-mono"
              />
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="px-3.5 py-2 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#003b1b] border border-gray-200 font-bold rounded-lg transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                {isTesting ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
            <p className="text-[10px] text-gray-500 mt-1">
              This Till will be embedded directly into all POS checkout STK prompts.
            </p>
          </div>

          {/* Daraja Consumer Key */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-gray-700">Daraja Consumer Key</label>
              {existingMasked?.consumerKeyMasked && (
                <span className="text-[10px] text-emerald-800 font-mono">
                  Current: {existingMasked.consumerKeyMasked}
                </span>
              )}
            </div>
            <input
              type="text"
              placeholder={existingMasked?.consumerKeyMasked ? 'Leave empty to keep existing encrypted key' : 'Paste Daraja Consumer Key'}
              value={consumerKey}
              onChange={(e) => setConsumerKey(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono"
            />
          </div>

          {/* Daraja Consumer Secret */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-gray-700">Daraja Consumer Secret</label>
              {existingMasked?.consumerSecretMasked && (
                <span className="text-[10px] text-emerald-800 font-mono">
                  Current: {existingMasked.consumerSecretMasked}
                </span>
              )}
            </div>
            <input
              type="password"
              placeholder={existingMasked?.consumerSecretMasked ? 'Leave empty to keep existing encrypted secret' : 'Paste Daraja Consumer Secret'}
              value={consumerSecret}
              onChange={(e) => setConsumerSecret(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono"
            />
          </div>

          {/* Online Passkey */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-gray-700">Lipa Na M-Pesa Online Passkey</label>
              {existingMasked?.passkeyMasked && (
                <span className="text-[10px] text-emerald-800 font-mono">
                  Current: {existingMasked.passkeyMasked}
                </span>
              )}
            </div>
            <input
              type="password"
              placeholder={existingMasked?.passkeyMasked ? 'Leave empty to keep existing encrypted passkey' : 'Paste Lipa Na M-Pesa Online Passkey'}
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono"
            />
          </div>

          {/* Manager Authorization PIN */}
          <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 space-y-1.5">
            <label className="block font-bold text-amber-950">Manager Authorization PIN *</label>
            <input
              type="password"
              maxLength={4}
              required
              placeholder="Enter 4-digit Manager PIN (e.g. 4920)"
              value={managerPin}
              onChange={(e) => setManagerPin(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs font-mono font-bold"
            />
            <span className="text-[10px] text-amber-800 block">
              Required to prevent unauthorized modification of store financial routing.
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-[#003b1b] hover:bg-[#14532d] text-[#b1f2be] font-bold rounded-lg flex items-center gap-1.5 disabled:opacity-60 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">lock</span>
              <span>{isSaving ? 'Encrypting & Saving...' : 'Save & Encrypt Credentials'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
