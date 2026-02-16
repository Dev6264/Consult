"use client";

import { useState } from "react";
import { Container } from "../../components/Container";
import { Section } from "../../components/Section";

const defaultCopyEn = "We celebrate a life well lived. Join us in remembrance and prayer.";
const defaultCopySw = "Tunaadhimisha maisha yenye baraka. Karibuni tumuombee na kumkumbuka.";
const defaultLong =
  "Family and friends are invited to gather as we honour a life filled with love, service, and faith. Your presence brings comfort and unity.";

export default function OrganizerIntake() {
  const [step, setStep] = useState(1);
  const [caseId, setCaseId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    slug: "",
    consentAttestation: false,
    noindex: true,
    privacy: "public",
    package: "announcement",
    organizerName: "",
    organizerPhone: "+2547",
    organizerRelation: "",
    deceasedName: "",
    deceasedDob: "",
    deceasedDod: "",
    deceasedFaith: "christian",
    deceasedBio: "",
    eventType: "service",
    eventStart: "",
    eventVenue: "",
    eventAddress: "",
    eventMapUrl: "",
    copyShortEn: defaultCopyEn,
    copyShortSw: defaultCopySw,
    copyLong: defaultLong,
    radio15: "We remember and celebrate a cherished life. Join us as we gather in prayer.",
    radio30:
      "The family invites you to a service of remembrance. Visit the memorial page for directions and times."
  });

  const update = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submitCase = async () => {
    setMessage(null);
    const payload = {
      slug: form.slug,
      consentAttestation: form.consentAttestation,
      noindex: form.noindex,
      privacy: form.privacy,
      package: form.package,
      organizer: {
        fullName: form.organizerName,
        phoneE164: form.organizerPhone,
        relation: form.organizerRelation
      },
      deceased: {
        fullName: form.deceasedName,
        dob: form.deceasedDob || null,
        dod: form.deceasedDod,
        faith: form.deceasedFaith,
        shortBio: form.deceasedBio
      },
      events: [
        {
          type: form.eventType,
          startIso: form.eventStart,
          venue: form.eventVenue,
          address: form.eventAddress || null,
          mapUrl: form.eventMapUrl
        }
      ],
      copyShortEn: form.copyShortEn,
      copyShortSw: form.copyShortSw,
      copyLong: form.copyLong,
      radio15: form.radio15,
      radio30: form.radio30
    };

    const response = await fetch("/api/cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ?? "Unable to create case.");
      return;
    }
    setCaseId(data.id);
    setStep(4);
  };

  const publishCase = async () => {
    if (!caseId) return;
    const response = await fetch("/api/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caseId })
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ?? "Unable to publish.");
      return;
    }
    setMessage(`Case published. Share link: ${data.publicUrl}`);
    setStep(5);
  };

  return (
    <Container>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Organizer Intake</h1>
          <p className="text-sm text-slate-600">Step {step} of 5</p>
        </div>
        {message && <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">{message}</div>}

        {step === 1 && (
          <Section title="1) Basics" subtitle="Capture the essentials and consent from next of kin.">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm">
                Slug (unique URL)
                <input
                  className="mt-1 w-full rounded border border-slate-300 p-2"
                  value={form.slug}
                  onChange={(event) => update("slug", event.target.value)}
                />
              </label>
              <label className="text-sm">
                Package tier
                <select
                  className="mt-1 w-full rounded border border-slate-300 p-2"
                  value={form.package}
                  onChange={(event) => update("package", event.target.value)}
                >
                  <option value="announcement">Announcement</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="corporate">Corporate</option>
                </select>
              </label>
              <label className="text-sm">
                Organizer full name
                <input
                  className="mt-1 w-full rounded border border-slate-300 p-2"
                  value={form.organizerName}
                  onChange={(event) => update("organizerName", event.target.value)}
                />
              </label>
              <label className="text-sm">
                Organizer phone (+2547...)
                <input
                  className="mt-1 w-full rounded border border-slate-300 p-2"
                  value={form.organizerPhone}
                  onChange={(event) => update("organizerPhone", event.target.value)}
                />
              </label>
              <label className="text-sm">
                Relation to deceased
                <input
                  className="mt-1 w-full rounded border border-slate-300 p-2"
                  value={form.organizerRelation}
                  onChange={(event) => update("organizerRelation", event.target.value)}
                />
              </label>
              <label className="text-sm">
                Privacy
                <select
                  className="mt-1 w-full rounded border border-slate-300 p-2"
                  value={form.privacy}
                  onChange={(event) => update("privacy", event.target.value)}
                >
                  <option value="public">Public (shareable link)</option>
                  <option value="invite">Invite only</option>
                </select>
              </label>
            </div>
            <label className="mt-4 flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.consentAttestation}
                onChange={(event) => update("consentAttestation", event.target.checked)}
              />
              I confirm I am next of kin or authorized to publish this obituary.
            </label>
            <label className="mt-2 flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={!form.noindex}
                onChange={(event) => update("noindex", !event.target.checked)}
              />
              Allow search engines to index this page (optional).
            </label>
            <div className="mt-4 flex justify-end">
              <button
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
                onClick={() => setStep(2)}
              >
                Continue to Events
              </button>
            </div>
          </Section>
        )}

        {step === 2 && (
          <Section title="2) Events" subtitle="At least one event is required.">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm">
                Event type
                <select
                  className="mt-1 w-full rounded border border-slate-300 p-2"
                  value={form.eventType}
                  onChange={(event) => update("eventType", event.target.value)}
                >
                  <option value="vigil">Vigil</option>
                  <option value="service">Service</option>
                  <option value="burial">Burial</option>
                </select>
              </label>
              <label className="text-sm">
                Event start (ISO, with +03:00)
                <input
                  className="mt-1 w-full rounded border border-slate-300 p-2"
                  placeholder="2025-09-05T14:00:00+03:00"
                  value={form.eventStart}
                  onChange={(event) => update("eventStart", event.target.value)}
                />
              </label>
              <label className="text-sm">
                Venue
                <input
                  className="mt-1 w-full rounded border border-slate-300 p-2"
                  value={form.eventVenue}
                  onChange={(event) => update("eventVenue", event.target.value)}
                />
              </label>
              <label className="text-sm">
                Address (optional)
                <input
                  className="mt-1 w-full rounded border border-slate-300 p-2"
                  value={form.eventAddress}
                  onChange={(event) => update("eventAddress", event.target.value)}
                />
              </label>
              <label className="text-sm md:col-span-2">
                Map URL (Google/Apple Maps)
                <input
                  className="mt-1 w-full rounded border border-slate-300 p-2"
                  value={form.eventMapUrl}
                  onChange={(event) => update("eventMapUrl", event.target.value)}
                />
              </label>
            </div>
            <div className="mt-4 flex justify-between">
              <button className="rounded-full border border-slate-300 px-4 py-2 text-sm" onClick={() => setStep(1)}>
                Back
              </button>
              <button
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
                onClick={() => setStep(3)}
              >
                Continue to Review
              </button>
            </div>
          </Section>
        )}

        {step === 3 && (
          <Section title="3) Review copy" subtitle="English + Kiswahili copy templates and scripts.">
            <div className="grid gap-4">
              <label className="text-sm">
                Deceased full name
                <input
                  className="mt-1 w-full rounded border border-slate-300 p-2"
                  value={form.deceasedName}
                  onChange={(event) => update("deceasedName", event.target.value)}
                />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm">
                  DOB (optional)
                  <input
                    className="mt-1 w-full rounded border border-slate-300 p-2"
                    value={form.deceasedDob}
                    onChange={(event) => update("deceasedDob", event.target.value)}
                  />
                </label>
                <label className="text-sm">
                  DOD
                  <input
                    className="mt-1 w-full rounded border border-slate-300 p-2"
                    value={form.deceasedDod}
                    onChange={(event) => update("deceasedDod", event.target.value)}
                  />
                </label>
              </div>
              <label className="text-sm">
                Faith template
                <select
                  className="mt-1 w-full rounded border border-slate-300 p-2"
                  value={form.deceasedFaith}
                  onChange={(event) => update("deceasedFaith", event.target.value)}
                >
                  <option value="christian">Christian</option>
                  <option value="muslim">Muslim</option>
                  <option value="hindu">Hindu</option>
                  <option value="interfaith">Interfaith</option>
                  <option value="neutral">Neutral</option>
                </select>
              </label>
              <label className="text-sm">
                Short bio
                <textarea
                  className="mt-1 w-full rounded border border-slate-300 p-2"
                  rows={3}
                  value={form.deceasedBio}
                  onChange={(event) => update("deceasedBio", event.target.value)}
                />
              </label>
              <label className="text-sm">
                Short copy (EN)
                <textarea
                  className="mt-1 w-full rounded border border-slate-300 p-2"
                  rows={3}
                  value={form.copyShortEn}
                  onChange={(event) => update("copyShortEn", event.target.value)}
                />
              </label>
              <label className="text-sm">
                Short copy (SW)
                <textarea
                  className="mt-1 w-full rounded border border-slate-300 p-2"
                  rows={3}
                  value={form.copyShortSw}
                  onChange={(event) => update("copyShortSw", event.target.value)}
                />
              </label>
              <label className="text-sm">
                Long profile draft
                <textarea
                  className="mt-1 w-full rounded border border-slate-300 p-2"
                  rows={4}
                  value={form.copyLong}
                  onChange={(event) => update("copyLong", event.target.value)}
                />
              </label>
              <label className="text-sm">
                15s radio script (max 220 chars)
                <textarea
                  className="mt-1 w-full rounded border border-slate-300 p-2"
                  rows={2}
                  maxLength={220}
                  value={form.radio15}
                  onChange={(event) => update("radio15", event.target.value)}
                />
              </label>
              <label className="text-sm">
                30s radio script (max 440 chars)
                <textarea
                  className="mt-1 w-full rounded border border-slate-300 p-2"
                  rows={3}
                  maxLength={440}
                  value={form.radio30}
                  onChange={(event) => update("radio30", event.target.value)}
                />
              </label>
            </div>
            <div className="mt-4 flex justify-between">
              <button className="rounded-full border border-slate-300 px-4 py-2 text-sm" onClick={() => setStep(2)}>
                Back
              </button>
              <button
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
                onClick={submitCase}
              >
                Save & Continue
              </button>
            </div>
          </Section>
        )}

        {step === 4 && caseId && (
          <Section title="4) Package + Payment" subtitle="Payments use a stub M-Pesa flow.">
            <div className="space-y-3 text-sm text-slate-700">
              <p>Package selected: {form.package}</p>
              <button
                className="rounded-full border border-slate-300 px-4 py-2 text-sm"
                onClick={async () => {
                  const response = await fetch("/api/payments/mpesa/stk", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ caseId, amount: 1000 })
                  });
                  const data = await response.json();
                  setMessage(data.message ?? "M-Pesa stub invoked.");
                }}
              >
                Trigger M-Pesa STK Push (stub)
              </button>
            </div>
            <div className="mt-4 flex justify-between">
              <button className="rounded-full border border-slate-300 px-4 py-2 text-sm" onClick={() => setStep(3)}>
                Back
              </button>
              <button
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
                onClick={publishCase}
              >
                Publish + Share
              </button>
            </div>
          </Section>
        )}

        {step === 5 && caseId && (
          <Section title="5) Publish + Share" subtitle="Your obituary is ready to share.">
            <div className="space-y-4 text-sm text-slate-700">
              <p>Shareable link will become live after verification.</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <a
                  className="rounded-full border border-slate-300 px-4 py-2 text-center text-sm"
                  href={`/cases/${form.slug}`}
                >
                  View Public Page
                </a>
                <button
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm"
                  onClick={async () => {
                    await navigator.clipboard.writeText(`${window.location.origin}/cases/${form.slug}`);
                    setMessage("Link copied to clipboard.");
                  }}
                >
                  Copy Link
                </button>
              </div>
            </div>
          </Section>
        )}
      </div>
    </Container>
  );
}
