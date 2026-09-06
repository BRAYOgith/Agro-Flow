import { NextResponse } from 'next/server';
import { queryAll, queryOne, execute } from '@/lib/db/index';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const users = queryAll<any>('SELECT id, username, name, role, pin, created_at FROM users ORDER BY created_at DESC;');
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, name, role, password, pin } = body;

    if (!username || !name || !role || !password) {
      return NextResponse.json({ error: 'Username, name, role, and password are required.' }, { status: 400 });
    }

    const existing = queryOne('SELECT id FROM users WHERE username = ?;', [username]);
    if (existing) {
      return NextResponse.json({ error: `Username '${username}' is already registered.` }, { status: 400 });
    }

    const id = `usr-${Date.now()}`;
    const password_hash = await bcrypt.hash(password, 10);
    const userPin = pin || Math.floor(1000 + Math.random() * 9000).toString();

    execute(
      'INSERT INTO users (id, username, name, role, password_hash, pin) VALUES (?, ?, ?, ?, ?, ?);',
      [id, username, name, role, password_hash, userPin]
    );

    execute('INSERT INTO audit_logs (username, action, details) VALUES (?, ?, ?);', [
      'system',
      'USER_REGISTERED',
      `Registered new ${role} user: ${username} (${name})`,
    ]);

    const created = queryOne('SELECT id, username, name, role, pin, created_at FROM users WHERE id = ?;', [id]);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const user = queryOne<any>('SELECT username, role FROM users WHERE id = ?;', [id]);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    execute('DELETE FROM users WHERE id = ?;', [id]);

    execute('INSERT INTO audit_logs (username, action, details) VALUES (?, ?, ?);', [
      'system',
      'USER_DEACTIVATED',
      `Revoked & deleted user account: ${user.username} (${user.role})`,
    ]);

    return NextResponse.json({ success: true, message: `User ${user.username} access revoked.` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
