# Vercel Deployment — Environment Setup

Configure these before deploying Mighty Rides to Vercel.
**Ready-to-paste real values (DB URLs, generated `NEXTAUTH_SECRET`) are in the gitignored
`.env.vercel.local`.** This file is the safe, committed reference (placeholders only).

## 1. Environment variables

Set each in **Vercel → Project → Settings → Environment Variables** (Production + Preview).

| Variable | Notes |
|---|---|
| `DATABASE_URL` | Supabase **transaction pooler**, port **6543**, `?pgbouncer=true&connection_limit=1`. (Serverless can't use the IPv6 direct host.) |
| `DIRECT_URL` | Supabase **session pooler**, port **5432**. Used only by `prisma migrate`/`db push`. |
| `NEXTAUTH_SECRET` | 32-byte base64 secret (`openssl rand -base64 32`). One is generated in `.env.vercel.local`. |
| `NEXTAUTH_URL` | Production URL, e.g. `https://mighty-rides.vercel.app`. |
| `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_SITE_URL` | Same production URL. Used for emails & payment redirects. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Public WhatsApp number (digits only, e.g. `2567...`). |
| `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY` | Flutterwave dashboard. |
| `FLUTTERWAVE_SECRET_KEY` | Flutterwave dashboard. |
| `FLUTTERWAVE_SECRET_HASH` | Must equal the **Secret hash** set on the webhook (sent verbatim in `verif-hash`). |
| `RESEND_API_KEY` | Resend. Emails are no-ops if unset. |
| `EMAIL_FROM` | Verified sender, e.g. `Mighty Rides <no-reply@your-domain.com>`. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary (image/ID storage). |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Upstash (rate limiting). |
| `CRON_SECRET` | Random secret (`openssl rand -hex 32`). Vercel Cron auto-sends it as `Authorization: Bearer <CRON_SECRET>`; the cron routes validate it. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_SENTRY_DSN`, `LOG_LEVEL` | Optional. |

## 2. Database migration

The schema is already pushed to Supabase. To re-sync after schema changes, run **locally**
(uses `DIRECT_URL`, the session pooler):

```bash
npx prisma migrate deploy   # or: npx prisma db push
```

Don't run migrations from serverless against the transaction pooler.

## 3. Flutterwave webhook

In the Flutterwave dashboard set the webhook URL to:

```
https://<your-domain>/api/webhooks/flutterwave
```

Set the **Secret hash** to the same value as `FLUTTERWAVE_SECRET_HASH`. The handler does a
constant-time match of the `verif-hash` header against it, re-verifies the charge server-side,
and is idempotent.

## 4. Cron jobs

`vercel.json` schedules pickup & return reminders at **05:00 UTC = 08:00 EAT** daily. Vercel Cron
is enabled automatically on deploy; ensure `CRON_SECRET` is set so the routes accept the calls.

## 5. Build

Default `next build` works. Note: `package.json`'s `build` script also copies files for a
standalone server — for standard Vercel hosting you can override the Build Command to `next build`
if the standalone copy steps aren't needed.
