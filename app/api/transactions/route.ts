import { NextResponse } from 'next/server';
import { runMigrations } from '@/lib/db/migrations';
import { seedInitialData } from '@/lib/db/seed';
import { queryAll, execute, queryOne } from '@/lib/db/index';
import { ShiftTransaction } from '@/src/types';

export async function GET() {
  try {
    runMigrations();
    await seedInitialData();

    const transactions = queryAll<ShiftTransaction>(
      'SELECT * FROM transactions ORDER BY created_at DESC;'
    );
    return NextResponse.json(transactions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
