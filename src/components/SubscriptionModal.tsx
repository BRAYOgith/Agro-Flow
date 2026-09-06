'use client';

import React, { useState } from 'react';
import { api } from '../services/api';

interface SubscriptionData {
  storeId: string;
  storeName: string;
  ownerPhone: string;
  dailyRate: number;
  walletBalance: number;
  licensedUntil: string;
  daysRemaining: number;
  subscriptionStatus: 'active' | 'grace_period' | 'locked';
  packages: {
    oneDay: { days: number; amount: number; label: string };
    oneWeek: { days: number; amount: number; label: string };
    oneMonth: { days: number; amount: number; label: string; savingsPercent?: number };
  };
}

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: SubscriptionData | null;
  onRefresh: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onRefresh,
}) => {
  const [selectedDays, setSelectedDays] = useState<number>(7);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>(subscription?.ownerPhone || '254712345678');
  const [simulateInstant, setSimulateInstant] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Rate configuration state (for platform owner / manager)
  const [showRateSettings, setShowRateSettings] = useState<boolean>(false);
  const [newRate, setNewRate] = useState<number>(subscription?.dailyRate || 100);
  const [managerPin, setManagerPin] = useState<string>('');

  if (!isOpen) return null;

  const dailyRate = subscription?.dailyRate || 100;
  const packages = subscription?.packages || {
    oneDay: { days: 1, amount: dailyRate, label: `1 Day (KES ${dailyRate})` },
    oneWeek: { days: 7, amount: dailyRate * 7, label: `1 Week (KES ${dailyRate * 7})` },
    oneMonth: { days: 30, amount: Math.round(dailyRate * 30 * 0.9), label: `1 Month (KES ${Math.round(dailyRate * 30 * 0.9)})` },
  };

  const getActiveAmount = (): number => {
    if (selectedDays === 1) return packages.oneDay.amount;
    if (selectedDays === 7) return packages.oneWeek.amount;
    if (selectedDays === 30) return packages.oneMonth.amount;
    return Number(customAmount) || dailyRate;
  };

  const handleTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = getActiveAmount();
    if (!amount || amount <= 0) {
      setStatusMessage({ text: 'Please select a package or enter a valid amount.', isError: true });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await api.topupSubscription(amount, phoneNumber, simulateInstant);
      setStatusMessage({ text: res.message, isError: false });
      onRefresh();
      if (res.instantSettled) {
        setTimeout(() => {
          setStatusMessage(null);
          onClose();
        }, 3000);
      }
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Failed to initiate M-Pesa prompt', isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managerPin || managerPin.trim() === '') {
      setStatusMessage({ text: 'Manager PIN is required to change subscription pricing.', isError: true });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.updateSubscriptionRate(newRate, managerPin);
      setStatusMessage({ text: res.message, isError: false });
      setShowRateSettings(false);
      setManagerPin('');
      onRefresh();
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Failed to update daily rate', isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLocked = subscription?.subscriptionStatus === 'locked';
  const isGrace = subscription?.subscriptionStatus === 'grace_period';

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-[#dae2fd] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-2xl text-[#003b1b] p-2 bg-[#f2f3ff] rounded-xl">
              verified
            </span>
            <div>
              <h3 className="font-playfair font-bold text-lg text-[#131b2e]">AgroFlow SaaS License</h3>
              <p className="text-xs text-gray-500">Store Operating License &amp; Micro-Billing Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 text-base">
            ✕
          </button>
        </div>

        {/* Status Messages */}
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

        {/* Current Health Banner */}
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            isLocked
              ? 'bg-red-50/80 border-red-200 text-red-950'
              : isGrace
              ? 'bg-amber-50/80 border-amber-200 text-amber-950'
              : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">
                {isLocked ? 'License Locked (Overdue)' : isGrace ? 'Grace Period Active (24h left)' : 'Active Store License'}
              </span>
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-white/80 border border-current">
                {subscription?.daysRemaining !== undefined && subscription.daysRemaining > 0
                  ? `${subscription.daysRemaining}d remaining`
                  : 'Expired'}
              </span>
            </div>
            <p className="text-xs opacity-90">
              Store: <strong>{subscription?.storeName || 'Kerugoya Central Hub'}</strong> • Daily Rate:{' '}
              <strong>KES {dailyRate.toLocaleString()}/day</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowRateSettings(!showRateSettings)}
            className="text-[11px] font-bold text-[#003b1b] bg-white px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer shrink-0"
          >
            {showRateSettings ? 'Close Rate Config' : 'Configure Rate'}
          </button>
        </div>

        {/* Owner Daily Rate Adjustment Panel */}
        {showRateSettings && (
          <form onSubmit={handleUpdateRate} className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs space-y-3">
            <div className="font-bold text-gray-800 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-emerald-800">tune</span>
              <span>Platform Owner: Adjust Daily SaaS Pricing</span>
            </div>
            <p className="text-[11px] text-gray-600">
              The daily rate is dynamic. You can adjust it anytime (e.g. from KES 100 to KES 200). All package calculations update in real time.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">New Daily Rate (KES) *</label>
                <input
                  type="number"
                  min="10"
                  step="10"
                  required
                  value={newRate}
                  onChange={(e) => setNewRate(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Manager Authorization PIN *</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  placeholder="Manager PIN (e.g., 4920)"
                  value={managerPin}
                  onChange={(e) => setManagerPin(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowRateSettings(false)}
                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded font-semibold text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-[#003b1b] hover:bg-[#14532d] text-[#b1f2be] font-bold rounded"
              >
                Save New Rate
              </button>
            </div>
          </form>
        )}

        {/* Top-Up Packages */}
        <form onSubmit={handleTopup} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-800 mb-2">Select Renewal Package:</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 1 Day */}
              <div
                onClick={() => setSelectedDays(1)}
                className={`p-3.5 rounded-xl border text-center cursor-pointer transition-all ${
                  selectedDays === 1
                    ? 'border-[#003b1b] bg-emerald-50/70 shadow-xs ring-2 ring-[#003b1b]/20'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span className="text-[10px] text-gray-500 font-bold uppercase block">1 Day Pass</span>
                <span className="font-mono font-bold text-base text-[#131b2e] block my-0.5">
                  KES {packages.oneDay.amount.toLocaleString()}
                </span>
                <span className="text-[10px] text-gray-500">24 Hours Access</span>
              </div>

              {/* 1 Week */}
              <div
                onClick={() => setSelectedDays(7)}
                className={`p-3.5 rounded-xl border text-center cursor-pointer transition-all ${
                  selectedDays === 7
                    ? 'border-[#003b1b] bg-emerald-50/70 shadow-xs ring-2 ring-[#003b1b]/20'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span className="text-[10px] text-gray-500 font-bold uppercase block">1 Week Pass</span>
                <span className="font-mono font-bold text-base text-[#003b1b] block my-0.5">
                  KES {packages.oneWeek.amount.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-800 font-semibold">7 Days Continuous</span>
              </div>

              {/* 1 Month (10% Discount) */}
              <div
                onClick={() => setSelectedDays(30)}
                className={`p-3.5 rounded-xl border text-center cursor-pointer transition-all relative ${
                  selectedDays === 30
                    ? 'border-[#003b1b] bg-emerald-50/70 shadow-xs ring-2 ring-[#003b1b]/20'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span className="text-[10px] text-gray-500 font-bold uppercase block">1 Month Pass</span>
                <span className="font-mono font-bold text-base text-[#003b1b] block my-0.5">
                  KES {packages.oneMonth.amount.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold">10% Off Savings</span>
              </div>
            </div>
          </div>

          {/* M-Pesa Phone Input */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">M-Pesa Payment Phone Number *</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-base">
                phone_iphone
              </span>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="254712345678"
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold font-mono"
              />
            </div>
            <p className="text-[10px] text-gray-500 mt-1">
              An STK Push prompt will be dispatched directly to this Safaricom number.
            </p>
          </div>

          {/* Demo Simulation Toggle */}
          <div className="p-3 bg-[#f2f3ff] rounded-lg border border-[#dae2fd] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-gray-800 block">Instant Settlement Simulation (Demo Mode)</span>
              <span className="text-[10px] text-gray-600">Simulate immediate M-Pesa confirmation and license extension</span>
            </div>
            <input
              type="checkbox"
              checked={simulateInstant}
              onChange={(e) => setSimulateInstant(e.target.checked)}
              className="w-4 h-4 text-[#003b1b] rounded focus:ring-[#006a61] cursor-pointer"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#003b1b] hover:bg-[#14532d] text-[#b1f2be] font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">payments</span>
              <span>
                {isSubmitting
                  ? 'Initiating STK...'
                  : `Top Up KES ${getActiveAmount().toLocaleString()} via M-Pesa`}
              </span>
            </button>
          </div>
        </form>

        {/* Offline Paybill Info */}
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-[11px] text-gray-600 flex items-center justify-between">
          <span>Manual Paybill fallback: <strong>522522</strong> • Account: <strong>{subscription?.storeId || 'STORE-01'}</strong></span>
          <span className="text-gray-400 font-mono">AgroFlow Central</span>
        </div>
      </div>
    </div>
  );
};
