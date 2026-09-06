export type ScreenType =
  | 'dashboard'
  | 'sales-pos'
  | 'inventory-stock'
  | 'farmers-acreage-advisory'
  | 'credit-debt-ledger'
  | 'suppliers-pos'
  | 'shift-register-daily-close'
  | 'reports-analytics';

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  categoryType: 'Fungicides' | 'Fertilizers' | 'Insecticides' | 'Hybrid Seeds' | 'Veterinary' | 'Foliar';
  packageSpec: string;
  actives: string;
  pcpbReg: string;
  supplier: string;
  batchNo: string;
  expiryDate: string;
  daysToExpiry: number;
  stockCount: number;
  unit: string;
  minStock: number;
  costPrice: number;
  retailPrice: number;
  marginPercent: number;
  taxExempt?: boolean;
  urgent?: boolean;
  dosageNote?: string;
  shelfLocation?: string;
  kephisTagged?: boolean;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

export interface FarmerRecord {
  id: string;
  nationalId: string;
  name: string;
  phone: string;
  location: string;
  acreage: number;
  crops: string;
  cooperative: string;
  coopMemberNo: string;
  verificationStatus: string;
  creditLimit: number;
  outstandingBalance: number;
  dueDate: string;
  daysOverdue?: number;
  lastPurchaseDate: string;
  status: 'good' | 'due-soon' | 'overdue' | 'partial';
  notes?: string;
  soilPh?: number;
  agronomistAdvisor?: string;
}

export interface ShiftTransaction {
  id: string;
  time: string;
  type: string;
  farmerName: string;
  agriculturalBlock: string;
  itemsSummary: string;
  totalAmount: number;
  channel: 'M-Pesa' | 'Cash' | 'Credit';
  channelRef?: string;
  status: 'Cleared' | 'On Book';
  creditAmount?: number;
}

export interface DenominationTally {
  denomination: string;
  unitValue: number;
  count: number;
  subtotal: number;
}

export interface InwardLineItem {
  id: string;
  sku: string;
  spec: string;
  batchNo: string;
  pcpbNo: string;
  expiry: string;
  ordered: number;
  received: number;
  condition: string;
  unitCost: number;
  extended: number;
  status: 'Verified' | 'Shortfall Flag';
  isFlagged?: boolean;
}
