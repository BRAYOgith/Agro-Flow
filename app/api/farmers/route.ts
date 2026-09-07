import { NextResponse } from 'next/server';
import { runMigrations } from '@/lib/db/migrations';
import { seedInitialData } from '@/lib/db/seed';
import { queryAll, execute } from '@/lib/db/index';
import { requireAuth, sanitizeHeaderValue, AuthError } from '@/lib/auth';
import { FarmerRecord } from '@/src/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    runMigrations();
    await seedInitialData();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const coop = searchParams.get('coop');

    let sql = 'SELECT * FROM farmers';
    const params: any[] = [];
    const conditions: string[] = [];

    if (status && status !== 'All') {
      conditions.push('status = ?');
      params.push(status);
    }

    if (coop && coop !== 'All') {
      conditions.push('cooperative = ?');
      params.push(coop);
    }

    if (search && search.trim() !== '') {
      conditions.push('(name LIKE ? OR phone LIKE ? OR nationalId LIKE ? OR cooperative LIKE ?)');
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY name ASC';

    const farmers = queryAll<FarmerRecord>(sql, params);
    return NextResponse.json(farmers);
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
    const f: FarmerRecord = await request.json();
    const id = f.id || `FARM-${Math.floor(1000 + Math.random() * 9000)}`;

    const cleanName = sanitizeHeaderValue(f.name);
    const cleanPhone = sanitizeHeaderValue(f.phone);
    const cleanNationalId = sanitizeHeaderValue(f.nationalId);
    const cleanCooperative = sanitizeHeaderValue(f.cooperative);
    const cleanLocation = sanitizeHeaderValue(f.location);

    if (!cleanName || !cleanPhone) {
      return NextResponse.json({ error: 'Farmer name and phone are required.' }, { status: 400 });
    }

    execute(
      `INSERT INTO farmers (id, nationalId, name, phone, location, acreage, crops, cooperative, coopMemberNo, verificationStatus, creditLimit, outstandingBalance, dueDate, daysOverdue, lastPurchaseDate, status, notes, soilPh, agronomistAdvisor)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        id,
        cleanNationalId,
        cleanName,
        cleanPhone,
        cleanLocation,
        f.acreage,
        f.crops,
        cleanCooperative,
        f.coopMemberNo,
        f.verificationStatus,
        f.creditLimit,
        f.outstandingBalance || 0,
        f.dueDate,
        f.daysOverdue || 0,
        f.lastPurchaseDate,
        f.status || 'good',
        f.notes,
        f.soilPh,
        f.agronomistAdvisor,
      ]
    );

    execute('INSERT INTO audit_logs (username, action, details) VALUES (?, ?, ?);', [
      user.username,
      'FARMER_RECORD_CREATED',
      `Registered new farmer ${cleanName} (${id}) under cooperative ${cleanCooperative} by ${user.username}.`,
    ]);

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
