import { NextResponse } from 'next/server'; import { prisma } from '@/lib/prisma';
export async function POST(req:Request){ const f=await req.formData(); await prisma.premiumIntent.create({data:{obituaryId:String(f.get('obituaryId')),contact:String(f.get('contact')),notes:String(f.get('notes')||'')}}); return NextResponse.redirect(new URL(req.headers.get('referer')||'/',req.url)); }
