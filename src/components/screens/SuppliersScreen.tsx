import React, { useState } from 'react';
import { InwardLineItem, ScreenType } from '../../types';

interface SuppliersScreenProps {
  inwardLines: InwardLineItem[];
  onCommitGrnToInventory: () => void;
  onNavigate: (screen: ScreenType) => void;
}

export const SuppliersScreen: React.FC<SuppliersScreenProps> = ({
  inwardLines,
  onCommitGrnToInventory,
  onNavigate,
}) => {
  const [grnCommitted, setGrnCommitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'manifest' | 'pcpb'>('manifest');

  const handleCommit = () => {
    onCommitGrnToInventory();
    setGrnCommitted(true);
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Banner */}
      <div className="bg-white rounded-xl p-4 border border-[#dae2fd] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-sm text-[#131b2e]">
            Inward Goods Delivery Dispatch (#GRN-2024-089)
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Inward Stock & Purchase Orders</p>
        </div>

        <button
          onClick={handleCommit}
          disabled={grnCommitted}
          className="px-4 py-1.5 bg-[#003b1b] text-[#b1f2be] rounded-lg text-xs font-bold disabled:opacity-50"
        >
          {grnCommitted ? 'GRN Inward Committed ✓' : 'Commit GRN to Inventory'}
        </button>
      </div>

      {/* Sub-Tabs */}
      <div className="flex border-b border-gray-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('manifest')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'manifest' ? 'text-[#003b1b]' : 'text-gray-500'
          }`}
        >
          Inward Delivery Manifest
          {activeTab === 'manifest' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#003b1b]"></span>}
        </button>
        <button
          onClick={() => setActiveTab('pcpb')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'pcpb' ? 'text-[#003b1b]' : 'text-gray-500'
          }`}
        >
          PCPB 2D Serialization Validation
          {activeTab === 'pcpb' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#003b1b]"></span>}
        </button>
      </div>

      {activeTab === 'manifest' && (
        <div className="bg-white rounded-xl border border-[#dae2fd] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px] bg-[#faf8ff]">
                  <th className="py-3 px-4">SKU & Specification</th>
                  <th className="py-3 px-4">Batch No & PCPB</th>
                  <th className="py-3 px-4 text-center">Recv / Ord</th>
                  <th className="py-3 px-4 text-right">Extended Cost</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inwardLines.map((line) => (
                  <tr key={line.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-bold text-[#131b2e]">{line.sku}</td>
                    <td className="py-3 px-4 font-mono">{line.batchNo}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold">{line.received} / {line.ordered}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#003b1b]">KES {line.extended.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${line.isFlagged ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {line.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'pcpb' && (
        <div className="bg-white rounded-xl p-5 border border-[#dae2fd] shadow-xs space-y-3 text-xs">
          <h3 className="font-bold text-sm text-[#131b2e]">PCPB Hologram Serialization Verification</h3>
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-900 border border-emerald-200">
            ✓ 4 of 4 Scanned 2D Data Matrix barcodes verified against PCPB Central Hologram Registry.
          </div>
        </div>
      )}
    </div>
  );
};
