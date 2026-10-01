# Module 3 Backend Blueprint

## Product and four prompt questions

1. **What are we building?** A reliable recycled-plastic batch traceability system from collection and processing through final use.
2. **What must it contain?** Batch records, ordered event history, public read access, validated writes, protected admin management, PostgreSQL persistence, and evidence of behavior.
3. **How should it behave?** Validate input before persistence, return useful JSON errors and exact status codes, preserve date-only values, sort batches and events predictably, and remain responsive without changing public routes.
4. **How should it look?** Preserve the Module 2 public frontend and visual identity. The isolated admin CMS should be calm, readable, touch-friendly, accessible, and visually distinct from public browsing.

## Scope and route constraints

- Preserve `/`, `/batches`, and `/batches/[id]`, including their existing components, styles, data presentation, and visual identity.
- Add admin functionality only below `/admin`, with isolated admin components and styles.
- Keep server secrets out of client bundles and out of version control.
- Public reads may be unauthenticated. Admin reads and every write must require a signed session/token check.
- Use TypeScript, semantic HTML, accessible labels, and the repository's existing Next.js conventions.

## Data model

| Table | Important columns | Purpose/relationships |
|---|---|---|
| `batches` | `id`, `batch_code`, `material_type`, `weight_kg`, `source_location`, `processed_at`, `current_status`, `created_at` | One traceable recycled-plastic batch; `batch_code` is unique. |
| `batch_events` | `id`, `batch_id`, `event_type`, `event_date`, `location`, `actor`, `notes`, `created_at` | Ordered custody/processing events; foreign key to `batches`. |
| optional `facilities` | Not planned initially | Normalize repeated facilities only if the implemented workflows materially require it. |

### Types and constraints

- `batches.id` and `batch_events.id`: generated UUID primary keys.
- `batch_code`: required, trimmed, unique, and indexed for public detail lookup.
- `material_type`: controlled values `PET`, `HDPE`, or `PP`.
- `weight_kg`: required numeric value greater than zero.
- `source_location`: required non-empty text.
- `processed_at`: nullable PostgreSQL `date`; API serialization must remain `YYYY-MM-DD`.
- `current_status`: controlled values `Collected`, `Processing`, `Ready`, or `Delivered`.
- `created_at`: database-generated timestamp with timezone.
- Event `batch_id`: required foreign key with restrictive delete behavior so event history is not orphaned.
- Event `event_type`, `event_date`, `location`, and `actor`: required; `notes` is optional.
- Event dates are date-only values and should be returned in chronological order, with `created_at` as a deterministic tie-breaker.
- Index `batches(current_status)`, `batches(material_type)`, and `batch_events(batch_id, event_date, created_at)` for filters and detail history.

## API and persistence plan

- `GET /api/batches`: public list, optionally filtered by `status` and `material`; deterministic newest-first ordering.
- `GET /api/batches/:id`: public detail by batch code or supported identifier, including ordered events; missing rows return JSON `404`.
- `POST /api/batches`: protected create with optional initial events; valid input returns `201` and duplicate/invalid input returns `400`.
- `PATCH /api/batches/:id`: protected partial update for editable fields and status/events as designed; valid input returns `200`, missing rows `404`, invalid input `400`.
- Protected admin operations return JSON `401` when the session/token is missing or invalid; unexpected failures return JSON `500`.
- PostgreSQL access is centralized in `api/db.ts`, with environment-based connection settings and date parsers configured explicitly.
- Docker Compose will provide a project-specific Postgres service and named volume. Schema and believable seed data will be replayable through documented Windows-friendly scripts.

## Admin workflow plan

- `/admin/login`: credential check that creates a signed, HTTP-only session/token without exposing secrets to browser JavaScript.
- `/admin/batches`: authenticated list with status/material context, loading, empty, error, and event-history states.
- Add/edit workflow: accessible labeled controls, inline validation, clear success/error feedback, and persistence visible after refresh.
- Responsive target: desktop and 375px widths, with no clipping, overlap, or horizontal overflow and with comfortable touch targets.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Accidental public frontend regression | Inspect public paths before each stage and limit changes to `api`, database files, and `app/admin/**`/admin-only helpers. |
| Secrets committed or shipped client-side | Use ignored `.env`, commit only `.env.example`, and review staged files before every commit. |
| Date values shift timezone | Use PostgreSQL `date` and an explicit date-only parser/serializer. |
| Invalid writes crash the API | Centralize validation and JSON error handling; test malformed JSON, missing fields, duplicate codes, and invalid status/events. |
| Admin route appears protected while API writes are open | Enforce authentication in the API itself, then verify unauthenticated requests return `401`. |
| Local persistence is not reproducible | Use Compose, a named volume, schema/seed SQL, and documented apply scripts. |
| Narrow screens become unusable | Test admin pages at 375px after implementation and inspect overflow, wrapping, and target sizes. |
| Missing local Next guide | `node_modules/next/dist/docs/` is not present in this checkout; implementation will follow the installed Next 15 package conventions and existing repository code. |

## Stage boundary

This blueprint intentionally does not change public application files. Subsequent stages will add persistence, API, isolated admin UI, evidence, and admin-only polish in separate reviewable commits.
