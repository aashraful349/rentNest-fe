# 🏡 RentNest - Modern Rental Property Marketplace

**RentNest** is a full-featured, full-stack rental property platform built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and an Express/Node.js backend utilizing **Prisma ORM**, **PostgreSQL**, and **Stripe Checkout**.

It provides an end-to-end ecosystem connecting tenants with verified landlords featuring dynamic category filtering, rental requests, real-time application tracking, Stripe-hosted checkout in BDT (৳), post-rental review submissions, and administrative control.

---

## 📑 Table of Contents

- [Overview & Architecture](#-overview--architecture)
- [Key Features by Role](#-key-features-by-role)
  - [Public & Property Discovery](#1-public--property-discovery)
  - [Tenant Experience](#2-tenant-experience)
  - [Landlord Experience](#3-landlord-experience)
  - [Admin Control Center](#4-admin-control-center)
- [Rental Request Lifecycle & Badges](#-rental-request-lifecycle--badges)
- [Stripe Checkout & Review Workflow](#-stripe-checkout--review-workflow)
- [Database Schema (Prisma)](#-database-schema-prisma)
- [Tech Stack](#-tech-stack)
- [Complete API Reference](#-complete-api-reference)
- [Directory Structure](#-directory-structure)
- [Environment Variables](#-environment-variables)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Error Handling & Edge Cases](#-error-handling--edge-cases)
- [Deployment Guide](#-deployment-guide)

---

## 🏛 Overview & Architecture

RentNest connects tenants and landlords with an automated transactional flow:

```text
  ┌┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┐
  ┆  Tenant / Guest   ┆
  └┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┘
            ┊
            ┊ 1. Browse listings & filter properties
            ▼
  ┌┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┐
  ┆ Property Catalog  ┆
  └┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┘
            ┊
            ┊ 2. Submit rental request (POST /api/rentals)
            ▼
  ┌┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┐
  ┆Landlord Dashboard ┆
  └┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┘
            ┊
            ┊ 3. Landlord approves request (Status: APPROVED)
            ▼
  ┌┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┐
  ┆ Tenant Dashboard  ┆
  └┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┘
            ┊
            ┊ 4. Clicks "Pay Now" (POST /api/payments/create)
            ▼
  ┌┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┐
  ┆  Stripe Checkout  ┆ ─── Hosted Checkout session in BDT (৳)
  └┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┘
            ┊
            ┊ 5. Redirect on successful transaction
            ▼
  ┌┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┐
  ┆  Success Screen   ┆ ─── /payment/success confirmation page
  └┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┘
            ┊
            ┊ 6. Submits property review (POST /api/reviews)
            ▼
  ┌┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┐
  ┆ Property Details  ┆ ─── Verified tenant review published live
  └┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┘
```

| Step | Phase | Action | Endpoint / Screen | Outcome |
| :---: | :--- | :--- | :--- | :--- |
| **1** | **Discovery** | Tenant searches & browses homes | `/properties` | Evaluates property features & pricing |
| **2** | **Application** | Tenant submits rental request | `POST /api/rentals` | Created with `PENDING` status |
| **3** | **Approval** | Landlord accepts applicant | `PATCH /api/landlord/requests/:id` | Status changes to `APPROVED` |
| **4** | **Payment** | Tenant clicks "Pay Now" | `POST /api/payments/create` | Redirected to Stripe Checkout in BDT (৳) |
| **5** | **Confirmation** | Stripe redirects on success | `/payment/success` | Rental activated & receipt generated |
| **6** | **Review** | Tenant leaves rating & review | `POST /api/reviews` | Review appears on listing page |

### Architectural Highlights
- **Server Actions & Server Components**: Core pages (`/properties`, `/properties/[pid]`, `/dashboard/*`) leverage React Server Components for fast initial data loading and SEO, paired with React 19 Client Components for interactive forms and modals.
- **Authentication Strategy**: Dual-token architecture using secure HTTP-only cookies (`accessToken` and `refreshToken`). Server actions automatically forward cookies for backend authentication.
- **BDT Currency Standard**: All property prices and payment sessions are denominated in Bangladeshi Taka (BDT, ৳) with one-time rental payments.

---

## 🌟 Key Features by Role

### 1. Public & Property Discovery
- **Hero & Curated Listings**: Engaging landing page with quick search and featured properties.
- **Dynamic Category Filtering**: Categories (`APARTMENT`, `HOUSE`, `STUDIO`, `OFFICE`, `SHOP`, `WAREHOUSE`, `LAND`, `OTHER`) fetched dynamically from `GET /api/categories`, filtering out empty categories automatically.
- **Multi-parameter Search**: Search by title, description, location, category, and sort by price ascending or descending.
- **Rich Property Details**: Multi-image galleries, landlord verification status, full address, BDT pricing, amenities, and verified tenant reviews.
- **About Us Page**: Ecosystem mission statement and platform guidelines.

### 2. Tenant Experience
- **One-Click Application**: Apply directly from listing pages using `POST /api/rentals` with an optional note to the landlord.
- **Application Tracking Dashboard**: View active inquiries, review statuses, and cancel pending applications.
- **Stripe Checkout Integration**: Seamless **"Pay Now"** button for approved applications redirecting to Stripe Checkout in BDT.
- **Post-Payment Reviews**: Prompted immediately after successful payment on `/payment/success` to submit a review with rating, title, and comments.
- **Payment History & Receipts**: View transaction timestamps, payment IDs, and printable receipt cards.
- **Profile Management**: Profile page at `/profile` inheriting public navigation displaying user bio, contact details, and role.

### 3. Landlord Experience
- **Listing Management**: Create, edit, and toggle availability of properties (`AVAILABLE` / `UNAVAILABLE`).
- **Application Review**: Inspect applicant credentials, read tenant notes, and approve or reject rental requests via `PATCH /api/landlord/requests/:id`.
- **Income Analytics**: Monitor total earnings and tenancy overview.

### 4. Admin Control Center
- **User Moderation**: View all tenants and landlords, and toggle user access (`ACTIVE` / `BLOCKED`) via `PATCH /api/admin/users/:id`.
- **Platform Inquiries Overview**: Full audit log of all rental requests across the entire platform via `GET /api/admin/rentals`.
- **Listing Moderation**: Feature high-quality listings or remove fraudulent properties.
- **System Telemetry**: User role distribution, active listing counts, and system statistics.

---

## 🏷 Rental Request Lifecycle & Badges

The platform enforces a standardized visual badge and action system across all tenant and landlord views:

| Status | Badge Color | Button Displayed | Description |
| :--- | :--- | :--- | :--- |
| **`PENDING`** | 🟡 **Yellow / Orange** | *None* | Awaiting landlord review |
| **`APPROVED`** | 🔵 **Blue** | **"Pay Now"** (Blue) | Landlord approved; ready for Stripe checkout |
| **`REJECTED`** | 🔴 **Red** | *None* | Request declined by landlord |
| **`ACTIVE`** *(or Paid)* | 🟢 **Green** | **"Leave Review"** (Green) | Payment confirmed; tenant can submit a review |
| **`COMPLETED`** | ⚪ **Gray** | *None* | Tenancy period completed |

---

## 💳 Stripe Checkout & Review Workflow

1. **Initiate Payment**:
   - Tenant clicks **"Pay Now"** on an `APPROVED` request.
   - The frontend calls `POST /api/payments/create` with `{ rentalRequestId }`.
   - The backend responds with `{ data: { paymentUrl } }`.
   - The frontend stores `rentalRequestId` in `localStorage` under `lastPaymentRentalRequestId` and redirects the user to Stripe.
2. **Stripe Processing**:
   - Stripe renders a hosted checkout session in BDT (৳).
   - On completion, Stripe redirects back to `{APP_URL}/payment?success=true`.
3. **Outcome Router**:
   - `/payment/page.tsx` reads `?success=true` and forwards to `/payment/success`.
   - If canceled, forwards to `/payment/cancel`.
4. **Review Submission**:
   - `/payment/success` loads the stored `rentalRequestId` and renders a review submission form.
   - Submits `POST /api/reviews` with payload:
     ```json
     {
       "rentalRequestId": "71991bba-752e-4b79-b92a-331730b3b76e",
       "title": "Great apartment!",
       "description": "Very clean, smooth check-in, landlord was very helpful."
     }
     ```
   - On success, displays confirmation and cleans up local storage.

---

## 🗄 Database Schema (Prisma)

RentNest's database architecture guarantees data integrity and 1-to-1 relationships for transactional flows:

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(TENANT)
  status    Status   @default(ACTIVE)
  phone     String?
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  properties     Property[]
  rentalRequests rentalRequest[]
  reviews        Review[]
  payments       Payment[]

  @@map("users")
}

model Property {
  id          String   @id @default(uuid())
  title       String
  description String
  price       Float
  location    String
  images      String[]
  category    Category
  isFeatured  Boolean  @default(false)
  status      PropertyStatus @default(AVAILABLE)

  landlordId  String
  landlord    User     @relation(fields: [landlordId], references: [id], onDelete: Cascade)

  rentalRequests rentalRequest[]
  reviews        Review[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("properties")
}

model rentalRequest {
  id         String   @id @default(uuid())
  tenantId   String
  tenant     User     @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  propertyId String
  property   Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  status     RentalStatus @default(PENDING)
  message    String?

  payment    Payment?
  review     Review?

  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@map("rental_requests")
}

model Review {
  id              String        @id @default(uuid())
  tenantId        String
  user            User          @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  propertyId      String
  property        Property      @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  rentalRequestId String        @unique
  rentalRequest   rentalRequest @relation(fields: [rentalRequestId], references: [id])
  title           String        @db.VarChar(255)
  description     String

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("reviews")
}

model Payment {
  id              String        @id @default(uuid())
  rentalRequestId String        @unique
  rentalRequest   rentalRequest @relation(fields: [rentalRequestId], references: [id])
  tenantId        String
  tenant          User          @relation(fields: [tenantId], references: [id])
  amount          Float
  currency        String        @default("bdt")
  status          PaymentStatus @default(PENDING)
  stripeSessionId String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("payments")
}
```

---

## 🛠 Tech Stack

### Frontend Architecture
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Engine**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Toaster Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Type Safety**: TypeScript 5 with strict mode

### Backend & Database
- **Runtime**: Node.js & Express
- **ORM**: [Prisma ORM](https://www.prisma.io/)
- **Database**: PostgreSQL
- **Payments**: Stripe API (`v3` / Checkout Sessions)
- **Authentication**: JWT access & refresh tokens via HTTP-only cookies

---

## 📡 Complete API Reference

### Authentication & Profiles
| Method | Endpoint | Request Body | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | `{ name, email, password, role }` | Register new user |
| `POST` | `/api/auth/login` | `{ email, password }` | Authenticate user & set cookies |
| `GET` | `/api/auth/me` | *None* | Get current authenticated user |
| `POST` | `/api/auth/refresh-token` | *None* | Rotate JWT access token |
| `POST` | `/api/auth/logout` | *None* | Clear authentication session cookies |

### Properties & Categories
| Method | Endpoint | Query / Body | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/properties` | `?search=&category=&sortBy=&order=` | Search & filter property listings |
| `GET` | `/api/properties/:id` | *None* | Get single property details |
| `GET` | `/api/categories` | *None* | Get all dynamic categories |

### Rental Requests
| Method | Endpoint | Request Body | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/rentals` | `{ propertyId, message? }` | Create new rental application |
| `GET` | `/api/rentals` | *None* | Get current tenant's rental requests |
| `GET` | `/api/rentals/:id` | *None* | Get details for specific rental request |

### Stripe Payments
| Method | Endpoint | Request Body | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/payments/create` | `{ rentalRequestId }` | Generate Stripe checkout session |
| `GET` | `/api/payments` | *None* | Get tenant's payment history |
| `GET` | `/api/payments/:id` | *None* | Get single payment receipt |
| `POST` | `/api/payments/webhook` | Raw Stripe body | Stripe webhook event processor |

### Reviews
| Method | Endpoint | Request Body | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/reviews` | `{ rentalRequestId, title, description }` | Submit property review |
| `GET` | `/api/reviews/:propertyId` | *None* | Fetch reviews for a property |

### Landlord & Admin Endpoints
| Method | Endpoint | Request Body | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/landlord/properties` | *None* | Get landlord's listed properties |
| `POST` | `/api/landlord/properties` | `{ title, description, price, location, images, category }` | Create property listing |
| `GET` | `/api/landlord/requests` | *None* | Get applications on landlord's properties |
| `PATCH` | `/api/landlord/requests/:id` | `{ status: "APPROVED" \| "REJECTED" }` | Moderate rental request |
| `GET` | `/api/admin/users` | *None* | Get all registered platform users |
| `PATCH` | `/api/admin/users/:id` | `{ status: "ACTIVE" \| "BLOCKED" }` | Block or unban user |
| `GET` | `/api/admin/rentals` | *None* | Get all platform rental requests |

---

## 📂 Directory Structure

```
rentNest-fe/
├── app/
│   ├── (publicRoute)/
│   │   ├── about/                   # About RentNest page
│   │   ├── profile/                 # User profile view with public navbar
│   │   ├── properties/              # Properties browse & filter page
│   │   │   └── [pid]/               # Property detail view with reviews
│   │   ├── layout.tsx               # Public layout with persistent Navbar
│   │   └── page.tsx                 # Home page with featured listings
│   ├── auth/
│   │   ├── login/                   # Login form & authentication action
│   │   └── register/                # Registration form
│   ├── dashboard/
│   │   ├── admin/                   # Admin dashboard (users, rentals, moderation)
│   │   ├── landlord/                # Landlord dashboard (properties & inquiries)
│   │   └── tenant/                  # Tenant dashboard (applications & payments)
│   │       ├── payments/[id]/       # Individual payment receipt page
│   │       └── requests/[id]/       # Rental request details & pay redirection
│   ├── payment/
│   │   ├── page.tsx                 # Stripe callback router (?success=true / false)
│   │   ├── cancel/                  # Payment cancelled notice
│   │   └── success/                 # Payment success & review submission form
│   ├── error.tsx                    # Root error boundary (Try Again & Reset)
│   ├── not-found.tsx                # Custom 404 page
│   ├── global-error.tsx             # Fallback critical error boundary
│   └── layout.tsx                   # Root HTML layout with Sonner Toaster
├── components/
│   ├── shared/
│   │   └── navbar.tsx               # Responsive navigation header with user dropdown
│   └── ui/                          # UI components (Button, Card, Badge, Input, etc.)
├── services/                        # Server Actions & API Fetchers
│   ├── admin.ts                     # Users & rentals management
│   ├── landlord.ts                  # Property creation & request approvals
│   ├── tenant.ts                    # Rental requests, Stripe checkout, receipts
│   ├── review.ts                    # Review creation & fetching
│   ├── getMe.ts                     # Session fetching & caching
│   └── logout.ts                    # Cookie invalidation
└── lib/
    ├── type.ts                      # Shared TypeScript interfaces
    └── utils.ts                     # Utility functions (cn class merging)
```

---

## ⚙ Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API Base URLs
BACKEND_API_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000

# JWT Secrets (used for cookie decoding/matching)
JWT_ACCESS_SECRET=your_jwt_access_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
```

---

## 🚀 Getting Started & Local Setup

### 1. Prerequisites
- Node.js 18.x or 20.x
- npm or yarn
- Running instance of the RentNest backend (`http://localhost:5000`)

### 2. Installation
```bash
git clone <your-repository-url>
cd rentNest-fe
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Code Quality & Type Safety
```bash
# Verify static types (0 errors)
npm run typecheck

# Verify linter rules
npm run lint
```

---

## 🛡 Error Handling & Edge Cases

- **Error Boundaries**:
  - `app/error.tsx`: Recovers from runtime failures during rendering with a retry button.
  - `app/global-error.tsx`: Catches root layout failures with a standalone minimal recovery shell.
  - `app/not-found.tsx`: Clean 404 page for missing properties or unmapped routes.
- **Image Fallbacks**: Next.js `<Image>` components sanitize missing or malformed backend image URLs (e.g. `"Image not provided"`), providing graceful placeholder fallbacks without crashing the DOM.
- **Cross-session Persistence**: After returning from an external Stripe redirect, the payment outcome handler matches the pending review from `localStorage` (`lastPaymentRentalRequestId`) ensuring the user can submit a review without re-authenticating or navigating manually.

---

## 🚢 Deployment Guide

### Deploying the Frontend (Vercel)
1. Push your repository to GitHub / GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Environment Variables:
   - `BACKEND_API_URL`: Hosted backend URL (e.g., `https://api.rentnest.com`)
   - `NEXT_PUBLIC_API_URL`: Hosted backend URL (e.g., `https://api.rentnest.com`)
4. Build command: `npm run build`
5. Output directory: `.next`

### Deploying the Backend
1. Deploy your Express / Prisma backend to Render, Railway, or AWS.
2. Set `APP_URL` in your backend environment variables to your hosted frontend URL (e.g., `https://rentnest.vercel.app`).
3. Ensure CORS configuration in Express permits the frontend domain.
4. Set up the Stripe Webhook URL to point to `https://api.rentnest.com/api/payments/webhook` with the event `checkout.session.completed`.
