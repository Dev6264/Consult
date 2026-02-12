import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function Home({ searchParams }: { searchParams: Promise<{ name?: string; county?: string }> }) {
  const { name, county } = await searchParams;
  const notices = await prisma.obituary.findMany({
    where: {
      status: 'PUBLISHED',
      ...(name ? { fullName: { contains: name, mode: 'insensitive' } } : {}),
      ...(county ? { county: { contains: county, mode: 'insensitive' } } : {})
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Verified Obituary Commerce - Kenya</h1>
      <p>Every notice is moderated before publish; high-profile names are escalated.</p>
      <form className="flex gap-2">
        <input className="border p-2" name="name" placeholder="Search name" defaultValue={name} />
        <input className="border p-2" name="county" placeholder="County" defaultValue={county} />
        <button className="bg-black text-white px-3">Search</button>
      </form>
      <div className="grid gap-3">
        {notices.map((n) => (
          <Link key={n.id} href={`/obituary/${n.slug}-${n.id}`} className="bg-white border p-3 block">
            <div className="font-semibold">{n.fullName}</div>
            <div>{n.county}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
