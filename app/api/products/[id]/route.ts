import { NextResponse } from 'next/server';
import { execute, queryOne } from '@/lib/db/index';
import { requireAuth, assertRole, AuthError } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const body = await request.json();

    const product = queryOne<any>('SELECT * FROM products WHERE id = ?;', [id]);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (body.retailPrice !== undefined) {
      // Modifying retail price requires manager or admin role
      assertRole(user, ['admin', 'manager']);
      execute('UPDATE products SET retailPrice = ? WHERE id = ?;', [body.retailPrice, id]);
      execute('INSERT INTO audit_logs (username, action, details) VALUES (?, ?, ?);', [
        user.username,
        'PRODUCT_PRICE_CHANGED',
        `Updated retail price of ${product.name} (${id}) from KES ${product.retailPrice} to KES ${body.retailPrice}.`,
      ]);
    }

    if (body.stockCount !== undefined) {
      // Manual stock count override requires manager or admin role unless stock is deducted
      if (body.stockCount > product.stockCount) {
        assertRole(user, ['admin', 'manager']);
      }
      execute('UPDATE products SET stockCount = ? WHERE id = ?;', [body.stockCount, id]);
    }

    const updated = queryOne('SELECT * FROM products WHERE id = ?;', [id]);
    return NextResponse.json(updated);
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
