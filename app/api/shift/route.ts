import { NextResponse } from 'next/server';
import { runMigrations } from '@/lib/db/migrations';
import { seedInitialData } from '@/lib/db/seed';
import { queryAll, execute } from '@/lib/db/index';
import { DenominationTally } from '@/src/types';

export async function GET() {
  try {
    runMigrations();
    await seedInitialData();

    const denominations = queryAll<DenominationTally>('SELECT * FROM denominations;');
    return NextResponse.json(denominations);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { denomination, count } = body;

    if (!denomination || count === undefined) {
      return NextResponse.json({ error: 'Missing denomination or count' }, { status: 400 });
    }

    const row = queryAll<DenominationTally>('SELECT * FROM denominations WHERE denomination = ?;', [denomination])[0];
    if (row) {
      const subtotal = row.unitValue * count;
      execute('UPDATE denominations SET count = ?, subtotal = ? WHERE denomination = ?;', [
        count,
        subtotal,
        denomination,
      ]);
    }

    const updated = queryAll<DenominationTally>('SELECT * FROM denominations;');
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pin, cashierName } = body;

    if (pin !== '4920' && pin !== '1234') {
      return NextResponse.json({ error: 'Invalid Manager PIN for shift lock' }, { status: 401 });
    }

    execute('INSERT INTO audit_logs (username, action, details) VALUES (?, ?, ?);', [
      cashierName || 'Faith Wanjiru',
      'SHIFT_FINALIZED_AND_LOCKED',
      'Dual-signature physical cash handover & KRA Z-Report sealed.',
    ]);

    return NextResponse.json({ success: true, message: 'Shift finalized and locked successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
