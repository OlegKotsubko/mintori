"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { GAMES, GRADES, listingsFor, populationFor, priceFor, priceHistory, type Card, type CardSet, type Grade } from "@/lib/data";
import { fmtDate, fmtInt, fmtUSD } from "@/lib/format";
import { CardImage } from "@/components/CardImage";
import { CardTile, RarityBadge } from "@/components/CardTile";
import { GradeChips, VariantChips } from "@/components/Chips";
import { PriceChart } from "@/components/PriceChart";
import { PriceChange } from "@/components/PriceChange";
import { BuyButton, ListingRow, PriceAlertToggle } from "@/components/Commerce";
import { SectionHead, TrustBadges } from "@/components/Blocks";
import { useApp } from "@/components/Providers";
import { ChevronRight, Info, Plus } from "@/components/Icons";

export function CardDetail({ card, set, related }: { card: Card; set: CardSet; related: Card[] }) {
  const [variant, setVariant] = useState(card.variants[0]);
  const [grade, setGrade] = useState<Grade>("Raw");
  const [alertOpen, setAlertOpen] = useState(false);
  const { addToCart } = useApp();

  const price = priceFor(card, variant, grade);
  const gi = GRADES.indexOf(grade) + card.variants.indexOf(variant);
  const change7 = Math.round(card.change7d * (1 + gi * 0.12) * 100) / 100;
  const history = useMemo(() => priceHistory(card.slug + variant + grade, price, 730, change7), [card.slug, variant, grade, price, change7]);
  const listings = useMemo(() => listingsFor(card, variant, grade), [card, variant, grade]);
  const pop = useMemo(() => populationFor(card), [card]);
  const lowest = listings[0];
  const bestNM = listings.find((l) => !/Played/.test(l.condition)) ?? lowest;
  const lastSold = history[history.length - 2].v;
  const popTotal = pop.reduce((s, p) => s + p.count, 0);
  const popMax = Math.max(...pop.map((p) => p.count));
  const label = `${card.name} · ${variant} · ${grade}`;

  return (
    <div className="container pb-28 pt-4 md:pb-10 md:pt-6">
      {/* Breadcrumbs: Game > Set > Card */}
      <nav aria-label="Breadcrumb" className="mb-4 md:mb-6">
        <ol className="flex flex-wrap items-center gap-1 text-xs text-faint sm:text-sm">
          <li><Link href="/" className="hover:text-ink">{GAMES[card.game].label}</Link></li>
          <li aria-hidden><ChevronRight size={14} /></li>
          <li><Link href={`/set/${set.slug}`} className="hover:text-ink">{set.name}</Link></li>
          <li aria-hidden><ChevronRight size={14} /></li>
          <li aria-current="page" className="truncate text-muted">{card.name} <span className="num">{card.number}</span></li>
        </ol>
      </nav>

      {/* ABOVE THE FOLD: image · title + price + trust · selectors + buy */}
      <section className="grid grid-cols-[112px_1fr] gap-x-4 gap-y-6 [grid-template-areas:'img_info'_'buy_buy'] sm:grid-cols-[180px_1fr] lg:grid-cols-[minmax(0,420px)_1fr] lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:[grid-template-areas:'img_info'_'img_buy']">
        <div className="[grid-area:img] lg:sticky lg:top-24 lg:self-start">
          <CardImage card={card} variant={variant} priority />
          <p className="mt-3 hidden text-center text-xs text-faint lg:block">Representative image · each listing shows the actual card</p>
        </div>

        <div className="min-w-0 [grid-area:info]">
          <RarityBadge rarity={card.rarity} rare={card.rare} />
          <h1 className="mt-2 text-xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">{card.name}</h1>
          <p className="mt-1 text-xs text-muted sm:text-sm">{set.name} · <span className="num">{card.number}</span> · {card.subtitle}</p>

          <div className="mt-4 lg:mt-6">
            <p className="text-xs font-medium text-faint">Market price · {variant} · {grade}</p>
            <div className="mt-0.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="num text-[28px] font-extrabold tracking-tight sm:text-4xl lg:text-5xl">{fmtUSD(price)}</span>
              <PriceChange pct={change7} size="sm" pill label="7d" />
            </div>
            <dl className="num mt-2 hidden gap-x-6 gap-y-1 text-sm sm:flex sm:flex-wrap">
              <div className="flex gap-1.5"><dt className="text-faint">Last sold</dt><dd className="font-semibold">{fmtUSD(lastSold)}</dd><dd className="text-faint">· yesterday</dd></div>
              <div className="flex gap-1.5"><dt className="text-faint">Lowest listing</dt><dd className="font-semibold">{fmtUSD(lowest.price)}</dd></div>
              <div className="flex gap-1.5"><dt className="text-faint">30d sales</dt><dd className="font-semibold">{card.rare ? 42 : 318}</dd></div>
            </dl>
          </div>
          <TrustBadges layout="strip" className="mt-4 lg:hidden" />
        </div>

        <div className="min-w-0 space-y-5 [grid-area:buy] lg:mt-0">
          {card.variants.length > 1 && <VariantChips variants={card.variants} value={variant} onChange={setVariant} />}
          <GradeChips grades={GRADES} value={grade} onChange={setGrade} priceOf={(g) => priceFor(card, variant, g)} />

          <div className="grid grid-cols-2 gap-2 md:hidden">
            <button className="btn-secondary" onClick={() => addToCart(label)}><Plus size={16} /> Collection</button>
            <button className="btn-secondary" aria-expanded={alertOpen} onClick={() => setAlertOpen(!alertOpen)}>Price alert</button>
            {alertOpen && <div className="col-span-2"><PriceAlertToggle defaultOn target={Math.round(price * 0.9)} current={price} /></div>}
          </div>

          <div className="hidden rounded-xl2 border border-line bg-surface p-4 md:block lg:p-5">
            <div className="mb-3 flex items-baseline justify-between text-sm">
              <span className="text-muted"><span className="num font-semibold text-ink">{listings.length}</span> listings from <span className="num font-semibold text-ink">{fmtUSD(lowest.price)}</span></span>
              <span className="text-faint">{lowest.shipping === 0 ? "Free insured shipping" : `+ ${fmtUSD(lowest.shipping)} ship`}</span>
            </div>
            <BuyButton price={bestNM.price} label={label} />
            <p className="mt-2 text-center text-xs text-faint">Lowest {grade === "Raw" ? "Near Mint" : grade} listing · sold by {bestNM.seller}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button className="btn-secondary" onClick={() => addToCart(label)}><Plus size={16} /> Add to collection</button>
              <button className="btn-secondary" aria-expanded={alertOpen} onClick={() => setAlertOpen(!alertOpen)}>Set price alert</button>
            </div>
            {alertOpen && <div className="mt-3"><PriceAlertToggle defaultOn target={Math.round(price * 0.9)} current={price} /></div>}
            <TrustBadges layout="strip" className="mt-4 border-t border-line pt-4" />
          </div>
        </div>
      </section>

      {/* CHART + POPULATION */}
      <section className="mt-12 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <div className="panel p-4 sm:p-6">
          <PriceChart data={history} title={`${variant} · ${grade} price history`} footnote="Median of verified completed sales on Mintori, eBay and major auction houses. Outliers and best-offer anomalies removed." />
        </div>
        <div className="panel p-4 sm:p-6">
          <p className="eyebrow">Population report</p>
          <p className="mt-1 text-sm text-muted"><span className="num font-semibold text-ink">{fmtInt(popTotal)}</span> graded by PSA · updated {fmtDate("2026-11-07")}</p>
          <ul className="mt-4 space-y-3">
            {pop.map((p) => (
              <li key={p.grade} className="grid grid-cols-[64px_1fr_56px] items-center gap-3 text-sm">
                <span className="font-medium text-muted">{p.grade}</span>
                <span className="h-2 overflow-hidden rounded-full bg-elevated"><span className={p.grade === "PSA 10" ? "block h-full rounded-full bg-gold" : "block h-full rounded-full bg-faint/60"} style={{ width: `${(p.count / popMax) * 100}%` }} /></span>
                <span className="num text-right font-semibold">{fmtInt(p.count)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-5 text-sm">
            <div><p className="text-xs text-faint">Gem rate</p><p className="num font-semibold">{((pop[0].count / popTotal) * 100).toFixed(1)}%</p></div>
            <div><p className="text-xs text-faint">Est. pull rate</p><p className="num font-semibold">{card.rare ? "1 in 1,440 packs" : "1 in 36 packs"}</p></div>
            <div><p className="text-xs text-faint">Rarity</p><p className="font-semibold">{card.rarity}</p></div>
            <div><p className="text-xs text-faint">Released</p><p className="num font-semibold">{fmtDate(set.releaseDate)}</p></div>
          </div>
          <p className="mt-4 flex gap-1.5 text-xs text-faint"><Info size={14} className="shrink-0" /> Grading ROI: a PSA 10 sells for {(priceFor(card, variant, "PSA 10") / priceFor(card, variant, "Raw")).toFixed(1)}× raw.</p>
        </div>
      </section>

      {/* LISTINGS */}
      <section className="mt-12" aria-labelledby="listings-h">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="listings-h" className="h-section">Current listings</h2>
            <p className="text-sm text-muted">{variant} · {grade} · sorted by price + shipping</p>
          </div>
          <label className="flex items-center gap-2 text-sm text-muted">Sort
            <select className="input select h-10 w-auto pr-8"><option>Price + shipping</option><option>Newest</option><option>Seller rating</option></select>
          </label>
        </div>
        <div className="panel overflow-hidden">
          <div className="hidden grid-cols-[minmax(0,1.6fr)_1fr_.6fr_1fr_auto] gap-4 border-b border-line px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-faint md:grid">
            <span>Seller</span><span>Condition</span><span>Ships</span><span>Price</span><span className="w-[118px]" />
          </div>
          <ul className="divide-y divide-line">
            {listings.map((l, i) => <ListingRow key={l.id} l={l} best={i === 0} cardName={card.name} />)}
          </ul>
        </div>
      </section>

      {/* RELATED */}
      <section className="mt-14">
        <SectionHead title="Related cards" href={`/set/${set.slug}`} cta={`All of ${set.name}`} />
        <div className="scroll-row">
          {related.map((c) => <div key={c.slug} className="w-[44%] shrink-0 sm:w-[30%] lg:w-[calc((100%-5rem)/6)]"><CardTile card={c} /></div>)}
        </div>
      </section>

      {/* Mobile sticky buy bar — the single primary action on small screens */}
      <div className="fixed inset-x-0 bottom-14 z-30 border-t border-line bg-bg/95 px-4 py-3 backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-faint">{grade === "Raw" ? "Near Mint" : grade} · {listings.length} listings</p>
            <p className="num font-bold">{fmtUSD(bestNM.price)}</p>
          </div>
          <button onClick={() => addToCart(label)} className="btn-primary h-11 px-6">Buy now</button>
        </div>
      </div>
    </div>
  );
}
