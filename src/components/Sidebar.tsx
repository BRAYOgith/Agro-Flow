import React, { useState } from 'react';
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
      <div className="p-4 border-b border-[#14532d] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1X9wFvkPwR2rD-0K7RfG9t5qZ6pueh0C-3t9cT_cBLxyVLB8zYvPOEj74ThuFFBhNzqKYSI--qvIwvubjHuCGbO_Ff2zBPZr4eo-ZohcRjmLH1RzKEgloqef7kc5bNLEBmdk9ZY2F_ILINM8h1jfuz_1mLi90KDf1sp2hMQrgHpKiLLwSjX7p7vbn-9ty5OUpbjAnn9tNRU319WM1-60_sndWDOC1TtuMwQFVZz2p5k4oxssS4PXQ466kom"
              alt="AgroFlow Logo"
              className="w-9 h-9 object-contain bg-white rounded-lg p-1 shadow-sm"
            />
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#11bf36] rounded-full"></span>
          </div>
          <div>
            <div className="font-playfair font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
              AgroFlow
              <span className="text-[10px] uppercase font-sans font-semibold tracking-wider bg-[#11bf36]/20 text-[#11bf36] px-1.5 py-0.5 rounded border border-[#11bf36]/40">
                Agri-OS
              </span>
            </div>
            <div className="text-[11px] text-gray-300 font-medium flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#11bf36] animate-pulse"></span>
              Kerugoya Central Hub
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 pt-3 pb-2">
        <button
          onClick={() => onNavigate('sales-pos')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md cursor-pointer ${
            currentScreen === 'sales-pos'
              ? 'bg-[#11bf36] text-white ring-2 ring-white/50 shadow-lg'
              : 'bg-[#11bf36]/90 text-white hover:bg-[#11bf36]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-lg">point_of_sale</span>
            <span>Quick Sale / POS</span>
          </div>
          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-black/20 text-white">
            F2
          </span>
        </button>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto no-scrollbar">
        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#11bf36]/80">
          Agro-Enterprise Operations
        </div>

        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#002410] border-l-4 border-[#11bf36] text-white shadow-xs font-semibold pl-2.5'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <span
                  className={`material-symbols-outlined text-xl shrink-0 ${
                    isActive ? 'text-[#11bf36]' : 'text-white/60'
                  }`}
                >
                  {item.icon}
                </span>
                <div className="truncate">
                  <div className="text-xs font-medium leading-tight truncate">{item.label}</div>
                  <div className={`text-[10px] font-normal leading-tight mt-0.5 truncate ${
                    isActive ? 'text-[#11bf36]/90' : 'text-gray-400'
                  }`}>
                    {item.sublabel}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#11bf36]/20 text-[#11bf36] shrink-0 border border-[#11bf36]/40">
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

      <div className="p-3 bg-[#002b13] border-t border-[#14532d] space-y-2">
        <div className="rounded-xl border border-[#14532d] bg-[#003417] overflow-hidden transition-all duration-200">
          <button
            onClick={() => setIsSettingsOpen((prev) => !prev)}
            className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-[#87c695] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">settings</span>
              <span>Settings &amp; Platform</span>
            </div>
            <span
              className={`material-symbols-outlined text-base text-[#87c695] transition-transform duration-200 ${
                isSettingsOpen ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </button>

          {isSettingsOpen && (
            <div className="p-2 space-y-1 bg-[#002410] border-t border-[#14532d] animate-fade-in text-xs">
              {onOpenSubscriptionModal && (
                <button
                  onClick={onOpenSubscriptionModal}
                  className="w-full px-2.5 py-1.5 text-left text-[#11bf36] hover:bg-[#14532d] rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm text-[#11bf36]">verified</span>
                  <div className="truncate">
                    <div className="font-semibold text-xs leading-tight">SaaS License &amp; Renewal</div>
                    <div className="text-[10px] text-gray-300">Daily wallet &amp; status</div>
                  </div>
                </button>
              )}

              {onOpenDarajaModal && (
                <button
                  onClick={onOpenDarajaModal}
                  className="w-full px-2.5 py-1.5 text-left text-gray-200 hover:text-white hover:bg-[#14532d] rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm text-[#11bf36]">phone_android</span>
                  <div className="truncate">
                    <div className="font-semibold text-xs leading-tight">M-Pesa Till Setup</div>
                    <div className="text-[10px] text-gray-400">Store Till &amp; Daraja Keys</div>
                  </div>
                </button>
              )}

              <a
                href="/legal"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-2.5 py-1.5 text-left text-gray-200 hover:text-white hover:bg-[#14532d] rounded-lg transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm text-[#11bf36]">gavel</span>
                <div className="truncate">
                  <div className="font-semibold text-xs leading-tight">Legal &amp; Compliance Hub</div>
                  <div className="text-[10px] text-gray-400">Terms, Privacy &amp; Policies</div>
                </div>
              </a>

              {onOpenPlatformUpdate && (
                <button
                  onClick={onOpenPlatformUpdate}
                  className="w-full px-2.5 py-1.5 text-left text-gray-200 hover:text-white hover:bg-[#14532d] rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm text-[#11bf36]">system_update</span>
                  <div className="truncate">
                    <div className="font-semibold text-xs leading-tight">Platform Cockpit</div>
                    <div className="text-[10px] text-gray-400">Staff PINs &amp; SQLite Backup</div>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>

        {onSignOut && (
          <button
            onClick={onSignOut}
            className="w-full px-3 py-2 bg-red-950/40 hover:bg-red-950/80 text-red-200 hover:text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 border border-red-900/40 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
};
