"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CARDS, COLLECTION, SETS, WISHLIST, cardsInSet, getSet, priceHistory } from "@/lib/data";
import { cx, fmtInt, fmtUSD } from "@/lib/format";
import { PriceChart, Sparkline } from "@/components/PriceChart";
import { PriceChange } from "@/components/PriceChange";
import { CardTile } from "@/components/CardTile";
import { CardImage } from "@/components/CardImage";
import { EmptyState, SectionHead, SetProgress } from "@/components/Blocks";
import { PriceAlertToggle } from "@/components/Commerce";
import { Heart, Plus } from "@/components/Icons";

const TABS = ["All", "Raw", "Graded", "Sealed"] as const;

export function CollectionView() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const history = useMemo(() => priceHistory("portfolio-main", COLLECTION.value), []);
  const owned = useMemo(() => [...CARDS.filter((c) => c.owned), ...cardsInSet(SETS[0]).filter((c) => c.owned && !CARDS.includes(c))].slice(0, 15), []);
  const movers = [CARDS[0], CARDS[5], CARDS[2], CARDS[6], CARDS[1]];
  const moverPct = [3.12, 2.48, 1.96, -2.71, -1.35];
  const gain = COLLECTION.value - COLLECTION.cost;
  const shown = tab === "Sealed" ? [] : tab === "Graded" ? owned.filter((c) => c.rare) : tab === "Raw" ? owned.filter((c) => !c.rare) : owned;

  return (
    <div className="container py-6 md:py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Portfolio</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight md:text-3xl">My collection</h1>
        </div>
        <button className="btn-primary"><Plus size={18} /> Add cards</button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        {/* VALUE */}
        <section className="panel p-4 sm:p-6" aria-label="Collection value">
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="col-span-2">
              <p className="text-xs font-medium text-faint">Total collection value</p>
              <p className="num mt-1 text-[32px] font-extrabold leading-none tracking-tight sm:text-[40px]">{fmtUSD(COLLECTION.value)}</p>
              <div className="mt-2"><PriceChange pct={COLLECTION.dayPct} abs={COLLECTION.dayChange} label="today" /></div>
            </div>
            <div><p className="text-xs text-faint">Cost basis</p><p className="num mt-1 font-semibold">{fmtUSD(COLLECTION.cost)}</p></div>
            <div><p className="text-xs text-faint">Unrealized gain</p><p className="num mt-1 font-semibold text-up">+{fmtUSD(gain)}</p><PriceChange pct={(gain / COLLECTION.cost) * 100} size="xs" /></div>
          </div>
          <PriceChart data={history} title="Value over time" height={220} defaultRange="1Y" />
        </section>

        {/* TOP MOVERS */}
        <section className="panel p-4 sm:p-6" aria-labelledby="movers-h">
          <h2 id="movers-h" className="font-semibold">Top movers today</h2>
          <p className="text-sm text-muted">Across your 1,286 cards</p>
          <ul className="mt-4 divide-y divide-line">
            {movers.map((c, i) => (
              <li key={c.slug}>
                <Link href={`/card/${c.slug}`} className="flex items-center gap-3 py-3 hover:opacity-90">
                  <div className="w-10 shrink-0"><CardImage card={c} tilt={false} /></div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{c.name}</p>
                    <p className="truncate text-xs text-faint">{getSet(c.setSlug)?.name}</p>
                  </div>
                  <Sparkline data={priceHistory(c.slug + "m", c.price, 24).map((p, k) => p.v * 0.15 + k * moverPct[i] * c.price * 0.01)} className="hidden sm:block" />
                  <div className="text-right">
                    <p className="num text-sm font-bold">{fmtUSD(c.price)}</p>
                    <PriceChange pct={moverPct[i]} size="xs" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.7fr]">
        {/* SET COMPLETION */}
        <section className="panel p-4 sm:p-6" aria-labelledby="sets-h">
          <h2 id="sets-h" className="font-semibold">Set completion</h2>
          <div className="mt-3 space-y-1">
            <SetProgress name="First Light Base Set" owned={102} total={102} href="/set/first-light-base" value="Complete · master set value $41,880" />
            <SetProgress name="Celestial Tides" owned={142} total={207} href="/set/celestial-tides" value="65 missing · est. $2,118 to complete" />
            <SetProgress name="2026 Apex Chrome Football" owned={118} total={300} href="/set/2026-apex-chrome-football" value="182 missing · est. $1,346 to complete" />
            <SetProgress name="2026 Heritage Diamond Baseball" owned={61} total={400} href="/set/2026-heritage-diamond-baseball" value="339 missing · est. $905 to complete" />
          </div>
        </section>

        {/* WISHLIST */}
        <section className="panel p-4 sm:p-6" aria-labelledby="wish-h">
          <div className="flex items-baseline justify-between">
            <h2 id="wish-h" className="font-semibold">Wishlist &amp; price alerts</h2>
            <span className="text-xs text-faint"><span className="num">2</span> alerts active</span>
          </div>
          <ul className="mt-3 divide-y divide-line">
            {WISHLIST.map(({ card, target, alert }) => (
              <li key={card.slug} className="grid grid-cols-[40px_1fr] items-center gap-x-3 gap-y-2 py-3 sm:grid-cols-[40px_1fr_auto]">
                <div className="row-span-2 sm:row-span-1"><CardImage card={card} tilt={false} /></div>
                <div className="min-w-0">
                  <Link href={`/card/${card.slug}`} className="block truncate text-sm font-semibold hover:underline">{card.name}</Link>
                  <p className="num text-xs text-faint">Market {fmtUSD(card.price)} · <PriceChange pct={card.change7d} size="xs" label="7d" /></p>
                </div>
                <PriceAlertToggle compact defaultOn={alert} target={target} current={card.price} />
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* GRID */}
      <section className="mt-12" aria-labelledby="grid-h">
        <SectionHead title="Cards" sub={`${fmtInt(COLLECTION.cards)} cards · ${COLLECTION.graded} graded`} />
        <h2 id="grid-h" className="sr-only">Collection cards</h2>
        <div role="tablist" className="mb-6 flex gap-1 overflow-x-auto border-b border-line">
          {TABS.map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
              className={cx("-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold", tab === t ? "border-gold text-ink" : "border-transparent text-muted hover:text-ink")}>{t}</button>
          ))}
        </div>
        {shown.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
            {shown.map((c) => <CardTile key={c.slug} card={c} />)}
          </div>
        ) : (
          <EmptyState icon={<Heart size={22} />} title="No sealed products yet" body="Add booster boxes, ETBs and hobby boxes to track their value alongside your cards." action={<button className="btn-secondary"><Plus size={16} /> Add sealed product</button>} />
        )}
      </section>
    </div>
  );
}
