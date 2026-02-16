import { notFound } from "next/navigation";
import { Container } from "../../../components/Container";
import { Section } from "../../../components/Section";
import { Badge } from "../../../components/Badge";
import { prisma } from "../../../lib/prisma";
import { formatKenyaDate, buildWhatsAppShare } from "../../../lib/utils";
import { LanguageToggle } from "../../../components/LanguageToggle";
import { CaseInteractions } from "../../../components/CaseInteractions";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const caseItem = await prisma.case.findUnique({
    where: { slug: params.slug },
    include: { media: true, deceased: true }
  });
  if (!caseItem || !caseItem.media) return {};
  return {
    title: `${caseItem.deceased?.fullName ?? "Obituary"} | Transitions`,
    openGraph: {
      title: caseItem.deceased?.fullName ?? "Obituary",
      images: [caseItem.media.cardOgUrl]
    },
    robots: caseItem.noindex ? { index: false, follow: false } : { index: true, follow: true }
  };
}

export default async function CasePage({ params }: { params: { slug: string } }) {
  const caseItem = await prisma.case.findUnique({
    where: { slug: params.slug },
    include: {
      deceased: true,
      events: true,
      media: true,
      copyDeck: true
    }
  });

  if (!caseItem || !caseItem.deceased || !caseItem.media) {
    notFound();
  }

  const isLive = caseItem.status === "live";
  const publicUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/cases/${caseItem.slug}`;
  const whatsappTemplateUrl = buildWhatsAppShare(
    caseItem.copyDeck?.copyShortEn ?? "We remember a cherished life.",
    publicUrl
  );

  return (
    <Container>
      <div className="space-y-6">
        {!isLive && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
            PENDING VERIFICATION - This page is not yet live.
          </div>
        )}

        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white">
          {!isLive && (
            <div className="watermark absolute inset-0 flex items-center justify-center">
              <p className="text-3xl font-bold text-red-400/60">PENDING VERIFICATION</p>
            </div>
          )}
          <div className="relative grid gap-6 p-6 md:grid-cols-[180px_1fr]">
            <img
              src={caseItem.media.cardSqUrl}
              alt="Obituary card"
              className="h-40 w-40 rounded-2xl object-cover"
            />
            <div className="space-y-2">
              <Badge tone={isLive ? "success" : "warning"}>{caseItem.status.replace(/_/g, " ")}</Badge>
              <h1 className="text-2xl font-semibold text-slate-900">{caseItem.deceased.fullName}</h1>
              <p className="text-sm text-slate-600">
                {caseItem.deceased.dob ? `DOB: ${caseItem.deceased.dob} · ` : ""}
                DOD: {caseItem.deceased.dod}
              </p>
              <p className="text-sm text-slate-600">Faith: {caseItem.deceased.faith}</p>
              <p className="text-sm text-slate-700">{caseItem.deceased.shortBio}</p>
            </div>
          </div>
        </div>

        <Section title="Copy (English & Kiswahili)" subtitle="Toggle languages for sharing">
          <LanguageToggle
            en={caseItem.copyDeck?.copyShortEn ?? ""}
            sw={caseItem.copyDeck?.copyShortSw ?? ""}
          />
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-slate-700">Long profile</h3>
            <p className="mt-2 text-sm text-slate-600 whitespace-pre-line">{caseItem.copyDeck?.copyLong}</p>
          </div>
        </Section>

        <Section title="Audio announcements" subtitle="English + Kiswahili audio placeholders">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-slate-700">English</p>
              {caseItem.media.audioEnUrl ? (
                <audio controls className="mt-2 w-full">
                  <source src={caseItem.media.audioEnUrl} type="audio/mpeg" />
                </audio>
              ) : (
                <p className="text-xs text-slate-500">Audio pending.</p>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Kiswahili</p>
              {caseItem.media.audioSwUrl ? (
                <audio controls className="mt-2 w-full">
                  <source src={caseItem.media.audioSwUrl} type="audio/mpeg" />
                </audio>
              ) : (
                <p className="text-xs text-slate-500">Audio pending.</p>
              )}
            </div>
          </div>
        </Section>

        <Section title="Events timeline" subtitle="Vigil, service, burial">
          <div className="space-y-4">
            {caseItem.events.map((event) => (
              <div key={event.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{event.type.toUpperCase()}</p>
                    <p className="text-sm text-slate-600">{formatKenyaDate(event.startIso)}</p>
                    <p className="text-sm text-slate-600">{event.venue}</p>
                    {event.address && <p className="text-xs text-slate-500">{event.address}</p>}
                  </div>
                  <div className="flex flex-col gap-2 text-sm">
                    <a
                      className="rounded-full border border-slate-300 px-4 py-2 text-center"
                      href={event.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Get Directions
                    </a>
                    <a
                      className="rounded-full border border-slate-300 px-4 py-2 text-center"
                      href={`/api/events/${event.id}/ics`}
                    >
                      Add to Calendar
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="RSVP & Share" subtitle="Let the family know you are attending.">
          <CaseInteractions
            caseId={caseItem.id}
            publicUrl={publicUrl}
            whatsappTemplateUrl={whatsappTemplateUrl}
            audioAvailable={Boolean(caseItem.media.audioEnUrl || caseItem.media.audioSwUrl)}
          />
        </Section>

        <Section title="Download content pack" subtitle="ZIP with profile + media assets.">
          <a
            className="rounded-full border border-slate-300 px-4 py-2 text-sm"
            href={`/api/cases/${caseItem.id}/download`}
          >
            Download Content Pack
          </a>
        </Section>

        <Section title="Request takedown" subtitle="If this page should be removed, submit a request.">
          <form className="space-y-3 text-sm" action="/api/takedown" method="POST">
            <input type="hidden" name="caseId" value={caseItem.id} />
            <input type="hidden" name="url" value={publicUrl} />
            <label className="block">
              Your name
              <input className="mt-1 w-full rounded border border-slate-300 p-2" name="requesterName" required />
            </label>
            <label className="block">
              Phone
              <input className="mt-1 w-full rounded border border-slate-300 p-2" name="requesterPhone" required />
            </label>
            <label className="block">
              Reason
              <textarea className="mt-1 w-full rounded border border-slate-300 p-2" name="reason" rows={3} required />
            </label>
            <button className="rounded-full border border-slate-300 px-4 py-2 text-sm" type="submit">
              Submit request
            </button>
          </form>
        </Section>
      </div>
    </Container>
  );
}
