import React, { useState } from 'react';
import { ScreenType, ShiftTransaction, ProductItem, FarmerRecord } from '../../types';

interface OverviewScreenProps {
  onNavigate: (screen: ScreenType) => void;
  transactions: ShiftTransaction[];
  products: ProductItem[];
  farmers: FarmerRecord[];
  onOpenQuickSale: () => void;
  onSendSmsReminder: (farmer: FarmerRecord) => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  onNavigate,
  transactions,
  products,
  farmers,
  onOpenQuickSale,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'live-stream' | 'alerts'>('analytics');

  
  const totalGrossSales = transactions.reduce((acc, t) => acc + t.totalAmount, 0);
  const mpesaSales = transactions.filter((t) => t.channel === 'M-Pesa').reduce((acc, t) => acc + t.totalAmount, 0);
  const cashSales = transactions.filter((t) => t.channel === 'Cash').reduce((acc, t) => acc + t.totalAmount, 0);
  const totalReceivables = farmers.reduce((acc, f) => acc + f.outstandingBalance, 0);
  const lowStockProducts = products.filter((p) => p.stockCount <= p.minStock);
  const expiringSoonProducts = products.filter((p) => p.daysToExpiry <= 60);

  
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayDayName = new Date().toLocaleDateString('en-US', { weekday: 'short' });

  const weeklySales = daysOfWeek.map((day) => {
    
    const isToday = day === todayDayName || (todayDayName.startsWith(day));
    const dayTotal = isToday ? totalGrossSales : 0;
    return {
      day,
      amount: dayTotal,
      label: `KES ${dayTotal.toLocaleString()}`,
      current: isToday,
    };
  });

  const maxWeeklyAmount = Math.max(10000, totalGrossSales);

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white rounded-xl p-3 border border-[#dae2fd] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-[#11bf36] text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Executive Cockpit
          </button>
          <button
            onClick={() => setActiveTab('live-stream')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'live-stream'
                ? 'bg-[#11bf36] text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#11bf36] animate-pulse"></span>
            Live Terminal Stream ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'alerts'
                ? 'bg-red-700 text-white shadow-xs'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            Urgent Interventions ({lowStockProducts.length + expiringSoonProducts.length})
          </button>
        </div>

        <button
          onClick={onOpenQuickSale}
          className="px-4 py-2 rounded-lg bg-[#11bf36] hover:bg-[#0ea82f] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <span className="material-symbols-outlined text-sm">point_of_sale</span>
          Launch POS Counter [F2]
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#dae2fd] border-t-4 border-t-[#11bf36] shadow-xs">
          <span className="font-semibold uppercase tracking-wider text-[11px] text-gray-500 block mb-1">
            Today's Gross Sales
          </span>
          <div className="text-2xl font-extrabold text-[#131b2e] tracking-tight font-mono">
            KES {totalGrossSales.toLocaleString()}
          </div>
          <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px]">
            <span className="text-gray-500">M-Pesa: <strong className="text-[#11bf36]">KES {mpesaSales.toLocaleString()}</strong></span>
            <span className="text-gray-500">Cash: <strong className="text-[#131b2e]">KES {cashSales.toLocaleString()}</strong></span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#dae2fd] border-t-4 border-t-[#11bf36] shadow-xs">
          <span className="font-semibold uppercase tracking-wider text-[11px] text-gray-500 block mb-1">
            Est. Gross Profit
          </span>
          <div className="text-2xl font-extrabold text-[#11bf36] tracking-tight font-mono">
            KES {Math.round(totalGrossSales * 0.22).toLocaleString()}
          </div>
          <div className="mt-3 pt-2.5 border-t border-gray-100 text-[11px] text-gray-500">
            <span>Blended Margin: <strong className="text-[#11bf36]">{totalGrossSales > 0 ? '22.0%' : '0.0%'}</strong></span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('credit-debt-ledger')}
          className="bg-white rounded-xl p-4 border border-[#dae2fd] shadow-xs hover:shadow-md transition-all cursor-pointer group hover:border-[#006a61]"
        >
          <span className="font-semibold uppercase tracking-wider text-[11px] text-gray-500 block mb-1 group-hover:text-[#006a61]">
            Farmer Credit Book
          </span>
          <div className="text-2xl font-extrabold text-[#131b2e] tracking-tight font-mono">
            KES {totalReceivables.toLocaleString()}
          </div>
          <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>{farmers.length} Registered Farmers</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('inventory-stock')}
          className="bg-white rounded-xl p-4 border border-[#dae2fd] shadow-xs hover:shadow-md transition-all cursor-pointer group hover:border-[#ba1a1a]"
        >
          <span className="font-semibold uppercase tracking-wider text-[11px] text-gray-500 block mb-1 group-hover:text-red-700">
            Dispensary Stock
          </span>
          <div className="text-2xl font-extrabold text-[#131b2e] tracking-tight font-mono">
            {products.length} Products Stocked
          </div>
          <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>{lowStockProducts.length} Safety Deficit</span>
          </div>
        </div>
      </div>

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-[#dae2fd] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-[#131b2e]">
                  Weekly Revenue Velocity
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Calculated dynamically from real counter sale transactions
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#11bf36] bg-[#eaf8ed] border border-[#11bf36]/30 px-2.5 py-1 rounded-md">
                7-Day Revenue: KES {totalGrossSales.toLocaleString()}
              </span>
            </div>

            <div className="h-48 flex items-end justify-between gap-3 pt-4 px-2 border-b border-gray-100">
              {weeklySales.map((bar) => {
                const heightPercent = bar.amount > 0 ? Math.max(5, Math.round((bar.amount / maxWeeklyAmount) * 100)) : 0;
                return (
                  <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 group relative">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap z-10 pointer-events-none">
                      {bar.label}
                    </div>

                    <div className="w-full bg-[#eaedff] rounded-t-lg h-36 flex items-end overflow-hidden p-0.5">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-md transition-all duration-500 ${
                          bar.amount > 0 ? 'bg-[#11bf36]' : 'bg-gray-200'
                        }`}
                      />
                    </div>

                    <div className="text-center">
                      <span className={`text-xs font-semibold ${bar.current ? 'text-[#11bf36] font-bold' : 'text-gray-600'}`}>
                        {bar.day}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-[#dae2fd] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-[#131b2e]">Dispensary Inventory</h3>
              <span className="text-[10px] font-semibold text-gray-500">{products.length} SKUs</span>
            </div>

            {products.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-center text-gray-400">
                <span className="material-symbols-outlined text-3xl mb-1">inventory_2</span>
                <p className="text-xs font-medium">No products in inventory</p>
                <p className="text-[11px] text-gray-400">Add products via Inventory screen</p>
              </div>
            ) : (
              <div className="space-y-4">
                {products.slice(0, 4).map((p) => (
                  <div key={p.id} className="text-xs">
                    <div className="flex items-center justify-between font-semibold text-[#131b2e]">
                      <span className="truncate pr-2">{p.name}</span>
                      <span className="font-mono text-[#006a61]">KES {p.retailPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-500 mt-1">
                      <span>{p.category}</span>
                      <span>{p.stockCount} {p.unit} remaining</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'live-stream' && (
        <div className="bg-white rounded-xl p-5 border border-[#dae2fd] shadow-xs">
          <h3 className="font-bold text-sm text-[#131b2e] mb-4">
            Live Counter Transactions Stream ({transactions.length})
          </h3>

          {transactions.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-center text-gray-400">
              <span className="material-symbols-outlined text-3xl mb-1">receipt_long</span>
              <p className="text-xs font-medium">No transactions recorded yet</p>
              <p className="text-[11px] text-gray-400">Process counter sales via POS screen [F2]</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px] bg-gray-50/50">
                    <th className="py-2.5 px-3">Tx ID / Time</th>
                    <th className="py-2.5 px-3">Farmer / Customer</th>
                    <th className="py-2.5 px-3">Items Summary</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-center">Channel</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-mono font-bold text-[#131b2e]">{tx.id}</div>
                        <div className="text-[10px] text-gray-400">{tx.time}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-[#131b2e]">{tx.farmerName}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-gray-700 line-clamp-1 max-w-[280px]" title={tx.itemsSummary}>
                          {tx.itemsSummary}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-[#131b2e]">
                        KES {tx.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {tx.channel}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                          ● {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="bg-white rounded-xl p-5 border border-[#dae2fd] shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#131b2e] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-amber-600 text-lg">warning</span>
            Urgent Interventions & Safety Audits
          </h3>

          {expiringSoonProducts.length === 0 && lowStockProducts.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-center text-gray-400 text-xs font-medium">
              ✓ No urgent inventory alerts or stock deficits detected.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {expiringSoonProducts.map((p) => (
                <div key={p.id} className="p-3 bg-red-50/70 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between text-xs font-bold text-red-900">
                    <span>{p.name}</span>
                    <span className="text-[10px] bg-red-200 text-red-800 px-1.5 py-0.2 rounded font-mono">
                      {p.daysToExpiry}d left
                    </span>
                  </div>
                  <p className="text-[11px] text-red-800 mt-1">
                    Batch {p.batchNo} expires on {p.expiryDate}. Current stock: {p.stockCount} {p.unit}.
                  </p>
                </div>
              ))}

              {lowStockProducts.map((p) => (
                <div key={p.id} className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                    <span>{p.name}</span>
                    <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-mono">
                      {p.stockCount} Left
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800 mt-1">
                    Stock below minimum of {p.minStock}. Supplier: {p.supplier}.
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
