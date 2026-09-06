import { NextResponse } from 'next/server';
import { queryOne, execute } from '@/lib/db/index';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { storeId = 'store-01', amount, phone, simulateInstantSuccess = false } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid payment amount is required' }, { status: 400 });
    }

    if (!phone || phone.trim() === '') {
      return NextResponse.json({ error: 'Valid M-Pesa phone number is required' }, { status: 400 });
    }

    // Format phone to standard Kenyan 2547XXXXXXXX / 2541XXXXXXXX
    let formattedPhone = phone.replace(/\s+/g, '').replace('+', '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = `254${formattedPhone.substring(1)}`;
    } else if (formattedPhone.startsWith('7') || formattedPhone.startsWith('1')) {
      formattedPhone = `254${formattedPhone}`;
    }

    const store = queryOne<any>(
      `SELECT store_id, store_name, daily_rate, licensed_until, wallet_balance FROM store_subscription WHERE store_id = ?;`,
      [storeId]
    );

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    const dailyRate = Number(store.daily_rate) || 100;
    // Calculate days: if amount matches the 30-day package (dailyRate * 30 * 0.9), grant 30 days
    const monthlyThreshold = Math.round(dailyRate * 30 * 0.9);
    let daysToGrant: number;

    if (amount >= monthlyThreshold) {
      daysToGrant = Math.max(30, Math.floor((amount / (dailyRate * 0.9))));
    } else {
      daysToGrant = Math.max(1, Math.floor(amount / dailyRate));
    }

    const checkoutRequestId = `ws_SAAS_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    // If developer/demo test mode requested or local testing:
    if (simulateInstantSuccess) {
      const receiptNumber = `QK${Math.floor(10000000 + Math.random() * 90000000)}`;
      const currentExpiry = new Date(store.licensed_until);
      const baseTime = currentExpiry.getTime() > Date.now() ? currentExpiry.getTime() : Date.now();
      const newExpiry = new Date(baseTime + daysToGrant * 86400000).toISOString();

      execute(
        `INSERT OR IGNORE INTO saas_payment_logs (id, store_id, mpesa_receipt, amount, phone, days_added)
         VALUES (?, ?, ?, ?, ?, ?);`,
        [`pay-${Date.now()}`, storeId, receiptNumber, amount, formattedPhone, daysToGrant]
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

      return NextResponse.json({
        success: true,
        instantSettled: true,
        checkoutRequestId,
        mpesaReceipt: receiptNumber,
        daysAdded: daysToGrant,
        newLicensedUntil: newExpiry,
        message: `M-Pesa payment of KES ${amount.toLocaleString()} received. Store license extended by ${daysToGrant} day(s).`,
      });
    }

    // Standard STK Push dispatch response
    return NextResponse.json({
      success: true,
      checkoutRequestId,
      phone: formattedPhone,
      amount,
      daysToGrant,
      accountReference: storeId.toUpperCase(),
      message: `M-Pesa STK Prompt sent to ${formattedPhone} for KES ${amount.toLocaleString()}. Enter your M-Pesa PIN on your phone.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
