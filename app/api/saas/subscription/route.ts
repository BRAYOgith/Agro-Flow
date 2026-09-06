import { NextResponse } from 'next/server';
import { runMigrations } from '@/lib/db/migrations';
import { seedInitialData } from '@/lib/db/seed';
import { queryOne, execute } from '@/lib/db/index';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
  try {
    runMigrations();
    await seedInitialData();

    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId') || 'store-01';

    const store = queryOne<any>(
      `SELECT store_id, store_name, owner_phone, daily_rate, wallet_balance, licensed_until, subscription_status, daraja_type, daraja_shortcode, daraja_active
       FROM store_subscription WHERE store_id = ?;`,
      [storeId]
    );

    if (!store) {
      return NextResponse.json({ error: 'Store record not found' }, { status: 404 });
    }

    const now = Date.now();
    const expiryTime = new Date(store.licensed_until).getTime();
    const diffMs = expiryTime - now;
    const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    let dynamicStatus: 'active' | 'grace_period' | 'locked' = 'active';
    if (daysRemaining < -1) {
      dynamicStatus = 'locked';
    } else if (daysRemaining <= 0) {
      dynamicStatus = 'grace_period';
    }

    // Auto update status in db if it changed
    if (dynamicStatus !== store.subscription_status) {
      execute(
        `UPDATE store_subscription SET subscription_status = ?, updated_at = datetime('now') WHERE store_id = ?;`,
        [dynamicStatus, storeId]
      );
    }

    const dailyRate = Number(store.daily_rate) || 100;

    return NextResponse.json({
      storeId: store.store_id,
      storeName: store.store_name,
      ownerPhone: store.owner_phone,
      dailyRate,
      walletBalance: store.wallet_balance || 0,
      licensedUntil: store.licensed_until,
      daysRemaining,
      subscriptionStatus: dynamicStatus,
      darajaConfigured: Boolean(store.daraja_active),
      darajaShortcode: store.daraja_shortcode || '',
      darajaType: store.daraja_type || 'BuyGoods',
      packages: {
        oneDay: {
          days: 1,
          amount: dailyRate,
          label: `1 Day Access (KES ${dailyRate.toLocaleString()})`,
        },
        oneWeek: {
          days: 7,
          amount: dailyRate * 7,
          label: `1 Week Access (KES ${(dailyRate * 7).toLocaleString()})`,
        },
        oneMonth: {
          days: 30,
          amount: Math.round(dailyRate * 30 * 0.9), // 10% monthly incentive
          savingsPercent: 10,
          label: `1 Month - 30 Days (KES ${Math.round(dailyRate * 30 * 0.9).toLocaleString()})`,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PUT: Allows store manager or platform owner to adjust the dynamic daily rate or store details.
 * Protected by Manager PIN.
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { storeId = 'store-01', dailyRate, pin, ownerPhone, storeName } = body;

    if (!pin) {
      return NextResponse.json({ error: 'Manager PIN is required to modify subscription settings' }, { status: 400 });
    }

    // Verify Manager PIN
    const manager = queryOne<{ pin: string }>(
      `SELECT pin FROM users WHERE role = 'manager' LIMIT 1;`
    );

    if (!manager || manager.pin !== pin) {
      return NextResponse.json({ error: 'Invalid Manager PIN authorization' }, { status: 403 });
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (typeof dailyRate === 'number' && dailyRate > 0) {
      updates.push('daily_rate = ?');
      params.push(Math.round(dailyRate));
    }

    if (ownerPhone && ownerPhone.trim() !== '') {
      updates.push('owner_phone = ?');
      params.push(ownerPhone.trim());
    }

    if (storeName && storeName.trim() !== '') {
      updates.push('store_name = ?');
      params.push(storeName.trim());
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 });
    }

    updates.push("updated_at = datetime('now')");
    params.push(storeId);

    execute(
      `UPDATE store_subscription SET ${updates.join(', ')} WHERE store_id = ?;`,
      params
    );

    return NextResponse.json({
      success: true,
      message: `Store subscription updated successfully. Daily rate configured to KES ${dailyRate || 'unchanged'}.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
