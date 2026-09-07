import { NextResponse } from 'next/server';
import { execute, queryOne } from '@/lib/db/index';
import { requireAuth, assertRole, AuthError } from '@/lib/auth';
import { FarmerRecord } from '@/src/types';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const body = await request.json();

    const current = queryOne<FarmerRecord>('SELECT * FROM farmers WHERE id = ?;', [id]);
    if (!current) {
      return NextResponse.json({ error: 'Farmer record not found' }, { status: 404 });
    }

    // Role check: Only managers or admins can modify credit ceilings
    if (body.creditLimit !== undefined) {
      assertRole(user, ['admin', 'manager']);
      execute('UPDATE farmers SET creditLimit = ? WHERE id = ?;', [body.creditLimit, id]);
      execute('INSERT INTO audit_logs (username, action, details) VALUES (?, ?, ?);', [
        user.username,
        'FARMER_CREDIT_LIMIT_MODIFIED',
        `Adjusted credit ceiling for farmer ${current.name} (${id}) to KES ${body.creditLimit}.`,
      ]);
    }

    if (body.repaymentAmount !== undefined) {
      const newBal = Math.max(0, current.outstandingBalance - body.repaymentAmount);
      const newStatus = newBal === 0 ? 'good' : current.status === 'overdue' && newBal < 15000 ? 'good' : current.status;
      execute('UPDATE farmers SET outstandingBalance = ?, status = ? WHERE id = ?;', [newBal, newStatus, id]);
      execute('INSERT INTO audit_logs (username, action, details) VALUES (?, ?, ?);', [
        user.username,
        'FARMER_REPAYMENT_RECORDED',
        `Processed repayment of KES ${body.repaymentAmount} for ${current.name}. Outstanding balance: KES ${newBal}.`,
      ]);
    }

    if (body.addCreditAmount !== undefined) {
      const newBal = current.outstandingBalance + body.addCreditAmount;
      execute('UPDATE farmers SET outstandingBalance = ? WHERE id = ?;', [newBal, id]);
      execute('INSERT INTO audit_logs (username, action, details) VALUES (?, ?, ?);', [
        user.username,
        'FARMER_CREDIT_EXTENDED',
        `Dispatched KES ${body.addCreditAmount} inputs on credit to ${current.name}. Outstanding balance: KES ${newBal}.`,
      ]);
    }

    const updated = queryOne<FarmerRecord>('SELECT * FROM farmers WHERE id = ?;', [id]);
    return NextResponse.json(updated);
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
