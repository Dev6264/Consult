import { MetricCard } from "../../../components/metric-card";
import { SectionHeader } from "../../../components/section-header";

const products = [
  { name: "Gravel Pro Bike", revenue: "$18,400", units: 42 },
  { name: "City Commuter", revenue: "$12,980", units: 37 },
  { name: "Aero Helmet", revenue: "$8,210", units: 96 }
];

export default function EcommerceDashboardPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="E-commerce performance"
        subtitle="Compare revenue, orders, and conversion over your selected range."
      />
      <div className="grid gap-6 lg:grid-cols-4">
        <MetricCard title="Revenue" value="$84,240" delta="+8.2%" tooltip="Gross revenue from completed orders." />
        <MetricCard title="Orders" value="1,240" delta="+3.4%" tooltip="Completed orders in the date range." />
        <MetricCard title="AOV" value="$68" delta="-1.1%" tooltip="Average order value (revenue / orders)." />
        <MetricCard title="Conversion" value="3.9%" delta="+0.3%" tooltip="Orders divided by unique visitors." />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-semibold text-white">Top products</h3>
          <p className="text-xs text-slate-500">Based on revenue, last 30 days</p>
          <div className="mt-4 space-y-3">
            {products.map((product) => (
              <div key={product.name} className="flex items-center justify-between text-sm">
                <span className="text-slate-200">{product.name}</span>
                <span className="text-slate-300">{product.revenue} · {product.units} units</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card space-y-3">
          <h3 className="text-lg font-semibold text-white">Conversion health</h3>
          <p className="text-xs text-slate-500">Audience, product views, and checkout funnel</p>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex justify-between">
              <span>Visitors</span>
              <span>31,200</span>
            </div>
            <div className="flex justify-between">
              <span>Product views</span>
              <span>18,540</span>
            </div>
            <div className="flex justify-between">
              <span>Checkouts started</span>
              <span>3,280</span>
            </div>
            <div className="flex justify-between font-semibold text-white">
              <span>Orders</span>
              <span>1,240</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
