# Mighty Rides — Digital Operating System

**Comprehensive System Report**
Prepared: June 2026 · Platform: mighty-rides.vercel.app · Status: **Live · pre-launch hardening**

A comprehensive report on the platform that runs Mighty Rides — luxury vehicle sales, hire, sourcing, and corporate mobility — end to end, from the customer showroom to the back-office desk.

---

## Contents

1. [Executive summary](#1--executive-summary)
2. [The business](#2--the-business)
3. [By the numbers](#3--by-the-numbers)
4. [Customer features](#4--customer-features)
5. [Admin features](#5--admin-features)
6. [Key journeys](#6--key-journeys)
7. [Technology](#7--technology)
8. [Architecture](#8--architecture)
9. [Data model](#9--data-model)
10. [Site map](#10--site-map)
11. [API surface](#11--api-surface)
12. [Security](#12--security)
13. [SEO & performance](#13--seo--performance)
14. [Build history](#14--build-history)
15. [Status & gaps](#15--status--gaps)
16. [Access & operations](#16--access--operations)
17. [Roadmap](#17--roadmap)

---

## 1 — Executive summary

Mighty Rides has moved from a manual, phone-and-spreadsheet operation to a **single web platform** that lets customers browse, book and track luxury vehicles themselves — and lets staff run the entire fleet, bookings, and customer relationship from one dashboard.

**For customers** — A premium public site to buy or hire vehicles, an account with ID verification, self-service booking with a deposit, real-time rental tracking, extensions, issue reporting, and downloadable receipts — available 24/7, no phone call required.

**For Mighty Rides** — One admin dashboard to manage the fleet, confirm and hand over bookings, run pickups & returns, answer inquiries and complaints, publish content, and see the day's numbers — replacing scattered emails, calls and paperwork.

> **Bottom line:** The platform is **built, rebuilt on a production database, and deployed live**. Core flows are verified working. What remains before a formal launch is external configuration — payment keys, a verified email domain — and a human visual QA pass. Payments are intentionally deferred pending commercial terms with Mighty Rides.

---

## 2 — The business

Founded in **2018** and based at Mirembe Business Centre, Plot 18, Lugogo Bypass, Kampala, Mighty Rides is a premium automotive company serving Uganda's executives, businesses, event organisers and visitors. Pricing is Ugandan-Shilling-first (UGX) with a USD equivalent shown alongside.

| Service | Description |
|---|---|
| **Luxury car sales** | Premium pre-owned and imported vehicles, sold by consultation. |
| **Luxury car hire** | The main revenue line — daily, weekly and monthly rental for weddings, airport transfers and executive travel. |
| **Vehicle sourcing** | Finding and importing specific vehicles a customer wants but isn't in stock. |
| **Corporate mobility** | Fleet and long-term arrangements for organisations. |
| **Prestige & concierge** | White-glove service for VIP and dignitary clients. |
| **Parts & maintenance** | Spare parts, customisation and after-sale support. |

---

## 3 — By the numbers

| Metric | Value |
|---|---|
| Pages / screens | **44** |
| API endpoints | **52** |
| Data models | **19** |
| UI components | **107** |
| Lines of code (TS/TSX) | **~41,500** |
| Automated emails | **10** templates |

Figures are from the current codebase (TypeScript/TSX under `src/`). The platform is a single Next.js application covering the public website, the customer portal, and the admin dashboard.

---

## 4 — Customer features

- **Browse & filter inventory** — Separate catalogues for cars for sale and cars for hire, with dual UGX/USD pricing, real photos, specifications and live availability. Hire vehicles are filtered by occasion — Wedding, Airport, Executive, Long-term, Personal, Corporate.
- **Register & verify identity** — A three-step signup: personal details, ID document upload (stored privately), and terms. Strong-password and Ugandan-phone validation; DOB 18+ check; a verification email with a secure link.
- **Self-service booking** — Pick dates, see live cost and the 30% deposit, and reserve — with conflict checks so a vehicle can't be double-booked. (Online payment is wired but toggled off pending Flutterwave setup.)
- **Track an active rental** — A private portal showing the active booking, return countdown, and status, with confirmation and reminder emails at each step.
- **Request an extension** — Ask to keep a vehicle longer from the portal; staff approve or decline and the customer is notified.
- **Report an issue** — Raise a complaint with type and urgency; staff respond and resolve, and the customer sees the response — end to end, wired to the database.
- **History & receipts** — Past rentals and a downloadable PDF receipt per completed booking.
- **Manage the account** — Edit name and phone, change password, and see verification status — all reading and writing real user data.
- **Inquire & convert** — Contact, sourcing, corporate, trade-in and after-sale forms; WhatsApp quick-contact throughout; newsletter signup.
- **Read & get answers** — Blog, a categorised FAQ, and legal pages (Terms, Privacy, Cancellation).

---

## 5 — Admin features

A single, responsive admin dashboard (light theme, gold accent) with one sidebar covering every area:

- **Dashboard overview** — KPI tiles (active rentals, pending bookings, available vehicles, open complaints, new inquiries) plus today's pickups, returns and registrations.
- **Fleet management** — Full add / edit / delete of vehicles with photo upload, specifications, pricing, status, and the **Events & Occasions** selector that controls which cars appear under each hire event filter.
- **Booking lifecycle** — Confirm, decline, activate (handover) and return bookings — each transition sends the matching customer email and updates vehicle status.
- **Pickups & returns** — A day view with one-tap "Mark Active" and "Mark Returned" quick actions.
- **Complaints & inquiries** — Inboxes to review, respond to and resolve customer issues and leads.
- **Customer directory** — Every registered rentee with verification status; ID documents viewable via short-lived signed URLs.
- **Content & sourcing** — Blog authoring, sourcing requests, and a sales log.
- **Settings** — Exchange rate, notification email, office details, WhatsApp number and site announcement — all live-editable and saved.

---

## 6 — Key journeys

**How a rental flows:**

1. **Browse & choose** — Customer finds a vehicle on `/hire`, filtered by occasion, and opens its detail page.
2. **Register & verify** — Creates an account, uploads ID, accepts terms, verifies email.
3. **Book & reserve** — Selects dates; the system checks availability, calculates the total and the 30% deposit, and creates the booking (payment step pending Flutterwave).
4. **Confirmation** — Booking is recorded; confirmation and admin-notification emails go out.
5. **Handover** — Staff mark the booking active at the office; the vehicle status flips to Rented Out and the customer gets the "rental active" email.
6. **Return & receipt** — Staff mark it returned; the vehicle returns to Available and the customer receives a thank-you email with a receipt link.

Parallel journeys — **extension requests** and **complaint handling** — follow the same request → staff action → notification pattern, all persisted in the database.

---

## 7 — Technology

A modern, industry-standard stack chosen for reliability, security and low running cost.

| Layer | Technology | Role |
|---|---|---|
| Framework | Next.js 16 (App Router) | The whole application — pages, API, rendering |
| Language | TypeScript 5 | Type-safe code, fewer runtime bugs |
| UI | React 19 · Tailwind CSS 4 | Interface and styling / brand design system |
| Database | PostgreSQL (Supabase) · Prisma 6 | All data; type-safe access layer |
| Auth | NextAuth 4 | Login, sessions, role-based access |
| Payments | Flutterwave *(pending keys)* | MTN / Airtel / card — deposit & webhook wired |
| Email | Resend | Transactional email (10 templates) |
| Files | Cloudinary | Vehicle photos (public) & ID docs (private) |
| Rate limiting | Upstash Redis *(optional)* | Abuse protection (fails open until configured) |
| PDF | @react-pdf/renderer | Rental receipts |
| Hosting | Vercel | Serverless hosting, SSL, global delivery |

---

## 8 — Architecture

- **One app, three faces** — A single Next.js codebase serves the **public website**, the authenticated **customer portal**, and the **admin dashboard** — sharing components, data and design tokens.
- **Live data, resilient rendering** — Data-driven pages render per request against the live database and degrade to a friendly empty-state if the database is briefly unreachable — so a blip never shows an error page.
- **Serverless + pooled DB** — Vercel functions connect to Supabase Postgres through the transaction pooler, so the app scales without exhausting database connections.
- **Two visual worlds** — A dark, gold luxury theme for the public site; a light, low-eye-strain theme for the admin dashboard — the gold accent carries the brand across both.

---

## 9 — Data model

The database was reconstructed on PostgreSQL with idiomatic models mapped to the underlying tables. Nineteen tables:

| Model | Holds |
|---|---|
| `User` | Customers & admins — profile, role, ID docs, verification status |
| `Vehicle` | Fleet — sale/hire type, pricing, photos, specs, occasions, status |
| `Booking` | Rentals — dates, cost, deposit, status, handover details |
| `BookingStatusLog` | Audit trail of every booking status change |
| `Complaint` | Customer issues, urgency, admin response, resolution |
| `Inquiry` | Leads from contact / vehicle / sourcing forms |
| `SalesLog` | Recorded vehicle sales |
| `SourcingRequest` | Bespoke vehicle-sourcing requests |
| `SoftLock` | Temporary holds preventing double-booking |
| `BlogPost` | Blog content & categories |
| `Setting` | Editable config — rate, office, WhatsApp, announcement |
| `AdminAuditLog` | Record of admin actions |
| `NewsletterSubscriber` | Email signups |
| `CorporateInquiry`, `RentalInquiry`, `RentalVehicle`, `TradeInRequest`, `AfterSaleRequest`, `ConversionEvent` | Additional lead, listing and analytics tables restored during the rebuild |

---

## 10 — Site map

**Public site:** `/` · `/cars` · `/cars/[slug]` · `/hire` · `/hire/[slug]` · `/about` · `/services` · `/sourcing` · `/corporate` · `/concierge` · `/prestige` · `/contact` · `/blog` · `/blog/[slug]` · `/faq` · `/terms` · `/privacy` · `/cancellation`

**Accounts:** `/login` · `/register` · `/forgot-password` · `/reset-password` · `/verify-email`

**Customer portal:** `/portal` · `/portal/history` · `/portal/complaints` · `/portal/profile`

**Admin dashboard:** `/admin` · `/admin/fleet` · `/admin/fleet/new` · `/admin/fleet/[id]` · `/admin/bookings` · `/admin/bookings/[id]` · `/admin/pickups` · `/admin/inquiries` · `/admin/sourcing` · `/admin/complaints` · `/admin/sales` · `/admin/rentees` · `/admin/reports` · `/admin/blog` · `/admin/blog/new` · `/admin/blog/[id]/edit` · `/admin/settings`

**Utility:** `/sitemap.xml`, `/robots.txt` and `/api/health` are generated for search engines and uptime monitoring.

---

## 11 — API surface

52 endpoints, grouped by area. Admin and portal endpoints require an authenticated session; admin endpoints additionally require the admin role.

| Area | Endpoints |
|---|---|
| Auth & account | `register` · `verify-email` · `forgot/reset-password` · `[...nextauth]` · `user/profile` · `user/change-password` |
| Inventory | `vehicles` · `vehicles/[slug]` · `cars` |
| Bookings | `bookings/create` · `check-availability` · `unavailable` · `my` · `[id]/activate` · `[id]/return` · `[id]/request-extension` · `[id]/receipt` |
| Complaints | `complaints` · `complaints/[id]/resolve` |
| Leads & forms | `contact` · `inquiries` · `sourcing` · `corporate` · `rentals` · `rentals/inquiry` · `trade-in` · `after-sale` · `concierge` · `conversion` · `newsletter` |
| Admin | `admin/fleet(+[id])` · `admin/bookings/[id](+extension)` · `admin/complaints` · `admin/sourcing` · `admin/sales` · `admin/blog` · `admin/signed-url` |
| Content & config | `blog(+[slug])` · `settings(+[key], ugx_usd_rate)` |
| Media | `upload` |
| Payments | `webhooks/flutterwave` *(ready)* |
| Automation & ops | `cron/pickup-reminders` · `cron/return-reminders` · `health` |

---

## 12 — Security

- **Passwords** — Hashed with bcrypt (cost 12) — never stored or logged in plain text. Strong-password policy on signup and change.
- **Access control** — Middleware protects `/portal` and `/admin`; admin pages re-check the admin role server-side. Customers can only see their own data.
- **Private ID documents** — ID uploads go to a private Cloudinary folder; admins view them only through time-limited signed URLs — no permanent public link.
- **Payment webhook** — Verified against the Flutterwave secret hash (constant-time), idempotent, and re-verified server-side — untrusted requests are rejected.
- **Input validation & limits** — Server-side validation on every form; rate limiting on registration, password reset, uploads and newsletter; security headers and a content-security policy.
- **Encrypted in transit** — HTTPS everywhere via Vercel; secrets kept in environment variables, never in the codebase.

---

## 13 — SEO & performance

**Structured data & metadata.** Every vehicle page carries Product/Car rich-result markup with price and availability; the homepage carries local-business (AutoDealer) data; the FAQ carries FAQ markup. Per-page titles, descriptions, canonical URLs, Open Graph and Twitter cards are in place, with a generated sitemap and robots file.

**Performance & accessibility.** Images are optimised and served from a CDN; pages render dynamically for live inventory. Accessibility work includes labelled form controls, keyboard-operable menus and corrected colour contrast. A full Lighthouse and cross-browser pass on the deployed site remains a launch checklist item.

---

## 14 — Build history

The platform arrived with a data layer that could not run in production. It was rebuilt from the ground up and then progressively hardened. The through-line, in order:

| Milestone | What changed |
|---|---|
| Database rebuild | Reconstructed the Prisma schema on PostgreSQL, restored 6 missing tables and all enums, and fixed the flows the old code depended on. |
| Deployable build | Fixed a stale-client build failure, made every data page build-independent, and replaced a broken packaging step — the build now succeeds even if the database is unreachable. |
| Real data everywhere | Replaced demo/mock content on the homepage and profile with live database data; removed seeded fake inventory; localised to Uganda/UGX. |
| Critical flows wired | Booking lifecycle emails, activate/return, complaints end-to-end, settings save, Cloudinary upload, vehicle CRUD, health check, registration verification. |
| Growth & polish | Service categories, contact, legal & cancellation pages, FAQ, newsletter, full SEO/structured data, DB-resilient pages. |
| UI fixes | Hero overlap, mobile menu, text-contrast root cause, admin login redirect, occasions management, and the duplicate-sidebar / light admin theme. |

Delivered across 15 version-controlled commits on `main`, each verified with a clean type-check and green production build.

---

## 15 — Status & gaps

| Area | Status | Notes |
|---|---|---|
| Database on Supabase | ✅ Done | Live, pooled, schema in sync |
| Deployed build | ✅ Done | Builds green; DB-independent |
| Auth, registration, portal | ✅ Verified | Signup persists; admin reaches dashboard |
| Fleet & occasions management | ✅ Verified | Create/edit/delete + event filter tested |
| Booking lifecycle & emails | ✅ Wired | Emails send via Resend |
| Cloudinary uploads | ✅ Verified | Live upload to the account confirmed |
| Runtime DB URL on Vercel | ✅ Fixed | Must use the pooler host, not the direct host |
| Email delivery (any inbox) | 🟠 Config | Verify a domain in Resend; till then only the owner receives |
| Payments (Flutterwave) | 🟠 Deferred | Code ready; keys + webhook pending commercial terms |
| Rate limiting (Upstash) | 🟠 Optional | Fails open until configured |
| Browser / mobile / Lighthouse QA | 🔵 Human pass | Needs a person on the deployed site |

---

## 16 — Access & operations

**Admin sign-in**

| | |
|---|---|
| Where | `/login` → redirects admins to `/admin` |
| Email | `admin@mightyrides.com` |
| Password | set at handover |

Registered customers appear under **Admin → Rentees**.

**Add a hire vehicle**

1. Admin → Fleet → Add Vehicle
2. Set type to *For Hire* or *Sale & Hire*
3. Choose its **Events & Occasions**, upload photos, Save

> **Before launch — configuration checklist.** In Vercel: set `DATABASE_URL` to the Supabase **transaction pooler** (port 6543), plus `NEXTAUTH_SECRET`/`NEXTAUTH_URL`, Resend and Cloudinary keys. Verify a Resend domain for customer email. Add Flutterwave keys when payments are agreed. Rotate any credentials shared during development.

---

## 17 — Roadmap

**Launch gate**
- Deploy env config
- Resend domain
- Human browser/mobile QA
- Lighthouse pass

**On agreement**
- Flutterwave live keys
- End-to-end payment test
- Upstash rate limiting

**Beyond**
- Custom domain + SEO submit
- Real inventory & blog content
- Analytics dashboards
- Staff training

The engineering is ready. What stands between here and a public launch is configuration, content, and a human walk-through — not code.

---

*Mighty Rides — Digital Operating System · System report · June 2026*
