# Traceability of Recycled Plastic Supply Chain

Trace recycled-plastic batches from collection through processing and final use with a public journey view and a protected operations workspace.

**Live deployment:** pending Vercel deployment and cloud database credentials.

## Features

- Public batch registry at `/batches`
- Public batch detail and event timeline at `/batches/[id]`
- Protected staff login at `/admin/login`
- Admin batch creation and editing
- Current-status management
- Progress and custody-event recording
- PostgreSQL-backed traceability history
- Same-origin Next.js `/api/*` routes backed by Express business logic
- Loading, retry, validation, and database-failure states

## Architecture

```text
Next.js
├── Public traceability pages
├── Admin CMS
└── /api/* → embedded Express handlers → PostgreSQL
```

Local development uses Docker Compose PostgreSQL. Production is designed for a cloud PostgreSQL provider such as Neon and a Vercel deployment.

## Technology stack

- Next.js 15 and React 19
- Express 5 and `pg`
- PostgreSQL 16
- Docker Compose for local development
- Neon or another SSL-enabled cloud PostgreSQL provider for production
- Vercel for production hosting

## Local setup

Requirements: Node.js, npm, and Docker Desktop.

```powershell
npm install
Copy-Item .env.example .env
docker compose up -d db
npm run dev
```

Open the port shown by Next.js. The integrated API is served by the same Next.js application; no separate Express process is required.

## Environment setup

Copy `.env.example` to `.env` for local development. The application needs `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET`. The `POSTGRES_*` variables are used by the local Docker Compose database.

For Vercel, configure the cloud PostgreSQL `DATABASE_URL` and production-specific admin values in the Vercel project environment settings. Never commit `.env`, passwords, tokens, or database connection strings.

## Database setup

The schema and seed files are in `api/db/`:

- `api/db/schema.sql`
- `api/db/seed.sql`

The local database is exposed on port `5433` by Docker Compose. Production should use a managed PostgreSQL database with SSL enabled.

## Verification

```powershell
npm run lint
npm run build
```

Module 4 QA evidence is available in [docs/module-4-test-evidence.md](docs/module-4-test-evidence.md). The implementation history is documented in [IMPLEMENTATION_NOTES.md](IMPLEMENTATION_NOTES.md).

## Product flow

1. An administrator registers or edits a batch.
2. Staff record custody and processing progress events.
3. The public traceability page reads the persisted batch and event history.
4. Users can verify the journey without accessing the admin workspace.
