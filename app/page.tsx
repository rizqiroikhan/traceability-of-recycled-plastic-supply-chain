'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BatchCard, type PublicBatch } from '@/components/batch-card';
import { SummaryCard } from '@/components/summary-card';
import { StatusBadge } from '@/components/status-badge';

const statuses = ['Collected', 'Processing', 'Ready', 'Delivered'] as const;

export default function Home() {
  const [batches, setBatches] = useState<PublicBatch[]>([]);
  const [error, setError] = useState('');
  async function load() {
    try {
      const response = await fetch('/api/batches');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Unable to load live data');
      setBatches(data.batches);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load live data');
    }
  }
  useEffect(() => { void load(); }, []);
  const totalWeight = batches.reduce((total, batch) => total + Number(batch.weightKg), 0);
  const active = batches.filter((batch) => batch.currentStatus !== 'Delivered').length;
  const delivered = batches.filter((batch) => batch.currentStatus === 'Delivered').length;

  return <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-14">
    <section className="relative overflow-hidden rounded-[2rem] bg-forest px-6 py-9 text-white shadow-card sm:px-10 sm:py-12"><div className="relative z-10 max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.18em] text-white/60">Supply chain visibility</p><h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Know every batch. Build better cycles.</h1><p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">Track recycled plastic as it moves from collection and processing to its final use.</p><Link href="/batches" className="mt-8 inline-flex items-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-forest">Explore batches <span className="ml-2">→</span></Link></div></section>
    <section className="mt-8 rounded-3xl border border-forest/10 bg-white p-6 shadow-card sm:p-8"><p className="text-sm font-bold uppercase tracking-[0.18em] text-forest">How traceability works</p><div className="mt-5 grid gap-5 md:grid-cols-3"><div><span className="text-2xl font-bold text-forest">01</span><h2 className="mt-2 font-bold text-charcoal">Batch registered</h2><p className="mt-2 text-sm leading-relaxed text-charcoal/60">A recycled-plastic batch is recorded with its material, weight, source, and status.</p></div><div><span className="text-2xl font-bold text-forest">02</span><h2 className="mt-2 font-bold text-charcoal">Progress recorded</h2><p className="mt-2 text-sm leading-relaxed text-charcoal/60">Custody and processing events capture where the batch moved and who handled it.</p></div><div><span className="text-2xl font-bold text-forest">03</span><h2 className="mt-2 font-bold text-charcoal">Journey verified</h2><p className="mt-2 text-sm leading-relaxed text-charcoal/60">Anyone can open the public record and verify the batch journey from live data.</p></div></div></section>
    {error && <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-900">{error} <button className="ml-3 font-bold underline" onClick={() => void load()}>Retry</button></div>}
    <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><SummaryCard label="Material tracked" value={`${(totalWeight / 1000).toFixed(1)} t`} helper="Live PostgreSQL records" icon="◒" tone="forest" /><SummaryCard label="Active batches" value={String(active)} helper="Moving through network" icon="↗" tone="blue" /><SummaryCard label="Delivered" value={String(delivered)} helper="Completed journeys" icon="✓" tone="amber" /><SummaryCard label="Tracked batches" value={String(batches.length)} helper="Current registry" icon="♻" tone="charcoal" /></section>
    <section className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]"><article className="rounded-3xl border border-forest/10 bg-white p-6 shadow-card sm:p-7"><p className="text-sm font-semibold text-charcoal/55">Batch status</p><h2 className="mt-1 text-2xl font-bold text-charcoal">Where materials are now</h2><div className="mt-7 space-y-5">{statuses.map((status) => { const count = batches.filter((batch) => batch.currentStatus === status).length; return <div key={status}><div className="mb-2 flex items-center justify-between text-sm"><StatusBadge status={status} /><span className="font-bold text-charcoal">{count} batches</span></div><div className="h-2 rounded-full bg-mist"><div className="h-2 rounded-full bg-forest" style={{ width: batches.length ? `${(count / batches.length) * 100}%` : '0%' }} /></div></div>; })}</div></article><article><div className="flex items-end justify-between gap-4"><div><p className="text-sm font-semibold text-charcoal/55">Recent activity</p><h2 className="mt-1 text-2xl font-bold text-charcoal">Latest batch movements</h2></div><Link href="/batches" className="text-sm font-bold text-forest">See all →</Link></div><div className="mt-5 space-y-3">{batches.slice(0, 3).map((batch) => <BatchCard key={batch.id} batch={batch} />)}</div></article></section>
  </div>;
}
