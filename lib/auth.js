import { createHmac, timingSafeEqual } from 'crypto';

function getSecret() {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error('ADMIN_SESSION_SECRET env var is not set');
  return s;
}

export function createSessionToken() {
  const payload = Date.now().toString();
  const sig = createHmac('sha256', getSecret()).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

export function isValidSessionToken(token) {
  if (!token || typeof token !== 'string') return false;
  const dot = token.lastIndexOf('.');
  if (dot === -1) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  let expected;
  try {
    expected = createHmac('sha256', getSecret()).update(payload).digest('hex');
  } catch {
    return false;
  }
  const a = Buffer.from(sig.padEnd(expected.length, '0'), 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length) return false;
  if (!timingSafeEqual(a, b)) return false;
  const ts = parseInt(payload, 10);
  if (isNaN(ts)) return false;
  return Date.now() - ts < 86_400_000; // 24h
}
