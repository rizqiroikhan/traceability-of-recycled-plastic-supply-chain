"use client";

import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-50 border-b border-forest/10 bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-forest text-lg font-bold text-white shadow-card">↺</span>
          <span className="max-w-[190px] text-sm font-bold leading-tight tracking-tight text-forest sm:max-w-none sm:text-base">Traceability of Recycled Plastic</span>
        </Link>
        <button type="button" className="rounded-xl border border-forest/15 p-2 text-forest md:hidden" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          <span className="block h-0.5 w-5 bg-current" /><span className="my-1.5 block h-0.5 w-5 bg-current" /><span className="block h-0.5 w-5 bg-current" />
        </button>
        <nav className={`${open ? "flex" : "hidden"} absolute left-5 right-5 top-full z-[60] flex-col gap-1 rounded-2xl border border-forest/10 bg-white p-3 shadow-card md:static md:flex md:flex-row md:items-center md:gap-8 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
          <Link href="/" className="rounded-xl px-3 py-2 text-sm font-semibold text-charcoal/70 transition hover:bg-mist hover:text-forest" onClick={() => setOpen(false)}>Overview</Link>
          <Link href="/batches" className="rounded-xl px-3 py-2 text-sm font-semibold text-charcoal/70 transition hover:bg-mist hover:text-forest" onClick={() => setOpen(false)}>Batches</Link>
        </nav>
      </div>
    </header>
  );
}
