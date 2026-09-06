import { NextResponse } from 'next/server';
import { execute, queryOne } from '@/lib/db/index';
import { FarmerRecord } from '@/src/types';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const current = queryOne<FarmerRecord>('SELECT * FROM farmers WHERE id = ?;', [id]);
    if (!current) {
      return NextResponse.json({ error: 'Farmer record not found' }, { status: 404 });
    }

    if (body.repaymentAmount !== undefined) {
      const newBal = Math.max(0, current.outstandingBalance - body.repaymentAmount);
      const newStatus = newBal === 0 ? 'good' : current.status === 'overdue' && newBal < 15000 ? 'good' : current.status;
      execute('UPDATE farmers SET outstandingBalance = ?, status = ? WHERE id = ?;', [newBal, newStatus, id]);
    }

    if (body.addCreditAmount !== undefined) {
      const newBal = current.outstandingBalance + body.addCreditAmount;
      execute('UPDATE farmers SET outstandingBalance = ? WHERE id = ?;', [newBal, id]);
    }

    if (body.creditLimit !== undefined) {
      execute('UPDATE farmers SET creditLimit = ? WHERE id = ?;', [body.creditLimit, id]);
    }

    const updated = queryOne<FarmerRecord>('SELECT * FROM farmers WHERE id = ?;', [id]);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
