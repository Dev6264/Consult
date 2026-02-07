"use client";

import { useState } from "react";
import { SectionHeader } from "../../components/section-header";

const rollups = [
  { name: "spring-launch", sessions: 8200, revenue: "$12,480" },
  { name: "vip-reengage", sessions: 2400, revenue: "$4,210" },
  { name: "creator-partner", sessions: 1750, revenue: "$3,980" }
];

export default function CampaignsPage() {
  const [baseUrl, setBaseUrl] = useState("https://shop.acmebikes.com/collections/new");
  const [campaign, setCampaign] = useState("spring-launch");
  const [source, setSource] = useState("newsletter");
  const [medium, setMedium] = useState("email");

  const utmUrl = `${baseUrl}?utm_source=${encodeURIComponent(source)}&utm_medium=${encodeURIComponent(
    medium
  )}&utm_campaign=${encodeURIComponent(campaign)}`;

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Campaigns & UTM builder"
        subtitle="Generate tracking URLs and monitor campaign rollups."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-4">
          <h3 className="text-lg font-semibold text-white">UTM builder</h3>
          <label className="block text-sm text-slate-300">
            Landing URL
            <input
              value={baseUrl}
              onChange={(event) => setBaseUrl(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            />
          </label>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block text-sm text-slate-300">
              Source
              <input
                value={source}
                onChange={(event) => setSource(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
              />
            </label>
            <label className="block text-sm text-slate-300">
              Medium
              <input
                value={medium}
                onChange={(event) => setMedium(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
              />
            </label>
            <label className="block text-sm text-slate-300">
              Campaign
              <input
                value={campaign}
                onChange={(event) => setCampaign(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
              />
            </label>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-slate-300">
            {utmUrl}
          </div>
        </div>
        <div className="card space-y-3">
          <h3 className="text-lg font-semibold text-white">Campaign rollups</h3>
          <p className="text-xs text-slate-500">utm_campaign performance, last 30 days</p>
          <div className="space-y-3 text-sm text-slate-300">
            {rollups.map((row) => (
              <div key={row.name} className="flex items-center justify-between">
                <span>{row.name}</span>
                <span>{row.sessions} sessions · {row.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
