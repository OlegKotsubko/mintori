"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CARDS, GAMES, SETS, getSet } from "@/lib/data";
import { cx, fmtUSD } from "@/lib/format";
import { Search } from "./Icons";
import { PriceChange } from "./PriceChange";

export function SearchBar({ size = "md", autoFocus }: { size?: "md" | "lg"; autoFocus?: boolean }) {
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const [active, setActive] = useState(0);
  const router = useRouter();

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    const cards = CARDS.filter((c) => (c.name + " " + c.number + " " + getSet(c.setSlug)?.name).toLowerCase().includes(s)).slice(0, 5)
      .map((c) => ({ href: `/card/${c.slug}`, title: c.name, meta: `${getSet(c.setSlug)?.name} · ${c.number}`, price: c.price, change: c.change7d }));
    const sets = SETS.filter((x) => x.name.toLowerCase().includes(s)).slice(0, 3)
      .map((x) => ({ href: `/set/${x.slug}`, title: x.name, meta: `Set · ${GAMES[x.game].label} · ${x.total} cards`, price: undefined as number | undefined, change: 0 }));
    return [...cards, ...sets];
  }, [q]);

  const lg = size === "lg";
  const open = focus && q.length > 0;

  return (
    <form role="search" className="relative w-full"
      onSubmit={(e) => { e.preventDefault(); const r = results[active]; if (r) router.push(r.href); }}>
      <label htmlFor={`search-${size}`} className="sr-only">Search any card, set or player</label>
      <Search size={lg ? 22 : 18} className={cx("pointer-events-none absolute top-1/2 -translate-y-1/2 text-faint", lg ? "left-5" : "left-3.5")} />
      <input
        id={`search-${size}`} type="search" autoComplete="off" autoFocus={autoFocus}
        role="combobox" aria-expanded={open} aria-controls={`sr-${size}`} aria-autocomplete="list"
        placeholder="Search any card, set or player"
        value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }}
        onFocus={() => setFocus(true)} onBlur={() => setTimeout(() => setFocus(false), 150)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
          if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
        }}
        className={cx("w-full rounded-2xl border border-line bg-elevated text-ink placeholder:text-faint focus:border-gold focus:outline-none",
          lg ? "h-16 pl-14 pr-32 text-base sm:text-lg shadow-lift" : "h-10 pl-10 pr-3 text-sm")}
      />
      {lg && <button type="submit" className="btn-primary absolute right-2 top-2 h-12 px-5 sm:px-6">Search</button>}

      {open && (
        <ul id={`sr-${size}`} role="listbox" className="absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-2xl border border-line bg-elevated text-left shadow-lift">
          {results.length === 0 && <li className="px-4 py-5 text-sm text-muted">No matches for “{q}”. Try a set name or card number like <span className="num text-ink">199/165</span>.</li>}
          {results.map((r, i) => (
            <li key={r.href} role="option" aria-selected={i === active}>
              <Link href={r.href} className={cx("flex items-center justify-between gap-4 px-4 py-3", i === active && "bg-surface")} onMouseEnter={() => setActive(i)}>
                <span className="min-w-0"><span className="block truncate text-sm font-semibold">{r.title}</span><span className="block truncate text-xs text-faint">{r.meta}</span></span>
                {r.price !== undefined && <span className="shrink-0 text-right"><span className="num block text-sm font-bold">{fmtUSD(r.price)}</span><PriceChange pct={r.change} size="xs" /></span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
