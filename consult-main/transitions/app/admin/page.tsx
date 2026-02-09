import { prisma } from "../../lib/prisma";
import { Container } from "../../components/Container";
import { Section } from "../../components/Section";

export default async function AdminPage() {
  const cases = await prisma.case.findMany({
    include: { deceased: true, organizer: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <Container>
      <Section title="Admin Console" subtitle="Verification, takedown, and audit log overview.">
        <div className="space-y-4">
          {cases.map((caseItem) => (
            <div key={caseItem.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {caseItem.deceased?.fullName ?? "Unnamed"}
                  </p>
                  <p className="text-xs text-slate-500">Status: {caseItem.status}</p>
                  <p className="text-xs text-slate-500">Package: {caseItem.package}</p>
                </div>
                <a className="rounded-full border border-slate-300 px-4 py-2 text-sm" href={`/admin/${caseItem.id}`}>
                  View details
                </a>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </Container>
  );
}
