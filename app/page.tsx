import Link from "next/link";
import { BatchCard } from "@/components/batch-card";
import { SummaryCard } from "@/components/summary-card";
import { StatusBadge } from "@/components/status-badge";
import { batches } from "@/lib/batch-data";

const statusOrder = ["Collected", "Processing", "Ready", "Delivered"] as const;

export default function Home() {
  const totalWeight = batches.reduce((total, batch) => total + batch.weightKg, 0);
  const activeBatches = batches.filter((batch) => batch.status !== "Delivered").length;
  const deliveredBatches = batches.filter((batch) => batch.status === "Delivered").length;
  const averageContent = Math.round(batches.reduce((total, batch) => total + batch.recycledContentPercent, 0) / batches.length);

  return <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-14">
    <section className="relative overflow-hidden rounded-[2rem] bg-forest px-6 py-9 text-white shadow-card sm:px-10 sm:py-12">
      <div className="relative z-10 max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.18em] text-white/60">Supply chain visibility</p><h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Know every batch. Build better cycles.</h1><p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">Track recycled plastic as it moves from collection and processing to its final use.</p><Link href="/batches" className="mt-8 inline-flex items-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-forest transition hover:bg-[#edf5ee]">Explore batches <span className="ml-2">→</span></Link></div>
      <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border-[42px] border-white/10" /><div className="absolute -bottom-36 right-24 h-64 w-64 rounded-full border-[34px] border-amber/50" />
    </section>

    <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><SummaryCard label="Material tracked" value={`${(totalWeight / 1000).toFixed(1)} t`} helper="Across 8 recorded batches" icon="◒" tone="forest" /><SummaryCard label="Active batches" value={String(activeBatches)} helper="Moving through the network" icon="↗" tone="blue" /><SummaryCard label="Delivered" value={String(deliveredBatches)} helper="Completed final-use journeys" icon="✓" tone="amber" /><SummaryCard label="Avg. recycled content" value={`${averageContent}%`} helper="Content across all batches" icon="♻" tone="charcoal" /></section>

    <section className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <article className="rounded-3xl border border-forest/10 bg-white p-6 shadow-card sm:p-7"><div className="flex items-start justify-between"><div><p className="text-sm font-semibold text-charcoal/55">Batch status</p><h2 className="mt-1 text-2xl font-bold text-charcoal">Where materials are now</h2></div><span className="rounded-xl bg-mist px-3 py-2 text-xl text-forest">◌</span></div><div className="mt-7 space-y-5">{statusOrder.map((status) => { const count = batches.filter((batch) => batch.status === status).length; return <div key={status}><div className="mb-2 flex items-center justify-between text-sm"><StatusBadge status={status} /><span className="font-bold text-charcoal">{count} <span className="font-normal text-charcoal/45">batches</span></span></div><div className="h-2 rounded-full bg-mist"><div className="h-2 rounded-full bg-forest" style={{ width: `${(count / batches.length) * 100}%` }} /></div></div>; })}</div></article>
      <article><div className="flex items-end justify-between gap-4"><div><p className="text-sm font-semibold text-charcoal/55">Recent activity</p><h2 className="mt-1 text-2xl font-bold text-charcoal">Latest batch movements</h2></div><Link href="/batches" className="hidden text-sm font-bold text-forest sm:block">See all →</Link></div><div className="mt-5 space-y-3">{batches.slice(0, 3).map((batch) => <BatchCard key={batch.id} batch={batch} />)}</div><Link href="/batches" className="mt-4 block text-center text-sm font-bold text-forest sm:hidden">See all batches →</Link></article>
    </section>
  </div>;
}
