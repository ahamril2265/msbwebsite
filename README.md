# Mustawa — packaging store

Online store and admin panel for carry bags, garbage bags, HD string bags, PP containers and PP plastic.
Built with Next.js 15, Tailwind CSS and Prisma (SQLite locally).

## First-time setup

```bash
npm install
cp .env.example .env      # then edit .env: set AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm run db:setup          # creates prisma/dev.db, loads the catalog, creates the admin account
npm run dev               # http://localhost:3000
```

Sign in with the admin email and password from `.env`, then open **/admin** (or use "Admin panel" in the account menu).

## What's where

| Area | Path |
| --- | --- |
| Storefront | `/`, `/search`, `/product/[id]`, `/cart`, `/checkout`, `/quote` |
| Customer account | `/login`, `/signup`, `/orders`, `/profile` |
| Admin | `/admin` — dashboard, orders, products, quote requests, settings |
| API | `app/api/**` |
| Database schema | `prisma/schema.prisma` |
| Initial catalog | `lib/seed-catalog.js` (only used by `npm run db:seed`) |

## Useful commands

- `npm run db:seed` — re-run the seed (adds missing products/admin; doesn't overwrite your edits)
- `npm run db:studio` — browse and edit the database in a web UI
- `npm run build && npm start` — production build

## Going live

- **Database:** switch `provider` in `prisma/schema.prisma` to `postgresql`, point `DATABASE_URL` at a hosted Postgres (Neon, Supabase, Railway…), then `npm run db:setup`.
- **Uploaded photos** are saved to `./uploads`. On serverless hosts (e.g. Vercel) that folder isn't persistent; use a host with a disk (Railway, Render, a VPS) or move uploads to object storage.
- **Payments:** checkout supports bank transfer and cash on delivery. Card payments need a provider such as Stripe.
- **Email:** order confirmations and password-reset emails need an email provider (e.g. Resend); not wired up yet.
