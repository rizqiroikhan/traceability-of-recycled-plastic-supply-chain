import 'dotenv/config';
import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import { query } from './db';

const app = express();
const port = Number(process.env.API_PORT ?? 4000);
const materials = new Set(['PET', 'HDPE', 'PP']);
const statuses = new Set(['Collected', 'Processing', 'Ready', 'Delivered']);

app.use(cors());
app.use(express.json());

type BatchInput = {
  batchCode?: unknown;
  materialType?: unknown;
  weightKg?: unknown;
  sourceLocation?: unknown;
  processedAt?: unknown;
  currentStatus?: unknown;
  events?: unknown;
};

function error(res: Response, status: number, message: string) {
  return res.status(status).json({ error: message });
}

function validDate(value: unknown, nullable = true) {
  if (value === null && nullable) return true;
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function validateBatch(body: BatchInput, partial = false) {
  const problems: string[] = [];
  if (!partial || body.batchCode !== undefined) {
    if (typeof body.batchCode !== 'string' || body.batchCode.trim() === '') problems.push('batchCode is required');
  }
  if (!partial || body.materialType !== undefined) {
    if (typeof body.materialType !== 'string' || !materials.has(body.materialType)) problems.push('materialType must be PET, HDPE, or PP');
  }
  if (!partial || body.weightKg !== undefined) {
    if (typeof body.weightKg !== 'number' || !Number.isFinite(body.weightKg) || body.weightKg <= 0) problems.push('weightKg must be a positive number');
  }
  if (!partial || body.sourceLocation !== undefined) {
    if (typeof body.sourceLocation !== 'string' || body.sourceLocation.trim() === '') problems.push('sourceLocation is required');
  }
  if (body.processedAt !== undefined && !validDate(body.processedAt)) problems.push('processedAt must be YYYY-MM-DD or null');
  if (body.currentStatus !== undefined && (typeof body.currentStatus !== 'string' || !statuses.has(body.currentStatus))) problems.push('currentStatus is invalid');
  if (body.events !== undefined && !Array.isArray(body.events)) problems.push('events must be an array');
  return problems;
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.ADMIN_SESSION_SECRET;
  const provided = req.header('authorization')?.replace(/^Bearer\s+/i, '');
  if (!expected || !provided || provided !== expected) return error(res, 401, 'Authentication required');
  return next();
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/batches', async (req, res) => {
  try {
    const values: unknown[] = [];
    const filters: string[] = [];
    if (req.query.status) { values.push(req.query.status); filters.push(`current_status = $${values.length}`); }
    if (req.query.material) { values.push(req.query.material); filters.push(`material_type = $${values.length}`); }
    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const result = await query(`SELECT id, batch_code AS "batchCode", material_type AS "materialType", weight_kg AS "weightKg", source_location AS "sourceLocation", processed_at AS "processedAt", current_status AS "currentStatus", created_at AS "createdAt" FROM batches ${where} ORDER BY created_at DESC, batch_code ASC`, values);
    return res.json({ batches: result.rows });
  } catch { return error(res, 500, 'Unable to read batches'); }
});

app.get('/api/batches/:id', async (req, res) => {
  try {
    const result = await query(`SELECT id, batch_code AS "batchCode", material_type AS "materialType", weight_kg AS "weightKg", source_location AS "sourceLocation", processed_at AS "processedAt", current_status AS "currentStatus", created_at AS "createdAt" FROM batches WHERE batch_code = $1 OR id::text = $1`, [req.params.id]);
    if (!result.rows[0]) return error(res, 404, 'Batch not found');
    const events = await query(`SELECT id, event_type AS "eventType", event_date AS "eventDate", location, actor, notes, created_at AS "createdAt" FROM batch_events WHERE batch_id = $1 ORDER BY event_date ASC, created_at ASC`, [result.rows[0].id]);
    return res.json({ ...result.rows[0], events: events.rows });
  } catch { return error(res, 500, 'Unable to read batch'); }
});

app.post('/api/batches', requireAdmin, async (req, res) => {
  const body = req.body as BatchInput;
  const problems = validateBatch(body);
  if (problems.length) return error(res, 400, problems.join('; '));
  try {
    const result = await query(`INSERT INTO batches (batch_code, material_type, weight_kg, source_location, processed_at, current_status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, batch_code AS "batchCode", material_type AS "materialType", weight_kg AS "weightKg", source_location AS "sourceLocation", processed_at AS "processedAt", current_status AS "currentStatus", created_at AS "createdAt"`, [body.batchCode, body.materialType, body.weightKg, body.sourceLocation, body.processedAt ?? null, body.currentStatus ?? 'Collected']);
    return res.status(201).json(result.rows[0]);
  } catch (caught: unknown) {
    if (typeof caught === 'object' && caught !== null && 'code' in caught && caught.code === '23505') return error(res, 400, 'batchCode already exists');
    return error(res, 500, 'Unable to create batch');
  }
});

app.patch('/api/batches/:id', requireAdmin, async (req, res) => {
  const body = req.body as BatchInput;
  const problems = validateBatch(body, true);
  if (problems.length) return error(res, 400, problems.join('; '));
  const fields: string[] = [];
  const values: unknown[] = [];
  const map: Record<string, string> = { batchCode: 'batch_code', materialType: 'material_type', weightKg: 'weight_kg', sourceLocation: 'source_location', processedAt: 'processed_at', currentStatus: 'current_status' };
  for (const [key, column] of Object.entries(map)) if (body[key as keyof BatchInput] !== undefined) { values.push(body[key as keyof BatchInput]); fields.push(`${column} = $${values.length}`); }
  if (!fields.length) return error(res, 400, 'At least one editable field is required');
  values.push(req.params.id);
  try {
    const result = await query(`UPDATE batches SET ${fields.join(', ')} WHERE batch_code = $${values.length} OR id::text = $${values.length} RETURNING id, batch_code AS "batchCode", material_type AS "materialType", weight_kg AS "weightKg", source_location AS "sourceLocation", processed_at AS "processedAt", current_status AS "currentStatus", created_at AS "createdAt"`, values);
    if (!result.rows[0]) return error(res, 404, 'Batch not found');
    return res.json(result.rows[0]);
  } catch (caught: unknown) {
    if (typeof caught === 'object' && caught !== null && 'code' in caught && caught.code === '23505') return error(res, 400, 'batchCode already exists');
    return error(res, 500, 'Unable to update batch');
  }
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  void _next;
  if (err instanceof SyntaxError) return error(res, 400, 'Malformed JSON');
  return error(res, 500, 'Unexpected server error');
});

app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
