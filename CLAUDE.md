# Property Manager - Project Documentation

## Overview

A comprehensive property management system built with React, Vite, TypeScript, Tailwind CSS, React Router, Supabase, and PWA support.

## Tech Stack

- **React 18** - UI Library
- **Vite** - Build Tool
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **React Router v6** - Client-side Routing
- **Supabase** - Database & Authentication
- **TanStack Query (React Query)** - Data Fetching & Caching
- **PWA** - Progressive Web App Support

## Project Structure

```
src/
├── api/                    # API calls to Supabase
│   ├── auth.ts            # Authentication functions
│   ├── supabase.ts        # Supabase client
│   ├── properties.ts      # Property CRUD operations
│   ├── rooms.ts           # Room CRUD operations
│   ├── tenants.ts         # Tenant CRUD operations
│   ├── prices.ts          # Pricing operations
│   └── expenses.ts        # Expense operations
├── components/
│   ├── ui/               # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── Modal.tsx
│   └── layouts/
│       └── Layout.tsx    # Main app layout with sidebar
├── hooks/                 # Custom React hooks
│   ├── useAuth.tsx       # Auth context provider
│   ├── useProperties.ts  # Property queries & mutations
│   ├── useRooms.ts       # Room queries & mutations
│   ├── useTenants.ts     # Tenant queries & mutations
│   ├── usePrices.ts      # Price queries & mutations
│   └── useExpenses.ts    # Expense queries & mutations
├── pages/                # Route pages
│   ├── Login.tsx         # Login page
│   ├── Dashboard/        # Dashboard page
│   ├── Properties/       # Properties pages
│   ├── Tenants/          # Tenants pages
│   └── Settings/         # Settings page
├── types/                # TypeScript types
│   └── property.ts       # Property-related types
├── lib/                  # Utilities
│   └── utils.ts          # Helper functions
├── router.tsx           # React Router configuration
├── main.tsx             # App entry point
└── index.css            # Global styles
```

## Key Features

- **Multi-step Property Creation** - 3-step wizard for adding properties
- **Room Management** - Bulk room creation, status tracking
- **Tenant Management** - Full tenant lifecycle management
- **Pricing System** - Multiple pricing intervals (daily, weekly, monthly, etc.)
- **Expense Tracking** - Track utilities and other expenses
- **Row Level Security** - Data isolation per user via Supabase RLS
- **PWA Support** - Installable as desktop/mobile app
- **Responsive Design** - Mobile-first approach

## Database Schema

See `supabase-schema.sql` for complete database schema with:
- 6 tables (properties, rooms, rental_prices, tenants, expenses, payments)
- Row Level Security policies
- Auto-update triggers for `updated_at` columns

## Environment Variables

Create `.env` file from `.env.example`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in Supabase credentials
4. Run the database schema in Supabase SQL Editor
5. Start development: `npm run dev`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Supabase Setup

1. Create a new Supabase project
2. Go to SQL Editor and run `supabase-schema.sql`
3. Enable Google OAuth in Authentication > Providers (optional)
4. Get API credentials from Settings > API
5. Add credentials to `.env` file

## PWA Configuration

The app is configured as a PWA with:
- Service Worker via vite-plugin-pwa
- Offline support
- Install prompt
- App manifest

To generate PWA icons, use any online PWA icon generator and place them in the `public/` folder:
- `pwa-192x192.png`
- `pwa-512x512.png`

## Type Definitions

All TypeScript types are in `src/types/property.ts`:
- `Property`, `Room`, `Tenant`, `RentalPrice`, `Expense`, `Payment`
- Related types with relations (e.g., `PropertyWithRooms`)
- API response types

## React Query Patterns

The app uses React Query with these patterns:

```typescript
// Query with automatic caching
const { data, isLoading } = useProperties()

// Mutation with automatic cache invalidation
const createProperty = useCreateProperty()
await createProperty.mutateAsync(newProperty)
```

## Routing

Routes are protected by authentication:
- `/login` - Public route
- `/properties` - Protected
- `/properties/new` - Protected
- `/properties/:id` - Protected
- `/tenants` - Protected
- `/settings` - Protected
