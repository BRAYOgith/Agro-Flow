import { NextResponse } from 'next/server';
import { runMigrations } from '@/lib/db/migrations';
import { queryAll, queryOne, execute, execScript } from '@/lib/db/index';
import { requireAuth, assertRole, AuthError } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'backup') {
      const user = await requireAuth(request);
      assertRole(user, ['admin']);

      const products = queryAll('SELECT * FROM products;');
      const farmers = queryAll('SELECT * FROM farmers;');
      const transactions = queryAll('SELECT * FROM transactions;');
      const inward_lines = queryAll('SELECT * FROM inward_lines;');
      const denominations = queryAll('SELECT * FROM denominations;');
      const audit_logs = queryAll('SELECT * FROM audit_logs;');
      const schema_migrations = queryAll('SELECT * FROM schema_migrations;');

      const backupData = {
        app: 'AgroFlow Agri-OS',
        version: '1.2.0',
        timestamp: new Date().toISOString(),
        tables: {
          products,
          farmers,
          transactions,
          inward_lines,
          denominations,
          audit_logs,
          schema_migrations,
        },
      };

      return NextResponse.json(backupData);
    }

    if (action === 'audit_logs') {
      const user = await requireAuth(request);
      assertRole(user, ['admin', 'manager']);

      const logs = queryAll('SELECT * FROM audit_logs ORDER BY id DESC LIMIT 50;');
      return NextResponse.json(logs);
    }

    // Default: Return system health & migration status (admin / manager)
    const user = await requireAuth(request);
    assertRole(user, ['admin', 'manager']);

    const migrationResult = runMigrations();
    const versionRow = queryOne<{ value: string }>('SELECT value FROM system_info WHERE key = ?;', ['version']);
    const migrations = queryAll('SELECT * FROM schema_migrations ORDER BY id DESC;');

    return NextResponse.json({
      status: 'healthy',
      version: versionRow?.value || '1.2.0',
      database: 'SQLite (agroflow.db)',
      migrationStatus: migrationResult,
      appliedMigrations: migrations,
      timestamp: new Date().toISOString(),
    });
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
    assertRole(user, ['admin']);

    const body = await request.json();
    const { action, backupData } = body;

    if (action === 'run_migrations') {
      const result = runMigrations();
      execute('INSERT INTO audit_logs (username, action, details) VALUES (?, ?, ?);', [
        user.username,
        'PLATFORM_MIGRATIONS_RUN',
        `Applied ${result.applied.length} pending schema updates. Total: ${result.total}`,
      ]);
      return NextResponse.json({ success: true, result });
    }

    if (action === 'restore' && backupData) {
      if (backupData.tables?.products) {
        execScript('DELETE FROM products;');
        for (const p of backupData.tables.products) {
          execute(
            `INSERT INTO products (id, name, category, categoryType, packageSpec, actives, pcpbReg, supplier, batchNo, expiryDate, daysToExpiry, stockCount, unit, minStock, costPrice, retailPrice, marginPercent, taxExempt, urgent, dosageNote, shelfLocation, kephisTagged)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              p.id,
              p.name,
              p.category,
              p.categoryType,
              p.packageSpec,
              p.actives,
              p.pcpbReg,
              p.supplier,
              p.batchNo,
              p.expiryDate,
              p.daysToExpiry,
              p.stockCount,
              p.unit,
              p.minStock,
              p.costPrice,
              p.retailPrice,
              p.marginPercent,
              p.taxExempt,
              p.urgent,
              p.dosageNote,
              p.shelfLocation,
              p.kephisTagged,
            ]
          );
        }
      }

      execute('INSERT INTO audit_logs (username, action, details) VALUES (?, ?, ?);', [
        user.username,
        'DATABASE_RESTORED_FROM_BACKUP',
        `Restored database snapshot from ${backupData.timestamp || 'backup file'} by ${user.username}.`,
      ]);

      return NextResponse.json({ success: true, message: 'System state restored successfully' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
