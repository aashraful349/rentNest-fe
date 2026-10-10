# RentNest - Rental Property Marketplace

RentNest is a full-stack rental property marketplace built with Next.js 16 (React 19), Tailwind CSS, and a Node.js/Express backend with Prisma and Stripe. It connects tenants with verified landlords, providing browsing, application management, role-based dashboards, Stripe checkout in BDT, and post-payment reviews.

---

## Features

### 1. Public Features
- **Browse Properties**: Real-time property listings with filtering by search term, location, price sorting, and dynamic category selection.
- **Detailed Property View**: High-resolution image galleries, property specifications, verified status badges, and authentic tenant reviews.
- **About Page**: Learn about RentNest's mission, ecosystem features, and benefits for tenants and landlords.

### 2. Tenant Experience
- **Rental Requests**: Submit rental inquiries directly from any available property listing.
- **Tenant Portal**:
  - Live status tracking with color-coded badges (`PENDING`, `APPROVED`, `REJECTED`, `ACTIVE`, `COMPLETED`).
  - **Pay Now**: One-click transition from approved status directly into Stripe Hosted Checkout in BDT.
  - **Leave Review**: Submit post-rental reviews and ratings once a lease is active.
- **Payment History**: View transaction logs, payment receipts, and dates.
- **User Profile**: Personal account details, phone number, bio, and role display.

### 3. Landlord Experience
- **Property Listing Management**: Create and list properties with dynamic category mapping (`APARTMENT`, `HOUSE`, `STUDIO`, `OFFICE`, `SHOP`, `WAREHOUSE`, `LAND`, `OTHER`).
- **Application Moderation**: Review incoming tenant rental requests with full tenant contact information and approve or reject them in real time.
- **Dashboard Analytics**: Track listed properties, total earnings in BDT, and inquiry volume.

### 4. Admin Control Center
- **User Management**: View all tenants and landlords with the ability to block or unban accounts (`ACTIVE` / `BLOCKED`).
- **Platform-Wide Moderation**: Oversee all rental inquiries across every property on the platform.
- **Listing Moderation**: Feature high-quality homes and remove spam or inappropriate listings.

---

## Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Component Styling**: Custom UI components inspired by Radix & Shadcn UI
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Payments**: Stripe Hosted Checkout (`currency: "bdt"`)
- **Authentication**: JWT access and refresh token dual-rotation

---

## Project Structure

```
rentNest-fe/
├── app/
│   ├── (publicRoute)/
│   │   ├── about/              # About RentNest page
│   │   ├── profile/            # Authenticated user profile page
│   │   ├── properties/         # Property catalog and search filters
│   │   │   └── [pid]/          # Property detail view with reviews
│   │   └── page.tsx            # Home page featuring verified listings
│   ├── auth/
│   │   ├── login/              # Login screen
│   │   └── register/           # Registration screen (Tenant / Landlord)
│   ├── dashboard/
│   │   ├── admin/              # Admin Control Center
│   │   ├── landlord/           # Landlord portal (Listings & requests)
│   │   └── tenant/             # Tenant portal (Requests & receipts)
│   ├── payment/
│   │   ├── cancel/             # Payment cancelled page
│   │   └── success/            # Payment success & review submission
│   ├── error.tsx               # Root error boundary
│   ├── not-found.tsx           # Custom 404 page
│   └── global-error.tsx        # Fallback critical error boundary
├── components/
│   ├── shared/
│   │   └── navbar.tsx          # Responsive navigation header
│   └── ui/                     # UI components (Button, Card, Badge, Input, etc.)
├── services/                   # Server Actions and API integration
│   ├── admin.ts                # Admin actions (users, rentals, moderation)
│   ├── landlord.ts             # Landlord actions (properties, requests)
│   ├── tenant.ts               # Tenant actions (rentals, payments)
│   ├── review.ts               # Review actions (fetch & submit reviews)
│   └── getMe.ts                # Current session resolver
└── lib/
    ├── type.ts                 # Shared TypeScript interfaces
    └── utils.ts                # Class name merging utility
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
BACKEND_API_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000

JWT_ACCESS_SECRET=your_jwt_access_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
```

When deploying to production, replace `http://localhost:5000` with the live URL of your deployed backend API.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

### 4. Run Typecheck & Linter
```bash
npm run typecheck
npm run lint
```
