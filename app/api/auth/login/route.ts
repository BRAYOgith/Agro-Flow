import { NextResponse } from 'next/server';
import { runMigrations } from '@/lib/db/migrations';
import { seedInitialData } from '@/lib/db/seed';
import { queryOne } from '@/lib/db/index';
import { checkRateLimit } from '@/lib/rate-limiter';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'agroflow-enterprise-secret-key-2026';

export async function POST(request: Request) {
  try {
    // 1. IP / Rate Limiting Protection (5 attempts per 5 minutes)
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const rateCheck = checkRateLimit(`login:${clientIp}`, 10, 300);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many login attempts. Please try again in ${rateCheck.resetSeconds} seconds.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.resetSeconds),
          },
        }
      );
    }

    // 2. Ensure DB schema exists
    runMigrations();
    await seedInitialData();

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const user = queryOne<{
      id: string;
      username: string;
      name: string;
      role: string;
      password_hash: string;
      pin: string;
    }>('SELECT * FROM users WHERE username = ?;', [username]);

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 3. Generate Signed JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 4. Return response with both HttpOnly Cookie & JSON Token
    const response = NextResponse.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });

    const isProduction = process.env.NODE_ENV === 'production';
    response.cookies.set({
      name: 'agroflow_session',
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
