import { cookies } from 'next/headers';
import crypto from 'node:crypto';

const SESSION_KEY = 'admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is required');
  return secret;
}

function hmac(value: string, secret: string) {
  return crypto.createHmac('sha256', secret).update(value).digest('base64url');
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export function signAdminSession(email: string, now = Date.now()) {
  const exp = Math.floor(now / 1000) + SESSION_TTL_SECONDS;
  const payload = `${email}|${exp}`;
  const sig = hmac(payload, getSessionSecret());
  return `${payload}|${sig}`;
}

export function verifyAdminSession(sessionValue?: string | null, now = Date.now()) {
  if (!sessionValue) return false;
  const [email, expRaw, sig] = sessionValue.split('|');
  if (!email || !expRaw || !sig) return false;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp <= Math.floor(now / 1000)) return false;
  if (email !== process.env.ADMIN_EMAIL) return false;

  const expectedSig = hmac(`${email}|${expRaw}`, getSessionSecret());
  return safeEqual(sig, expectedSig);
}

export async function isAdmin() {
  const jar = await cookies();
  return verifyAdminSession(jar.get(SESSION_KEY)?.value);
}

export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error('Unauthorized');
}

export async function setAdminCookie() {
  const jar = await cookies();
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  jar.set(SESSION_KEY, signAdminSession(email), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_TTL_SECONDS,
    path: '/'
  });
}
