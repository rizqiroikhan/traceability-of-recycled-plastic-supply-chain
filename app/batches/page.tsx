import { BatchListClient } from "@/components/batch-list-client";

export default function BatchesPage() {
  return <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-14">
    <div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.18em] text-forest">Batch registry</p><h1 className="mt-3 text-4xl font-bold tracking-tight text-charcoal sm:text-5xl">Every batch, in one clear view.</h1><p className="mt-4 text-base leading-relaxed text-charcoal/60">Browse the recycled plastic moving through the network and open any record to trace its journey.</p></div>
    <div className="mt-9"><BatchListClient /></div>
  </div>;
}
