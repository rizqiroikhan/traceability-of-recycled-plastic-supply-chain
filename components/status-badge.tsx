import type { BatchStatus } from "@/lib/batch-data";

const styles: Record<BatchStatus, string> = {
  Collected: "bg-amber/15 text-[#9A671D]",
  Processing: "bg-recycled/15 text-[#286481]",
  Ready: "bg-forest/12 text-forest",
  Delivered: "bg-charcoal/10 text-charcoal/70",
};

export function StatusBadge({ status }: { status: BatchStatus }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${styles[status]}`}><span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />{status}</span>;
}
