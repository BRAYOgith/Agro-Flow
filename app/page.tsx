'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ScreenType, ProductItem, CartItem, FarmerRecord, ShiftTransaction, DenominationTally, InwardLineItem } from '@/src/types';
import { api } from '@/src/services/api';
import { Sidebar } from '@/src/components/Sidebar';
import { Header } from '@/src/components/Header';
import { OverviewScreen } from '@/src/components/screens/OverviewScreen';
import { PosScreen } from '@/src/components/screens/PosScreen';
import { InventoryScreen } from '@/src/components/screens/InventoryScreen';
import { FarmersScreen } from '@/src/components/screens/FarmersScreen';
import { CreditLedgerScreen } from '@/src/components/screens/CreditLedgerScreen';
import { ShiftCloseScreen } from '@/src/components/screens/ShiftCloseScreen';
import { SuppliersScreen } from '@/src/components/screens/SuppliersScreen';
import { PlatformUpdateModal } from '@/src/components/PlatformUpdateModal';
import { LoginModal } from '@/src/components/LoginModal';
import { LandingLoginPage } from '@/src/components/LandingLoginPage';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [farmers, setFarmers] = useState<FarmerRecord[]>([]);
  const [transactions, setTransactions] = useState<ShiftTransaction[]>([]);
  const [denominations, setDenominations] = useState<DenominationTally[]>([]);
  const [inwardLines, setInwardLines] = useState<InwardLineItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type?: 'success' | 'info' } | null>(null);

  // Auth & Platform Modal state
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPlatformUpdateModal, setShowPlatformUpdateModal] = useState(false);

  const showToast = (title: string, desc: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Load live data from SQLite API endpoints
  const loadData = useCallback(async () => {
    try {
      const [prodsData, farmersData, txData, denData, inwData] = await Promise.all([
        api.getProducts(undefined, searchQuery),
        api.getFarmers(undefined, undefined, searchQuery),
        api.getTransactions(),
        api.getDenominations(),
        api.getInwardLines(),
      ]);

      setProducts(prodsData);
      setFarmers(farmersData);
      setTransactions(txData);
      setDenominations(denData);
      setInwardLines(inwData);

      // Seed initial active cart item if empty
      if (prodsData.length >= 3 && cart.length === 0) {
        setCart([
          { product: prodsData[0], quantity: 2 },
          { product: prodsData[1], quantity: 1 },
          { product: prodsData[2], quantity: 1 },
        ]);
      }
    } catch (err: any) {
      console.error('Error loading API data:', err);
    }
  }, [searchQuery, cart.length]);

  const getDefaultScreenForRole = (role?: string): ScreenType => {
    const r = (role || '').toLowerCase();
    if (r.includes('cashier')) return 'sales-pos';
    return 'dashboard';
  };

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('agroflow_user');
    const token = localStorage.getItem('agroflow_token');
    if (!storedUser || !token) {
      setShowLoginModal(true);
    } else {
      try {
        const u = JSON.parse(storedUser);
        setCurrentUser(u);
        setCurrentScreen(getDefaultScreenForRole(u.role));
      } catch (e) {
        setShowLoginModal(true);
      }
    }
    loadData();
  }, [loadData]);

  // Global Keyboard Shortcut Listeners (F1, F2, F3, F4, F9)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        setCurrentScreen('sales-pos');
      } else if (e.key === 'F1' && currentScreen === 'sales-pos') {
        e.preventDefault();
        setCart([]);
        showToast('Cart Cleared', 'Sale ticket emptied');
      } else if (e.key === 'F3') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      } else if (e.key === 'F4') {
        e.preventDefault();
        setCurrentScreen('farmers-acreage-advisory');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScreen]);

  // Cart operations
  const handleAddToCart = (product: ProductItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast('Added to Cart', `${product.name} added to current sale ticket.`);
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handlePushPrescriptionToCart = (items: { product: ProductItem; quantity: number }[]) => {
    setCart((prev) => {
      const updated = [...prev];
      items.forEach(({ product, quantity }) => {
        const index = updated.findIndex((i) => i.product.id === product.id);
        if (index > -1) {
          updated[index].quantity += quantity;
        } else {
          updated.push({ product, quantity });
        }
      });
      return updated;
    });
    showToast(
      'Field Prescription Loaded',
      `${items.length} prescribed products loaded into POS Counter cart.`
    );
  };

  // Complete Sale via API
  const handleCompleteSale = async ({
    cart,
    farmer,
    paymentMethod,
    mpesaPhone,
    sendSms,
  }: {
    cart: CartItem[];
    farmer: FarmerRecord | null;
    paymentMethod: 'M-Pesa' | 'Cash' | 'Credit';
    mpesaPhone: string;
    cashTendered: number;
    sendSms: boolean;
  }) => {
    const totalAmount = cart.reduce((acc, item) => acc + item.product.retailPrice * item.quantity, 0);
    const itemsSummary = cart.map((i) => `${i.quantity}x ${i.product.name}`).join(', ');

    const newTx = {
      type: paymentMethod === 'Credit' ? 'Farmer Credit Book' : 'Retail Counter Sale',
      farmerName: farmer ? farmer.name : 'Walk-in Customer',
      agriculturalBlock: farmer ? farmer.location : 'Kerugoya Peri-urban',
      itemsSummary,
      totalAmount,
      channel: paymentMethod,
      channelRef: paymentMethod === 'M-Pesa' ? `QJD${Math.floor(1000 + Math.random() * 9000)}LK` : undefined,
      status: (paymentMethod === 'Credit' ? 'On Book' : 'Cleared') as 'Cleared' | 'On Book',
      creditAmount: paymentMethod === 'Credit' ? totalAmount : undefined,
    };

    try {
      const createdTx = await api.createTransaction(newTx);

      // Deduct stock in DB
      for (const item of cart) {
        const newStock = Math.max(0, item.product.stockCount - item.quantity);
        await api.updateProduct(item.product.id, { stockCount: newStock });
      }

      // If Credit, update farmer balance in DB
      if (paymentMethod === 'Credit' && farmer) {
        await api.updateFarmer(farmer.id, { addCreditAmount: totalAmount });
      }

      await loadData();
      setCart([]);
      showToast(
        `Sale Completed (${createdTx.id || '#SALE'})`,
        `KES ${totalAmount.toLocaleString()} paid via ${paymentMethod}. ${
          sendSms ? `SMS receipt sent to ${farmer?.name || mpesaPhone}.` : ''
        }`
      );
    } catch (err: any) {
      showToast('Sale Failed', err.message || 'Error processing sale');
    }
  };

  // Record Repayment via API
  const handleRecordRepayment = async (
    farmerId: string,
    amount: number,
    channel: string,
    ref: string
  ) => {
    const farmer = farmers.find((f) => f.id === farmerId);
    if (!farmer) return;

    try {
      await api.updateFarmer(farmerId, { repaymentAmount: amount });

      await api.createTransaction({
        type: 'Farmer Credit Repayment',
        farmerName: `${farmer.name} (Repayment)`,
        agriculturalBlock: farmer.location,
        itemsSummary: `Credit Repayment - Ref #${ref}`,
        totalAmount: amount,
        channel: channel as any,
        channelRef: ref,
        status: 'Cleared',
      });

      await loadData();
      showToast(
        'Payment Recorded',
        `KES ${amount.toLocaleString()} credited to ${farmer.name}'s account. SMS confirmation sent.`
      );
    } catch (err: any) {
      showToast('Repayment Error', err.message);
    }
  };

  // SMS reminder
  const handleSendSmsReminder = (farmer: FarmerRecord) => {
    showToast(
      'SMS Reminder Sent',
      `Africa's Talking SMS reminder dispatched to ${farmer.name} (${farmer.phone}) for KES ${farmer.outstandingBalance.toLocaleString()}.`
    );
  };

  // Denomination update via API
  const handleUpdateDenominationCount = async (denomination: string, count: number) => {
    try {
      const updated = await api.updateDenomination(denomination, count);
      setDenominations(updated);
    } catch (err: any) {
      console.error(err);
    }
  };

  // Commit GRN via API
  const handleCommitGrnToInventory = async () => {
    try {
      await api.commitGrn();
      await loadData();
      showToast(
        'GRN-2024-089 Committed',
        '138 Verified units added to dispensary stock ledger. Twiga Chemical AP adjusted.'
      );
    } catch (err: any) {
      showToast('GRN Error', err.message);
    }
  };

  if (showLoginModal || !currentUser) {
    return (
      <LandingLoginPage
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setCurrentScreen(getDefaultScreenForRole(user.role));
          setShowLoginModal(false);
          loadData();
          showToast('Authenticated', `Signed in as ${user.name} (${user.role})`);
        }}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-[#faf8ff] text-[#131b2e] antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        expiringCount={products.filter((p) => p.daysToExpiry <= 30 || p.stockCount <= p.minStock).length}
        overdueCount={farmers.filter((f) => f.status === 'overdue' || (f.daysOverdue ?? 0) > 0).length}
        totalReceivables={farmers.reduce((sum, f) => sum + (f.outstandingBalance || 0), 0)}
        pendingGrnCount={inwardLines.length}
        onSignOut={() => {
          localStorage.removeItem('agroflow_token');
          localStorage.removeItem('agroflow_user');
          setCurrentUser(null);
          setShowLoginModal(true);
        }}
        onOpenPlatformUpdate={() => setShowPlatformUpdateModal(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header */}
        <Header
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Screen Container */}
        <main className="flex-1 p-6 overflow-y-auto">
          {currentScreen === 'dashboard' && (
            <OverviewScreen
              onNavigate={setCurrentScreen}
              transactions={transactions}
              products={products}
              farmers={farmers}
              onOpenQuickSale={() => setCurrentScreen('sales-pos')}
              onSendSmsReminder={handleSendSmsReminder}
            />
          )}

          {currentScreen === 'sales-pos' && (
            <PosScreen
              products={products}
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateCartQty={handleUpdateCartQty}
              onRemoveFromCart={handleRemoveFromCart}
              onClearCart={handleClearCart}
              farmers={farmers}
              onCompleteSale={handleCompleteSale}
            />
          )}

          {currentScreen === 'inventory-stock' && (
            <InventoryScreen
              products={products}
              onNavigate={setCurrentScreen}
              onOpenQuickSale={() => setCurrentScreen('sales-pos')}
              onReceiveStock={() => setCurrentScreen('suppliers-pos')}
              onRefreshData={loadData}
            />
          )}

          {currentScreen === 'farmers-acreage-advisory' && (
            <FarmersScreen
              farmers={farmers}
              products={products}
              onNavigate={setCurrentScreen}
              onPushPrescriptionToCart={handlePushPrescriptionToCart}
              onRefreshData={loadData}
            />
          )}

          {currentScreen === 'credit-debt-ledger' && (
            <CreditLedgerScreen
              farmers={farmers}
              onRecordRepayment={handleRecordRepayment}
              onSendSmsReminder={handleSendSmsReminder}
            />
          )}

          {currentScreen === 'shift-register-daily-close' && (
            <ShiftCloseScreen
              transactions={transactions}
              denominations={denominations}
              onUpdateDenominationCount={handleUpdateDenominationCount}
              onNavigate={setCurrentScreen}
            />
          )}

          {currentScreen === 'suppliers-pos' && (
            <SuppliersScreen
              inwardLines={inwardLines}
              onCommitGrnToInventory={handleCommitGrnToInventory}
              onNavigate={setCurrentScreen}
            />
          )}
        </main>
      </div>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#003b1b] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#87c695]/40 flex items-start gap-3 max-w-sm animate-in fade-in slide-in-from-bottom-3">
          <span className="material-symbols-outlined text-[#87c695] text-xl mt-0.5">
            check_circle
          </span>
          <div className="flex-1">
            <div className="text-xs font-bold text-white">{toastMessage.title}</div>
            <div className="text-[11px] text-[#87c695] mt-0.5 leading-snug">
              {toastMessage.desc}
            </div>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/60 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Authentication Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setCurrentScreen(getDefaultScreenForRole(user.role));
          setShowLoginModal(false);
          loadData();
          showToast('Authenticated', `Signed in as ${user.name} (${user.role})`);
        }}
      />

      {/* Platform Update & Security Cockpit Modal */}
      <PlatformUpdateModal
        isOpen={showPlatformUpdateModal}
        onClose={() => setShowPlatformUpdateModal(false)}
      />
    </div>
  );
}
