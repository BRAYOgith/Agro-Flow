import { queryOne, execute } from './index';
import bcrypt from 'bcryptjs';

export async function seedInitialData() {
  // Only seed default User Accounts if empty (so user can login)
  const userCount = queryOne<{ count: number }>('SELECT COUNT(*) as count FROM users;')?.count || 0;
  if (userCount === 0) {
    const passwordHash = bcrypt.hashSync('admin123', 10);
    execute(
      `INSERT INTO users (id, username, name, role, password_hash, pin) VALUES (?, ?, ?, ?, ?, ?);`,
      ['usr-01', 'john.mwangi', 'John Mwangi', 'manager', passwordHash, '4920']
    );
    execute(
      `INSERT INTO users (id, username, name, role, password_hash, pin) VALUES (?, ?, ?, ?, ?, ?);`,
      ['usr-02', 'faith.wanjiru', 'Faith Wanjiru', 'cashier', passwordHash, '1234']
    );
    execute(
      `INSERT INTO users (id, username, name, role, password_hash, pin) VALUES (?, ?, ?, ?, ?, ?);`,
      ['usr-03', 'agronomy.team', 'Field Agronomist', 'agronomist', passwordHash, '0000']
    );
  }

  // Ensure denominations table exists with zero count tallies
  const denCount = queryOne<{ count: number }>('SELECT COUNT(*) as count FROM denominations;')?.count || 0;
  if (denCount === 0) {
    const denominations = [
      { denomination: 'KES 1,000 Note', unitValue: 1000, count: 0, subtotal: 0 },
      { denomination: 'KES 500 Note', unitValue: 500, count: 0, subtotal: 0 },
      { denomination: 'KES 200 Note', unitValue: 200, count: 0, subtotal: 0 },
      { denomination: 'KES 100 Note', unitValue: 100, count: 0, subtotal: 0 },
      { denomination: 'KES 50 Note / Coin', unitValue: 50, count: 0, subtotal: 0 },
    ];
    for (const d of denominations) {
      execute(
        `INSERT INTO denominations (denomination, unitValue, count, subtotal) VALUES (?, ?, ?, ?);`,
        [d.denomination, d.unitValue, d.count, d.subtotal]
      );
    }
  }

  // Seed default store subscription if not exists
  const storeCount = queryOne<{ count: number }>('SELECT COUNT(*) as count FROM store_subscription;')?.count || 0;
  if (storeCount === 0) {
    const configuredRate = Number(process.env.SAAS_DAILY_RATE) || 100;
    const fourteenDaysAhead = new Date(Date.now() + 14 * 86400000).toISOString();
    execute(
      `INSERT INTO store_subscription (
        store_id, store_name, owner_phone, daily_rate, wallet_balance, licensed_until, subscription_status, daraja_type, daraja_shortcode, daraja_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        'store-01',
        'Kerugoya Central Hub',
        '+254712345678',
        configuredRate,
        500,
        fourteenDaysAhead,
        'active',
        'BuyGoods',
        '592019',
        1,
      ]
    );
  }
}

