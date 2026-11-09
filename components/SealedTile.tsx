import Link from "next/link";
import type { SealedProduct } from "@/lib/data";
import { fmtUSD } from "@/lib/format";
import { SealedArt } from "./CardArt";
import { PriceChange } from "./PriceChange";

export function SealedTile({ p }: { p: SealedProduct }) {
  return (
    <Link href={`/set/${p.setSlug}#sealed`} className="group flex gap-4 rounded-xl2 border border-line bg-surface p-3 transition hover:border-faint sm:flex-col sm:gap-3">
      <div className="aspect-square w-24 shrink-0 overflow-hidden rounded-xl bg-elevated p-2 transition group-hover:scale-[1.02] sm:w-full">
        <SealedArt id={p.slug} name={p.name} kind={p.kind} hue={p.hue} />
      </div>
      <div className="min-w-0 flex-1 sm:px-1 sm:pb-1">
        <p className="text-xs font-medium text-faint">{p.kind}</p>
        <p className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug">{p.name}</p>
        <div className="mt-2 flex items-baseline justify-between gap-2">
          <span className="num font-bold">{fmtUSD(p.price)}</span>
          <PriceChange pct={p.change7d} size="xs" />
        </div>
      </div>
    </Link>
  );
}
