import { NextResponse } from 'next/server'; import { requireGptAuth } from '@/lib/gptAuth';
export async function POST(req:Request){ if(!requireGptAuth(req)) return NextResponse.json({error:'Unauthorized'},{status:401}); return NextResponse.json({required:['fullName','county','dod','primaryContactName','primaryContactPhone','deathCert','requesterId']}); }
