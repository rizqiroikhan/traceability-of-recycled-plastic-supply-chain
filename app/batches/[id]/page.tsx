'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { JourneyTimeline } from '@/components/journey-timeline';
import { StatusBadge } from '@/components/status-badge';

type Event = { id: string; eventType: string; eventDate: string; location: string; actor: string; notes: string | null };
type Batch = { id: string; batchCode: string; materialType: 'PET' | 'HDPE' | 'PP'; weightKg: number; sourceLocation: string; processedAt: string | null; currentStatus: 'Collected' | 'Processing' | 'Ready' | 'Delivered'; events: Event[] };

export default function BatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => { const resolved = await params; setLoading(true); setError(''); try { const response = await fetch(`/api/batches/${encodeURIComponent(resolved.id)}`); const data = await response.json(); if (!response.ok) throw new Error(data.error ?? 'Unable to load batch'); setBatch(data); } catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to load batch'); } finally { setLoading(false); } }, [params]);
  useEffect(() => { void load(); }, [load]);
  if (loading) return <div className="mx-auto max-w-6xl px-5 py-14 text-center text-charcoal/55">Loading live batch record…</div>;
  if (error || !batch) return <div className="mx-auto max-w-2xl px-5 py-14 text-center"><p className="text-xl font-bold text-charcoal">{error === 'Batch not found' ? 'Batch not found' : 'We couldn’t load this batch.'}</p><p className="mt-2 text-charcoal/60">{error}</p><button type="button" onClick={() => void load()} className="mt-5 rounded-xl bg-forest px-4 py-2 font-bold text-white">Retry</button></div>;
  const journey = batch.events.map((event) => ({ stage: event.eventType, location: `${event.location} · ${event.actor}`, date: event.eventDate, completed: true }));
  return <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-14"><Link href="/batches" className="inline-flex items-center gap-2 text-sm font-bold text-forest hover:underline">← Back to all batches</Link><div className="mt-7 flex min-w-0 flex-col gap-5 border-b border-forest/10 pb-8 sm:flex-row sm:items-end sm:justify-between"><div className="min-w-0"><p className="font-mono text-xs font-bold tracking-[0.16em] text-forest">{batch.batchCode}</p><h1 className="mt-3 text-4xl font-bold tracking-tight text-charcoal sm:text-5xl">{batch.materialType} plastic batch</h1><p className="mt-3 max-w-2xl break-words text-base text-charcoal/60">Collected from {batch.sourceLocation}. This record is backed by the live PostgreSQL traceability API.</p></div><div className="shrink-0"><StatusBadge status={batch.currentStatus} /></div></div><div className="mt-8 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]"><div className="min-w-0"><section className="rounded-3xl border border-forest/10 bg-white p-6 shadow-card sm:p-7"><p className="text-sm font-semibold text-charcoal/55">Batch details</p><dl className="mt-6 divide-y divide-forest/10">{[['Material', batch.materialType], ['Weight', `${Number(batch.weightKg).toLocaleString()} kg`], ['Processed date', batch.processedAt ?? 'Pending'], ['Source', batch.sourceLocation], ['Current status', batch.currentStatus]].map(([label, value]) => <div key={label} className="flex items-start justify-between gap-5 py-4 first:pt-0 last:pb-0"><dt className="shrink-0 text-sm text-charcoal/50">{label}</dt><dd className="max-w-[62%] break-words text-right text-sm font-bold text-charcoal">{value}</dd></div>)}</dl></section></div><section className="rounded-3xl border border-forest/10 bg-white p-6 shadow-card sm:p-7"><div><p className="text-sm font-semibold text-charcoal/55">Supply-chain journey</p><h2 className="mt-1 text-2xl font-bold text-charcoal">Live progress history</h2></div>{batch.events.length ? <JourneyTimeline journey={journey} /> : <p className="mt-7 rounded-2xl bg-mist p-4 text-sm text-charcoal/60">No progress events have been recorded yet.</p>}</section></div></div>;
}
