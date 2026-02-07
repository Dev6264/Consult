"use client";

import { useState } from "react";
import { SectionHeader } from "../../components/section-header";

const demoAssets = [
  { name: "hero-bike.jpg", uploader: "Jamie", createdAt: "2024-08-02" },
  { name: "summer-lookbook.png", uploader: "Avery", createdAt: "2024-08-05" },
  { name: "storefront-video.mp4", uploader: "Jordan", createdAt: "2024-08-06" }
];

export default function MediaPage() {
  const [folder, setFolder] = useState("/campaigns/summer");

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Media library"
        subtitle="Upload, organize, and inspect asset metadata across the store."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-4">
          <h3 className="text-lg font-semibold text-white">Upload assets</h3>
          <label className="block text-sm text-slate-300">
            Folder
            <input
              value={folder}
              onChange={(event) => setFolder(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            />
          </label>
          <input type="file" className="text-sm text-slate-300" multiple />
          <p className="text-xs text-slate-500">Uploads are stored per tenant with metadata.</p>
        </div>
        <div className="card space-y-3">
          <h3 className="text-lg font-semibold text-white">Recent assets</h3>
          <div className="space-y-3 text-sm text-slate-300">
            {demoAssets.map((asset) => (
              <div key={asset.name} className="flex items-center justify-between">
                <span>{asset.name}</span>
                <span>
                  {asset.uploader} · {asset.createdAt}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
