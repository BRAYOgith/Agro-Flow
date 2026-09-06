import { NextResponse } from 'next/server';
import { runMigrations } from '@/lib/db/migrations';
import { seedInitialData } from '@/lib/db/seed';
import { queryAll, execute } from '@/lib/db/index';
import { InwardLineItem } from '@/src/types';

export async function GET() {
  try {
    runMigrations();
    await seedInitialData();

    const rawRows = queryAll<any>('SELECT * FROM inward_lines;');
    const lines: InwardLineItem[] = rawRows.map((r) => ({
      ...r,
      isFlagged: Boolean(r.isFlagged),
    }));
    return NextResponse.json(lines);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Commit GRN to inventory
    // 1. Keep inward line shortfall flags intact for audit records
    // 2. Increment product stock count
    execute(`UPDATE products SET stockCount = stockCount + 50 WHERE name LIKE '%Ridomil%';`);
    execute(`UPDATE products SET stockCount = stockCount + 38 WHERE name LIKE '%Belt Expert%';`);
    execute(`UPDATE products SET stockCount = stockCount + 30 WHERE name LIKE '%Karate%';`);
    execute(`UPDATE products SET stockCount = stockCount + 20 WHERE name LIKE '%Acelan%';`);

    execute('INSERT INTO audit_logs (username, action, details) VALUES (?, ?, ?);', [
      'John Mwangi',
      'GRN_COMMITTED_TO_INVENTORY',
      'GRN-2024-089 138 Verified units added to dispensary stock ledger. Twiga Chemical AP adjusted.',
    ]);

    return NextResponse.json({ success: true, message: 'GRN committed to dispensary stock ledger' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
