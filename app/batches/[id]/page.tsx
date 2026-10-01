import Link from "next/link";
import { notFound } from "next/navigation";
import { JourneyTimeline } from "@/components/journey-timeline";
import { StatusBadge } from "@/components/status-badge";
import { batches, getBatch } from "@/lib/batch-data";

export function generateStaticParams() {
  return batches.map((batch) => ({ id: batch.id }));
}

export default async function BatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const batch = getBatch(id);
  if (!batch) notFound();

  return <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-14">
    <Link href="/batches" className="inline-flex items-center gap-2 text-sm font-bold text-forest hover:underline">← Back to all batches</Link>
    <div className="mt-7 flex min-w-0 flex-col gap-5 border-b border-forest/10 pb-8 sm:flex-row sm:items-end sm:justify-between"><div className="min-w-0"><p className="font-mono text-xs font-bold tracking-[0.16em] text-forest">{batch.id}</p><h1 className="mt-3 text-4xl font-bold tracking-tight text-charcoal sm:text-5xl">{batch.material} plastic batch</h1><p className="mt-3 max-w-2xl break-words text-base text-charcoal/60">Collected from {batch.source} and moving toward {batch.destination}.</p></div><div className="shrink-0"><StatusBadge status={batch.status} /></div></div>
    <div className="mt-8 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="min-w-0 space-y-5"><section className="rounded-3xl border border-forest/10 bg-white p-6 shadow-card sm:p-7"><p className="text-sm font-semibold text-charcoal/55">Batch details</p><dl className="mt-6 divide-y divide-forest/10">{[["Material", batch.material], ["Weight", `${batch.weightKg.toLocaleString()} kg`], ["Collection date", batch.collectionDate], ["Current location", batch.currentLocation], ["Destination", batch.destination], ["Recycled content", `${batch.recycledContentPercent}%`]].map(([label, value]) => <div key={label} className="flex items-start justify-between gap-5 py-4 first:pt-0 last:pb-0"><dt className="shrink-0 text-sm text-charcoal/50">{label}</dt><dd className="max-w-[62%] break-words text-right text-sm font-bold text-charcoal">{value}</dd></div>)}</dl></section><section className="rounded-3xl bg-forest p-6 text-white shadow-card sm:p-7"><p className="text-sm font-semibold text-white/60">Traceability note</p><p className="mt-3 text-lg font-bold leading-relaxed">This record is a mock example for the Module 2 frontend.</p><p className="mt-3 text-sm leading-relaxed text-white/70">Use the journey timeline to see each handoff from collection to final use.</p></section></div>
      <section className="rounded-3xl border border-forest/10 bg-white p-6 shadow-card sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-charcoal/55">Supply-chain journey</p><h2 className="mt-1 text-2xl font-bold text-charcoal">From collection to use</h2></div><span className="rounded-xl bg-mist px-3 py-2 text-xl text-forest">↗</span></div><JourneyTimeline journey={batch.journey} /></section>
    </div>
  </div>;
}
