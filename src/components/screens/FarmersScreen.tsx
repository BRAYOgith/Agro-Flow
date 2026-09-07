import React, { useState } from 'react';
import { FarmerRecord, ProductItem, ScreenType } from '../../types';
import { api } from '../../services/api';

interface FarmersScreenProps {
  farmers: FarmerRecord[];
  products: ProductItem[];
  onNavigate: (screen: ScreenType) => void;
  onPushPrescriptionToCart: (items: { product: ProductItem; quantity: number }[]) => void;
  onRefreshData?: () => void;
}

export const FarmersScreen: React.FC<FarmersScreenProps> = ({
  farmers,
  products,
  onNavigate,
  onPushPrescriptionToCart,
  onRefreshData,
}) => {
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>(farmers[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'profile' | 'advisory' | 'directory'>('profile');
  const [showTankMixModal, setShowTankMixModal] = useState(false);
  const [showAddFarmerModal, setShowAddFarmerModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    nationalId: '',
    location: 'Kerugoya Central',
    crops: 'Tomatoes, French Beans',
    cooperative: 'Kirinyaga Central Farmers Co-op',
    coopMemberNo: '',
    creditLimit: 30000,
    notes: '',
  });

  const currentFarmer = farmers.find((f) => f.id === selectedFarmerId) || farmers[0];

  const handleRegisterFarmer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.nationalId.trim()) {
      setStatusMessage({ text: 'Please fill in Name, Phone, and National ID.', isError: true });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const generatedId = `FARM-${Math.floor(1000 + Math.random() * 9000)}`;
      const memberNo = formData.coopMemberNo.trim() || `MBR-${Math.floor(100 + Math.random() * 900)}`;

      await api.createFarmer({
        id: generatedId,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        nationalId: formData.nationalId.trim(),
        location: formData.location.trim(),
        crops: formData.crops.trim(),
        cooperative: formData.cooperative.trim(),
        coopMemberNo: memberNo,
        verificationStatus: 'KYC Verified',
        creditLimit: Number(formData.creditLimit) || 20000,
        outstandingBalance: 0,
        dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        daysOverdue: 0,
        lastPurchaseDate: new Date().toISOString().split('T')[0],
        status: 'good',
        notes: formData.notes.trim() || 'New smallholder account registered at POS counter.',
        acreage: 0,
      });

      if (onRefreshData) {
        await onRefreshData();
      }

      setSelectedFarmerId(generatedId);
      setShowAddFarmerModal(false);
      setFormData({
        name: '',
        phone: '',
        nationalId: '',
        location: 'Kerugoya Central',
        crops: 'Tomatoes, French Beans',
        cooperative: 'Kirinyaga Central Farmers Co-op',
        coopMemberNo: '',
        creditLimit: 30000,
        notes: '',
      });
      setStatusMessage({ text: `Farmer ${formData.name} successfully registered!`, isError: false });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      setStatusMessage({ text: err?.message || 'Failed to register farmer', isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const prescriptionItems = [
    {
      productId: 'prod-01',
      qty: 2,
      target: 'Curative Early Blight & Downy Mildew knockdown',
      sprayTiming: 'Day 1 (Immediate)',
    },
    {
      productId: 'prod-02',
      qty: 1,
      target: 'Tuta Absoluta and Leafminer larvae suppression',
      sprayTiming: 'Day 4 Morning',
    },
    {
      productId: 'prod-07',
      qty: 1,
      target: 'Potassium boost for fruit sizing and blossom retention',
      sprayTiming: 'Day 6 Fertigation',
    },
    {
      productId: 'prod-08',
      qty: 2,
      target: 'Blossom end rot prevention and calcium translocation',
      sprayTiming: 'Day 8 Foliar',
    },
  ];

  const handlePushToCart = () => {
    const cartItems = prescriptionItems
      .map((item) => {
        const prod = products.find((p) => p.id === item.productId);
        return { product: prod!, quantity: item.qty };
      })
      .filter((i) => i.product);

    onPushPrescriptionToCart(cartItems);
    onNavigate('sales-pos');
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {statusMessage && (
        <div
          className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between ${
            statusMessage.isError
              ? 'bg-red-50 text-red-800 border-red-200'
              : 'bg-emerald-50 text-emerald-900 border-emerald-200'
          }`}
        >
          <span>{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl p-4 border border-[#dae2fd] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-500">Active Smallholder Account:</span>
          <select
            value={selectedFarmerId}
            onChange={(e) => setSelectedFarmerId(e.target.value)}
            className="text-xs font-bold text-[#131b2e] bg-[#f2f3ff] border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#006a61]"
          >
            {farmers.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.location}) • {f.crops}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setShowAddFarmerModal(true)}
            className="px-3.5 py-2 bg-[#11bf36] hover:bg-[#0ea82f] text-white font-bold rounded-lg flex items-center gap-1.5 shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="material-symbols-outlined text-sm">person_add</span>
            <span>Register New Farmer</span>
          </button>
          <button
            onClick={() => onNavigate('credit-debt-ledger')}
            className="px-3 py-2 bg-[#f2f3ff] text-[#006a61] border border-gray-200 rounded-lg hover:bg-gray-100 font-semibold transition-colors"
          >
            Credit Ledger Book
          </button>
          <button
            onClick={() => onNavigate('sales-pos')}
            className="px-3.5 py-2 bg-[#b1f2be] text-[#00210d] font-bold rounded-lg hover:bg-[#87c695] transition-colors"
          >
            Open POS
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'profile' ? 'text-[#003b1b]' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Customer Profile & Accounts
          {activeTab === 'profile' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#003b1b]"></span>}
        </button>
        <button
          onClick={() => setActiveTab('advisory')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'advisory' ? 'text-[#003b1b]' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Input Prescriptions & Protocols
          {activeTab === 'advisory' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#003b1b]"></span>}
        </button>
        <button
          onClick={() => setActiveTab('directory')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'directory' ? 'text-[#003b1b]' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Farmer Directory ({farmers.length})
          {activeTab === 'directory' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#003b1b]"></span>}
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#dae2fd] shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="font-playfair text-2xl font-bold text-[#131b2e]">{currentFarmer?.name}</h2>
                <span className="text-xs font-semibold text-[#003b1b] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {currentFarmer?.verificationStatus || 'KYC Verified'}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Phone: <strong className="text-gray-800">{currentFarmer?.phone}</strong> • Kenyan Nat ID: <strong className="text-gray-800">{currentFarmer?.nationalId}</strong>
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded">
                  Block: <strong>{currentFarmer?.location || 'Kirinyaga Central'}</strong>
                </span>
                <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded">
                  Crops: <strong>{currentFarmer?.crops || 'General Cash Crops'}</strong>
                </span>
                <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded">
                  Co-op: <strong>{currentFarmer?.cooperative} ({currentFarmer?.coopMemberNo})</strong>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 shrink-0">
              <div className="bg-[#f2f3ff] p-3 rounded-xl border border-[#dae2fd] text-center min-w-[110px]">
                <span className="text-[10px] uppercase font-bold text-gray-500">Credit Limit</span>
                <div className="font-mono font-bold text-base text-[#131b2e]">
                  KES {(currentFarmer?.creditLimit || 0).toLocaleString()}
                </div>
              </div>
              <div className="bg-[#f2f3ff] p-3 rounded-xl border border-[#dae2fd] text-center min-w-[110px]">
                <span className="text-[10px] uppercase font-bold text-gray-500">Outstanding Due</span>
                <div className="font-mono font-bold text-base text-red-700">
                  KES {(currentFarmer?.outstandingBalance || 0).toLocaleString()}
                </div>
              </div>
              <div className="bg-[#f2f3ff] p-3 rounded-xl border border-[#dae2fd] text-center min-w-[110px]">
                <span className="text-[10px] uppercase font-bold text-gray-500">Credit Avail</span>
                <div className="font-mono font-bold text-base text-[#003b1b]">
                  KES {((currentFarmer?.creditLimit || 0) - (currentFarmer?.outstandingBalance || 0)).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 border border-[#dae2fd] shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-[#131b2e]">Customer KYC & Cooperative Ties</h3>
              <div className="text-xs space-y-2 text-gray-700">
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-gray-500">Cooperative Society:</span>
                  <span className="font-semibold">{currentFarmer?.cooperative}</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-gray-500">Co-op Member Number:</span>
                  <span className="font-mono font-semibold">{currentFarmer?.coopMemberNo}</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-gray-500">Payment Due Date:</span>
                  <span className="font-semibold">{currentFarmer?.dueDate || 'End of Month'}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-gray-500">Last Purchase Recorded:</span>
                  <span className="font-semibold">{currentFarmer?.lastPurchaseDate || 'Recent'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-[#dae2fd] shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-[#131b2e]">Duka Notes & Agronomic Profile</h3>
              <p className="text-xs text-gray-600 leading-relaxed bg-[#f2f3ff] p-3 rounded-lg border border-[#dae2fd]">
                {currentFarmer?.notes || 'Customer in good standing. Eligible for seasonal store credit.'}
              </p>
              <div className="text-xs text-gray-500 flex items-center gap-1.5 pt-1">
                <span className="material-symbols-outlined text-sm text-emerald-700">check_circle</span>
                <span>Eligible for 30-day revolving store credit backed by cooperative guarantee.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'advisory' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 border border-[#dae2fd] shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-[#131b2e]">Prescribed Crop Input Protocol</h3>
                <p className="text-xs text-gray-500 mt-0.5">Recommended package for {currentFarmer?.name} ({currentFarmer?.crops})</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowTankMixModal(true)}
                  className="px-3 py-1.5 bg-[#eaedff] text-[#003b1b] rounded-lg text-xs font-bold hover:bg-[#d8defa] transition-colors"
                >
                  View 20L Tank Mixing Matrix
                </button>
                <button
                  onClick={handlePushToCart}
                  className="px-3.5 py-1.5 bg-[#003b1b] text-[#b1f2be] rounded-lg text-xs font-bold hover:bg-[#14532d] transition-colors"
                >
                  Push to Cart [F2]
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px] bg-gray-50">
                    <th className="py-2.5 px-3">Target Product</th>
                    <th className="py-2.5 px-3">Objective</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {prescriptionItems.map((item) => {
                    const prod = products.find((p) => p.id === item.productId);
                    if (!prod) return null;
                    return (
                      <tr key={item.productId} className="hover:bg-gray-50">
                        <td className="py-2.5 px-3 font-bold text-[#131b2e]">{prod.name}</td>
                        <td className="py-2.5 px-3 text-gray-600">{item.target}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold">{item.qty} {prod.unit}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold">
                          KES {(prod.retailPrice * item.qty).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'directory' && (
        <div className="bg-white rounded-xl border border-[#dae2fd] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#131b2e]">Registered Smallholders & Customer Accounts</h3>
            <button
              onClick={() => setShowAddFarmerModal(true)}
              className="px-3 py-1.5 bg-[#003b1b] text-[#b1f2be] text-xs font-bold rounded-lg hover:bg-[#14532d] flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Register Farmer</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px] bg-[#faf8ff]">
                  <th className="py-3 px-4">Smallholder Name</th>
                  <th className="py-3 px-4">Phone & National ID</th>
                  <th className="py-3 px-4">Block & Crops</th>
                  <th className="py-3 px-4">Cooperative</th>
                  <th className="py-3 px-4 text-right">Credit Limit</th>
                  <th className="py-3 px-4 text-right">Balance Due</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {farmers.map((farmer) => (
                  <tr
                    key={farmer.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      farmer.id === selectedFarmerId ? 'bg-emerald-50/40' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-[#131b2e]">{farmer.name}</td>
                    <td className="py-3 px-4 text-gray-600">
                      <div>{farmer.phone}</div>
                      <div className="text-[10px] font-mono text-gray-400">ID: {farmer.nationalId}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      <div>{farmer.location}</div>
                      <div className="text-[10px] text-gray-400">{farmer.crops}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      <div>{farmer.cooperative}</div>
                      <div className="text-[10px] font-mono text-gray-400">{farmer.coopMemberNo}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-gray-800">
                      KES {farmer.creditLimit.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-red-700">
                      KES {farmer.outstandingBalance.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedFarmerId(farmer.id);
                          setActiveTab('profile');
                        }}
                        className="px-2.5 py-1 bg-[#eaedff] text-[#003b1b] rounded text-[11px] font-bold hover:bg-[#d8defa]"
                      >
                        View Account
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAddFarmerModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-[#dae2fd]">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <h3 className="font-playfair font-bold text-lg text-[#131b2e]">Register New Smallholder</h3>
                <p className="text-xs text-gray-500">Create customer profile & initialize credit account</p>
              </div>
              <button
                onClick={() => setShowAddFarmerModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterFarmer} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Jane Wambui Kariuki"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006a61] focus:bg-white text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+254 712 345 678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006a61] focus:bg-white text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">National ID No. *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 28491023"
                    value={formData.nationalId}
                    onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006a61] focus:bg-white text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Agricultural Block / Location</label>
                  <input
                    type="text"
                    placeholder="e.g., Kerugoya Central"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006a61] focus:bg-white text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Primary Cash Crops</label>
                  <input
                    type="text"
                    placeholder="e.g., Tomatoes, French Beans"
                    value={formData.crops}
                    onChange={(e) => setFormData({ ...formData, crops: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006a61] focus:bg-white text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Approved Credit Limit (KES)</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006a61] focus:bg-white text-xs font-semibold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Cooperative Society</label>
                  <input
                    type="text"
                    placeholder="e.g., Kirinyaga Central Farmers Co-op"
                    value={formData.cooperative}
                    onChange={(e) => setFormData({ ...formData, cooperative: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006a61] focus:bg-white text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Cooperative Member No.</label>
                  <input
                    type="text"
                    placeholder="e.g., KC-4921"
                    value={formData.coopMemberNo}
                    onChange={(e) => setFormData({ ...formData, coopMemberNo: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006a61] focus:bg-white text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Account Notes / Credit Guarantor</label>
                <textarea
                  rows={2}
                  placeholder="Special instructions, guarantors, or landmark near homestead..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006a61] focus:bg-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddFarmerModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#11bf36] hover:bg-[#0ea82f] text-white font-bold rounded-lg flex items-center gap-1.5 disabled:opacity-60 shadow-md cursor-pointer transition-all"
                >
                  <span className="material-symbols-outlined text-sm">how_to_reg</span>
                  <span>{isSubmitting ? 'Registering...' : 'Save & Register Farmer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTankMixModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-4 shadow-2xl space-y-3 text-xs">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm text-[#131b2e]">20L Knapsack Tank Mixing Matrix</h3>
              <button onClick={() => setShowTankMixModal(false)} className="text-gray-400">✕</button>
            </div>
            <div className="space-y-2">
              <div className="p-2 bg-emerald-50 rounded">
                <strong>Fungicide Knockdown:</strong> Ridomil Gold (50g) per 20L knapsack.
              </div>
              <div className="p-2 bg-blue-50 rounded">
                <strong>Foliar Bloom Booster:</strong> Multi-K (50g) + EasyGro Ca-B (30g).
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
