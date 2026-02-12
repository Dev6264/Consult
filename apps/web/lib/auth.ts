import { cookies } from 'next/headers';

const SESSION_KEY = 'admin_session';

export async function isAdmin() {
  const jar = await cookies();
  return jar.get(SESSION_KEY)?.value === process.env.ADMIN_EMAIL;
}

export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error('Unauthorized');
}

export async function setAdminCookie() {
  const jar = await cookies();
  jar.set(SESSION_KEY, process.env.ADMIN_EMAIL || 'admin@example.com', { httpOnly: true, sameSite: 'lax' });
}
