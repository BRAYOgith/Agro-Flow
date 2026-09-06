import crypto from 'crypto';

// 256-bit encryption key derived from environment or secure hardware salt
const MASTER_KEY =
  process.env.ENCRYPTION_KEY ||
  crypto
    .createHash('sha256')
    .update('agroflow-production-security-salt-2026-kirinyaga-secret-master-key')
    .digest('hex');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96-bit recommended for GCM

/**
 * Encrypts sensitive credentials (Safaricom Consumer Secret, Passkey, etc.) using AES-256-GCM.
 * Output format: iv_hex:auth_tag_hex:ciphertext_hex
 */
export function encryptSecret(plaintext: string): string {
  if (!plaintext || plaintext.trim() === '') return '';

  const iv = crypto.randomBytes(IV_LENGTH);
  const key = Buffer.from(MASTER_KEY.substring(0, 64), 'hex');
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypts a cipher bundle and verifies the GCM authentication tag.
 * Throws error if payload has been tampered with or corrupted.
 */
export function decryptSecret(cipherBundle: string): string {
  if (!cipherBundle || !cipherBundle.includes(':')) return '';

  try {
    const parts = cipherBundle.split(':');
    if (parts.length !== 3) return '';

    const [ivHex, authTagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const key = Buffer.from(MASTER_KEY.substring(0, 64), 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Cryptographic verification failed: Tampered or invalid cipher payload');
    return '';
  }
}

/**
 * Safely masks sensitive API keys for display in UI without exposing credentials.
 * e.g. "c7891234567890abcdef" -> "c789••••••••cdef"
 */
export function maskSecret(secret: string): string {
  if (!secret) return '';
  const s = secret.trim();
  if (s.length <= 8) return '••••••••';
  const start = s.substring(0, 4);
  const end = s.substring(s.length - 4);
  return `${start}••••••••${end}`;
}
