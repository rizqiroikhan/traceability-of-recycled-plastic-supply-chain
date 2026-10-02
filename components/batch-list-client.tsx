"use client";

import { useEffect, useMemo, useState } from "react";
import { BatchCard, type PublicBatch } from "@/components/batch-card";

const filters = ["All", "PET", "HDPE", "PP"] as const;
type Filter = (typeof filters)[number];

export function BatchListClient() {
  const [filter, setFilter] = useState<Filter>("All");
  const [batches, setBatches] = useState<PublicBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  async function load() { setLoading(true); setError(''); try { const response = await fetch('/api/batches'); const data = await response.json(); if (!response.ok) throw new Error(data.error ?? 'Unable to load batches'); setBatches(data.batches); } catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to load batches'); } finally { setLoading(false); } }
  useEffect(() => { void load(); }, []);
  const filteredBatches = useMemo(() => filter === "All" ? batches : batches.filter((batch) => batch.materialType === filter), [filter, batches]);

  return <>
    <div className="flex flex-nowrap gap-1 rounded-2xl border border-forest/10 bg-white p-2 shadow-card" aria-label="Filter batches by material">
      {filters.map((item) => <button key={item} type="button" onClick={() => setFilter(item)} aria-pressed={filter === item} className={`min-w-0 flex-1 whitespace-nowrap rounded-xl px-2 py-2 text-sm font-bold transition sm:px-4 ${filter === item ? "bg-forest text-white" : "text-charcoal/60 hover:bg-mist hover:text-forest"}`}>{item === "All" ? "All materials" : item}</button>)}
    </div>
    {loading ? <div className="mt-7 rounded-3xl border border-forest/10 bg-white p-12 text-center text-charcoal/55">Loading live batch records…</div> : error ? <div className="mt-7 rounded-3xl border border-red-200 bg-red-50 p-8 text-center"><p className="font-bold text-red-900">We couldn’t load the batch registry.</p><p className="mt-2 text-sm text-red-800">{error}</p><button type="button" onClick={() => void load()} className="mt-4 rounded-xl bg-forest px-4 py-2 font-bold text-white">Retry</button></div> : <><div className="mt-7 flex items-center justify-between gap-4"><p className="text-sm text-charcoal/55">Showing <span className="font-bold text-charcoal">{filteredBatches.length}</span> {filteredBatches.length === 1 ? "batch" : "batches"}</p><p className="text-xs font-medium uppercase tracking-[0.14em] text-charcoal/35">Live PostgreSQL records</p></div>{filteredBatches.length > 0 ? <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{filteredBatches.map((batch) => <BatchCard key={batch.id} batch={batch} />)}</div> : <div className="mt-4 rounded-3xl border border-dashed border-forest/20 bg-white p-12 text-center"><p className="font-bold text-charcoal">No batches found</p><p className="mt-2 text-sm text-charcoal/55">Try another material filter.</p></div>}</>}
  </>;
}
