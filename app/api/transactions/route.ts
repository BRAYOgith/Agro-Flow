import { NextResponse } from 'next/server';
import { runMigrations } from '@/lib/db/migrations';
import { seedInitialData } from '@/lib/db/seed';
import { queryAll, execute } from '@/lib/db/index';
import { requireAuth, sanitizeHeaderValue, AuthError } from '@/lib/auth';
import { ShiftTransaction } from '@/src/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    runMigrations();
    await seedInitialData();

    const transactions = queryAll<ShiftTransaction>(
      'SELECT * FROM transactions ORDER BY created_at DESC;'
    );
    return NextResponse.json(transactions);
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth(request);
    const tx: ShiftTransaction = await request.json();

    if (!tx.totalAmount || typeof tx.totalAmount !== 'number' || tx.totalAmount <= 0) {
      return NextResponse.json({ error: 'Valid transaction totalAmount is required' }, { status: 400 });
    }

    const id = tx.id || `#TRX-${Math.floor(1000 + Math.random() * 9000)}`;
    const time = tx.time || new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Defensive CRLF sanitization to prevent header/log/SMS injection attacks
    const cleanFarmerName = sanitizeHeaderValue(tx.farmerName || 'Walk-in Customer');
    const cleanAgriculturalBlock = sanitizeHeaderValue(tx.agriculturalBlock || 'Kerugoya Branch');
    const cleanItemsSummary = sanitizeHeaderValue(tx.itemsSummary || 'Counter inputs purchase');
    const cleanChannel = sanitizeHeaderValue(tx.channel || 'Cash');
    const cleanChannelRef = tx.channelRef ? sanitizeHeaderValue(tx.channelRef) : null;
    const cleanType = sanitizeHeaderValue(tx.type || 'Retail Counter Sale');

    execute(
      `INSERT INTO transactions (id, time, type, farmerName, agriculturalBlock, itemsSummary, totalAmount, channel, channelRef, status, creditAmount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        id,
        time,
        cleanType,
        cleanFarmerName,
        cleanAgriculturalBlock,
        cleanItemsSummary,
        tx.totalAmount,
        cleanChannel,
        cleanChannelRef,
        tx.status === 'On Book' ? 'On Book' : 'Cleared',
        tx.creditAmount || null,
      ]
    );

    execute('INSERT INTO audit_logs (username, action, details) VALUES (?, ?, ?);', [
      user.username,
      'TRANSACTION_RECORDED',
      `Recorded transaction ${id} (${cleanType} - KES ${tx.totalAmount}) via ${cleanChannel} by ${user.username}.`,
    ]);

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
