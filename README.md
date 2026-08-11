# Property Manager

Sistem manajemen properti untuk Kos, Apartemen, Homestay, dan properti lainnya.

## Tech Stack

- **React 18** - UI Library
- **Vite** - Build Tool
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **React Router v6** - Routing
- **Supabase** - Database & Authentication
- **TanStack Query** - Data Fetching
- **PWA** - Progressive Web App

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment Variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` dengan credentials Supabase kamu:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Setup Database**
   - Buka [Supabase Dashboard](https://supabase.com)
   - Buat project baru
   - Jalankan SQL di `supabase-schema.sql` melalui SQL Editor

4. **Jalankan Development Server**
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Features

- Multi-step property creation wizard
- Room management dengan bulk create
- Tenant lifecycle management
- Multiple pricing intervals (daily, weekly, monthly, yearly)
- Expense tracking
- Row Level Security via Supabase RLS
- PWA support (installable as app)

## License

MIT
