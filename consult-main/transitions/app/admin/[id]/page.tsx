import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { Container } from "../../../components/Container";
import { Section } from "../../../components/Section";

export default async function AdminDetail({ params }: { params: { id: string } }) {
  const caseItem = await prisma.case.findUnique({
    where: { id: params.id },
    include: {
      organizer: true,
      deceased: true,
      events: true,
      auditLogs: { orderBy: { createdAt: "desc" } }
    }
  });

  if (!caseItem) notFound();

  return (
    <Container>
      <div className="space-y-6">
        <Section title="Case details" subtitle={`Status: ${caseItem.status}`}>
          <div className="space-y-2 text-sm text-slate-700">
            <p>Organizer: {caseItem.organizer?.fullName}</p>
            <p>Phone: {caseItem.organizer?.phoneE164}</p>
            <p>Consent attested: {caseItem.consentAttestation ? "Yes" : "No"}</p>
            <p>Package: {caseItem.package}</p>
            <p>Payment: {caseItem.paymentStatus}</p>
            <p>Privacy: {caseItem.privacy}</p>
            <p>Noindex: {caseItem.noindex ? "Yes" : "No"}</p>
          </div>
        </Section>

        <Section title="Verification actions" subtitle="Set pending/live/rejected or unpublish.">
          <div className="flex flex-col gap-3 sm:flex-row">
            {(["pending_verification", "live", "rejected"] as const).map((status) => (
              <form key={status} action={`/api/cases/${caseItem.id}/verify`} method="POST">
                <input type="hidden" name="status" value={status} />
                <button className="rounded-full border border-slate-300 px-4 py-2 text-sm" type="submit">
                  Mark {status.replace(/_/g, " ")}
                </button>
              </form>
            ))}
            <form action={`/api/publish`} method="POST">
              <input type="hidden" name="caseId" value={caseItem.id} />
              <input type="hidden" name="forceUnpublish" value="true" />
              <button className="rounded-full border border-red-300 px-4 py-2 text-sm text-red-600" type="submit">
                Unpublish
              </button>
            </form>
          </div>
        </Section>

        <Section title="Events">
          <ul className="space-y-2 text-sm text-slate-700">
            {caseItem.events.map((event) => (
              <li key={event.id}>{event.type.toUpperCase()} · {event.startIso} · {event.venue}</li>
            ))}
          </ul>
        </Section>

        <Section title="Audit log">
          <div className="space-y-2 text-xs text-slate-600">
            {caseItem.auditLogs.map((log) => (
              <div key={log.id} className="rounded-lg border border-slate-200 p-2">
                <p className="font-semibold">{log.event}</p>
                <p>{new Date(log.createdAt).toLocaleString("en-KE", { timeZone: "Africa/Nairobi" })}</p>
                <pre className="whitespace-pre-wrap break-words">{JSON.stringify(log.meta, null, 2)}</pre>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Takedown request">
          <form action="/api/audit/log" method="POST" className="space-y-2">
            <input type="hidden" name="caseId" value={caseItem.id} />
            <input type="hidden" name="event" value="takedown_request" />
            <textarea
              name="meta"
              className="w-full rounded border border-slate-300 p-2 text-sm"
              rows={3}
              placeholder="Record any takedown notes here."
            />
            <button className="rounded-full border border-slate-300 px-4 py-2 text-sm" type="submit">
              Log takedown note
            </button>
          </form>
        </Section>
      </div>
    </Container>
  );
}
