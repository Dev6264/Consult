# SteeringOS

SteeringOS is a multi-tenant dashboard for small e-commerce businesses to steer their store from a single cockpit.

## One-command local start

```bash
docker compose up
```

The stack uses Next.js (App Router), Prisma + Postgres, NextAuth, Tailwind, and Recharts.

## Demo credentials

| Role | Email | Password |
| --- | --- | --- |
| Admin | jamie@acmebikes.com | steeringos |
| Analyst | sam@acmebikes.com | steeringos |
| Viewer | priya@acmebikes.com | steeringos |

## Tracker installation (Magento)

1. Upload `public/steeringos-tracker.js` to your Magento theme assets.
2. Add the script tag to your Magento storefront layout:

```html
<script src="https://yourdomain.com/steeringos-tracker.js"></script>
```

3. Replace the API key and endpoint inside the snippet with your tenant key and host.
4. Track custom events from Magento pages:

```html
<script>
  window.SteeringOS.track("add_to_cart", window.location.pathname);
</script>
```

## Metric definitions

- **Active users now**: unique sessions with events in the last 5 minutes.
- **New vs returning**: first-time sessions vs sessions with prior events in last 30 days.
- **Guest vs registered**: sessions without a user ID vs sessions with a known account.
- **Conversion rate**: purchases ÷ visits.
- **AOV**: revenue ÷ orders.

## Magento connector (stub)

The connector is a stub for Magento REST API integration.

```bash
npm run prisma:generate
node --loader ts-node/esm magento-connector/load-demo.ts
```

TODOs are marked in `magento-connector/interface.ts`.

## API routes

- `POST /api/collect` (API key required)
- `GET /api/metrics/realtime`
- `GET /api/metrics/ecommerce`
- `GET/POST /api/metrics/marketing`
- `GET/POST /api/campaigns`
- `GET/POST /api/media`
- `GET/PUT /api/settings/store`
- `GET /api/settings/users`
- `GET/POST/DELETE /api/settings/api-keys`
- `GET/POST /api/settings/webhooks`
