import { MetricCard } from "../../../components/metric-card";
import { SectionHeader } from "../../../components/section-header";
import { RealtimeChart } from "../../../components/realtime-chart";

const realtimePoints = Array.from({ length: 12 }).map((_, index) => ({
  minute: `${index * 2}m`,
  views: 180 + Math.round(Math.sin(index / 2) * 40) + index * 6
}));

const funnel = [
  { step: "visit", count: 820 },
  { step: "view_item", count: 610 },
  { step: "add_to_cart", count: 270 },
  { step: "begin_checkout", count: 160 },
  { step: "purchase", count: 72 }
];

export default function RealtimeDashboardPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Realtime dashboard"
        subtitle="Last 30 minutes · auto-refresh every 60 seconds"
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <MetricCard
          title="Active users now"
          value="128"
          delta="+14%"
          tooltip="Live visitors with events in the last 5 minutes."
        />
        <MetricCard
          title="New vs returning"
          value="72% new"
          tooltip="New visitors have no prior sessions in the past 30 days."
        />
        <MetricCard
          title="Guest vs registered"
          value="64% guest"
          tooltip="Registered users have logged in or checked out previously."
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Page views</p>
              <p className="text-xs text-slate-500">Every 2 minutes · 30-minute window</p>
            </div>
            <span className="badge">Realtime</span>
          </div>
          <RealtimeChart data={realtimePoints} />
        </div>
        <div className="card space-y-3">
          <div>
            <p className="text-sm text-slate-400">Funnel conversion</p>
            <p className="text-xs text-slate-500">visit → purchase</p>
          </div>
          <div className="space-y-3">
            {funnel.map((item) => (
              <div key={item.step} className="flex items-center justify-between text-sm">
                <span className="text-slate-300">{item.step}</span>
                <span className="text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <MetricCard title="Device breakdown" value="62% mobile" tooltip="Based on user agent in the event stream." />
        <MetricCard title="Geo snapshot" value="US · 54%" tooltip="Geo resolved from IP (stubbed)." />
        <MetricCard title="Traffic sources" value="Paid · 41%" tooltip="Derived from utm_source/referrer." />
      </div>
    </div>
  );
}
