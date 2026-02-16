import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkDuplicate, evaluateRisk, makeSlug } from '@/lib/risk';
import { savePrivateFile } from '@/lib/storage';
import crypto from 'node:crypto';
import { throttle } from '@/lib/rateLimit';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'local';
  if (throttle(`obit-${ip}`, 6, 60000)) return NextResponse.json({ error: 'Rate limited' }, { status: 429 });
  const form = await req.formData();
  if ((form.get('honeypot') as string)?.trim()) return NextResponse.json({ error: 'Spam' }, { status: 400 });

  const fullName = String(form.get('fullName') || '');
  const county = String(form.get('county') || '');
  const dod = new Date(String(form.get('dod')));
  const primaryContactName = String(form.get('primaryContactName') || '');
  const primaryContactPhone = String(form.get('primaryContactPhone') || '');
  if (!fullName || !county || !primaryContactName || !primaryContactPhone || Number.isNaN(dod.getTime())) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const deathCert = form.get('deathCert') as File;
  const requesterId = form.get('requesterId') as File;
  if (!deathCert || !requesterId) return NextResponse.json({ error: 'Required docs missing' }, { status: 400 });

  const risk = await evaluateRisk(fullName);
  const duplicate = await checkDuplicate(fullName, county, dod);
  const obituary = await prisma.obituary.create({ data: { slug: makeSlug(fullName), fullName, county, dod, primaryContactName, primaryContactPhone, status: risk.highRisk || duplicate ? 'SUBMITTED_HIGH_RISK' : 'SUBMITTED', riskFlag: risk.highRisk || duplicate ? 'HIGH_RISK' : risk.riskFlag, needsInfoToken: crypto.randomUUID() } });

  const dcPath = await savePrivateFile(Buffer.from(await deathCert.arrayBuffer()), deathCert.name);
  const ridPath = await savePrivateFile(Buffer.from(await requesterId.arrayBuffer()), requesterId.name);
  await prisma.documentUpload.createMany({ data: [{ obituaryId: obituary.id, type: 'DEATH_CERT', filePath: dcPath, mimeType: deathCert.type }, { obituaryId: obituary.id, type: 'REQUESTER_ID', filePath: ridPath, mimeType: requesterId.type }] });
  await prisma.auditLog.create({ data: { obituaryId: obituary.id, actor: 'SYSTEM', action: 'SUBMISSION_CREATED', detailsJson: { risk, duplicate } } });
  return NextResponse.redirect(new URL(`/create/submitted?id=${obituary.id}`, req.url));
}
