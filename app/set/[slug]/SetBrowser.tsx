"use client";
import { useMemo, useState } from "react";
import type { Card } from "@/lib/data";
import { cx, fmtInt } from "@/lib/format";
import { CardTile } from "@/components/CardTile";
import { CardTileSkeleton, EmptyState } from "@/components/Blocks";
import { Filter, X } from "@/components/Icons";

type Owned = "all" | "owned" | "missing";
const PRICE = [
  { id: "any", label: "Any price", min: 0, max: Infinity },
  { id: "u5", label: "Under $5", min: 0, max: 5 },
  { id: "5-50", label: "$5 – $50", min: 5, max: 50 },
  { id: "50-250", label: "$50 – $250", min: 50, max: 250 },
  { id: "250", label: "$250+", min: 250, max: Infinity },
];

export function SetBrowser({ cards, total }: { cards: Card[]; total: number }) {
  const rarities = useMemo(() => Array.from(new Set(cards.map((c) => c.rarity))), [cards]);
  const [rar, setRar] = useState<string[]>([]);
  const [price, setPrice] = useState("any");
  const [owned, setOwned] = useState<Owned>("all");
  const [sort, setSort] = useState("number");
  const [open, setOpen] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const list = useMemo(() => {
    const pr = PRICE.find((p) => p.id === price)!;
    const out = cards.filter((c) =>
      (!rar.length || rar.includes(c.rarity)) && c.price >= pr.min && c.price < pr.max &&
      (owned === "all" || (owned === "owned" ? c.owned : !c.owned)));
    if (sort === "price-desc") out.sort((a, b) => b.price - a.price);
    if (sort === "change") out.sort((a, b) => b.change7d - a.change7d);
    return out;
  }, [cards, rar, price, owned, sort]);

  const active = rar.length + (price !== "any" ? 1 : 0) + (owned !== "all" ? 1 : 0);
  const clear = () => { setRar([]); setPrice("any"); setOwned("all"); };

  const filters = (
    <div className="space-y-7">
      <fieldset>
        <legend className="mb-2.5 text-sm font-semibold">Collection</legend>
        <div className="grid grid-cols-3 rounded-xl border border-line bg-elevated p-1" role="radiogroup" aria-label="Owned filter">
          {(["all", "owned", "missing"] as Owned[]).map((o) => (
            <button key={o} role="radio" aria-checked={owned === o} onClick={() => setOwned(o)}
              className={cx("h-8 rounded-lg text-xs font-semibold capitalize", owned === o ? "bg-surface text-ink shadow" : "text-muted hover:text-ink")}>{o === "missing" ? "Not owned" : o}</button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2.5 text-sm font-semibold">Rarity</legend>
        <div className="space-y-1">
          {rarities.map((r) => {
            const n = cards.filter((c) => c.rarity === r).length;
            const on = rar.includes(r);
            return (
              <label key={r} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-elevated">
                <input type="checkbox" checked={on} onChange={() => setRar(on ? rar.filter((x) => x !== r) : [...rar, r])} className="h-4 w-4 accent-[rgb(var(--gold))]" />
                <span className="flex-1 text-muted">{r}</span><span className="num text-xs text-faint">{n}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2.5 text-sm font-semibold">Price range</legend>
        <div className="flex flex-wrap gap-2">
          {PRICE.map((p) => <button key={p.id} aria-pressed={price === p.id} onClick={() => setPrice(p.id)} className="chip h-8 text-xs">{p.label}</button>)}
        </div>
      </fieldset>
      {active > 0 && <button onClick={clear} className="text-sm font-semibold text-gold-text hover:underline">Clear all filters</button>}
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <aside className="hidden lg:block"><div className="sticky top-24">{filters}</div></aside>

      <div>
        <div className="mb-5 flex items-center justify-between gap-3">
          <p className="text-sm text-muted">Showing <span className="num font-semibold text-ink">{list.length}</span> of <span className="num">{fmtInt(total)}</span> cards</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setOpen(true)} className="btn-secondary h-10 lg:hidden"><Filter size={16} /> Filters{active > 0 && <span className="num grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] text-gold-ink">{active}</span>}</button>
            <label className="sr-only" htmlFor="sort">Sort</label>
            <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)} className="input select h-10 w-auto">
              <option value="number">Card number</option>
              <option value="price-desc">Price: high to low</option>
              <option value="change">7d change</option>
            </select>
          </div>
        </div>

        {list.length === 0 ? (
          <EmptyState title="No cards match these filters" body="Try widening the price range or including more rarities." action={<button onClick={clear} className="btn-secondary">Clear filters</button>} />
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 xl:grid-cols-5 md:grid-cols-4">
            {list.map((c) => <CardTile key={c.slug} card={c} showOwned compact={false} />)}
            {loadingMore && Array.from({ length: 5 }).map((_, i) => <CardTileSkeleton key={i} />)}
          </div>
        )}
        {list.length > 0 && (
          <div className="mt-10 text-center">
            <button className="btn-secondary px-6" onClick={() => { setLoadingMore(true); setTimeout(() => setLoadingMore(false), 1800); }}>Load more cards</button>
          </div>
        )}
      </div>

      {/* Mobile filter sheet */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] animate-fade-in overflow-y-auto rounded-t-3xl border border-line bg-surface p-5 pb-8">
            <div className="mb-5 flex items-center justify-between"><p className="text-lg font-bold">Filters</p><button onClick={() => setOpen(false)} className="btn-ghost h-10 w-10 px-0" aria-label="Close filters"><X /></button></div>
            {filters}
            <button onClick={() => setOpen(false)} className="btn-primary mt-8 w-full">Show {list.length} cards</button>
          </div>
        </div>
      )}
    </div>
  );
}
