'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const api = 'http://localhost:4000';
const eventTypes = ['Collected', 'Sorted', 'Washed', 'Processed', 'In transit', 'Delivered'];

export default function NewHistoryEventPage() {
  const params = useParams<{ batchCode: string }>();
  const router = useRouter();
  const batchCode = decodeURIComponent(params.batchCode);
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('traceability_admin_token');
    if (!saved) { router.replace('/admin/login'); return; }
    setToken(saved);
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setMessage('');
    const form = new FormData(event.currentTarget);
    const payload = { eventType: form.get('eventType'), eventDate: form.get('eventDate'), location: form.get('location'), actor: form.get('actor'), notes: form.get('notes') || null };
    try {
      const response = await fetch(`${api}/api/batches/${encodeURIComponent(batchCode)}/events`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Could not add progress event');
      router.push(`/admin/batches/${encodeURIComponent(batchCode)}`);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not add progress event'); }
    finally { setSaving(false); }
  }

  return <main className="admin-page">
    <p><Link className="admin-link-button" href={`/admin/batches/${encodeURIComponent(batchCode)}`}>← Back to {batchCode}</Link></p>
    <header className="admin-header"><div><p className="admin-eyebrow">Batch progress</p><h1>Add history event</h1><p className="admin-muted">Connect a new custody or processing milestone to {batchCode}.</p></div></header>
    <section className="admin-panel admin-form-panel"><form onSubmit={submit} className="admin-form">
      <div className="admin-form-grid"><div><label htmlFor="eventType">Event type</label><select id="eventType" name="eventType" defaultValue="Processed" required>{eventTypes.map((eventType) => <option key={eventType}>{eventType}</option>)}</select></div><div><label htmlFor="eventDate">Event date</label><input id="eventDate" name="eventDate" type="date" required /></div><div><label htmlFor="location">Location</label><input id="location" name="location" placeholder="Bekasi Reprocessing Plant" required /></div><div><label htmlFor="actor">Actor</label><input id="actor" name="actor" placeholder="Processing partner" required /></div></div>
      <label htmlFor="notes">Notes <span className="admin-label-hint">optional</span></label><textarea id="notes" name="notes" rows={4} placeholder="What happened at this milestone?" />
      {message && <p className="admin-error" role="alert">{message}</p>}
      <div className="admin-form-actions"><Link className="admin-button admin-button-secondary" href={`/admin/batches/${encodeURIComponent(batchCode)}`}>Cancel</Link><button className="admin-button" disabled={saving}>{saving ? 'Saving…' : 'Save progress event'}</button></div>
    </form></section>
  </main>;
}
