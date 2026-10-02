'use client';

import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type EventItem = { eventType: string; eventDate: string; location: string; actor: string; notes: string | null };
type Detail = { batchCode: string; materialType: string; weightKg: string; sourceLocation: string; processedAt: string | null; currentStatus: string; events: EventItem[] };

const api = 'http://localhost:4000';
const statuses = ['Collected', 'Processing', 'Ready', 'Delivered'];

export default function AdminBatchDetailPage() {
  const params = useParams<{ batchCode: string }>();
  const router = useRouter();
  const batchCode = decodeURIComponent(params.batchCode);
  const [batch, setBatch] = useState<Detail | null>(null);
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const response = await fetch(`${api}/api/batches/${encodeURIComponent(batchCode)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Could not load batch');
      setBatch(data);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not load batch'); }
    finally { setLoading(false); }
  }, [batchCode]);

  useEffect(() => {
    const saved = localStorage.getItem('traceability_admin_token');
    if (!saved) { router.replace('/admin/login'); return; }
    setToken(saved); load();
  }, [load, router]);

  async function update(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!batch) return;
    const form = new FormData(event.currentTarget);
    const response = await fetch(`${api}/api/batches/${encodeURIComponent(batch.batchCode)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ currentStatus: form.get('currentStatus') }) });
    const data = await response.json();
    if (!response.ok) { setMessage(data.error ?? 'Update failed'); return; }
    setMessage('Batch updated successfully.'); await load();
  }

  return <main className="admin-page">
    <p><Link className="admin-link-button" href="/admin/batches">← Back to batches</Link></p>
    {loading ? <div className="admin-panel"><p className="admin-muted">Loading batch…</p></div> : batch ? <>
      <header className="admin-header"><div><p className="admin-eyebrow">Batch detail</p><h1>{batch.batchCode}</h1><p className="admin-muted">Review this batch’s custody and processing history.</p></div><span className={`admin-status status-${batch.currentStatus.toLowerCase()}`}>{batch.currentStatus}</span></header>
      {message && <p className="admin-notice" role="status">{message}</p>}
      <section className="admin-grid"><div className="admin-panel"><h2>Batch information</h2><dl className="admin-facts"><div><dt>Material</dt><dd>{batch.materialType}</dd></div><div><dt>Weight</dt><dd>{batch.weightKg} kg</dd></div><div><dt>Source</dt><dd>{batch.sourceLocation}</dd></div><div><dt>Processed</dt><dd>{batch.processedAt ?? 'Not yet processed'}</dd></div></dl><form onSubmit={update} className="admin-form"><label htmlFor="status">Current status</label><select id="status" name="currentStatus" defaultValue={batch.currentStatus}>{statuses.map((status) => <option key={status}>{status}</option>)}</select><button className="admin-button">Save status</button></form></div><div className="admin-panel"><h2>Event history</h2>{batch.events.length ? <ol className="admin-events">{batch.events.map((item) => <li key={`${item.eventDate}-${item.eventType}`}><strong>{item.eventType}</strong><span>{item.eventDate} · {item.location}</span><small>{item.actor}{item.notes ? ` — ${item.notes}` : ''}</small></li>)}</ol> : <p className="admin-muted">No events have been recorded for this batch.</p>}</div></section>
    </> : <div className="admin-panel"><p className="admin-error" role="alert">{message || 'Batch not found'}</p></div>}
  </main>;
}
