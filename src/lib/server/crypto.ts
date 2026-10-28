import crypto from 'crypto';

function getAuthSecret(): string {
  const secret =
    process.env.AUTH_SECRET ||
    process.env.VERCEL_OIDC_TOKEN ||
    'lijemrakel-production-hmac-secret-key-2026';
  return secret;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${derivedKey}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const parts = storedHash.split('$');
    if (parts.length !== 3 || parts[0] !== 'scrypt') {
      return false;
    }
    const salt = parts[1];
    const originalHash = Buffer.from(parts[2], 'hex');
    const candidateHash = crypto.scryptSync(password, salt, 64);
    if (originalHash.length !== candidateHash.length) {
      return false;
    }
    return crypto.timingSafeEqual(originalHash, candidateHash);
  } catch {
    return false;
  }
}

export interface SessionTokenPayload {
  userId: string;
  email: string;
  roleId: string;
  iat: number;
  exp: number;
}

export function signSessionToken(
  payload: Omit<SessionTokenPayload, 'iat' | 'exp'>,
  ttlSeconds = 60 * 60 * 24 * 7
): string {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: SessionTokenPayload = {
    ...payload,
    iat: now,
    exp: now + ttlSeconds,
  };
  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString(
    'base64url'
  );
  const signature = crypto
    .createHmac('sha256', getAuthSecret())
    .update(encodedPayload)
    .digest('base64url');
  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): SessionTokenPayload | null {
  try {
    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) return null;

    const expectedSig = crypto
      .createHmac('sha256', getAuthSecret())
      .update(encodedPayload)
      .digest('base64url');

    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSig);
    if (
      sigBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
    ) {
      return null;
    }

    const decoded = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8')
    ) as SessionTokenPayload;

    const now = Math.floor(Date.now() / 1000);
    if (!decoded.exp || decoded.exp < now) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export function generateSecureToken(bytes = 24): string {
  return crypto.randomBytes(bytes).toString('hex');
}

export function hashVisitorFingerprint(ip: string, userAgent: string): string {
  const daySalt = new Date().toISOString().slice(0, 10);
  return crypto
    .createHash('sha256')
    .update(`${ip}|${userAgent}|${daySalt}`)
    .digest('hex')
    .slice(0, 16);
}
