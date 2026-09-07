import { NextResponse } from 'next/server';
import { runMigrations } from '@/lib/db/migrations';
import { seedInitialData } from '@/lib/db/seed';
import { queryAll, queryOne, execute } from '@/lib/db/index';
import { requireAuth, assertRole, AuthError } from '@/lib/auth';
import { DenominationTally } from '@/src/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    runMigrations();
    await seedInitialData();

    const denominations = queryAll<DenominationTally>('SELECT * FROM denominations;');
    return NextResponse.json(denominations);
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { denomination, count } = body;

    if (!denomination || count === undefined) {
      return NextResponse.json({ error: 'Missing denomination or count' }, { status: 400 });
    }

    const row = queryOne<DenominationTally>('SELECT * FROM denominations WHERE denomination = ?;', [denomination]);
    if (row) {
      const subtotal = row.unitValue * count;
      execute('UPDATE denominations SET count = ?, subtotal = ? WHERE denomination = ?;', [
        count,
        subtotal,
        denomination,
      ]);
      execute('INSERT INTO audit_logs (username, action, details) VALUES (?, ?, ?);', [
        user.username,
        'DRAWER_TALLY_UPDATED',
        `Updated ${denomination} count to ${count} by ${user.username}.`,
      ]);
    }

    const updated = queryAll<DenominationTally>('SELECT * FROM denominations;');
    return NextResponse.json(updated);
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const caller = await requireAuth(request);
    const body = await request.json();
    const { pin } = body;

    if (!pin) {
      return NextResponse.json({ error: 'Manager PIN authorization required to seal shift' }, { status: 400 });
    }

    // Verify PIN dynamically against authorized managers or admins in the database
    const authorizingUser = queryOne<{ id: string; name: string; role: string }>(
      `SELECT id, name, role FROM users WHERE pin = ? AND (role = 'manager' OR role = 'admin');`,
      [pin]
    );

    if (!authorizingUser) {
      return NextResponse.json({ error: 'Invalid Manager PIN for shift lock' }, { status: 401 });
    }

    execute('INSERT INTO audit_logs (username, action, details) VALUES (?, ?, ?);', [
      caller.name || caller.username,
      'SHIFT_FINALIZED_AND_LOCKED',
      `Dual-signature physical cash handover sealed by ${caller.name} (${caller.role}), countersigned by ${authorizingUser.name} (${authorizingUser.role}).`,
    ]);

    return NextResponse.json({
      success: true,
      message: 'Shift finalized and locked successfully',
      sealedBy: caller.name,
      authorizedBy: authorizingUser.name,
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
