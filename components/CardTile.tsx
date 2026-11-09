import Link from "next/link";
import { getSet, type Card } from "@/lib/data";
import { fmtUSD } from "@/lib/format";
import { CardImage } from "./CardImage";
import { PriceChange } from "./PriceChange";
import { Check, Sparkle } from "./Icons";

export function RarityBadge({ rarity, rare }: { rarity: string; rare?: boolean }) {
  if (!rare) return <span className="rounded-md bg-elevated px-1.5 py-0.5 text-[11px] font-medium text-muted">{rarity}</span>;
  return (
    <span className="holo-border inline-flex items-center gap-1 rounded-md bg-surface px-1.5 py-0.5 text-[11px] font-semibold">
      <Sparkle size={11} className="text-gold" /> <span className="holo-text">{rarity}</span>
    </span>
  );
}

/** Card tile: image, name, set · number, market price, 7-day change. */
export function CardTile({ card, showOwned = false, compact = false }: { card: Card; showOwned?: boolean; compact?: boolean }) {
  const set = getSet(card.setSlug);
  return (
    <Link href={`/card/${card.slug}`} className="group block snap-start rounded-xl2 p-2 -m-2 transition hover:bg-surface focus-visible:bg-surface">
      <div className="relative transition duration-300 group-hover:-translate-y-1">
        <CardImage card={card} />
        {showOwned && card.owned && (
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-bg/85 px-2 py-0.5 text-[11px] font-semibold text-up backdrop-blur">
            <Check size={12} strokeWidth={3} /> Owned
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1 px-0.5">
        <p className="truncate text-sm font-semibold leading-tight">{card.name}</p>
        {!compact && (
          <p className="truncate text-xs text-faint">
            {set?.name} · <span className="num">{card.number}</span>
          </p>
        )}
        <div className="flex items-baseline justify-between gap-2 pt-0.5">
          <span className="num text-[15px] font-bold">{fmtUSD(card.price)}</span>
          <PriceChange pct={card.change7d} size="xs" />
        </div>
      </div>
    </Link>
  );
}
