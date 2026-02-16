import { describe, expect, test, beforeEach, afterEach } from 'vitest';
import { signAdminSession, verifyAdminSession } from '@/lib/auth';

describe('admin session signing', () => {
  const oldEmail = process.env.ADMIN_EMAIL;
  const oldSecret = process.env.ADMIN_SESSION_SECRET;

  beforeEach(() => {
    process.env.ADMIN_EMAIL = 'admin@example.com';
    process.env.ADMIN_SESSION_SECRET = 'test-secret';
  });

  afterEach(() => {
    process.env.ADMIN_EMAIL = oldEmail;
    process.env.ADMIN_SESSION_SECRET = oldSecret;
  });

  test('accepts a signed session for the configured admin', () => {
    const now = Date.UTC(2026, 0, 1);
    const token = signAdminSession('admin@example.com', now);

    expect(verifyAdminSession(token, now + 1000)).toBe(true);
  });

  test('rejects forged or expired sessions', () => {
    const now = Date.UTC(2026, 0, 1);
    const token = signAdminSession('admin@example.com', now);
    const forged = token.replace('admin@example.com', 'attacker@example.com');

    expect(verifyAdminSession(forged, now + 1000)).toBe(false);
    expect(verifyAdminSession(token, now + 9 * 60 * 60 * 1000)).toBe(false);
  });
});
