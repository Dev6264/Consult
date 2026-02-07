import Link from "next/link";

const nav = [
  { href: "/dashboard/realtime", label: "Realtime" },
  { href: "/dashboard/ecommerce", label: "E-commerce" },
  { href: "/dashboard/marketing", label: "Marketing" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/media", label: "Media" },
  { href: "/settings", label: "Settings" }
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-900 bg-slate-950/80 p-6">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-white">SteeringOS</h1>
        <p className="text-xs text-slate-400">Multi-tenant commerce cockpit</p>
      </div>
      <nav className="space-y-3">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-xl border border-slate-800 px-4 py-3 text-sm text-slate-200 transition hover:border-brand-500 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-10 space-y-3">
        <div className="rounded-xl border border-slate-800 p-4 text-xs text-slate-300">
          <p className="font-semibold text-slate-200">Tenant: Acme Bikes</p>
          <p>Role: Admin</p>
        </div>
        <Link href="/login" className="block text-xs text-slate-500 underline">
          Switch account
        </Link>
      </div>
    </aside>
  );
}
