# Module 3 Test Evidence

Evidence captured on 2026-10-01 against the local API and Docker PostgreSQL service. No credentials or connection strings are included here.

## Database

`docker compose ps` reported:

```text
recycled-plastic-traceability-db   postgres:16-alpine   Up (healthy)   0.0.0.0:5433->5432/tcp
```

Representative queries returned:

```text
 batches
---------
       4

 events
--------
      9

 batch_code  | current_status
-------------+----------------
 RP-2026-001 | Ready
 RP-2026-002 | Processing
 RP-2026-003 | Delivered
 RP-2026-004 | Collected
```

After the authenticated API write flow, the database query showed:

```text
 batch_code  | weight_kg | current_status
-------------+-----------+----------------
 RP-2026-001 |   1840.50 | Ready
 RP-TEST-001 |     10.00 | Ready
```

## API happy and naughty paths

| Request | Observed status | Observed JSON result |
|---|---:|---|
| `GET /api/health` | 200 | `{ "ok": true }` |
| `GET /api/batches` | 200 | Four seeded batch records |
| `GET /api/batches/RP-2026-001` | 200 | Batch detail with three ordered events |
| `GET /api/batches/UNKNOWN` | 404 | `{ "error": "Batch not found" }` |
| Unauthenticated `POST /api/batches` | 401 | `{ "error": "Authentication required" }` |
| Authenticated malformed JSON | 400 | `{ "error": "Malformed JSON" }` |
| Authenticated negative weight | 400 | `{ "error": "weightKg must be a positive number" }` |
| Authenticated duplicate `RP-TEST-001` | 400 | `{ "error": "batchCode already exists" }` |
| Authenticated valid create | 201 | `RP-TEST-001` persisted with `Collected` status |
| Authenticated invalid status patch | 400 | `{ "error": "currentStatus is invalid" }` |
| Authenticated valid status patch | 200 | `RP-TEST-001` persisted with `Ready` status |
| Invalid admin login | 401 | `{ "error": "Invalid credentials" }` |
| Valid admin login | 200 | Signed token returned; token omitted from this evidence |

The server remained available after malformed input and subsequent valid requests completed normally.

## Static and route checks

- `npm run lint`: passed with no errors.
- `npm run build`: passed; Next generated `/`, `/batches`, `/batches/[id]`, `/admin/login`, and `/admin/batches`.
- A production server on an isolated port returned `200` for `/`, `/batches`, `/batches/RP-2026-001`, `/admin/login`, and `/admin/batches`.
- Public application files under `app/` public routes, `components/`, and `lib/` were not changed by Module 3.
- `.env` was verified ignored by `git check-ignore -v .env`; `.env` was not staged.

The browser-specific console and 375px visual checks remain part of the admin polish pass; no public route or public style was modified in the CMS stages.
