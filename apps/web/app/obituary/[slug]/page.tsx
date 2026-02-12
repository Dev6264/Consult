import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const id = slug.split('-').at(-1);
  const ob = id ? await prisma.obituary.findUnique({ where: { id } }) : null;
  if (!ob) return {};
  const url = `${process.env.APP_URL}/obituary/${ob.slug}-${ob.id}`;
  return { title: `${ob.fullName} obituary`, alternates: { canonical: url }, openGraph: { title: ob.fullName, url } };
}

function badge(status: string) {
  if (status === 'PUBLISHED' || status === 'VERIFIED') return 'Verified';
  if (status === 'SUBMITTED' || status === 'SUBMITTED_HIGH_RISK') return 'Pending';
  return 'Unverified';
}

export default async function ObituaryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const id = slug.split('-').at(-1);
  if (!id) notFound();
  const ob = await prisma.obituary.findUnique({ where: { id }, include: { condolences: { where: { status: 'APPROVED' } } } });
  if (!ob || ob.status !== 'PUBLISHED') notFound();
  const url = `${process.env.APP_URL}/obituary/${ob.slug}-${ob.id}`;

  return <div className="space-y-4">
    <h1 className="text-2xl font-bold">{ob.fullName}</h1>
    <p>{badge(ob.status)} • {ob.county}</p>
    <p>{ob.shortBio}</p>
    <p>Funeral schedule: {JSON.stringify(ob.funeralEvents ?? {})}</p>
    {ob.mapUrl && <a className="text-blue-600" href={ob.mapUrl}>Map</a>}
    {(ob.paybillNumber || ob.paybillAccount) && <p>Paybill: {ob.paybillNumber} / {ob.paybillAccount}</p>}
    <div className="flex gap-2">
      <a className="underline" href={`https://wa.me/?text=${encodeURIComponent(url)}`}>Share WhatsApp</a>
      <a className="underline" href={`/api/obituaries/${ob.id}/qr`}>QR</a>
      <a className="underline" href={`/api/obituaries/${ob.id}/poster`}>Poster PDF</a>
    </div>

    <form action="/api/condolences" method="post" className="grid gap-2 max-w-xl">
      <input type="hidden" name="obituaryId" value={ob.id} />
      <input className="border p-2" name="authorName" placeholder="Your name" required />
      <textarea className="border p-2" name="message" placeholder="Condolence" required />
      <button className="bg-black text-white p-2">Submit condolence</button>
    </form>

    <form action="/api/leads" method="post" className="grid gap-2 max-w-xl">
      <input type="hidden" name="obituaryId" value={ob.id} />
      <select className="border p-2" name="category">
        <option>printing</option><option>photographer</option><option>tents/chairs</option><option>catering</option><option>transport</option><option>hotels</option>
      </select>
      <input className="border p-2" name="requesterName" placeholder="Name" required />
      <input className="border p-2" name="phone" placeholder="Phone" required />
      <textarea className="border p-2" name="notes" placeholder="Notes" />
      <button className="bg-black text-white p-2">Request services</button>
    </form>

    <form action="/api/report" method="post" className="grid gap-2 max-w-xl">
      <input type="hidden" name="obituaryId" value={ob.id} />
      <textarea className="border p-2" name="reason" placeholder="Report this page" required />
      <button className="bg-red-700 text-white p-2">Report</button>
    </form>

    <form action="/api/premium_intents" method="post" className="grid gap-2 max-w-xl">
      <input type="hidden" name="obituaryId" value={ob.id} />
      <input className="border p-2" name="contact" placeholder="Contact for premium" required />
      <textarea className="border p-2" name="notes" placeholder="Notes" />
      <button className="bg-amber-700 text-white p-2">Premium Memorial Interest</button>
    </form>

    <h2 className="font-semibold">Condolences</h2>
    {ob.condolences.map((c) => <p key={c.id}>{c.authorName}: {c.message}</p>)}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: ob.fullName, deathDate: ob.dod, address: ob.county }) }} />
  </div>;
}
