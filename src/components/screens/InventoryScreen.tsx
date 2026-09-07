import React, { useState } from 'react';
import { ProductItem, ScreenType } from '../../types';
import { api } from '../../services/api';

interface InventoryScreenProps {
  products: ProductItem[];
  onNavigate: (screen: ScreenType) => void;
  onOpenQuickSale: () => void;
  onReceiveStock: () => void;
  onRefreshData?: () => void;
}

export const InventoryScreen: React.FC<InventoryScreenProps> = ({
  products,
  onNavigate,
  onOpenQuickSale,
  onReceiveStock,
  onRefreshData,
}) => {
  const [filterType, setFilterType] = useState<'All' | 'LowStock' | 'Expiring'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [compactView, setCompactView] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Crop Protection',
    categoryType: 'Fungicides' as ProductItem['categoryType'],
    packageSpec: '500g Sachet',
    actives: '',
    pcpbReg: 'PCPB(CR)',
    supplier: 'Syngenta East Africa',
    batchNo: `BT-${Math.floor(1000 + Math.random() * 9000)}`,
    expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    stockCount: 50,
    unit: 'Sachets',
    minStock: 10,
    costPrice: 950,
    retailPrice: 1250,
    shelfLocation: 'Shelf B-12',
  });

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.retailPrice) {
      setStatusMessage({ text: 'Please fill in Product Name and Retail Price.', isError: true });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const expDate = new Date(formData.expiryDate);
      const daysToExpiry = Math.max(1, Math.ceil((expDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
      const cost = Number(formData.costPrice) || 0;
      const retail = Number(formData.retailPrice) || 0;
      const margin = retail > 0 ? Math.round(((retail - cost) / retail) * 100) : 0;

      await api.createProduct({
        name: formData.name.trim(),
        category: formData.category,
        categoryType: formData.categoryType,
        packageSpec: formData.packageSpec.trim(),
        actives: formData.actives.trim() || 'Proprietary Blend',
        pcpbReg: formData.pcpbReg.trim(),
        supplier: formData.supplier.trim(),
        batchNo: formData.batchNo.trim(),
        expiryDate: formData.expiryDate,
        daysToExpiry,
        stockCount: Number(formData.stockCount) || 0,
        unit: formData.unit.trim() || 'Units',
        minStock: Number(formData.minStock) || 5,
        costPrice: cost,
        retailPrice: retail,
        marginPercent: margin,
        taxExempt: false,
        urgent: false,
        shelfLocation: formData.shelfLocation.trim(),
        kephisTagged: formData.categoryType === 'Hybrid Seeds',
      });

      if (onRefreshData) {
        await onRefreshData();
      }

      setShowAddModal(false);
      setFormData({
        name: '',
        category: 'Crop Protection',
        categoryType: 'Fungicides',
        packageSpec: '500g Sachet',
        actives: '',
        pcpbReg: 'PCPB(CR)',
        supplier: 'Syngenta East Africa',
        batchNo: `BT-${Math.floor(1000 + Math.random() * 9000)}`,
        expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
        stockCount: 50,
        unit: 'Sachets',
        minStock: 10,
        costPrice: 950,
        retailPrice: 1250,
        shelfLocation: 'Shelf B-12',
      });
      setStatusMessage({ text: `Product "${formData.name}" added to inventory successfully!`, isError: false });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      setStatusMessage({ text: err?.message || 'Failed to add product to inventory', isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesFilter =
      filterType === 'All'
        ? true
        : filterType === 'LowStock'
        ? p.stockCount <= p.minStock
        : p.daysToExpiry <= 90;

    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.actives.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.pcpbReg.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const lowStockCount = products.filter((p) => p.stockCount <= p.minStock).length;
  const expiringCount = products.filter((p) => p.daysToExpiry <= 90).length;

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white rounded-xl p-4 border border-[#dae2fd] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-sm text-[#131b2e]">
            Regulated Inventory & Batch Dispensary
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Active Store Inventory & Stock Batches</p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 bg-[#11bf36] hover:bg-[#0ea82f] text-white rounded-lg font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span>
            <span>Add New Product</span>
          </button>
          <button
            onClick={() => setCompactView(!compactView)}
            className="px-3.5 py-1.5 bg-[#eaedff] text-[#003b1b] rounded-lg font-bold hover:bg-[#d8defa] transition-colors cursor-pointer"
          >
            {compactView ? 'Switch to Full Regulatory Audit View' : 'Switch to Compact View'}
          </button>
          <button
            onClick={onReceiveStock}
            className="px-3.5 py-1.5 bg-[#f2f3ff] text-[#006a61] border border-gray-200 rounded-lg font-bold flex items-center gap-1 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add_box</span>
            <span>Receive Stock (GRN)</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between ${
            statusMessage.isError
              ? 'bg-red-50 text-red-800 border-red-200'
              : 'bg-[#eaf8ed] text-[#003b1b] border-[#11bf36]/30'
          }`}
        >
          <span>{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl p-3 border border-[#dae2fd] shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('All')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filterType === 'All' ? 'bg-[#11bf36] text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Products ({products.length})
          </button>
          <button
            onClick={() => setFilterType('LowStock')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filterType === 'LowStock' ? 'bg-red-700 text-white' : 'bg-red-50 text-red-700'
            }`}
          >
            Safety Deficit ({lowStockCount})
          </button>
          <button
            onClick={() => setFilterType('Expiring')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filterType === 'Expiring' ? 'bg-amber-700 text-white' : 'bg-amber-50 text-amber-800'
            }`}
          >
            Shelf-Life Risk &lt;90d ({expiringCount})
          </button>
        </div>

        <div className="relative w-64">
          <span className="material-symbols-outlined absolute left-2.5 top-2 text-gray-400 text-base">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SKU, active, PCPB..."
            className="w-full pl-8 pr-3 py-1 text-xs bg-gray-50 border border-gray-200 rounded-lg"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#dae2fd] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px] bg-[#faf8ff]">
                <th className="py-3 px-4">SKU & Category</th>
                {!compactView && <th className="py-3 px-4">Active Ingredients & PCPB</th>}
                {!compactView && <th className="py-3 px-4">Supplier & Batch</th>}
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4 text-center">Stock</th>
                <th className="py-3 px-4 text-right">Retail Price</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((p) => {
                const isUnderMin = p.stockCount <= p.minStock;
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#131b2e]">{p.name}</div>
                      <div className="text-[10px] text-gray-500">{p.category} • {p.packageSpec}</div>
                    </td>

                    {!compactView && (
                      <td className="py-3 px-4">
                        <div className="text-gray-800">{p.actives}</div>
                        <div className="text-[10px] font-mono text-gray-500">{p.pcpbReg}</div>
                      </td>
                    )}

                    {!compactView && (
                      <td className="py-3 px-4">
                        <div className="text-gray-800">{p.supplier}</div>
                        <div className="text-[10px] font-mono text-gray-500">{p.batchNo}</div>
                      </td>
                    )}

                    <td className="py-3 px-4 font-mono font-medium">
                      {p.expiryDate}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`font-mono font-bold ${isUnderMin ? 'text-red-700' : 'text-[#131b2e]'}`}>
                        {p.stockCount} {p.unit}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-[#003b1b]">
                      KES {p.retailPrice.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={onOpenQuickSale}
                        className="px-2.5 py-1 bg-[#eaedff] text-[#003b1b] rounded text-[11px] font-bold"
                      >
                        Sell POS
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-[#dae2fd] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <h3 className="font-playfair font-bold text-lg text-[#131b2e]">Add New Regulated Inventory Item</h3>
                <p className="text-xs text-gray-500">Register product SKU, regulatory PCPB tags & initial stock batch</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Commercial Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Ridomil Gold MZ 68 WG"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006a61] focus:bg-white text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category Type</label>
                  <select
                    value={formData.categoryType}
                    onChange={(e) => setFormData({ ...formData, categoryType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006a61] focus:bg-white text-xs font-semibold"
                  >
                    <option value="Fungicides">Fungicides</option>
                    <option value="Insecticides">Insecticides</option>
                    <option value="Fertilizers">Fertilizers</option>
                    <option value="Hybrid Seeds">Hybrid Seeds</option>
                    <option value="Veterinary">Veterinary</option>
                    <option value="Foliar">Foliar Feed</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Packaging Spec</label>
                  <input
                    type="text"
                    placeholder="e.g., 500g Sachet / 1L Bottle"
                    value={formData.packageSpec}
                    onChange={(e) => setFormData({ ...formData, packageSpec: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006a61] focus:bg-white text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">PCPB / KEPHIS Reg No.</label>
                  <input
                    type="text"
                    placeholder="e.g., PCPB(CR)0482"
                    value={formData.pcpbReg}
                    onChange={(e) => setFormData({ ...formData, pcpbReg: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006a61] focus:bg-white text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Active Chemical Compounds</label>
                  <input
                    type="text"
                    placeholder="e.g., Metalaxyl-M 40g/kg + Mancozeb"
                    value={formData.actives}
                    onChange={(e) => setFormData({ ...formData, actives: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006a61] focus:bg-white text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Authorized Supplier / Importer</label>
                  <input
                    type="text"
                    placeholder="e.g., Syngenta East Africa"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006a61] focus:bg-white text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Batch Number</label>
                  <input
                    type="text"
                    placeholder="e.g., SYN-2026-904"
                    value={formData.batchNo}
                    onChange={(e) => setFormData({ ...formData, batchNo: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006a61] focus:bg-white text-xs font-semibold font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Batch Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006a61] focus:bg-white text-xs font-semibold font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Shelf Location</label>
                  <input
                    type="text"
                    placeholder="e.g., Shelf B-04"
                    value={formData.shelfLocation}
                    onChange={(e) => setFormData({ ...formData, shelfLocation: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006a61] focus:bg-white text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#faf8ff] p-3 rounded-xl border border-[#dae2fd]">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Initial Stock Count</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stockCount}
                    onChange={(e) => setFormData({ ...formData, stockCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006a61] text-xs font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Unit of Measure</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006a61] text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Cost Price (KES)</label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006a61] text-xs font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#003b1b] mb-1">Retail Price (KES) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="10"
                    value={formData.retailPrice}
                    onChange={(e) => setFormData({ ...formData, retailPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006a61] text-xs font-bold font-mono text-[#003b1b]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#11bf36] hover:bg-[#0ea82f] text-white font-bold rounded-lg flex items-center gap-1.5 disabled:opacity-60 shadow-md cursor-pointer transition-all"
                >
                  <span className="material-symbols-outlined text-sm">save</span>
                  <span>{isSubmitting ? 'Adding...' : 'Save & Stock SKU'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
