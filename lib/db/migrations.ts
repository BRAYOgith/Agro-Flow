import { queryAll, queryOne, execute, execScript } from './index';

export interface Migration {
  version: string;
  name: string;
  up: () => void;
}

const MIGRATIONS: Migration[] = [
  {
    version: '1.0.0',
    name: 'initial_schema_setup',
    up: () => {
      execScript(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          version TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          applied_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          role TEXT NOT NULL,
          password_hash TEXT NOT NULL,
          pin TEXT NOT NULL,
          created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          categoryType TEXT NOT NULL,
          packageSpec TEXT,
          actives TEXT,
          pcpbReg TEXT,
          supplier TEXT,
          batchNo TEXT,
          expiryDate TEXT,
          daysToExpiry INTEGER,
          stockCount INTEGER DEFAULT 0,
          unit TEXT,
          minStock INTEGER DEFAULT 0,
          costPrice REAL DEFAULT 0,
          retailPrice REAL DEFAULT 0,
          marginPercent REAL DEFAULT 0,
          taxExempt INTEGER DEFAULT 0,
          urgent INTEGER DEFAULT 0,
          dosageNote TEXT,
          shelfLocation TEXT,
          kephisTagged INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS farmers (
          id TEXT PRIMARY KEY,
          nationalId TEXT NOT NULL,
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          location TEXT,
          acreage REAL DEFAULT 0,
          crops TEXT,
          cooperative TEXT,
          coopMemberNo TEXT,
          verificationStatus TEXT,
          creditLimit REAL DEFAULT 0,
          outstandingBalance REAL DEFAULT 0,
          dueDate TEXT,
          daysOverdue INTEGER DEFAULT 0,
          lastPurchaseDate TEXT,
          status TEXT DEFAULT 'good',
          notes TEXT,
          soilPh REAL,
          agronomistAdvisor TEXT
        );

        CREATE TABLE IF NOT EXISTS transactions (
          id TEXT PRIMARY KEY,
          time TEXT NOT NULL,
          type TEXT NOT NULL,
          farmerName TEXT NOT NULL,
          agriculturalBlock TEXT,
          itemsSummary TEXT,
          totalAmount REAL DEFAULT 0,
          channel TEXT NOT NULL,
          channelRef TEXT,
          status TEXT NOT NULL,
          creditAmount REAL,
          created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS denominations (
          denomination TEXT PRIMARY KEY,
          unitValue INTEGER NOT NULL,
          count INTEGER DEFAULT 0,
          subtotal REAL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS inward_lines (
          id TEXT PRIMARY KEY,
          sku TEXT NOT NULL,
          spec TEXT,
          batchNo TEXT,
          pcpbNo TEXT,
          expiry TEXT,
          ordered INTEGER DEFAULT 0,
          received INTEGER DEFAULT 0,
          condition TEXT,
          unitCost REAL DEFAULT 0,
          extended REAL DEFAULT 0,
          status TEXT NOT NULL,
          isFlagged INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS audit_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp TEXT DEFAULT (datetime('now')),
          username TEXT NOT NULL,
          action TEXT NOT NULL,
          details TEXT
        );

        CREATE TABLE IF NOT EXISTS system_info (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        );
      `);
    },
  },
  {
    version: '1.1.0',
    name: 'hardware_category_classification_fix',
    up: () => {
      // Fix CP3 Knapsack Sprayer category from Veterinary to Hardware/Equipment
      execute(
        `UPDATE products SET category = 'Equipment & Tools', categoryType = 'Hardware' WHERE id = 'prod-10' AND category = 'Veterinary';`
      );
    },
  },
  {
    version: '1.2.0',
    name: 'system_versioning_and_health',
    up: () => {
      execute(`INSERT OR REPLACE INTO system_info (key, value) VALUES ('version', '1.2.0');`);
      execute(`INSERT OR REPLACE INTO system_info (key, value) VALUES ('platform_name', 'AgroFlow Agri-OS');`);
      execute(`INSERT OR REPLACE INTO system_info (key, value) VALUES ('last_migration_date', datetime('now'));`);
    },
  },
  {
    version: '1.3.0',
    name: 'saas_billing_and_tenant_security',
    up: () => {
      execScript(`
        CREATE TABLE IF NOT EXISTS store_subscription (
          store_id TEXT PRIMARY KEY,
          store_name TEXT NOT NULL,
          owner_phone TEXT NOT NULL,
          daily_rate INTEGER DEFAULT 100,
          wallet_balance REAL DEFAULT 0,
          licensed_until TEXT NOT NULL,
          subscription_status TEXT DEFAULT 'active',
          daraja_type TEXT DEFAULT 'BuyGoods',
          daraja_shortcode TEXT,
          daraja_consumer_key_encrypted TEXT,
          daraja_consumer_secret_encrypted TEXT,
          daraja_passkey_encrypted TEXT,
          daraja_active INTEGER DEFAULT 0,
          updated_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS saas_payment_logs (
          id TEXT PRIMARY KEY,
          store_id TEXT NOT NULL,
          mpesa_receipt TEXT UNIQUE NOT NULL,
          amount REAL NOT NULL,
          phone TEXT NOT NULL,
          days_added INTEGER NOT NULL,
          processed_at TEXT DEFAULT (datetime('now'))
        );
      `);
      execute(`INSERT OR REPLACE INTO system_info (key, value) VALUES ('version', '1.3.0');`);
    },
  },
];

export function runMigrations(): { applied: string[]; total: number } {
  // Ensure schema_migrations table exists
  execScript(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      applied_at TEXT DEFAULT (datetime('now'))
    );
  `);

  const appliedVersions = queryAll<{ version: string }>('SELECT version FROM schema_migrations;').map(
    (m) => m.version
  );

  const newlyApplied: string[] = [];

  for (const migration of MIGRATIONS) {
    if (!appliedVersions.includes(migration.version)) {
      migration.up();
      execute('INSERT INTO schema_migrations (version, name) VALUES (?, ?);', [
        migration.version,
        migration.name,
      ]);
      newlyApplied.push(`${migration.version}: ${migration.name}`);
    }
  }

  return { applied: newlyApplied, total: MIGRATIONS.length };
}
