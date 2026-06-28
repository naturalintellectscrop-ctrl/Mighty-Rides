# Mighty Rides — Production Readiness Audit (Code-Level)

**Date:** 2026-06-24
**Method:** Static audit of the repository (no deployment, browser, or live-payment access available from this environment).
**Verdict:** ❌ **DELAY & FIX — NOT ready for client handover.**

> ## ⏩ REMEDIATION LOG
> **Build is now GREEN end-to-end:** `tsc --noEmit` = 0 errors, `next build` compiles and generates all
> routes, schema pushed to Supabase Postgres (18 tables), admin user created via a live DB write.
> Status of the original blockers:
> - **B1 (schema regression) — RESOLVED & VERIFIED.** Reconstructed schema; 0 type errors; live DB writes work.
> - **B2 (Postgres) — DONE.** Datasource is `postgresql`; schema pushed to Supabase via the **IPv4 session
>   pooler** (`aws-1-eu-central-1.pooler.supabase.com:5432`). NOTE: the direct `db.<ref>.supabase.co` host
>   is IPv6-only and unreachable from IPv4 networks — use the pooler. For **Vercel**, set `DATABASE_URL`
>   to the **transaction pooler** (port 6543, `?pgbouncer=true`).
> - **B5 (payment URL) — FIXED.** `.env.example` (H5) — FIXED. `generateStaticParams` hardened against build-time DB outages.
> - **B3 (registration verification email) — FIXED.** `register` now generates a 24h token, stores it
>   (settings `verify_<token>`), and sends the verification email via Resend.
> - **B4 (Flutterwave webhook signature) — FIXED.** `verifyWebhookSignature` now does a constant-time
>   comparison of the `verif-hash` header against `FLUTTERWAVE_SECRET_HASH` (Flutterwave sends it
>   verbatim; it is not an HMAC). Also: the create flow now stores `payment_ref` so the webhook can
>   find the booking.
> - **H1/H2 (webhook reconciliation) — FIXED.** Webhook now re-verifies server-side via
>   `verifyPayment`, does a **currency-aware** amount check (UGX vs USD via the configured rate),
>   is idempotent, and sends the customer a confirmation + admin a notification on deposit paid.
> - **H3 (session timeout) — FIXED.** NextAuth now uses a rolling **30-minute** inactivity window.
> - **H4 (registration validation) — FIXED.** Server now enforces **Ugandan phone format** and
>   **DOB ≥ 18**.
> - **Unverified-login gate — ADDED.** `authorize` now rejects sign-in until `email_verified` (with a
>   friendly login-page message); the admin user is seeded verified so it isn't locked out.
> - **Timezone (§7.4) — FIXED.** `vercel.json` cron moved to `0 5 * * *` (05:00 UTC = **08:00 EAT**).
> - **Vercel/Postgres connection — CONFIGURED.** `directUrl` added to the datasource (transaction
>   pooler at runtime, session pooler for migrations). See `VERCEL_ENV_SETUP.md` (guide) and the
>   gitignored `.env.vercel.local` (ready-to-paste values incl. a generated `NEXTAUTH_SECRET`).
> - **Admin lifecycle wiring — COMPLETED.** Booking status changes (confirm/decline/activate/returned)
>   now send the customer the matching email; the `/admin/pickups` quick actions now have working
>   `/api/bookings/[id]/activate` + `/return` routes; the admin **Settings** page now saves
>   (`POST /api/settings`); added `GET /api/health` (DB ping + admin-only env-wiring report).
>   Default settings (incl. `office_address`) + demo data seeded into Supabase. Build is green
>   (76/76 pages prerender).
> - **STILL OPEN (live-only, needs your keys + a deploy):** real Flutterwave sandbox payment,
>   real email delivery to an inbox (set `RESEND_API_KEY` + verified domain), and the
>   §2/§10–12 design/responsive/perf/browser checks.
>
> #### original blocker detail below
> - **B1 (schema regression).** `prisma/schema.prisma` was reconstructed:
>   PascalCase models with `@@map` to the existing snake_case tables, `@default(cuid())` +
>   `@updatedAt`, and the **6 previously-missing tables** added (`RentalVehicle`, `RentalInquiry`,
>   `ConversionEvent`, `CorporateInquiry`, `AfterSaleRequest`, `TradeInRequest`). All delegate
>   references were normalized to camelCase singular and the enum imports replaced with local types.
>   **`tsc --noEmit` now reports 0 errors across `src/`, `prisma/seed.ts`, and `scripts/`** (was 109).
> - **B2 (Postgres) — IN PROGRESS.** Datasource switched to `postgresql`; `DATABASE_URL` points at the
>   provided Supabase instance. **Schema push/migration is BLOCKED**: the direct host
>   `db.<ref>.supabase.co` resolves to IPv6 only and is unreachable from this (IPv4) environment.
>   Needs the Supabase **IPv4 connection pooler** string (session mode, port 5432) to run
>   `prisma db push` / `migrate` and a real `next build`.
> - **B5 (payment URL) — FIXED.** `bookings/create` now returns `paymentResult.paymentUrl`.
> - **`.env.example` (H5) — FIXED.** Now documents all ~20 required variables.
> - **Still open:** B3 (registration verification email), B4 (Flutterwave webhook compares an HMAC
>   instead of the verbatim secret hash), H1–H4, H6. A real `next build` and the live-test sections
>   remain pending DB connectivity.

This audit covers everything verifiable from source. Live/runtime checks I could not
perform are collected in the "Manual / Live Verification Still Required" section at the end.

---

## 🔴 SHOWSTOPPER BLOCKERS (must fix before any handover)

### B1. Prisma schema is a degraded introspection — does not match the app (CONFIRMED via typecheck)
**Update after deeper investigation (deps installed, `prisma generate` + `tsc` run):** This is worse
than a naming mismatch. The committed `prisma/schema.prisma` is an **introspected, incomplete**
schema (snake_case plural models, `String` instead of enums, no `@default`/`@updatedAt`, no migrations).
The application code was written against a **different, richer schema** that no longer exists in the repo:

- **Models the code uses that DON'T EXIST in the schema at all** (6+ entire tables): `afterSaleRequest`,
  `conversionEvent`, `corporateInquiry`, `rentalInquiry`, `rentalVehicle`, `tradeInRequest`. The routes
  `/api/after-sale`, `/api/conversion`, `/api/corporate`, `/api/rentals`, `/api/rentals/inquiry`,
  `/api/trade-in` reference tables that were never created — they will crash and have nowhere to store data.
- **Models referenced by camelCase delegate** (schema is snake_case): `db.blogPost` (×18), `db.softLock`
  (×5), `db.sourcingRequest` (×5), `db.adminAuditLog` (×5), `db.salesLog`, `db.bookingStatusLog`, etc.
- **Enums imported from `@prisma/client` that the schema doesn't define**: `UserRole`, `BookingStatus`,
  `BlogCategory`, `ComplaintStatus`, `ComplaintUrgency`.
- **`create()` calls fail** because `id` and `updated_at` have no `@default(cuid())`/`@updatedAt`.

A full `tsc --noEmit` reports **109 app type errors**, the majority rooted in this schema regression.
`prisma/seed.ts` also expects the original PascalCase models (`db.user`, `db.vehicle`, `db.blogPost`).

**This cannot be fixed by renaming.** The Prisma schema must be **reconstructed** to match the code
(PascalCase models with `@@map` to the existing tables, the 5 enums, `@id @default(cuid())` +
`@updatedAt`, and the ~6 missing tables created) — work that should be done together with the B2
Postgres migration. **Partial remediation already applied:** delegate/relation references for
`users`/`vehicles`/`settings`/`bookings`/`complaints`/`inquiries` were made internally consistent, the
Prisma client now generates, and the typecheck now runs (it previously could not be assessed).

#### (original finding) Prisma model/delegate mismatch — app cannot run as committed
`prisma/schema.prisma` defines **plural** models only: `users`, `vehicles`, `settings`
(plus `bookings`, `complaints`, etc.). But the code calls **singular** delegates in 64 places:

- `db.vehicle.*` — **31 occurrences**
- `db.setting.*` — **27 occurrences**
- `db.user.*` — **6 occurrences**

vs. only 9 correct plural references (`db.users`/`db.vehicles`/`db.settings`).

Prisma does **not** singularize delegate names — `db.user`/`db.vehicle`/`db.setting` resolve to
`undefined`, so a freshly generated client (i.e. any clean Vercel build) throws
`Cannot read properties of undefined (reading 'findUnique')` on the affected paths. These paths
include the **most critical flows**:
- `src/lib/auth.ts` → `db.user.findUnique` → **login is broken**
- `src/app/admin/page.tsx`, `admin/fleet`, `admin/rentees`, `admin/reports` → **admin dashboard broken**
- `src/app/api/bookings/create/route.ts` → `db.vehicle`, `db.setting` → **booking broken**
- `src/app/api/cars/route.ts`, `api/vehicles/route.ts`, `api/bookings/check-availability` → **inventory broken**
- `api/auth/reset-password`, `api/auth/verify-email` → **account recovery broken**

**Fix:** make schema model names and code references consistent (rename code to plural, or add
`@@map` and rename models to singular), then `prisma generate` + a full typecheck.
> Note: `node_modules` is not installed and the client isn't generated, so I could not execute
> `tsc`/`prisma generate` to get the compiler's confirmation — but the mismatch is unambiguous in source.

### B2. Database is SQLite — will not work on Vercel
`prisma/schema.prisma`:
```
datasource db { provider = "sqlite"; url = "file:../db/mightyrides.db" }
```
`.env.example` likewise sets `DATABASE_URL="file:./db/mightyrides.db"`.

Vercel serverless functions have an **ephemeral, read-only** filesystem. A file-based SQLite DB
cannot persist writes (registrations, bookings, payments) and is not shared across function
instances. The audit's Section 9.1 explicitly expects **PostgreSQL**. This is incompatible with the
stated deployment target (`mighty-rides.vercel.app`).

**Fix:** migrate to a hosted Postgres (Neon/Supabase/Vercel Postgres), set `provider = "postgresql"`,
update `DATABASE_URL`, run migrations.

### B3. Registration never sends a verification email — verification flow is dead
`src/app/api/auth/register/route.ts:159` literally comments *"In production, send verification email
here / For now, we'll just return success."* The user is created with `email_verified: false`, but:
- No verification email is sent (no call to `sendVerificationEmail`).
- `src/lib/auth.ts` `authorize()` **does not check `email_verified`**, so unverified users can log in anyway.

Net result: the entire "verify your email" journey (Audit 4.1 Step 1, 7.1 emails #1–#2) does not exist.
A `verify-email` API route and email template both exist but are never wired to registration.

### B4. Flutterwave webhook signature check is wrong — real webhooks rejected
`src/lib/flutterwave.ts:verifyWebhookSignature` computes
`HMAC-SHA256(payload, SECRET_HASH)` and compares it to the `verif-hash` header.
Flutterwave does **not** HMAC-sign payloads — it sends your configured **secret hash verbatim** in
`verif-hash`. The correct check is a constant-time compare of `verif-hash === FLUTTERWAVE_SECRET_HASH`.
As written, **every legitimate webhook fails signature verification** and returns 401, so deposits are
never reconciled server-side.

### B5. Payment URL never reaches the client
`api/bookings/create/route.ts:235` returns `paymentResult?.data?.link`, but `initializePayment()`
returns `{ success, txRef, paymentUrl }` — there is no `.data.link`. So `paymentUrl` is **always
`null`** and the user is never redirected to pay. (Audit 4.1 Step 4.)

---

## 🟠 HIGH-PRIORITY ISSUES

| # | Area | Finding |
|---|------|---------|
| H1 | Payments | Booking charges in **USD** (`currency: 'USD'`, `amount: depositUsd`), but the webhook reconciles against `booking.deposit_ugx` (`data.amount !== booking.deposit_ugx`) — guaranteed mismatch; only logs a warning, never blocks. |
| H2 | Payments | Webhook only sets `deposit_paid: true`. It does **not** advance booking status or send a confirmation email. Audit 6.3 / 7.1 #3 ("booking created + confirmation email after payment") unmet. |
| H3 | Auth | Session `maxAge` is **30 days** with no idle timeout. Audit 5.1 expects auto-logout after 30 min inactivity. |
| H4 | Registration | No **DOB ≥ 18** validation and no Uganda **phone-format** validation (Audit 5.2). ID document fields (`idType`, `idFrontUrl`) are optional, so "must upload ID" isn't enforced server-side. |
| H5 | Config | `.env.example` lists only `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`. Missing the ~15 vars the code actually reads (Flutterwave, Cloudinary, Resend `RESEND_API_KEY`/`EMAIL_FROM`, Upstash, `CRON_SECRET`, `NEXT_PUBLIC_*`). Handover/onboarding will fail silently. |
| H6 | Env naming | Audit's expected names don't match code: code uses `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY` (not `FLUTTERWAVE_PUBLIC_KEY`), `NEXT_PUBLIC_GA_MEASUREMENT_ID` (not `GOOGLE_ANALYTICS_ID`), `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (not `CLOUDINARY_CLOUD_NAME`). Verify Vercel matches **code**, not the audit doc. |
| H7 | Repo hygiene | No `node_modules` installed and **no git commits** in the repo. Can't build/run/test locally; nothing is version-controlled. |

---

## 🟡 SECTION-BY-SECTION (verifiable items)

**§1 Infrastructure** — DB engine wrong (B2); env example incomplete (H5). SSL/Vercel status = live check.
**§5 Auth & Security**
- ✅ Passwords hashed with bcrypt cost 12; strong password policy (upper/lower/number/special/length/common-pattern) in `register`.
- ✅ Duplicate-email rejected; rate limiting on register (5/h per IP).
- ✅ Route protection: `middleware.ts` guards `/portal` & `/admin` by session cookie; admin role re-checked server-side in pages.
- ❌ Login broken by B1; email-verify gate missing (B3); no idle timeout (H3); login `authorize` has no rate limit.
- ⚠️ Middleware only checks **cookie presence**, not validity (acceptable since pages re-verify, but worth noting).

**§6 Payments**
- ✅ Deposit math correct: `DEPOSIT_PERCENTAGE = 30`, `calculateDeposit = round(total × 0.30)`.
- ❌ Webhook signature (B4), payment URL (B5), currency mismatch (H1), no post-payment status/email (H2).

**§7 Email** — ✅ Resend integration present with full template set (verification, welcome, booking
pending/confirmed/active/declined/returned, extension, pickup/return reminders, admin alert) and a
dev-mode no-op when `RESEND_API_KEY` is unset. ❌ Registration doesn't trigger any email (B3); "did it
arrive" requires live test.

**§9 Database & API** — Endpoints exist for auth, vehicles, cars, bookings (create/availability/
extension/my), inquiries, complaints, admin booking actions, webhooks, cron. ❌ Many crash on B1.
✅ Webhook is naturally idempotent (sets a boolean). ✅ Cron routes (`pickup-reminders`,
`return-reminders`) authenticate via `CRON_SECRET` bearer header.

**§13 Error Handling** — ✅ Custom `src/app/error.tsx` and `not-found.tsx` exist. ✅ User-friendly
validation messages in register. ⚠️ Webhook always returns 200 even on internal failure (intentional
for retry-suppression, but hides genuine failures — pair with alerting).

**§14 Legal** — ✅ `/terms` (84 lines) and `/privacy` (98 lines) pages exist with content. Legal
adequacy for Uganda jurisdiction = human/legal review.

**Security headers** (`next.config.ts`) — ✅ `X-Frame-Options`, `X-Content-Type-Options`, CSP set.
⚠️ No explicit `Strict-Transport-Security` (Vercel adds HSTS at the edge, so low risk).

---

## 🔵 MANUAL / LIVE VERIFICATION STILL REQUIRED (I could not run these)

These need a deployed build, a browser, real test credentials, and an inbox:
- **§1.1/1.2** Live load of `https://mighty-rides.vercel.app/`, load timing, SSL cert details.
- **§2** Visual layout, brand colors, typography, responsive rendering (375/768/1024/1440).
- **§3/§4** Click-through of every page and the full booking/extension/complaint/return journeys.
- **§6.1/6.3** Real Flutterwave sandbox payment + webhook delivery (will fail until B4/B5 fixed).
- **§7** Actual email **delivery** to an inbox and timezone-correct reminder scheduling.
- **§10–§12** Mobile/touch testing, image optimization in-network, Lighthouse scores, browser/device matrix.
- **§15/§16** Documentation, admin training, support channels, final handover sign-off.

---

## Bottom line
The repository in its current state **cannot build and run on the intended Vercel target**: the
Prisma layer is internally inconsistent (B1), the database engine is wrong for serverless (B2), the
email-verification and payment-redirect flows are incomplete (B3, B5), and webhook reconciliation is
broken (B4). Recommendation: **DELAY**. Fix B1–B5 and H1–H7, install deps, get a clean
`prisma generate` + `next build`, then re-run the live sections of this audit end-to-end.
