"use client";

import { useEffect, useState } from "react";

export function CaseInteractions({
  caseId,
  publicUrl,
  whatsappTemplateUrl,
  audioAvailable
}: {
  caseId: string;
  publicUrl: string;
  whatsappTemplateUrl: string;
  audioAvailable: boolean;
}) {
  const [visited, setVisited] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [headcount, setHeadcount] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    setVisited(true);
    window.localStorage.setItem(`case-visited-${caseId}`, "true");
  }, [caseId]);

  const sendAudio = async () => {
    const response = await fetch("/api/distribute/whatsapp/audio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caseId, visited })
    });
    const data = await response.json();
    setStatus(data.message ?? "Audio follow-up sent.");
  };

  const sendRsvp = async (payload: { status: string; headcount: number; name?: string; phone?: string }) => {
    const response = await fetch(`/api/cases/${caseId}/rsvps`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus(data.error ?? "Unable to RSVP");
      return;
    }
    setStatus("RSVP saved. Thank you.");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-700">RSVP</h3>
        <div className="mt-3 grid gap-3 text-sm">
          <input
            className="w-full rounded border border-slate-300 p-2"
            placeholder="Your name (optional)"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <input
            className="w-full rounded border border-slate-300 p-2"
            placeholder="Phone (optional)"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          <label className="text-xs text-slate-500">
            Headcount
            <input
              type="number"
              min={1}
              max={20}
              className="mt-1 w-full rounded border border-slate-300 p-2"
              value={headcount}
              onChange={(event) => setHeadcount(Number(event.target.value))}
            />
          </label>
          <div className="grid gap-2 sm:grid-cols-3">
            {(["yes", "maybe", "no"] as const).map((choice) => (
              <button
                key={choice}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                onClick={() =>
                  sendRsvp({ status: choice, headcount, name: name || undefined, phone: phone || undefined })
                }
              >
                {choice.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-700">Share via WhatsApp</h3>
        <p className="mt-2 text-xs text-slate-500">
          First share must include a link preview (image + text). Audio can only be sent after a visit.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <a className="rounded-full bg-emerald-600 px-4 py-2 text-center text-sm font-semibold text-white" href={whatsappTemplateUrl}>
            Share Link Preview
          </a>
          <button
            disabled={!visited || !audioAvailable}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            onClick={sendAudio}
          >
            Send Audio Follow-up
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-700">Copy link</h3>
        <button
          className="mt-2 rounded-full border border-slate-300 px-4 py-2 text-sm"
          onClick={async () => {
            await navigator.clipboard.writeText(publicUrl);
            setStatus("Link copied to clipboard.");
          }}
        >
          Copy Link
        </button>
      </div>

      {status && <div className="rounded-lg bg-slate-100 p-3 text-xs text-slate-600">{status}</div>}
    </div>
  );
}
