# Traceability Admin CMS — Implementation Notes

## 1. Project purpose

This project is a recycled-plastic supply-chain traceability application. The public site lets users browse batches and inspect their traceability journey. The admin CMS gives staff a protected workspace for maintaining batch records, changing current status, and recording custody or processing milestones.

## 2. Work completed so far

### Public traceability frontend

- Added the public batch listing and batch detail experience.
- Added responsive layouts for desktop and mobile screens.
- Added reusable components for navigation, summary cards, status badges, batch cards, and journey timelines.
- Added mobile filters and navigation improvements.

### Database and backend foundation

- Added Docker/PostgreSQL development setup in `docker-compose.yml`.
- Added database schema and seed data under `api/db/`.
- Added `batches` and `batch_events` tables.
- Added a foreign-key relationship from each history event to its batch.
- Added an index for chronological batch-event lookups.
- Added the API server in `api/server.ts`.

### Authentication

- Added staff login at `/admin/login`.
- Added server-side bearer-token protection for admin mutations.
- Kept login configuration in environment variables rather than hard-coding credentials in the UI.
- Added sign-out behavior in the admin workspace.

### Admin batch management

- Added the admin dashboard at `/admin`.
- Added the tracked-batches page at `/admin/batches`.
- Added batch listing, material, weight, source, and current-status display.
- Added refresh behavior and clear loading/error states.
- Added links from a batch code and the `View` button to its dedicated detail page.
- Added a `+ New batch` button.
- Added the new-batch page at `/admin/batches/new`.
- Added creation of new batches through the protected backend.
- Added editing of existing batch information at `/admin/batches/[batchCode]`.
- Added editing for material, weight, source location, processed date, and current status.
- Preserved the existing event history when a batch is edited.
- Added validation for supported material types, statuses, positive weights, valid dates, and required fields.

### Batch progress and history workflow

The latest feature separates batch creation from progress-history updates.

- Added an `+ Add progress event` button to every batch detail page.
- Added a dedicated progress page at:

  `/admin/batches/[batchCode]/history/new`

- Added progress-event fields:
  - Event type: Collected, Sorted, Washed, Processed, In transit, or Delivered
  - Event date
  - Location
  - Actor or organization responsible
  - Notes
- Added a protected backend endpoint:

  `POST /api/batches/:id/events`

- The endpoint accepts either a batch code or batch ID, verifies that the batch exists, validates the event payload, and inserts the event into `batch_events` using the batch foreign key.
- After saving, the user is returned to the batch detail page and can immediately see the new event in chronological history.
- Added an empty-history message explaining how to create the first progress event.
- Added keyboard-focus styling and responsive form behavior for the new workflow.

## 3. Current API routes

### Public/read routes

- `GET /api/health` — API health check.
- `GET /api/batches` — list batches.
- `GET /api/batches/:id` — return a batch and its event history.

### Admin/auth routes

- `POST /api/admin/login` — authenticate staff and return a session token.
- `POST /api/batches` — create a batch.
- `PATCH /api/batches/:id` — update batch information.
- `POST /api/batches/:id/events` — add a progress-history event.

Admin mutation routes require the bearer token returned by the login endpoint.

## 4. Main application pages

- `/` — public landing page.
- `/batches` — public batch listing.
- `/batches/[id]` — public batch traceability detail.
- `/admin/login` — staff sign-in.
- `/admin/batches` — admin batch management list.
- `/admin/batches/new` — create a new batch.
- `/admin/batches/[batchCode]` — edit a batch and inspect its history.
- `/admin/batches/[batchCode]/history/new` — add a separate progress event.

## 5. Important implementation decisions

- Batch creation and progress updates are separate workflows. This prevents the initial batch record from becoming overloaded with repeated history data.
- Progress events are stored in the existing relational database instead of browser state, so they remain available after refresh and can be consumed by the public traceability view.
- Batch history is ordered by event date and creation time.
- The admin UI uses the existing visual language: green action buttons, soft panels, status badges, responsive grids, and accessible focus states.
- Browser API calls now use same-origin relative paths such as `/api/batches`; Next.js owns the API bridge and Express is no longer started as a separate `:4000` service.

## 6. Verification completed

- ESLint passed.
- Next.js production build passed.
- New admin routes returned HTTP 200 during local verification.
- API health endpoint responded successfully.
- Admin login succeeded with the local development configuration.
- A progress event was created through the new endpoint and persisted to the database.
- Fetching the same batch afterward returned the new event in its history.
- The feature was committed and pushed to GitHub.

## 7. Git history for the backend/admin work

- `ace38ec` — define Module 3 backend blueprint
- `54cf8e1` — add PostgreSQL Docker setup and schema
- `e69578b` — add recycled-plastic batch API
- `d977d8e` — add protected batch-management CMS
- `5e84b7e` — add backend and CMS test evidence
- `497eec8` — polish admin CMS styling
- `9584853` — preserve admin batch events after status updates
- `b82cc60` — add admin batch detail navigation
- `90ee263` — add admin batch creation and editing
- `798b83d` — add batch progress-history workflow

The latest feature is available on the remote `master` branch.

## 8. Files most relevant to the current feature

- `api/server.ts` — API routes, validation, authentication, and database writes.
- `api/db/schema.sql` — database tables and relationships.
- `app/admin/batches/page.tsx` — batch list and new-batch entry point.
- `app/admin/batches/new/page.tsx` — new batch form.
- `app/admin/batches/[batchCode]/page.tsx` — batch editing and history display.
- `app/admin/batches/[batchCode]/history/new/page.tsx` — progress-event form.
- `app/admin/admin.css` — admin layout, form, button, table, and responsive styles.
- `docs/module-3-test-evidence.md` — earlier backend/CMS verification notes.

## 9. Current limitations and recommended next improvements

- The local API URL is currently configured directly in the frontend and should eventually be moved to a public environment variable.
- Authentication is suitable for local development but should use a production session store, secure cookies, password hashing, rate limiting, and CSRF protection before deployment.
- There is no delete/archive workflow for batches or events yet.
- There is no edit or correction workflow for individual history events yet.
- There is no pagination, filtering, or search for larger batch volumes.
- The next useful QA step is browser-level testing of login, create batch, edit batch, add progress event, refresh, and public traceability display against a clean database.

## 10. Development notes

- Keep `FRAMEWORK.md` unchanged unless its instructions are explicitly being addressed; it was pre-existing and intentionally not included in the feature commit.
- Start PostgreSQL with Docker Compose before using database-backed routes.
- Run the single Next.js app; its `/api/*` catch-all invokes the reusable Express application in-process.
- If Docker Desktop or the development server crashes, verify the listening ports and restart the affected service before diagnosing application code.

## 11. Module 4 integration

- Public `/`, `/batches`, and `/batches/[id]` pages now load PostgreSQL-backed data through relative API requests.
- Added `app/api/[...slug]/route.ts` as the Next.js-to-Express bridge.
- Preserved all existing Express routes, bearer-token headers, validation, and database business logic.
- Removed the standalone `dev:api` script and obsolete CORS dependency.
- Added loading, friendly failure, and retry handling for public network-backed views.
- Added QA evidence in `docs/module-4-test-evidence.md`.
- Module 4 commits pushed: `31adcb7` and `f9a3f10`.
