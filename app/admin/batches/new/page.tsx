'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const materials = ['PET', 'HDPE', 'PP'];
const statuses = ['Collected', 'Processing', 'Ready', 'Delivered'];

export default function NewBatchPage() {
  const router = useRouter();
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
    const payload = {
      batchCode: form.get('batchCode'), materialType: form.get('materialType'), weightKg: Number(form.get('weightKg')),
      sourceLocation: form.get('sourceLocation'), processedAt: form.get('processedAt') || null, currentStatus: form.get('currentStatus'),
    };
    try {
      const response = await fetch('/api/batches', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Could not create batch');
      router.push(`/admin/batches/${encodeURIComponent(data.batchCode)}`);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not create batch'); }
    finally { setSaving(false); }
  }

  return <main className="admin-page">
    <p><Link className="admin-link-button" href="/admin/batches">← Back to batches</Link></p>
    <header className="admin-header"><div><p className="admin-eyebrow">Operations workspace</p><h1>New batch</h1><p className="admin-muted">Add a traceable recycled-plastic batch to the supply-chain register.</p></div></header>
    <section className="admin-panel admin-form-panel"><form onSubmit={submit} className="admin-form">
      <div className="admin-form-grid"><div><label htmlFor="batchCode">Batch code</label><input id="batchCode" name="batchCode" placeholder="RP-2026-005" required /></div><div><label htmlFor="materialType">Material</label><select id="materialType" name="materialType" defaultValue="PET" required>{materials.map((material) => <option key={material}>{material}</option>)}</select></div><div><label htmlFor="weightKg">Weight (kg)</label><input id="weightKg" name="weightKg" type="number" min="0.01" step="0.01" placeholder="1250" required /></div><div><label htmlFor="currentStatus">Current status</label><select id="currentStatus" name="currentStatus" defaultValue="Collected">{statuses.map((status) => <option key={status}>{status}</option>)}</select></div></div>
      <label htmlFor="sourceLocation">Source location</label><input id="sourceLocation" name="sourceLocation" placeholder="Bandung Collection Hub" required />
      <label htmlFor="processedAt">Processed date <span className="admin-label-hint">optional</span></label><input id="processedAt" name="processedAt" type="date" />
      {message && <p className="admin-error" role="alert">{message}</p>}
      <div className="admin-form-actions"><Link className="admin-button admin-button-secondary" href="/admin/batches">Cancel</Link><button className="admin-button" disabled={saving}>{saving ? 'Creating…' : 'Create batch'}</button></div>
    </form></section>
  </main>;
}
