# Transitions MVP (Kenya)

WhatsApp-first digital obituary platform for Kenya. Organizers can create dignified obituary packages (page + cards + bilingual audio), share a public link, collect RSVPs, and download a standardized content pack.

## Pre-mortem guardrails
- **Verification + watermark**: prevents misinformation before next-of-kin consent is confirmed.
- **WhatsApp audio restriction**: templates must not include audio; audio can be sent only after recipient interaction.
- **Noindex by default**: protects privacy until organizers explicitly opt in to search visibility.
- **Tributes off by default**: avoids moderation risk in the MVP.

## Prerequisites
- Node.js 18+
- npm
- SQLite (bundled with Prisma)

## Install
```bash
cd transitions
npm install
```

## Prisma migrate + generate
```bash
npm run prisma:generate
npm run prisma:migrate
```

## Seed data
```bash
npm run prisma:seed
```

## Run dev server
```bash
npm run dev
```

## Happy path test (manual)
1. Visit `http://localhost:3000/organizer`.
2. Complete the intake flow and publish.
3. Open `http://localhost:3000/admin` and set the case to **live**.
4. Visit the public case page and test:
   - RSVP
   - WhatsApp share link
   - Audio follow-up (enabled after visit)
   - Content pack download

## Storage note
Uploads are stored locally in `/public/uploads`. For production, swap to S3/GCS and update `lib/utils.ts`.

## API surface (stubs included)
- POST `/api/cases`
- POST `/api/cases/[id]/verify`
- POST `/api/cases/[id]/events`
- POST `/api/cases/[id]/copy`
- POST `/api/media/cards`
- POST `/api/media/tts`
- POST `/api/print/program`
- POST `/api/publish`
- POST `/api/distribute/whatsapp/template`
- POST `/api/distribute/whatsapp/audio`
- POST `/api/feeds/rss/update`
- POST `/api/payments/mpesa/stk`
- POST `/api/audit/log`

## Notes
- Timezone: Africa/Nairobi (EAT, UTC+3).
- Date format: `Fri, 5 Sep 2025, 2:00 PM EAT`.
- Faith templates: Christian, Muslim, Hindu, Interfaith, Neutral.
- WhatsApp is treated as a distribution channel, not guaranteed reach.
