import Link from 'next/link';

export default async function SubmittedPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold">Submission received</h1>
      <p>Your obituary draft has been received and is pending verification.</p>
      {id && <p className="text-sm text-gray-600">Reference ID: {id}</p>}
      <p>We will publish the notice once moderation is complete.</p>
      <Link href="/" className="underline">
        Back to home
      </Link>
    </div>
  );
}
