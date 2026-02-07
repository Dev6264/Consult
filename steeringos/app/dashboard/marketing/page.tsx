"use client";

import { useState } from "react";
import { MetricCard } from "../../../components/metric-card";
import { SectionHeader } from "../../../components/section-header";

export default function MarketingDashboardPage() {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Marketing performance"
        subtitle="Upload email funnel CSVs scoped to this store to monitor engagement."
      />
      <div className="grid gap-6 lg:grid-cols-4">
        <MetricCard title="Sent" value="24,200" tooltip="Email sends recorded from the latest upload." />
        <MetricCard title="Delivered" value="22,480" tooltip="Delivered emails minus bounces." />
        <MetricCard title="Open rate" value="38%" tooltip="Unique opens / delivered." />
        <MetricCard title="Orders" value="312" tooltip="Orders attributed to email clicks." />
      </div>
      <div className="card space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Email funnel upload</h3>
          <p className="text-xs text-slate-500">
            CSV columns: campaign, sent, delivered, opened, clicked, orders
          </p>
        </div>
        <input
          type="file"
          accept=".csv"
          className="text-sm text-slate-300"
          onChange={(event) => setFileName(event.target.files?.[0]?.name ?? null)}
        />
        {fileName ? (
          <p className="text-xs text-slate-400">Selected file: {fileName}</p>
        ) : (
          <p className="text-xs text-slate-500">No file uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
