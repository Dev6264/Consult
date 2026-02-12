# Verified Obituary Commerce MVP

## Local setup
1. `cp .env.example .env`
2. `docker compose up -d`
3. `npm install`
4. `npm run prisma:generate`
5. `npm run prisma:migrate -- --name init`
6. `npm run dev`

## Admin bootstrap
- Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`.
- Login at `/admin/login`.

## Deployment notes
- Set env vars: `DATABASE_URL`, `APP_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `GPT_ACTIONS_API_KEY`.
- Run migrations on deploy.
- Uploaded files are local in `apps/web/uploads`; replace `lib/storage.ts` with S3 adapter in production.

## Custom GPT Actions setup
1. Create a Custom GPT and add a strict system prompt:
   - collect obituary fields conversationally;
   - call `intakeStart` then `intakeSubmit`;
   - never claim published until `getObituaryStatus` returns `PUBLISHED`.
2. Import `openapi/gpt-actions.yaml`.
3. Add auth header `x-api-key` with `GPT_ACTIONS_API_KEY`.
4. Example flow:
   - User: "Create obituary for Jane Doe..."
   - Tool: `intakeStart`
   - Tool: `intakeSubmit`
   - Assistant returns draft id/status/link.
