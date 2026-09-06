import React from 'react';
import { ScreenType } from '../types';

interface SidebarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  cartCount: number;
  expiringCount?: number;
  overdueCount?: number;
  totalReceivables?: number;
  pendingGrnCount?: number;
  onSignOut?: () => void;
  onOpenPlatformUpdate?: () => void;
  onOpenSubscriptionModal?: () => void;
  onOpenDarajaModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  cartCount,
  expiringCount = 0,
  overdueCount = 0,
  totalReceivables = 0,
  pendingGrnCount = 0,
  onSignOut,
  onOpenPlatformUpdate,
  onOpenSubscriptionModal,
  onOpenDarajaModal,
}) => {
  const formattedReceivables =
    totalReceivables >= 1000
      ? `${(totalReceivables / 1000).toFixed(0)}k`
      : totalReceivables.toLocaleString();

  const navItems = [
    {
      id: 'dashboard' as ScreenType,
      label: 'Overview & Metrics',
      sublabel: 'Cockpit & Cashflow',
      icon: 'dashboard',
    },
    {
      id: 'sales-pos' as ScreenType,
      label: 'POS Counter',
      sublabel: 'Terminal #01 Active',
      icon: 'point_of_sale',
      badge: cartCount > 0 ? `${cartCount} in cart` : undefined,
    },
    {
      id: 'inventory-stock' as ScreenType,
      label: 'Inventory & Batches',
      sublabel: 'PCPB & KEPHIS Regulated',
      icon: 'inventory_2',
      alert: expiringCount > 0 ? `${expiringCount} Expiring` : undefined,
    },
    {
      id: 'farmers-acreage-advisory' as ScreenType,
      label: 'Farmers & Accounts',
      sublabel: 'Customer & KYC Profiles',
      icon: 'agriculture',
    },
    {
      id: 'credit-debt-ledger' as ScreenType,
      label: 'Credit & Duka Ledger',
      sublabel: `Smallholder Book KES ${formattedReceivables}`,
      icon: 'account_balance_wallet',
      alert: overdueCount > 0 ? `${overdueCount} Overdue` : undefined,
    },
    {
      id: 'shift-register-daily-close' as ScreenType,
      label: 'Shift Close & Z-Report',
      sublabel: 'Physical Safe Reconcile',
      icon: 'receipt_long',
    },
    {
      id: 'suppliers-pos' as ScreenType,
      label: 'Suppliers & GRN Inward',
      sublabel: 'PO Inward Dispatch',
      icon: 'local_shipping',
      badge: pendingGrnCount > 0 ? `${pendingGrnCount} GRN` : undefined,
    },
  ];

  return (
    <aside className="w-64 bg-[#003b1b] text-white flex flex-col shrink-0 h-screen sticky top-0 border-r border-[#14532d] shadow-xl z-20 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#14532d] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://lh3.googleusercontent.com/aida/AEtjO1X9wFvkPwR2rD-0K7RfG9t5qZ6pueh0C-3t9cT_cBLxyVLB8zYvPOEj74ThuFFBhNzqKYSI--qvIwvubjHuCGbO_Ff2zBPZr4eo-ZohcRjmLH1RzKEgloqef7kc5bNLEBmdk9ZY2F_ILINM8h1jfuz_1mLi90KDf1sp2hMQrgHpKiLLwSjX7p7vbn-9ty5OUpbjAnn9tNRU319WM1-60_sndWDOC1TtuMwQFVZz2p5k4oxssS4PXQ466kom"
            alt="AgroFlow Logo"
            className="w-9 h-9 object-contain bg-white rounded-lg p-1 shadow-sm"
          />
          <div>
            <div className="font-playfair font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
              AgroFlow
              <span className="text-[10px] uppercase font-sans font-semibold tracking-wider bg-[#14532d] text-[#87c695] px-1.5 py-0.5 rounded border border-[#87c695]/30">
                Agri-OS
              </span>
            </div>
            <div className="text-[11px] text-[#87c695] font-medium flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Kerugoya Central Hub
            </div>
          </div>
        </div>
      </div>

      {/* Quick POS Launch Button */}
      <div className="px-3 pt-3 pb-2">
        <button
          onClick={() => onNavigate('sales-pos')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md ${
            currentScreen === 'sales-pos'
              ? 'bg-[#b1f2be] text-[#00210d] ring-2 ring-white/50 shadow-lg'
              : 'bg-[#14532d] text-[#87c695] hover:bg-[#1b6b3b] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-lg">point_of_sale</span>
            <span>Quick Sale / POS</span>
          </div>
          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-black/20 text-current">
            F2
          </span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#87c695]/70">
          Agro-Enterprise Operations
        </div>

        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
                isActive
                  ? 'bg-white/10 text-white font-semibold shadow-inner border-l-4 border-[#87c695]'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`material-symbols-outlined text-xl shrink-0 ${
                    isActive ? 'text-[#87c695]' : 'text-white/60'
                  }`}
                >
                  {item.icon}
                </span>
                <div className="truncate">
                  <div className="text-xs font-medium leading-tight truncate">{item.label}</div>
                  <div className="text-[10px] text-[#87c695]/80 font-normal leading-tight mt-0.5 truncate">
                    {item.sublabel}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#14532d] text-[#b1f2be] shrink-0 border border-[#87c695]/30">
                  {item.badge}
                </span>
              )}

              {item.alert && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 shrink-0 border border-amber-500/30">
                  {item.alert}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Controls & Sign Out */}
      <div className="p-3 bg-[#002b13] border-t border-[#14532d] space-y-1.5">
        {onOpenSubscriptionModal && (
          <button
            onClick={onOpenSubscriptionModal}
            className="w-full px-3 py-1.5 bg-[#14532d] hover:bg-[#1b6b3b] text-[#b1f2be] rounded-lg font-semibold text-xs flex items-center justify-center gap-2 border border-[#87c695]/30 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">verified</span>
            <span>SaaS License &amp; Renewal</span>
          </button>
        )}

        {onOpenDarajaModal && (
          <button
            onClick={onOpenDarajaModal}
            className="w-full px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[#87c695] hover:text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-2 border border-[#87c695]/20 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">phone_android</span>
            <span>M-Pesa Till Setup</span>
          </button>
        )}

        <a
          href="/legal"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[#87c695] hover:text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-2 border border-[#87c695]/20 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">gavel</span>
          <span>Legal &amp; Compliance Hub</span>
        </a>

        {onOpenPlatformUpdate && (
          <button
            onClick={onOpenPlatformUpdate}
            className="w-full px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[#87c695] hover:text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-2 border border-[#87c695]/20 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">system_update</span>
            <span>Platform Cockpit</span>
          </button>
        )}

        {onSignOut && (
          <button
            onClick={onSignOut}
            className="w-full px-3 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-200 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 border border-red-800/30 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
};
