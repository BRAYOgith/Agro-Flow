import React, { useState } from 'react';
import { FarmerRecord } from '../../types';

interface CreditLedgerScreenProps {
  farmers: FarmerRecord[];
  onRecordRepayment: (farmerId: string, amount: number, channel: string, ref: string) => void;
  onSendSmsReminder: (farmer: FarmerRecord) => void;
}

export const CreditLedgerScreen: React.FC<CreditLedgerScreenProps> = ({
  farmers,
  onRecordRepayment,
  onSendSmsReminder,
}) => {
  const [filterTab, setFilterTab] = useState<'All' | 'Current' | 'DueSoon' | 'Overdue'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFarmerForPayment, setActiveFarmerForPayment] = useState<FarmerRecord | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(10000);
  const [paymentChannel, setPaymentChannel] = useState<'M-Pesa' | 'Cash' | 'Bank'>('M-Pesa');
  const [receiptRef, setReceiptRef] = useState('QJD8910LM4');

  const filteredFarmers = farmers.filter((f) => {
    const matchesFilter =
      filterTab === 'All'
        ? true
        : filterTab === 'Current'
        ? f.status === 'good'
        : filterTab === 'DueSoon'
        ? f.status === 'due-soon'
        : f.status === 'overdue';

    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.phone.includes(searchQuery) ||
      f.cooperative.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalReceivables = farmers.reduce((sum, f) => sum + f.outstandingBalance, 0);

  const handleConfirmPayment = () => {
    if (!activeFarmerForPayment || paymentAmount <= 0) return;
    onRecordRepayment(
      activeFarmerForPayment.id,
      paymentAmount,
      paymentChannel,
      receiptRef
    );
    setActiveFarmerForPayment(null);
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      <div className="bg-white rounded-xl p-4 border border-[#dae2fd] border-t-4 border-t-[#11bf36] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">
            Total Farmer Receivables Book
          </span>
          <div className="text-2xl font-extrabold text-[#131b2e] font-mono mt-0.5">
            KES {totalReceivables.toLocaleString()}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-60">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-gray-400 text-base">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search farmer or co-op..."
              className="w-full pl-8 pr-3 py-1 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#11bf36]"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={() => setFilterTab('All')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${filterTab === 'All' ? 'bg-[#003b1b] text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          All Smallholders ({farmers.length})
        </button>
        <button
          onClick={() => setFilterTab('Current')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${filterTab === 'Current' ? 'bg-[#11bf36] text-white shadow-xs' : 'bg-[#eaf8ed] text-[#003b1b] hover:bg-[#d2f5db]'}`}
        >
          Current ({farmers.filter((f) => f.status === 'good').length})
        </button>
        <button
          onClick={() => setFilterTab('Overdue')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${filterTab === 'Overdue' ? 'bg-red-700 text-white shadow-xs' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}
        >
          Overdue ({farmers.filter((f) => f.status === 'overdue').length})
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#dae2fd] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px] bg-[#faf8ff]">
                <th className="py-3 px-4">Farmer / Smallholder</th>
                <th className="py-3 px-4">Co-operative & Crop</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Outstanding</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredFarmers.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#131b2e]">{f.name}</div>
                    <div className="text-[10px] text-gray-500">{f.phone} • {f.location}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-900 font-medium">{f.cooperative}</div>
                    <div className="text-[10px] text-gray-500">{f.crops}</div>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium">
                    {f.dueDate}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-sm text-[#003b1b]">
                    KES {f.outstandingBalance.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => {
                          setActiveFarmerForPayment(f);
                          setPaymentAmount(Math.min(10000, f.outstandingBalance));
                        }}
                        className="px-3 py-1 bg-[#11bf36] hover:bg-[#0ea82f] text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        Collect / Pay
                      </button>
                      <button
                        onClick={() => onSendSmsReminder(f)}
                        className="p-1 text-gray-500 hover:text-[#11bf36] transition-colors cursor-pointer"
                        title="Send SMS"
                      >
                        <span className="material-symbols-outlined text-base">send_to_mobile</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {activeFarmerForPayment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end">
          <div className="bg-white w-full max-w-md h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="font-bold text-sm text-[#131b2e]">Record Repayment</h3>
                <button onClick={() => setActiveFarmerForPayment(null)} className="text-gray-400">✕</button>
              </div>

              <div className="bg-[#f2f3ff] p-3 rounded-lg border border-[#dae2fd]">
                <div className="font-bold text-sm">{activeFarmerForPayment.name}</div>
                <div className="text-gray-500">{activeFarmerForPayment.cooperative}</div>
                <div className="mt-2 font-mono font-bold text-base text-red-700">
                  Balance: KES {activeFarmerForPayment.outstandingBalance.toLocaleString()}
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Repayment Amount (KES):</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full p-2 bg-gray-50 border rounded font-mono font-bold text-sm focus:ring-2 focus:ring-[#11bf36] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setPaymentChannel('M-Pesa')} className={`py-1.5 rounded font-bold border cursor-pointer ${paymentChannel === 'M-Pesa' ? 'bg-[#11bf36] text-white border-[#11bf36]' : 'bg-gray-50 hover:bg-gray-100'}`}>M-Pesa</button>
                <button onClick={() => setPaymentChannel('Cash')} className={`py-1.5 rounded font-bold border cursor-pointer ${paymentChannel === 'Cash' ? 'bg-[#11bf36] text-white border-[#11bf36]' : 'bg-gray-50 hover:bg-gray-100'}`}>Cash</button>
                <button onClick={() => setPaymentChannel('Bank')} className={`py-1.5 rounded font-bold border cursor-pointer ${paymentChannel === 'Bank' ? 'bg-[#11bf36] text-white border-[#11bf36]' : 'bg-gray-50 hover:bg-gray-100'}`}>Bank</button>
              </div>

              <div>
                <label className="text-gray-600 block mb-1">Receipt Reference:</label>
                <input type="text" value={receiptRef} onChange={(e) => setReceiptRef(e.target.value)} className="w-full p-1.5 bg-gray-50 border rounded font-mono focus:ring-2 focus:ring-[#11bf36] focus:outline-none" />
              </div>
            </div>

            <div className="pt-4 border-t flex gap-2">
              <button onClick={() => setActiveFarmerForPayment(null)} className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded font-bold text-xs cursor-pointer">Cancel</button>
              <button onClick={handleConfirmPayment} className="flex-1 py-2 bg-[#11bf36] hover:bg-[#0ea82f] text-white rounded font-bold text-xs shadow-md transition-all cursor-pointer">Confirm Repayment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
