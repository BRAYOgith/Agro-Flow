import { NextResponse } from 'next/server';
import { execute, queryOne } from '@/lib/db/index';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.stockCount !== undefined) {
      execute('UPDATE products SET stockCount = ? WHERE id = ?;', [body.stockCount, id]);
    }

    if (body.retailPrice !== undefined) {
      execute('UPDATE products SET retailPrice = ? WHERE id = ?;', [body.retailPrice, id]);
    }

    const updated = queryOne('SELECT * FROM products WHERE id = ?;', [id]);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
