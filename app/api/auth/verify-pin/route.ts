import { NextResponse } from 'next/server';
import { queryOne } from '@/lib/db/index';
import { checkRateLimit } from '@/lib/rate-limiter';

export async function POST(request: Request) {
  try {
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const rateCheck = checkRateLimit(`pin:${clientIp}`, 5, 300);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed PIN attempts. Register locked for ${rateCheck.resetSeconds} seconds.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.resetSeconds),
          },
        }
      );
    }

    const body = await request.json();
    const { pin } = body;

    if (!pin) {
      return NextResponse.json({ error: 'PIN is required' }, { status: 400 });
    }

    // Check if any manager or admin user matches the provided authorization PIN
    const user = queryOne<{ id: string; name: string; role: string }>(
      `SELECT id, name, role FROM users WHERE pin = ? AND (role = 'manager' OR role = 'admin');`,
      [pin]
    );

    if (user) {
      return NextResponse.json({ valid: true, managerName: user.name });
    }

    return NextResponse.json({ valid: false, error: 'Invalid Manager Authorization PIN' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
