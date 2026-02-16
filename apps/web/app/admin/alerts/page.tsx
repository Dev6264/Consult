import { prisma } from '@/lib/prisma'; import { isAdmin } from '@/lib/auth'; import { redirect } from 'next/navigation';
export default async function Page(){ if(!(await isAdmin())) redirect('/admin/login'); const alerts=await prisma.reportAlert.findMany({orderBy:{createdAt:'desc'}}); return <div>{alerts.map(a=><p key={a.id}>{a.reason}</p>)}</div>; }
