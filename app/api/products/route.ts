import { NextResponse } from 'next/server';
import { runMigrations } from '@/lib/db/migrations';
import { seedInitialData } from '@/lib/db/seed';
import { queryAll, execute } from '@/lib/db/index';
import { requireAuth, assertRole, AuthError } from '@/lib/auth';
import { ProductItem } from '@/src/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    runMigrations();
    await seedInitialData();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let sql = 'SELECT * FROM products';
    const params: any[] = [];
    const conditions: string[] = [];

    if (category && category !== 'All') {
      conditions.push('(category = ? OR categoryType = ?)');
      params.push(category, category);
    }

    if (search && search.trim() !== '') {
      conditions.push('(name LIKE ? OR actives LIKE ? OR pcpbReg LIKE ? OR batchNo LIKE ?)');
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY name ASC';

    const rawRows = queryAll<any>(sql, params);
    const products: ProductItem[] = rawRows.map((r) => ({
      ...r,
      taxExempt: Boolean(r.taxExempt),
      urgent: Boolean(r.urgent),
      kephisTagged: Boolean(r.kephisTagged),
    }));

    return NextResponse.json(products);
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
    assertRole(user, ['admin', 'manager']);

    const p: ProductItem = await request.json();
    const id = p.id || `prod-${Date.now()}`;

    execute(
      `INSERT INTO products (id, name, category, categoryType, packageSpec, actives, pcpbReg, supplier, batchNo, expiryDate, daysToExpiry, stockCount, unit, minStock, costPrice, retailPrice, marginPercent, taxExempt, urgent, dosageNote, shelfLocation, kephisTagged)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        id,
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
        p.taxExempt ? 1 : 0,
        p.urgent ? 1 : 0,
        p.dosageNote,
        p.shelfLocation,
        p.kephisTagged ? 1 : 0,
      ]
    );

    execute('INSERT INTO audit_logs (username, action, details) VALUES (?, ?, ?);', [
      user.username,
      'PRODUCT_CREATED',
      `Added new SKU ${p.name} (${id}) - Retail KES ${p.retailPrice} by ${user.username}.`,
    ]);

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
