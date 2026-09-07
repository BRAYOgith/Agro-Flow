import { NextResponse } from 'next/server';
import { runMigrations } from '@/lib/db/migrations';
import { seedInitialData } from '@/lib/db/seed';
import { queryAll, execute } from '@/lib/db/index';
import { requireAuth, AuthError } from '@/lib/auth';
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
    const id = tx.id || `#TRX-${Math.floor(1000 + Math.random() * 9000)}`;
    const time = tx.time || new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    execute(
      `INSERT INTO transactions (id, time, type, farmerName, agriculturalBlock, itemsSummary, totalAmount, channel, channelRef, status, creditAmount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        id,
        time,
        tx.type,
        tx.farmerName,
        tx.agriculturalBlock || 'Kerugoya Branch',
        tx.itemsSummary,
        tx.totalAmount,
        tx.channel,
        tx.channelRef || null,
        tx.status,
        tx.creditAmount || null,
      ]
    );

    execute('INSERT INTO audit_logs (username, action, details) VALUES (?, ?, ?);', [
      user.username,
      'TRANSACTION_RECORDED',
      `Recorded transaction ${id} (${tx.type} - KES ${tx.totalAmount}) via ${tx.channel} by ${user.username}.`,
    ]);

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
