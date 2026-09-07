import { NextResponse } from 'next/server';
import { runMigrations } from '@/lib/db/migrations';
import { seedInitialData } from '@/lib/db/seed';
import { queryOne, execute } from '@/lib/db/index';
import { encryptSecret, decryptSecret, maskSecret } from '@/lib/crypto';
import { requireAuth, assertRole, assertStoreAccess, AuthError } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const user = await requireAuth(request);
    assertRole(user, ['admin', 'manager']);

    runMigrations();
    await seedInitialData();

    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId') || user.storeId || 'store-01';

    // Prevent multi-tenant IDOR: Users can only read their assigned store
    assertStoreAccess(user, storeId);

    const store = queryOne<any>(
      `SELECT daraja_type, daraja_shortcode, daraja_consumer_key_encrypted, daraja_consumer_secret_encrypted, daraja_passkey_encrypted, daraja_active
       FROM store_subscription WHERE store_id = ?;`,
      [storeId]
    );

    if (!store) {
      return NextResponse.json({ error: 'Store record not found' }, { status: 404 });
    }

    const rawKey = decryptSecret(store.daraja_consumer_key_encrypted);
    const rawSecret = decryptSecret(store.daraja_consumer_secret_encrypted);
    const rawPasskey = decryptSecret(store.daraja_passkey_encrypted);

    return NextResponse.json({
      darajaType: store.daraja_type || 'BuyGoods',
      shortcode: store.daraja_shortcode || '',
      consumerKeyMasked: maskSecret(rawKey),
      consumerSecretMasked: maskSecret(rawSecret),
      passkeyMasked: maskSecret(rawPasskey),
      hasConsumerKey: Boolean(rawKey),
      hasConsumerSecret: Boolean(rawSecret),
      hasPasskey: Boolean(rawPasskey),
      isConfigured: Boolean(store.daraja_active && store.daraja_shortcode),
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
    assertRole(user, ['admin', 'manager']);

    const body = await request.json();
    const {
      storeId = user.storeId || 'store-01',
      darajaType = 'BuyGoods',
      shortcode,
      consumerKey,
      consumerSecret,
      passkey,
      pin,
    } = body;

    // Prevent multi-tenant IDOR
    assertStoreAccess(user, storeId);

    if (!pin) {
      return NextResponse.json({ error: 'Manager PIN authorization required to modify M-Pesa Till credentials' }, { status: 400 });
    }

    // Verify PIN specifically for the currently authenticated manager
    const currentUser = queryOne<{ pin: string }>(
      'SELECT pin FROM users WHERE id = ?;',
      [user.id]
    );

    if (!currentUser || currentUser.pin !== pin) {
      return NextResponse.json({ error: 'Invalid Manager PIN authorization for your account' }, { status: 403 });
    }

    if (!shortcode || shortcode.trim() === '') {
      return NextResponse.json({ error: 'Till Number / Shortcode is required' }, { status: 400 });
    }

    // Encrypt sensitive secrets with AES-256-GCM
    const encryptedKey = consumerKey ? encryptSecret(consumerKey.trim()) : undefined;
    const encryptedSecret = consumerSecret ? encryptSecret(consumerSecret.trim()) : undefined;
    const encryptedPasskey = passkey ? encryptSecret(passkey.trim()) : undefined;

    const existing = queryOne<any>(
      `SELECT daraja_consumer_key_encrypted, daraja_consumer_secret_encrypted, daraja_passkey_encrypted FROM store_subscription WHERE store_id = ?;`,
      [storeId]
    );

    const finalEncryptedKey = encryptedKey || existing?.daraja_consumer_key_encrypted || '';
    const finalEncryptedSecret = encryptedSecret || existing?.daraja_consumer_secret_encrypted || '';
    const finalEncryptedPasskey = encryptedPasskey || existing?.daraja_passkey_encrypted || '';

    execute(
      `UPDATE store_subscription 
       SET daraja_type = ?,
           daraja_shortcode = ?,
           daraja_consumer_key_encrypted = ?,
           daraja_consumer_secret_encrypted = ?,
           daraja_passkey_encrypted = ?,
           daraja_active = 1,
           updated_at = datetime('now')
       WHERE store_id = ?;`,
      [
        darajaType,
        shortcode.trim(),
        finalEncryptedKey,
        finalEncryptedSecret,
        finalEncryptedPasskey,
        storeId,
      ]
    );

    execute('INSERT INTO audit_logs (username, action, details) VALUES (?, ?, ?);', [
      user.username,
      'DARAJA_CREDENTIALS_CONFIGURED',
      `Configured ${darajaType} Till ${shortcode.trim()} for store ${storeId} by ${user.username}.`,
    ]);

    return NextResponse.json({
      success: true,
      message: `M-Pesa Till ${shortcode} credentials encrypted and secured successfully.`,
      darajaType,
      shortcode: shortcode.trim(),
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
