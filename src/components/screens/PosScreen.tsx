import React, { useState } from 'react';
import { ProductItem, CartItem, FarmerRecord } from '../../types';

interface PosScreenProps {
  products: ProductItem[];
  cart: CartItem[];
  onAddToCart: (product: ProductItem) => void;
  onUpdateCartQty: (productId: string, delta: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  farmers: FarmerRecord[];
  onCompleteSale: (saleData: {
    cart: CartItem[];
    farmer: FarmerRecord | null;
    paymentMethod: 'M-Pesa' | 'Cash' | 'Credit';
    mpesaPhone: string;
    cashTendered: number;
    sendSms: boolean;
  }) => void;
  isLocked?: boolean;
  onOpenSubscriptionModal?: () => void;
}

export const PosScreen: React.FC<PosScreenProps> = ({
  products,
  cart,
  onAddToCart,
  onUpdateCartQty,
  onRemoveFromCart,
  onClearCart,
  farmers,
  onCompleteSale,
  isLocked = false,
  onOpenSubscriptionModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>(farmers[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<'M-Pesa' | 'Cash' | 'Credit'>('M-Pesa');
  const [mpesaPhone, setMpesaPhone] = useState('0722491802');
  const [cashTendered, setCashTendered] = useState<number>(16000);
  const [sendSms, setSendSms] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [activeInfoProduct, setActiveInfoProduct] = useState<ProductItem | null>(null);

  const selectedFarmer = farmers.find((f) => f.id === selectedFarmerId) || null;
  const categories = ['All', 'Fungicides', 'Insecticides', 'Fertilizers', 'Hybrid Seeds', 'Foliar', 'Hardware'];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory || p.categoryType === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.actives.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.pcpbReg.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const subtotal = cart.reduce((acc, item) => acc + item.product.retailPrice * item.quantity, 0);

  const handleComplete = () => {
    if (cart.length === 0) return;
    onCompleteSale({
      cart,
      farmer: selectedFarmer,
      paymentMethod,
      mpesaPhone,
      cashTendered,
      sendSms,
    });
    setShowCheckoutModal(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-6.5rem)] select-none">
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-[#dae2fd] shadow-xs overflow-hidden">
        <div className="bg-[#f2f3ff] p-3 border-b border-[#dae2fd] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white bg-[#11bf36] px-2.5 py-0.5 rounded text-[11px] shadow-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              POS-01 ONLINE
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono font-semibold text-gray-600">
            <span className="bg-white px-1.5 py-0.5 rounded border border-gray-200">[F1] Clear</span>
            <span className="bg-white px-1.5 py-0.5 rounded border border-gray-200">[F3] Search</span>
            <span className="bg-[#11bf36] text-white px-2 py-0.5 rounded font-bold">[F9] Pay</span>
          </div>
        </div>

        <div className="p-3 border-b border-[#dae2fd] space-y-2.5">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-lg">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Scan barcode or search SKU, active ingredient, PCPB reg..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#faf8ff] border border-[#c0c9be] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#11bf36] focus:border-[#11bf36] focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg whitespace-nowrap text-xs font-bold transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#11bf36] text-white shadow-xs'
                    : 'bg-[#eaedff] text-[#131b2e] hover:bg-[#dae2fd]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-3 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 auto-rows-max bg-[#faf8ff]/50">
          {filteredProducts.map((p) => {
            const inCart = cart.find((item) => item.product.id === p.id);
            const isLowStock = p.stockCount <= p.minStock;

            return (
              <div
                key={p.id}
                className="bg-white rounded-xl p-3 border border-[#dae2fd] shadow-xs hover:border-[#11bf36] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-gray-500">
                    <span>{p.category}</span>
                    <button
                      onClick={() => setActiveInfoProduct(p)}
                      className="text-gray-400 hover:text-[#11bf36] p-0.5"
                      title="View Agronomic Info"
                    >
                      <span className="material-symbols-outlined text-sm">info</span>
                    </button>
                  </div>

                  <h4 className="font-bold text-xs text-[#131b2e] mt-1 line-clamp-1">{p.name}</h4>

                  <div className="mt-2 text-[10px] flex items-center justify-between">
                    <span className="text-gray-500">{p.packageSpec}</span>
                    <span className={`font-mono ${isLowStock ? 'text-red-700 font-bold' : 'text-emerald-700 font-medium'}`}>
                      Stock: {p.stockCount} {p.unit}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                  <div className="font-mono font-bold text-sm text-[#003b1b]">
                    KES {p.retailPrice.toLocaleString()}
                  </div>

                  <button
                    onClick={() => onAddToCart(p)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      inCart
                        ? 'bg-[#11bf36]/20 text-[#11bf36] border border-[#11bf36]/40'
                        : 'bg-[#11bf36] text-white hover:bg-[#0ea82f]'
                    }`}
                  >
                    {inCart ? `+ (${inCart.quantity})` : 'Add'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full lg:w-80 flex flex-col bg-white rounded-xl border border-[#dae2fd] shadow-sm overflow-hidden shrink-0">
        <div className="p-3 bg-[#f2f3ff] border-b border-[#dae2fd] flex items-center justify-between">
          <span className="font-bold text-xs text-[#131b2e] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base text-[#006a61]">shopping_cart</span>
            Active Sale Ticket
          </span>
          {cart.length > 0 && (
            <button onClick={onClearCart} className="text-[10px] font-semibold text-red-600 hover:underline">
              Clear [F1]
            </button>
          )}
        </div>

        <div className="flex-1 p-3 overflow-y-auto divide-y divide-gray-100">
          {cart.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center text-gray-400">
              <span className="material-symbols-outlined text-3xl mb-1 text-gray-300">shopping_basket</span>
              <p className="text-xs font-medium">Cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="py-2 flex items-center justify-between text-xs">
                <div className="flex-1 min-w-0 pr-2">
                  <div className="font-semibold text-[#131b2e] truncate">{item.product.name}</div>
                  <div className="text-[10px] text-gray-500">KES {item.product.retailPrice.toLocaleString()}</div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center border rounded bg-gray-50">
                    <button
                      onClick={() => onUpdateCartQty(item.product.id, -1)}
                      className="w-5 h-5 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-mono font-bold text-xs">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateCartQty(item.product.id, 1)}
                      className="w-5 h-5 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>

                  <div className="font-mono font-bold text-xs text-[#131b2e]">
                    KES {(item.product.retailPrice * item.quantity).toLocaleString()}
                  </div>

                  <button onClick={() => onRemoveFromCart(item.product.id)} className="text-gray-400 hover:text-red-600">
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3 bg-[#faf8ff] border-t border-[#dae2fd] space-y-3">
          <div className="flex justify-between text-base font-extrabold text-[#003b1b]">
            <span>Total Payable</span>
            <span className="font-mono">KES {subtotal.toLocaleString()}</span>
          </div>

          <button
            onClick={() => setShowCheckoutModal(true)}
            disabled={cart.length === 0}
            className="w-full py-3.5 bg-[#11bf36] hover:bg-[#0ea82f] text-white disabled:opacity-50 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="material-symbols-outlined text-base">payments</span>
            <span>Proceed to Payment Checkout [F9]</span>
          </button>
        </div>
      </div>

      {activeInfoProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-4 shadow-2xl space-y-3 text-xs">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm text-[#131b2e]">{activeInfoProduct.name}</h3>
              <button onClick={() => setActiveInfoProduct(null)} className="text-gray-400">✕</button>
            </div>
            <div className="space-y-1.5">
              <div><span className="text-gray-500">Active Ingredients:</span> <strong>{activeInfoProduct.actives}</strong></div>
              <div><span className="text-gray-500">PCPB Registration:</span> <span className="font-mono font-bold">{activeInfoProduct.pcpbReg}</span></div>
              <div><span className="text-gray-500">Supplier:</span> <strong>{activeInfoProduct.supplier}</strong></div>
              <div><span className="text-gray-500">Shelf Location:</span> <strong>{activeInfoProduct.shelfLocation}</strong></div>
              {activeInfoProduct.dosageNote && (
                <div className="p-2 bg-amber-50 text-amber-900 rounded border border-amber-200 mt-2">
                  💡 {activeInfoProduct.dosageNote}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 text-xs animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm text-[#131b2e]">Counter Checkout & Payment</h3>
              <button onClick={() => setShowCheckoutModal(false)} className="text-gray-400 font-bold">✕</button>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-700 block">Customer Account:</label>
              <select
                value={selectedFarmerId}
                onChange={(e) => {
                  setSelectedFarmerId(e.target.value);
                  const found = farmers.find((f) => f.id === e.target.value);
                  if (found) setMpesaPhone(found.phone.replace('+254', '0').replace(/\s+/g, ''));
                }}
                className="w-full text-xs font-semibold text-[#131b2e] bg-gray-50 border border-gray-200 rounded-lg p-2"
              >
                {farmers.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.cooperative}) - Bal: KES {f.outstandingBalance.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPaymentMethod('M-Pesa')}
                className={`py-2 rounded-lg font-bold border ${
                  paymentMethod === 'M-Pesa' ? 'bg-[#003b1b] text-white' : 'bg-gray-50 text-gray-700'
                }`}
              >
                M-Pesa
              </button>
              <button
                onClick={() => setPaymentMethod('Cash')}
                className={`py-2 rounded-lg font-bold border ${
                  paymentMethod === 'Cash' ? 'bg-[#003b1b] text-white' : 'bg-gray-50 text-gray-700'
                }`}
              >
                Cash
              </button>
              <button
                onClick={() => setPaymentMethod('Credit')}
                className={`py-2 rounded-lg font-bold border ${
                  paymentMethod === 'Credit' ? 'bg-[#003b1b] text-white' : 'bg-gray-50 text-gray-700'
                }`}
              >
                Credit Book
              </button>
            </div>

            {paymentMethod === 'M-Pesa' && (
              <div className="space-y-1">
                <label className="text-gray-600 block">M-Pesa Phone Number:</label>
                <input
                  type="text"
                  value={mpesaPhone}
                  onChange={(e) => setMpesaPhone(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded font-mono font-bold"
                />
              </div>
            )}

            {paymentMethod === 'Cash' && (
              <div className="space-y-1">
                <label className="text-gray-600 block">Cash Tendered (KES):</label>
                <input
                  type="number"
                  value={cashTendered}
                  onChange={(e) => setCashTendered(Number(e.target.value))}
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded font-mono font-bold"
                />
              </div>
            )}

            <div className="p-3 bg-emerald-50 rounded-xl flex justify-between font-extrabold text-sm text-[#003b1b]">
              <span>Gross Payable:</span>
              <span className="font-mono">KES {subtotal.toLocaleString()}</span>
            </div>

            {isLocked ? (
              <div className="space-y-2 pt-1">
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-950 text-xs">
                  <div className="font-bold flex items-center gap-1 text-red-900">
                    <span className="material-symbols-outlined text-sm">lock</span>
                    <span>Store Operating License Expired (Locked)</span>
                  </div>
                  <p className="mt-1">
                    Your store subscription has expired. Please top up your daily license fee to unlock the POS checkout counter.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowCheckoutModal(false);
                    if (onOpenSubscriptionModal) onOpenSubscriptionModal();
                  }}
                  className="w-full py-3 bg-[#003b1b] text-[#b1f2be] font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer hover:bg-[#14532d]"
                >
                  <span className="material-symbols-outlined text-base">payments</span>
                  <span>Top Up License via M-Pesa</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleComplete}
                className="w-full py-3.5 bg-[#11bf36] hover:bg-[#0ea82f] text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                <span className="material-symbols-outlined text-base">print</span>
                <span>Complete Sale &amp; Print 80mm Receipt</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
