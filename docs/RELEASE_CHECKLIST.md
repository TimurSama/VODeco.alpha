# Release checklist (v1)

## Database
- Run `prisma migrate deploy` (prod) or `prisma db push` (staging).
- Run `prisma generate` after any schema updates.
- Verify seed data for demo dashboards (optional).

## Build & deploy
- `npm run build` to validate production build.
- Verify `NEXT_PUBLIC_*` env vars are set (analytics, API base).
- Check SSR/CSR logs for any runtime warnings.

## Monitoring & logs
- Connect error tracking (Sentry/Logtail/etc).
- Ensure server logs include request IDs and error stack traces.
- Add alerts for 5xx spikes on API routes.

## Security & compliance
- Confirm `Terms`, `Privacy`, `Disclaimer` are accessible.
- Validate CORS/CSRF settings for API routes (if applicable).
- Rate limits for public APIs (if enabled).

## Product readiness
- Smoke test: landing → CTA → form submit.
- Dashboard loads with external data toggle.
- Globe interactions and resource card open/close.

