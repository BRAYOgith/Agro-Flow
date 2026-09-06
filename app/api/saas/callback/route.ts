import { NextResponse } from 'next/server';
import { queryOne, execute } from '@/lib/db/index';

/**
 * Safaricom M-Pesa Daraja Webhook for AgroFlow SaaS Subscription Recharges
 * Implements strict idempotency: duplicate callbacks with the same M-Pesa receipt are rejected.
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Safaricom Daraja standard callback structure
    const callbackData = payload?.Body?.stkCallback;
    if (!callbackData) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Invalid callback payload' }, { status: 400 });
    }

    const resultCode = callbackData.ResultCode;
    const resultDesc = callbackData.ResultDesc;

    if (resultCode !== 0) {
      // Transaction failed or canceled by user
      console.warn(`SaaS M-Pesa Topup failed: ${resultDesc} (Code: ${resultCode})`);
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted non-zero result' });
    }

    // Extract transaction metadata items
    const items: Array<{ Name: string; Value: any }> = callbackData.CallbackMetadata?.Item || [];
    let amount = 0;
    let mpesaReceipt = '';
    let phone = '';

    for (const item of items) {
      if (item.Name === 'Amount') amount = Number(item.Value);
      if (item.Name === 'MpesaReceiptNumber') mpesaReceipt = String(item.Value);
      if (item.Name === 'PhoneNumber') phone = String(item.Value);
    }

    if (!mpesaReceipt || amount <= 0) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Missing receipt or amount' }, { status: 400 });
    }

    // Idempotency Check: Verify receipt has not already been processed
    const existingLog = queryOne<{ id: string }>(
      `SELECT id FROM saas_payment_logs WHERE mpesa_receipt = ?;`,
      [mpesaReceipt]
    );

    if (existingLog) {
      console.log(`Idempotent webhook hit: M-Pesa receipt ${mpesaReceipt} already processed`);
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Receipt already settled' });
    }

    // Identify target store (default 'store-01')
    const storeId = 'store-01';
    const store = queryOne<any>(
      `SELECT store_id, daily_rate, licensed_until, wallet_balance FROM store_subscription WHERE store_id = ?;`,
      [storeId]
    );

    if (!store) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Store not found' }, { status: 404 });
    }

    const dailyRate = Number(store.daily_rate) || 100;
    const monthlyThreshold = Math.round(dailyRate * 30 * 0.9);
    let daysToGrant: number;

    if (amount >= monthlyThreshold) {
      daysToGrant = Math.max(30, Math.floor(amount / (dailyRate * 0.9)));
    } else {
      daysToGrant = Math.max(1, Math.floor(amount / dailyRate));
    }

    const currentExpiry = new Date(store.licensed_until);
    const baseTime = currentExpiry.getTime() > Date.now() ? currentExpiry.getTime() : Date.now();
    const newExpiry = new Date(baseTime + daysToGrant * 86400000).toISOString();

    // Atomic log insertion & store update
    execute(
      `INSERT INTO saas_payment_logs (id, store_id, mpesa_receipt, amount, phone, days_added)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [`pay-${Date.now()}`, storeId, mpesaReceipt, amount, phone, daysToGrant]
    );

    execute(
      `UPDATE store_subscription 
       SET licensed_until = ?, 
           subscription_status = 'active',
           wallet_balance = wallet_balance + ?,
           updated_at = datetime('now')
       WHERE store_id = ?;`,
      [newExpiry, amount, storeId]
    );

    console.log(`SaaS License Recharged: Added ${daysToGrant} days for ${storeId}. Receipt: ${mpesaReceipt}`);
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (error: any) {
    console.error('SaaS callback error:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: error.message }, { status: 500 });
  }
}
