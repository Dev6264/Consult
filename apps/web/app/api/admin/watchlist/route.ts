import { NextResponse } from 'next/server'; import { prisma } from '@/lib/prisma'; import { requireAdmin } from '@/lib/auth';
export async function POST(req:Request){ await requireAdmin(); const f=await req.formData(); await prisma.watchlistName.create({data:{name:String(f.get('name')),reason:String(f.get('reason')||'')}}); return NextResponse.redirect(new URL('/admin/watchlist',req.url)); }
