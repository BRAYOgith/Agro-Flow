import { ProductItem, FarmerRecord, ShiftTransaction, DenominationTally, InwardLineItem } from '../types';

class ApiService {
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('agroflow_token');
    }
    return null;
  }

  private async ensureHeaders(): Promise<HeadersInit> {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private async handleResponse<T>(res: Response, defaultErrorMsg: string): Promise<T> {
    if (!res.ok) {
      let msg = defaultErrorMsg;
      try {
        const data = await res.json();
        if (data.error) msg = data.error;
      } catch (e) {}
      throw new Error(msg);
    }
    return res.json() as Promise<T>;
  }

  async login(username: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return this.handleResponse<{ token: string; user: any }>(res, 'Login failed');
  }

  async verifyPin(pin: string) {
    const headers = await this.ensureHeaders();
    const res = await fetch('/api/auth/verify-pin', {
      method: 'POST',
      headers,
      body: JSON.stringify({ pin }),
    });
    return this.handleResponse<{ valid: boolean; managerName?: string }>(res, 'Invalid PIN');
  }

  async getProducts(category?: string, search?: string): Promise<ProductItem[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);

    const headers = await this.ensureHeaders();
    const res = await fetch(`/api/products?${params.toString()}`, { headers });
    return this.handleResponse<ProductItem[]>(res, 'Failed to fetch products');
  }

  async updateProduct(id: string, updates: { stockCount?: number; retailPrice?: number }) {
    const headers = await this.ensureHeaders();
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });
    return this.handleResponse<ProductItem>(res, 'Failed to update product');
  }

  async createProduct(product: Partial<ProductItem>): Promise<{ success: boolean; id: string }> {
    const headers = await this.ensureHeaders();
    const res = await fetch('/api/products', {
      method: 'POST',
      headers,
      body: JSON.stringify(product),
    });
    return this.handleResponse<{ success: boolean; id: string }>(res, 'Failed to create product');
  }

  async getFarmers(status?: string, coop?: string, search?: string): Promise<FarmerRecord[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (coop) params.append('coop', coop);
    if (search) params.append('search', search);

    const headers = await this.ensureHeaders();
    const res = await fetch(`/api/farmers?${params.toString()}`, { headers });
    return this.handleResponse<FarmerRecord[]>(res, 'Failed to fetch farmers');
  }

  async createFarmer(farmer: Partial<FarmerRecord>): Promise<{ success: boolean; id: string }> {
    const headers = await this.ensureHeaders();
    const res = await fetch('/api/farmers', {
      method: 'POST',
      headers,
      body: JSON.stringify(farmer),
    });
    return this.handleResponse<{ success: boolean; id: string }>(res, 'Failed to register farmer');
  }

  async updateFarmer(id: string, updates: { repaymentAmount?: number; addCreditAmount?: number; creditLimit?: number }) {
    const headers = await this.ensureHeaders();
    const res = await fetch(`/api/farmers/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });
    return this.handleResponse<FarmerRecord>(res, 'Failed to update farmer record');
  }

  async getTransactions(): Promise<ShiftTransaction[]> {
    const headers = await this.ensureHeaders();
    const res = await fetch('/api/transactions', { headers });
    return this.handleResponse<ShiftTransaction[]>(res, 'Failed to fetch transactions');
  }

  async createTransaction(tx: Partial<ShiftTransaction>): Promise<ShiftTransaction> {
    const headers = await this.ensureHeaders();
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers,
      body: JSON.stringify(tx),
    });
    return this.handleResponse<ShiftTransaction>(res, 'Failed to create transaction');
  }

  async getDenominations(): Promise<DenominationTally[]> {
    const headers = await this.ensureHeaders();
    const res = await fetch('/api/shift', { headers });
    return this.handleResponse<DenominationTally[]>(res, 'Failed to fetch shift denominations');
  }

  async updateDenomination(denomination: string, count: number): Promise<DenominationTally[]> {
    const headers = await this.ensureHeaders();
    const res = await fetch('/api/shift', {
      method: 'PUT',
      headers,
      body: JSON.stringify({ denomination, count }),
    });
    return this.handleResponse<DenominationTally[]>(res, 'Failed to update denomination count');
  }

  async lockShift(pin: string, cashierName: string) {
    const headers = await this.ensureHeaders();
    const res = await fetch('/api/shift', {
      method: 'POST',
      headers,
      body: JSON.stringify({ pin, cashierName }),
    });
    return this.handleResponse<{ success: boolean; message: string }>(res, 'Failed to lock shift');
  }

  async getInwardLines(): Promise<InwardLineItem[]> {
    const headers = await this.ensureHeaders();
    const res = await fetch('/api/suppliers', { headers });
    return this.handleResponse<InwardLineItem[]>(res, 'Failed to fetch inward lines');
  }

  async commitGrn() {
    const headers = await this.ensureHeaders();
    const res = await fetch('/api/suppliers', {
      method: 'POST',
      headers,
    });
    return this.handleResponse<{ success: boolean; message: string }>(res, 'Failed to commit GRN to inventory');
  }

  async getSystemStatus() {
    const headers = await this.ensureHeaders();
    const res = await fetch('/api/system', { headers });
    return this.handleResponse<any>(res, 'Failed to fetch system status');
  }

  async runMigrations() {
    const headers = await this.ensureHeaders();
    const res = await fetch('/api/system', {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'run_migrations' }),
    });
    return this.handleResponse<any>(res, 'Failed to run migrations');
  }

  async getBackup() {
    const headers = await this.ensureHeaders();
    const res = await fetch('/api/system?action=backup', { headers });
    return this.handleResponse<any>(res, 'Failed to export backup');
  }

  async restoreBackup(backupData: any) {
    const headers = await this.ensureHeaders();
    const res = await fetch('/api/system', {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'restore', backupData }),
    });
    return this.handleResponse<any>(res, 'Failed to restore backup');
  }

  async getAuditLogs() {
    const headers = await this.ensureHeaders();
    const res = await fetch('/api/system?action=audit_logs', { headers });
    return this.handleResponse<any[]>(res, 'Failed to fetch audit logs');
  }

  async getUsers() {
    const headers = await this.ensureHeaders();
    const res = await fetch('/api/users', { headers });
    return this.handleResponse<any[]>(res, 'Failed to fetch users');
  }

  async createUser(userData: { username: string; name: string; role: string; password: string; pin?: string }) {
    const headers = await this.ensureHeaders();
    const res = await fetch('/api/users', {
      method: 'POST',
      headers,
      body: JSON.stringify(userData),
    });
    return this.handleResponse<any>(res, 'Failed to create user');
  }

  async deleteUser(id: string) {
    const headers = await this.ensureHeaders();
    const res = await fetch(`/api/users?id=${id}`, {
      method: 'DELETE',
      headers,
    });
    return this.handleResponse<any>(res, 'Failed to delete user');
  }
}

export const api = new ApiService();
