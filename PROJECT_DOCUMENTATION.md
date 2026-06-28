# MIGHTY RIDES - PROJECT DOCUMENTATION

**Version:** 1.0.0  
**Date:** September 5, 2026  
**Repository:** https://github.com/naturalintellectscrop-ctrl/Mighty_Rides.git

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Database Schema](#4-database-schema)
5. [Pages and Routes](#5-pages-and-routes)
6. [API Endpoints](#6-api-endpoints)
7. [Authentication System](#7-authentication-system)
8. [Payment Integration](#8-payment-integration)
9. [Email System](#9-email-system)
10. [File Upload System](#10-file-upload-system)
11. [Rate Limiting](#11-rate-limiting)
12. [Analytics](#12-analytics)
13. [Deployment Guide](#13-deployment-guide)
14. [Environment Variables](#14-environment-variables)
15. [Testing Credentials](#15-testing-credentials)
16. [Future Improvements](#16-future-improvements)

---

## 1. PROJECT OVERVIEW

### 1.1 Business Description

Mighty Rides is a premium car dealership and rental service based in Kampala, Uganda. The platform serves two main business verticals:

- **Vehicle Sales**: Listing and selling quality pre-owned vehicles
- **Vehicle Hire/Rental**: Daily, weekly, and monthly vehicle rentals for various occasions

### 1.2 Key Features

- Public-facing website with vehicle listings
- Online booking system with Flutterwave payments
- Admin dashboard for fleet management
- Rentee portal for booking management
- Email verification and password reset flows
- WhatsApp integration for customer support
- Blog system for content marketing
- Multi-service offerings (Concierge, Corporate, Sourcing)

### 1.3 Brand Identity

| Element | Value |
|---------|-------|
| Primary Color (Black) | #0A0A0A |
| Secondary Color (Gold) | #C8952A |
| Surface Dark | #1E1E1E |
| Surface Light | #282828 |
| Heading Font | Oswald |
| Label Font | Barlow Condensed |
| Body Font | Inter |

---

## 2. TECHNOLOGY STACK

### 2.1 Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14+ | React framework with App Router |
| TypeScript | 5.0+ | Type-safe JavaScript |
| Tailwind CSS | 3.4+ | Utility-first CSS framework |

### 2.2 Backend Services

| Service | Purpose |
|---------|---------|
| Prisma ORM | Database ORM with type safety |
| SQLite (dev) / PostgreSQL (prod) | Database |
| NextAuth.js | Authentication system |
| Flutterwave | Payment processing |
| Resend | Email service |
| Cloudinary | Image/file storage |
| Upstash Redis | Rate limiting |

### 2.3 Key Libraries

```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "prisma": "^5.0.0",
  "next-auth": "^4.0.0",
  "@upstash/redis": "^1.38.0",
  "@upstash/ratelimit": "^2.0.8",
  "bcryptjs": "^2.4.3",
  "resend": "^3.0.0",
  "cloudinary": "^2.0.0"
}
```

---

## 3. PROJECT STRUCTURE

```
/home/z/my-project/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── about/              # About page
│   │   ├── admin/              # Admin dashboard
│   │   │   ├── blog/           # Blog management
│   │   │   ├── bookings/       # Booking management
│   │   │   ├── complaints/     # Complaints inbox
│   │   │   ├── fleet/          # Fleet management
│   │   │   ├── inquiries/      # Inquiries inbox
│   │   │   ├── pickups/        # Pickups queue
│   │   │   ├── rentees/        # Rentee management
│   │   │   ├── sales/          # Sales log
│   │   │   ├── settings/       # Admin settings
│   │   │   └── sourcing/       # Sourcing pipeline
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # Authentication APIs
│   │   │   ├── bookings/       # Booking APIs
│   │   │   ├── inquiries/      # Inquiry APIs
│   │   │   ├── settings/       # Settings APIs
│   │   │   └── webhooks/       # Webhook handlers
│   │   ├── blog/               # Blog pages
│   │   ├── cars/               # Vehicle sales pages
│   │   ├── concierge/          # Concierge service
│   │   ├── contact/            # Contact page
│   │   ├── corporate/          # Corporate services
│   │   ├── forgot-password/    # Password reset request
│   │   ├── hire/               # Vehicle rental pages
│   │   ├── login/              # Login page
│   │   ├── portal/             # Rentee portal
│   │   │   ├── complaints/     # Submit complaints
│   │   │   ├── history/        # Rental history
│   │   │   └── profile/        # User profile
│   │   ├── privacy/            # Privacy policy
│   │   ├── register/           # Registration
│   │   ├── reset-password/     # Password reset
│   │   ├── services/           # Services page
│   │   ├── sourcing/           # Vehicle sourcing
│   │   ├── terms/              # Terms of service
│   │   ├── verify-email/       # Email verification
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   └── globals.css         # Global styles
│   ├── components/             # React components
│   │   ├── admin/              # Admin-specific components
│   │   ├── analytics/          # Analytics components
│   │   ├── forms/              # Form components
│   │   ├── layout/             # Layout components
│   │   ├── portal/             # Portal-specific components
│   │   └── ui/                 # UI primitives
│   ├── lib/                    # Utility libraries
│   │   ├── db.ts               # Prisma client
│   │   ├── auth.ts             # NextAuth config
│   │   └── rate-limit.ts       # Rate limiting
│   └── hooks/                  # Custom React hooks
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Database seeding
├── db/
│   └── mightyrides.db          # SQLite database (dev)
├── public/                     # Static assets
├── .env.example                # Environment template
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
└── package.json                # Dependencies
```

---

## 4. DATABASE SCHEMA

### 4.1 Entity Overview

| Model | Description | Key Fields |
|-------|-------------|------------|
| User | User accounts | email, role, id_verified |
| Vehicle | Vehicle listings | name, type, status, prices |
| Booking | Rental bookings | booking_ref, status, dates |
| BookingStatusLog | Booking history | old_status, new_status |
| SoftLock | Temporary holds | vehicle_id, expires_at |
| Inquiry | Customer inquiries | type, status, message |
| SourcingRequest | Sourcing pipeline | vehicle_spec, status |
| Complaint | Customer complaints | type, urgency, status |
| SalesLog | Vehicle sales records | sale_price, sale_date |
| BlogPost | Blog content | title, slug, category |
| Setting | Key-value settings | key, value |

### 4.2 Enums

```prisma
enum UserRole { RENTEE, ADMIN }
enum IdType { NATIONAL_ID, PASSPORT }
enum AccountStatus { ACTIVE, SUSPENDED }
enum VehicleType { SALE, HIRE, BOTH }
enum VehicleStatus { AVAILABLE, RESERVED, RENTED_OUT, IN_SERVICE, SOLD }
enum BookingStatus { PENDING, CONFIRMED, ACTIVE, RETURNED, CANCELLED, DECLINED }
enum InquiryType { PURCHASE, CONCIERGE, CORPORATE, SERVICE, SOURCING, GENERAL }
enum InquiryStatus { NEW, CONTACTED, CLOSED }
enum ComplaintType { VEHICLE_CONDITION, BILLING, SERVICE, STAFF, OTHER }
enum ComplaintUrgency { LOW, MEDIUM, URGENT }
enum ComplaintStatus { OPEN, IN_PROGRESS, RESOLVED }
enum BlogCategory { BUYING_GUIDE, MARKET_NEWS, VEHICLE_SPOTLIGHT, RENTAL_GUIDE, CORPORATE, GENERAL }
```

### 4.3 Relationships

```
User (1) ──► (N) Booking
User (1) ──► (N) Complaint
User (1) ──► (N) SoftLock

Vehicle (1) ──► (N) Booking
Vehicle (1) ──► (N) Inquiry
Vehicle (1) ──► (N) SalesLog

Booking (1) ──► (N) BookingStatusLog
Booking (1) ──► (N) Complaint

Inquiry (1) ──► (1) SourcingRequest
```

---

## 5. PAGES AND ROUTES

### 5.1 Public Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Homepage | Hero, featured vehicles, services CTA |
| `/cars` | Vehicle Sales | Filterable grid of vehicles for sale |
| `/cars/[slug]` | Vehicle Detail | Gallery, specs, inquiry form |
| `/hire` | Vehicle Rental | Occasion selector, fleet grid |
| `/hire/[slug]` | Rental Vehicle | Pricing, booking CTA |
| `/about` | About Us | Company story, team, map |
| `/services` | Services | Service offerings |
| `/sourcing` | Vehicle Sourcing | Sourcing request form |
| `/concierge` | Concierge | Premium concierge services |
| `/corporate` | Corporate | Corporate fleet solutions |
| `/blog` | Blog | Blog post listing |
| `/blog/[slug]` | Blog Post | Individual blog article |
| `/contact` | Contact | Contact form and details |
| `/terms` | Terms of Service | Legal terms |
| `/privacy` | Privacy Policy | Privacy information |

### 5.2 Authentication Pages

| Route | Page | Description |
|-------|------|-------------|
| `/login` | Login | Email/password login |
| `/register` | Registration | 3-step registration form |
| `/verify-email` | Email Verification | Token-based verification |
| `/forgot-password` | Forgot Password | Password reset request |
| `/reset-password` | Reset Password | Token-based password reset |

### 5.3 Rentee Portal

| Route | Page | Description |
|-------|------|-------------|
| `/portal` | My Rentals | Active and upcoming bookings |
| `/portal/history` | Rental History | Past bookings |
| `/portal/complaints` | Complaints | Submit and view complaints |
| `/portal/profile` | Profile | Account settings |

### 5.4 Admin Dashboard

| Route | Page | Description |
|-------|------|-------------|
| `/admin` | Dashboard | KPIs, alerts, overview |
| `/admin/fleet` | Fleet Management | Vehicle CRUD, status control |
| `/admin/bookings` | Bookings | All bookings management |
| `/admin/bookings/[id]` | Booking Detail | Individual booking management |
| `/admin/inquiries` | Inquiries | Customer inquiry inbox |
| `/admin/sourcing` | Sourcing | Kanban pipeline for sourcing |
| `/admin/rentees` | Rentees | Customer management, ID verification |
| `/admin/complaints` | Complaints | Customer complaints inbox |
| `/admin/pickups` | Pickups | Vehicle pickup queue |
| `/admin/sales` | Sales | Vehicle sales log |
| `/admin/blog` | Blog | Blog post management |
| `/admin/settings` | Settings | Site settings, audit log |

---

## 6. API ENDPOINTS

### 6.1 Authentication APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/verify-email` | Email verification |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |
| POST | `/api/auth/[...nextauth]` | NextAuth.js endpoints |

### 6.2 Booking APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | List bookings |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/[id]` | Get booking details |
| PATCH | `/api/bookings/[id]` | Update booking status |

### 6.3 Inquiry APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/inquiries` | List inquiries |
| POST | `/api/inquiries` | Create inquiry |
| PATCH | `/api/inquiries/[id]` | Update inquiry status |

### 6.4 Settings APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings` | Get all settings |
| PATCH | `/api/settings` | Update settings |
| GET | `/api/settings/ugx_usd_rate` | Get exchange rate |

### 6.5 Webhooks

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/webhooks/flutterwave` | Flutterwave payment webhook |

---

## 7. AUTHENTICATION SYSTEM

### 7.1 NextAuth.js Configuration

- **Provider**: Credentials (email/password)
- **Session Strategy**: JWT
- **Roles**: RENTEE, ADMIN

### 7.2 Registration Flow

1. User fills 3-step form:
   - Step 1: Full name, email, phone, password
   - Step 2: Date of birth, nationality
   - Step 3: ID type, ID document upload
2. Password hashed with bcrypt
3. Verification token generated
4. Verification email sent via Resend
5. User must verify email before login

### 7.3 Login Flow

1. User enters email/password
2. Credentials validated against database
3. Email verification checked
4. JWT token created with role
5. User redirected based on role:
   - RENTEE → `/portal`
   - ADMIN → `/admin`

### 7.4 Password Reset Flow

1. User requests reset at `/forgot-password`
2. Reset token generated (expires in 1 hour)
3. Reset email sent via Resend
4. User clicks link → `/reset-password?token=xxx`
5. User enters new password
6. Password updated, user redirected to login

---

## 8. PAYMENT INTEGRATION

### 8.1 Flutterwave Configuration

- **Supported Currencies**: UGX, USD
- **Payment Methods**: MTN Mobile Money, Airtel Money, Visa, Mastercard
- **Deposit**: 30% of total rental cost required upfront
- **Remaining 70%**: Paid at office during pickup

### 8.2 Payment Flow

1. User selects vehicle and dates
2. System checks availability (conflict check)
3. Soft lock created (15-minute hold)
4. User redirected to Flutterwave checkout
5. Payment processed
6. Webhook received at `/api/webhooks/flutterwave`
7. Booking status updated to CONFIRMED
8. Confirmation email sent

### 8.3 Webhook Handling

```typescript
// Verify webhook signature
// Update booking payment status
// Send confirmation email
// Clear soft lock
```

---

## 9. EMAIL SYSTEM

### 9.1 Resend Integration

- **From Address**: noreply@mightyrides.com
- **Templates**: Custom HTML templates

### 9.2 Email Types

| Trigger | Recipient | Purpose |
|---------|-----------|---------|
| Registration | User | Email verification |
| Verification | User | Welcome message |
| Password Reset | User | Reset link |
| Booking Confirmed | User | Booking details |
| Booking Reminder (24h) | User | Pickup reminder |
| Booking Reminder (2h) | User | Final reminder |
| Admin Alert | Admin | New booking notification |

---

## 10. FILE UPLOAD SYSTEM

### 10.1 Cloudinary Configuration

- **Public Bucket**: `mighty-rides/public` (vehicle photos)
- **Private Bucket**: `mighty-rides/private` (ID documents)

### 10.2 Image Categories

| Type | Folder | Access |
|------|--------|--------|
| Vehicle Photos | public/vehicles | Public |
| Blog Images | public/blog | Public |
| ID Front | private/ids | Signed URLs only |
| ID Back | private/ids | Signed URLs only |
| Handover Photos | private/handover | Admin only |

### 10.3 Security

- Private images require signed URLs
- Signed URLs expire after 1 hour
- Only admins can generate signed URLs for ID documents

---

## 11. RATE LIMITING

### 11.1 Upstash Redis Configuration

Rate limiting is implemented using Upstash Redis with the following limits:

| Endpoint Type | Limit | Window |
|--------------|-------|--------|
| General API | 100 requests | 60 seconds |
| Authentication | 5 attempts | 15 minutes |
| Booking | 10 requests | 1 hour |
| Password Reset | 3 requests | 1 hour |
| Contact Form | 5 submissions | 1 hour |

### 11.2 Usage

```typescript
import { rateLimiters, checkRateLimit, getClientIp } from '@/lib/rate-limit';

// In API route
const ip = getClientIp(request);
const { success, headers } = await checkRateLimit(rateLimiters.auth, ip);

if (!success) {
  return rateLimitResponse(reset);
}
```

---

## 12. ANALYTICS

### 12.1 Google Analytics 4

- **Measurement ID**: Set via `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- **Auto Page Tracking**: Enabled
- **Custom Events**: Pre-defined tracking helpers

### 12.2 Tracked Events

| Event | Category | Label |
|-------|----------|-------|
| submit_inquiry | engagement | Vehicle name |
| begin_checkout | booking | Vehicle name |
| purchase | booking | Vehicle name, value |
| form_submit | contact | Form type |
| click | contact | phone/whatsapp |
| view_item | engagement | Vehicle name |
| search | engagement | Query |
| sign_up | auth | - |
| login | auth | - |

---

## 13. DEPLOYMENT GUIDE

### 13.1 Prerequisites

1. **PostgreSQL Database** (Neon, Supabase, Railway, or self-hosted)
2. **Flutterwave Account** (Test or Live mode)
3. **Resend Account** (for emails)
4. **Cloudinary Account** (for image storage)
5. **Upstash Account** (optional, for rate limiting)

### 13.2 Deployment Steps

```bash
# 1. Clone repository
git clone https://github.com/naturalintellectscrop-ctrl/Mighty_Rides.git
cd Mighty_Rides

# 2. Install dependencies
bun install

# 3. Copy environment file
cp .env.example .env.local

# 4. Fill in environment variables
# Edit .env.local with your credentials

# 5. Generate Prisma client
bunx prisma generate

# 6. Run database migrations
bunx prisma migrate deploy

# 7. Seed database (first time only)
bunx prisma db seed

# 8. Build application
bun run build

# 9. Start production server
bun run start
```

### 13.3 Recommended Hosting

| Platform | Pros | Cons |
|----------|------|------|
| **Vercel** | Best Next.js support, auto SSL | Limited serverless functions |
| **Railway** | Easy PostgreSQL, good pricing | Requires config |
| **Render** | Free tier available | Cold starts |
| **VPS + Docker** | Full control | Requires maintenance |

### 13.4 Post-Deployment Checklist

- [ ] Set up PostgreSQL database
- [ ] Configure Flutterwave webhook URL
- [ ] Verify email domain in Resend
- [ ] Create Cloudinary folders
- [ ] Test payment flow
- [ ] Test email delivery
- [ ] Enable rate limiting (Upstash)
- [ ] Add GA4 tracking code
- [ ] Set up SSL certificate
- [ ] Configure custom domain

---

## 14. ENVIRONMENT VARIABLES

### 14.1 Required Variables

```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"

# Email (Resend)
RESEND_API_KEY="re_xxx"
EMAIL_FROM="noreply@mightyrides.com"

# Payment (Flutterwave)
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY="FLWPUBK_xxx"
FLUTTERWAVE_SECRET_KEY="FLWSECK_xxx"
FLUTTERWAVE_WEBHOOK_HASH="xxx"

# Storage (Cloudinary)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="xxx"
CLOUDINARY_API_KEY="xxx"
CLOUDINARY_API_SECRET="xxx"
```

### 14.2 Optional Variables

```bash
# Rate Limiting (Upstash)
UPSTASH_REDIS_REST_URL="https://xxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="xxx"

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXX"

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER="256700000000"
```

---

## 15. TESTING CREDENTIALS

### 15.1 Admin Account

| Field | Value |
|-------|-------|
| Email | admin@mightyrides.com |
| Password | Admin123! |
| Role | ADMIN |

### 15.2 Test Payment (Flutterwave)

Use Flutterwave test card details for payment testing:
- Card Number: 5531 8866 5214 2950
- Expiry: Any future date
- CVV: 564
- PIN: 3310
- OTP: 12345

### 15.3 Sample Data

- **Vehicles**: 5 pre-loaded vehicles
- **Blog Posts**: 2 sample posts
- **Settings**: Default exchange rate (1 USD = 3700 UGX)

---

## 16. FUTURE IMPROVEMENTS

### 16.1 Recommended Enhancements

1. **Real-time Notifications**
   - WebSocket support for admin alerts
   - Push notifications for mobile app

2. **Advanced Analytics**
   - Dashboard charts with Chart.js
   - Revenue tracking and reporting

3. **Mobile App**
   - React Native app for customers
   - Push notifications

4. **AI Features**
   - Chatbot for customer support
   - Vehicle recommendation engine

5. **Multi-location Support**
   - Multiple pickup/drop-off locations
   - Branch management

### 16.2 Security Improvements

1. Two-factor authentication (2FA)
2. Session management (revoke sessions)
3. Audit logging for all admin actions
4. IP whitelisting for admin access

---

## DOCUMENT INFORMATION

| Field | Value |
|-------|-------|
| Document Version | 1.0.0 |
| Last Updated | September 5, 2026 |
| Author | AI Development Team |
| Repository | github.com/naturalintellectscrop-ctrl/Mighty_Rides |

---

**END OF DOCUMENTATION**
