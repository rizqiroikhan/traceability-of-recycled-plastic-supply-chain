import Link from "next/link";
import type { Batch } from "@/lib/batch-data";
import { StatusBadge } from "@/components/status-badge";

export function BatchCard({ batch }: { batch: Batch }) {
  return <Link href={`/batches/${batch.id}`} className="group block rounded-3xl border border-forest/10 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-forest/25 sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-xs font-bold tracking-[0.14em] text-forest">{batch.id}</p><h3 className="mt-2 text-lg font-bold text-charcoal">{batch.material} plastic</h3></div><StatusBadge status={batch.status} /></div><dl className="mt-6 grid grid-cols-2 gap-4 text-sm"><div><dt className="text-charcoal/45">Source</dt><dd className="mt-1 line-clamp-2 font-semibold text-charcoal/80">{batch.source}</dd></div><div><dt className="text-charcoal/45">Weight</dt><dd className="mt-1 font-semibold text-charcoal/80">{batch.weightKg.toLocaleString()} kg</dd></div></dl><div className="mt-6 flex items-center justify-between border-t border-forest/10 pt-4 text-sm"><span className="line-clamp-1 text-charcoal/55">{batch.currentLocation}</span><span className="font-bold text-forest transition group-hover:translate-x-1">View →</span></div></Link>;
}
