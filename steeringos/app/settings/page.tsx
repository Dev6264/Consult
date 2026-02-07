import { SectionHeader } from "../../components/section-header";

const users = [
  { name: "Jamie Rivera", role: "Admin", email: "jamie@acmebikes.com" },
  { name: "Sam Lee", role: "Analyst", email: "sam@acmebikes.com" },
  { name: "Priya Patel", role: "Viewer", email: "priya@acmebikes.com" }
];

const webhooks = [
  { url: "https://hooks.acmebikes.com/orders", status: "Active" },
  { url: "https://hooks.acmebikes.com/inventory", status: "Paused" }
];

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Settings"
        subtitle="Manage store profile, team access, API keys, and integrations."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-4">
          <h3 className="text-lg font-semibold text-white">Store profile</h3>
          <div className="space-y-2 text-sm text-slate-300">
            <p>Name: Acme Bikes</p>
            <p>Timezone: America/Los_Angeles</p>
            <p>Plan: Growth</p>
          </div>
        </div>
        <div className="card space-y-4">
          <h3 className="text-lg font-semibold text-white">API keys</h3>
          <p className="text-xs text-slate-500">Rotate keys to control tracking access.</p>
          <button className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
            Generate new key
          </button>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-3">
          <h3 className="text-lg font-semibold text-white">Users & roles</h3>
          <div className="space-y-3 text-sm text-slate-300">
            {users.map((user) => (
              <div key={user.email} className="flex items-center justify-between">
                <span>
                  {user.name} · {user.role}
                </span>
                <span>{user.email}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card space-y-3">
          <h3 className="text-lg font-semibold text-white">Webhooks</h3>
          <div className="space-y-3 text-sm text-slate-300">
            {webhooks.map((hook) => (
              <div key={hook.url} className="flex items-center justify-between">
                <span>{hook.url}</span>
                <span>{hook.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card space-y-2">
        <h3 className="text-lg font-semibold text-white">Integrations</h3>
        <p className="text-xs text-slate-500">Magento, Shopify, WooCommerce placeholders (coming soon).</p>
      </div>
    </div>
  );
}
