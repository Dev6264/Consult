import { prisma } from '@/lib/prisma'; import { Parser } from 'json2csv'; import { requireAdmin } from '@/lib/auth';
export async function GET(){ await requireAdmin(); const leads=await prisma.serviceLead.findMany(); const parser=new Parser(); const csv=parser.parse(leads); return new Response(csv,{headers:{'content-type':'text/csv','content-disposition':'attachment; filename=leads.csv'}}); }
