import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-3xl font-semibold text-white">SteeringOS Command Center</h2>
        <p className="mt-2 text-sm text-slate-400">
          Choose a dashboard to start steering your store.
        </p>
        <div className="mt-6 flex gap-4">
          <Link
            href="/dashboard/realtime"
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Launch realtime view
          </Link>
          <Link
            href="/dashboard/ecommerce"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200"
          >
            Review performance
          </Link>
        </div>
      </div>
    </div>
  );
}
