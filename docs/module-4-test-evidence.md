# Module 4 QA Evidence

Date: 2026-10-02

## Architecture

- Next.js dev server tested on `http://localhost:3002`.
- Express `:4000` was stopped during integrated API testing.
- PostgreSQL remained in Docker Compose on host port `5433`.
- Next catch-all route: `/api/[...slug]`.
- Browser requests use relative `/api/...` paths.

## Route checks

Passed through the single Next.js server:

- `GET /api/health` → `200 {"ok":true}`
- `GET /api/batches` → `200` with PostgreSQL batch records
- `GET /batches` → `200`
- `GET /batches/RP-2026-003` → `200`
- `GET /admin/login` → `200`
- `GET /admin/batches` → `200`
- `GET /admin/batches/new` → `200`
- `GET /admin/batches/RP-2026-003/history/new` → `200`

## Authentication and validation

- Admin login through `/api/admin/login` succeeded with the configured local credentials.
- Invalid batch payload returned `400` and was rejected before insertion.
- Invalid progress-event payload returned `400` and was rejected before insertion.
- Protected batch creation without `Authorization: Bearer ...` returned `401`.

## End-to-end persistence

- PATCH through the integrated route updated `RP-2026-003` from its prior status to `Ready`.
- POST through `/api/batches/RP-2026-003/events` created event `Sorted` at `Module 4 QA Facility` with actor `QA Operator`.
- Follow-up public API read returned the updated status and the new event in the batch history.
- Existing event history remained present; the batch returned five events after the new event was added.

## Database recovery

1. Stopped only the PostgreSQL container with `docker compose stop db`.
2. Public API request returned `500`, confirming the page did not hide the database failure with mock data.
3. Restarted only PostgreSQL with `docker compose start db`.
4. Public API request returned `200` after recovery.
5. `docker compose ps` reported the database container healthy.

## Static checks

- `npm run lint` passed.
- `npm run build` passed.
- No test script is configured in `package.json`.
- No `.env` or credential file was staged.
