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
    setMessage('');
    try {
      const response = await fetch(`${api}/api/batches/${encodeURIComponent(batch.batchCode)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ materialType: form.get('materialType'), weightKg: Number(form.get('weightKg')), sourceLocation: form.get('sourceLocation'), processedAt: form.get('processedAt') || null, currentStatus: form.get('currentStatus') }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Update failed');
      setMessage('Batch information updated successfully.'); await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Update failed'); }
  }

  return <main className="admin-page">
    <p><Link className="admin-link-button" href="/admin/batches">← Back to batches</Link></p>
    {loading ? <div className="admin-panel"><p className="admin-muted">Loading batch…</p></div> : batch ? <>
      <header className="admin-header"><div><p className="admin-eyebrow">Batch detail</p><h1>{batch.batchCode}</h1><p className="admin-muted">Review this batch’s custody and processing history.</p></div><span className={`admin-status status-${batch.currentStatus.toLowerCase()}`}>{batch.currentStatus}</span></header>
      {message && <p className="admin-notice" role="status">{message}</p>}
      <section className="admin-grid"><div className="admin-panel"><h2>Edit batch information</h2><form onSubmit={update} className="admin-form"><div className="admin-form-grid"><div><label htmlFor="materialType">Material</label><select id="materialType" name="materialType" defaultValue={batch.materialType}>{['PET', 'HDPE', 'PP'].map((material) => <option key={material}>{material}</option>)}</select></div><div><label htmlFor="weightKg">Weight (kg)</label><input id="weightKg" name="weightKg" type="number" min="0.01" step="0.01" defaultValue={batch.weightKg} required /></div><div><label htmlFor="currentStatus">Current status</label><select id="currentStatus" name="currentStatus" defaultValue={batch.currentStatus}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></div><div><label htmlFor="processedAt">Processed date</label><input id="processedAt" name="processedAt" type="date" defaultValue={batch.processedAt ?? ''} /></div></div><label htmlFor="sourceLocation">Source location</label><input id="sourceLocation" name="sourceLocation" defaultValue={batch.sourceLocation} required /><button className="admin-button">Save changes</button></form></div><div className="admin-panel"><div className="admin-panel-heading"><h2>Event history</h2><Link className="admin-button admin-button-compact" href={`/admin/batches/${encodeURIComponent(batch.batchCode)}/history/new`}>+ Add progress event</Link></div>{batch.events.length ? <ol className="admin-events">{batch.events.map((item) => <li key={`${item.eventDate}-${item.eventType}`}><strong>{item.eventType}</strong><span>{item.eventDate} · {item.location}</span><small>{item.actor}{item.notes ? ` — ${item.notes}` : ''}</small></li>)}</ol> : <p className="admin-muted">No events have been recorded for this batch yet. Add the first progress event to connect this batch to its history.</p>}</div></section>
    </> : <div className="admin-panel"><p className="admin-error" role="alert">{message || 'Batch not found'}</p></div>}
  </main>;
}
