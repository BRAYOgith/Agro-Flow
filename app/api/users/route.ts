import { NextResponse } from 'next/server';
import { queryAll, queryOne, execute } from '@/lib/db/index';
import { requireAuth, assertRole, AuthError } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const user = await requireAuth(request);
    assertRole(user, ['admin', 'manager']);

    // Redact plaintext PINs from response to prevent credential harvesting
    const users = queryAll<any>('SELECT id, username, name, role, created_at FROM users ORDER BY created_at DESC;');
    return NextResponse.json(users);
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const caller = await requireAuth(request);
    assertRole(caller, ['admin', 'manager']);

    const body = await request.json();
    const { username, name, role, password, pin } = body;

    if (!username || !name || !role || !password) {
      return NextResponse.json({ error: 'Username, name, role, and password are required.' }, { status: 400 });
    }

    // Only platform admin can create an admin account
    if (role.toLowerCase() === 'admin') {
      assertRole(caller, ['admin']);
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
      caller.username,
      'USER_REGISTERED',
      `Registered new ${role} user: ${username} (${name}) by ${caller.username}`,
    ]);

    const created = queryOne('SELECT id, username, name, role, created_at FROM users WHERE id = ?;', [id]);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const caller = await requireAuth(request);
    // Only administrators or managers can deactivate users
    assertRole(caller, ['admin', 'manager']);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Prevent self-deletion
    if (caller.id === id) {
      return NextResponse.json({ error: 'Cannot delete your own active user account.' }, { status: 400 });
    }

    const targetUser = queryOne<any>('SELECT username, role FROM users WHERE id = ?;', [id]);
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Managers cannot delete Admin accounts
    if (targetUser.role.toLowerCase() === 'admin') {
      assertRole(caller, ['admin']);
    }

    execute('DELETE FROM users WHERE id = ?;', [id]);

    execute('INSERT INTO audit_logs (username, action, details) VALUES (?, ?, ?);', [
      caller.username,
      'USER_DEACTIVATED',
      `Revoked & deleted user account: ${targetUser.username} (${targetUser.role}) by ${caller.username}`,
    ]);

    return NextResponse.json({ success: true, message: `User ${targetUser.username} access revoked.` });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
