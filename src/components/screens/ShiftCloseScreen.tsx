import React, { useState } from 'react';
import { DenominationTally, ShiftTransaction, ScreenType } from '../../types';

interface ShiftCloseScreenProps {
  transactions: ShiftTransaction[];
  denominations: DenominationTally[];
  onUpdateDenominationCount: (denomination: string, count: number) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const ShiftCloseScreen: React.FC<ShiftCloseScreenProps> = ({
  transactions,
  denominations,
  onUpdateDenominationCount,
  onNavigate,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'reconciliation' | 'daraja' | 'print'>('reconciliation');
  const [managerPin, setManagerPin] = useState('');
  const [shiftFinalized, setShiftFinalized] = useState(false);

  const physicalCashTotal = denominations.reduce((acc, d) => acc + d.unitValue * d.count, 0);
  const openingFloat = 5000;
  const netSafeDrop = physicalCashTotal - openingFloat;
  const systemExpectedCash = 54450;
  const variance = physicalCashTotal - systemExpectedCash;

  const handleFinalizeShift = () => {
    if (managerPin !== '4920' && managerPin !== '1234') {
      alert('Enter Manager Authorization PIN (Default: 4920) to lock register');
      return;
    }
    setShiftFinalized(true);
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      <div className="bg-white rounded-xl p-4 border border-[#dae2fd] border-t-4 border-t-[#11bf36] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-sm text-[#131b2e]">
            Shift Register &amp; Daily Closeout (Z-Report)
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Cashier: Faith Wanjiru • Register POS-01</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('print')}
            className="px-3.5 py-1.5 bg-[#eaedff] text-[#003b1b] rounded-lg text-xs font-bold hover:bg-[#d2d9f4] transition-colors cursor-pointer"
          >
            Print 80mm Z-Report
          </button>
          <button
            onClick={handleFinalizeShift}
            disabled={shiftFinalized}
            className="px-4 py-2 bg-[#11bf36] hover:bg-[#0ea82f] text-white rounded-lg text-xs font-bold disabled:opacity-50 transition-all shadow-md cursor-pointer"
          >
            {shiftFinalized ? 'Shift Locked ✓' : 'Lock Till & Finalize'}
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveSubTab('reconciliation')}
          className={`pb-3 relative transition-colors cursor-pointer ${
            activeSubTab === 'reconciliation' ? 'text-[#11bf36]' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Physical Cash Reconciliation
          {activeSubTab === 'reconciliation' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#11bf36]"></span>}
        </button>
        <button
          onClick={() => setActiveSubTab('daraja')}
          className={`pb-3 relative transition-colors cursor-pointer ${
            activeSubTab === 'daraja' ? 'text-[#11bf36]' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Daraja M-Pesa API Audit Stream
          {activeSubTab === 'daraja' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#11bf36]"></span>}
        </button>
      </div>

      {activeSubTab === 'reconciliation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-[#dae2fd] shadow-xs">
            <h3 className="font-bold text-sm text-[#131b2e] mb-3">Physical Cash Denomination Audit</h3>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b text-gray-500 uppercase text-[10px] bg-gray-50">
                  <th className="py-2.5 px-3">Denomination</th>
                  <th className="py-2.5 px-3 text-right">Unit Value</th>
                  <th className="py-2.5 px-3 text-center">Count / Tally</th>
                  <th className="py-2.5 px-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {denominations.map((d) => (
                  <tr key={d.denomination}>
                    <td className="py-2.5 px-3 font-semibold">{d.denomination}</td>
                    <td className="py-2.5 px-3 text-right font-mono">KES {d.unitValue}</td>
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        value={d.count}
                        onChange={(e) =>
                          onUpdateDenominationCount(d.denomination, Math.max(0, parseInt(e.target.value) || 0))
                        }
                        className="w-16 text-center font-mono font-bold text-xs bg-gray-50 border rounded py-1"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#003b1b]">
                      KES {(d.unitValue * d.count).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-xl p-5 border border-[#dae2fd] shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-sm text-[#131b2e]">Manager Lock Authorization</h3>
            <div className="space-y-2">
              <label className="text-gray-600 block">Manager Authorization PIN:</label>
              <input
                type="password"
                value={managerPin}
                onChange={(e) => setManagerPin(e.target.value)}
                placeholder="Enter PIN (4920)"
                className="w-full p-2 bg-gray-50 border rounded font-mono"
              />
            </div>
            <button
              onClick={handleFinalizeShift}
              disabled={shiftFinalized}
              className="w-full py-2.5 bg-[#003b1b] text-[#b1f2be] rounded-xl font-bold disabled:opacity-50"
            >
              {shiftFinalized ? 'Shift Sealed ✓' : 'Confirm Dual-Signature Lock'}
            </button>
          </div>
        </div>
      )}

      {activeSubTab === 'daraja' && (
        <div className="bg-white rounded-xl p-5 border border-[#dae2fd] shadow-xs">
          <h3 className="font-bold text-sm text-[#131b2e] mb-3">M-Pesa Daraja Gateway Real-Time Log</h3>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b text-gray-500 uppercase text-[10px] bg-gray-50">
                <th className="py-2 px-3">Receipt</th>
                <th className="py-2 px-3">Time</th>
                <th className="py-2 px-3">Customer</th>
                <th className="py-2 px-3 text-right">Amount</th>
                <th className="py-2 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono">
              <tr className="hover:bg-gray-50">
                <td className="py-2 px-3 font-bold">QJD8491LK2</td>
                <td className="py-2 px-3 text-gray-500 font-sans">14:28:10</td>
                <td className="py-2 px-3 font-sans">Peter Njoroge Gikunju</td>
                <td className="py-2 px-3 text-right font-bold text-[#003b1b]">KES 9,550</td>
                <td className="py-2 px-3 text-center text-emerald-700 font-bold font-sans">Verified</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
