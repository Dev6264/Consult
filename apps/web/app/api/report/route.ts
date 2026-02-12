import { NextResponse } from 'next/server'; import { prisma } from '@/lib/prisma';
export async function POST(req:Request){ const f=await req.formData(); await prisma.reportAlert.create({data:{obituaryId:String(f.get('obituaryId')),reason:String(f.get('reason'))}}); return NextResponse.redirect(new URL(req.headers.get('referer')||'/',req.url)); }
