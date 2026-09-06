import { NextResponse } from 'next/server';
import { runMigrations } from '@/lib/db/migrations';
import { seedInitialData } from '@/lib/db/seed';
import { queryOne, execute } from '@/lib/db/index';
import { encryptSecret, decryptSecret, maskSecret } from '@/lib/crypto';

export async function GET(request: Request) {
  try {
    runMigrations();
    await seedInitialData();

    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId') || 'store-01';

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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      storeId = 'store-01',
      darajaType = 'BuyGoods',
      shortcode,
      consumerKey,
      consumerSecret,
      passkey,
      pin,
    } = body;

    if (!pin) {
      return NextResponse.json({ error: 'Manager PIN authorization required to modify M-Pesa Till credentials' }, { status: 400 });
    }

    // Verify Manager PIN
    const manager = queryOne<{ pin: string }>(
      `SELECT pin FROM users WHERE role = 'manager' LIMIT 1;`
    );

    if (!manager || manager.pin !== pin) {
      return NextResponse.json({ error: 'Invalid Manager PIN authorization' }, { status: 403 });
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

    return NextResponse.json({
      success: true,
      message: `M-Pesa Till ${shortcode} credentials encrypted and secured successfully.`,
      darajaType,
      shortcode: shortcode.trim(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
