import { NextResponse } from 'next/server';
import { execute, queryOne } from '@/lib/db/index';

/**
 * Safaricom Daraja STK Push Asynchronous Webhook Callback
 * Receives the final payment confirmation from Safaricom M-Pesa.
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const callbackData = payload?.Body?.stkCallback;
    if (!callbackData) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Invalid STK callback structure' }, { status: 400 });
    }

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = callbackData;

    // ResultCode 0 indicates payment success in Daraja
    if (ResultCode === 0 && CallbackMetadata?.Item) {
      const items: Array<{ Name: string; Value: any }> = CallbackMetadata.Item;
      const amount = items.find((i) => i.Name === 'Amount')?.Value || 0;
      const mpesaReceiptNumber = items.find((i) => i.Name === 'MpesaReceiptNumber')?.Value || `MPESA-${Date.now()}`;
      const phoneNumber = items.find((i) => i.Name === 'PhoneNumber')?.Value || '';

      // Check if transaction with this reference already cleared (Idempotency)
      const existing = queryOne('SELECT id FROM transactions WHERE channelRef = ?;', [mpesaReceiptNumber]);
      if (!existing) {
        // Record cleared M-Pesa transaction
        const txId = `TX-${Date.now()}`;
        execute(
          `INSERT INTO transactions (id, type, farmerName, agriculturalBlock, itemsSummary, totalAmount, channel, channelRef, status, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            txId,
            'Retail Counter Sale',
            `M-Pesa (${phoneNumber})`,
            'Online Checkout',
            'M-Pesa STK Push Payment',
            amount,
            'M-Pesa',
            mpesaReceiptNumber,
            'Cleared',
            new Date().toISOString(),
          ]
        );
      }
    }

    // Always acknowledge Safaricom Daraja with 200 OK
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: 'Callback processed successfully',
    });
  } catch (error: any) {
    console.error('Error in M-Pesa Callback handler:', error);
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Error recorded' });
  }
}
