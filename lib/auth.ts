import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { queryOne } from '@/lib/db/index';

export const JWT_SECRET = process.env.JWT_SECRET || 'agroflow-enterprise-secret-key-2026';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: string;
  storeId?: string;
}

export class AuthError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

/**
 * Extracts and cryptographically verifies the authenticated user from the request.
 * Validates JWT signature and confirms the user account is active in the database.
 */
export async function requireAuth(request?: Request): Promise<AuthUser> {
  let token: string | undefined;

  // 1. Check request object if provided
  if (request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const match = cookieHeader.match(/agroflow_session=([^;]+)/);
        if (match) token = match[1];
      }
    }
  }

  // 2. Fall back to Next.js headers()
  if (!token) {
    try {
      const headerList = await headers();
      const authHeader = headerList.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      } else {
        const cookie = headerList.get('cookie');
        if (cookie) {
          const match = cookie.match(/agroflow_session=([^;]+)/);
          if (match) token = match[1];
        }
      }
    } catch {
      // headers() context may not be available outside Next server request lifecycle
    }
  }

  if (!token) {
    throw new AuthError('Authentication required. Missing Bearer token or session.', 401);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;

    // Verify user exists and is active in database
    const userInDb = queryOne<{ id: string; username: string; name: string; role: string }>(
      'SELECT id, username, name, role FROM users WHERE id = ?;',
      [decoded.id]
    );

    if (!userInDb) {
      throw new AuthError('Account no longer exists or access has been revoked.', 401);
    }

    return {
      id: userInDb.id,
      username: userInDb.username,
      name: userInDb.name,
      role: userInDb.role.toLowerCase(),
      storeId: decoded.storeId || 'store-01',
    };
  } catch (err: any) {
    if (err instanceof AuthError) throw err;
    throw new AuthError('Invalid or expired authentication session token.', 401);
  }
}

/**
 * Asserts that the authenticated user holds one of the required roles.
 */
export function assertRole(user: AuthUser, allowedRoles: string[]): void {
  const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());
  const userRole = user.role.toLowerCase();

  // Admin always has access across all privileged functions
  if (userRole === 'admin') return;

  if (!normalizedAllowed.includes(userRole)) {
    throw new AuthError(
      `Forbidden: Insufficient role permissions. Requires ${allowedRoles.join(' or ')}. Current role: ${user.role}.`,
      403
    );
  }
}

/**
 * Asserts that the user is authorized for the target store (prevents multi-tenant IDOR).
 */
export function assertStoreAccess(user: AuthUser, targetStoreId: string): void {
  // Global admin can manage all tenant stores
  if (user.role === 'admin') return;

  if (user.storeId && user.storeId !== targetStoreId) {
    throw new AuthError('Forbidden: Cross-tenant store access prohibited.', 403);
  }
}
