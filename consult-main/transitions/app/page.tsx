import { Container } from "../components/Container";
import { Section } from "../components/Section";

export default function Home() {
  return (
    <Container>
      <div className="space-y-6">
        <Section title="Transitions MVP" subtitle="WhatsApp-first digital obituary platform for Kenya">
          <div className="space-y-4 text-sm text-slate-700">
            <p>
              Build dignified obituary packages, share verified links, and collect RSVPs. Start with the organizer intake
              flow and review the seeded example case in the admin console.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                className="rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-white"
                href="/organizer"
              >
                Start Organizer Intake
              </a>
              <a className="rounded-full border border-slate-300 px-4 py-2 text-center text-sm" href="/admin">
                Open Admin Console
              </a>
            </div>
          </div>
        </Section>
        <Section title="Pre-mortem guardrails" subtitle="Why we designed the MVP this way">
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
            <li>Verification and watermarks prevent misinformation before next-of-kin consent is confirmed.</li>
            <li>WhatsApp templates exclude audio to comply with policy; audio is only sent after recipient interaction.</li>
            <li>Pages default to noindex to protect privacy until organizers opt in to search visibility.</li>
            <li>Tributes are off by default to reduce moderation risk in the MVP.</li>
          </ul>
        </Section>
      </div>
    </Container>
  );
}
