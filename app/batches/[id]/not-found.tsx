import Link from "next/link";

export default function BatchNotFound() {
  return <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-24 text-center lg:py-32"><span className="grid h-16 w-16 place-items-center rounded-3xl bg-amber/20 text-3xl text-[#9A671D]">?</span><p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-forest">Batch not found</p><h1 className="mt-3 text-4xl font-bold tracking-tight text-charcoal">We can&apos;t trace that record.</h1><p className="mt-4 leading-relaxed text-charcoal/60">The batch ID may be incorrect or may not be part of the live traceability registry.</p><Link href="/batches" className="mt-8 rounded-xl bg-forest px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1b4936]">Back to batches</Link></div>;
}
