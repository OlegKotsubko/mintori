"use client";
import { useState } from "react";
import { CARDS, GRADES, listingsFor, priceFor, priceHistory, type Grade } from "@/lib/data";
import { CardTile, RarityBadge } from "@/components/CardTile";
import { GradeChips, VariantChips } from "@/components/Chips";
import { PriceChart } from "@/components/PriceChart";
import { PriceChange } from "@/components/PriceChange";
import { ListingRow, PriceAlertToggle } from "@/components/Commerce";
import { CardTileSkeleton, ChartSkeleton, EmptyState, ListingSkeleton, SetProgress, TrustBadges } from "@/components/Blocks";
import { LoginCTA } from "@/components/LoginCTA";
import { Bell, Search } from "@/components/Icons";

const TOKENS = [
  ["bg", "Background"], ["surface", "Surface"], ["elevated", "Elevated"], ["line", "Line"],
  ["ink", "Text"], ["muted", "Text muted"], ["faint", "Text faint"], ["gold", "Accent gold"], ["up", "Price up"], ["down", "Price down"],
];

function Block({ title, children, note }: { title: string; children: React.ReactNode; note?: string }) {
  return (
    <section className="border-t border-line py-10">
      <h2 className="text-lg font-semibold">{title}</h2>
      {note && <p className="mt-1 max-w-2xl text-sm text-muted">{note}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function DSView() {
  const card = CARDS[0];
  const sport = CARDS[2];
  const [variant, setVariant] = useState(sport.variants[0]);
  const [grade, setGrade] = useState<Grade>("PSA 10");

  return (
    <div className="container py-10">
      <p className="eyebrow">Mintori UI kit</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Design system</h1>
      <p className="mt-2 max-w-2xl text-muted">Dark-first tokens, one gold accent, holographic foil reserved for rare highlights. Toggle the theme in the header to preview light mode.</p>

      <Block title="Color tokens" note="All text tokens meet WCAG AA on surface. Price direction always pairs color with an arrow and sign.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {TOKENS.map(([k, l]) => (
            <div key={k} className="overflow-hidden rounded-xl border border-line">
              <div className="h-16" style={{ background: `rgb(var(--${k}))` }} />
              <div className="bg-surface p-2.5"><p className="text-sm font-semibold">{l}</p><p className="font-mono text-xs text-faint">--{k}</p></div>
            </div>
          ))}
          <div className="overflow-hidden rounded-xl border border-line"><div className="holo-bg h-16" /><div className="bg-surface p-2.5"><p className="text-sm font-semibold">Holo foil</p><p className="font-mono text-xs text-faint">rare only</p></div></div>
        </div>
      </Block>

      <Block title="Typography" note="Manrope (geometric sans). Every price uses tabular numerals so columns align.">
        <div className="space-y-3">
          <p className="text-5xl font-extrabold tracking-tight">Display 48 / ExtraBold</p>
          <p className="text-2xl font-bold tracking-tight">Heading 24 / Bold</p>
          <p className="text-base">Body 16 — Transparent prices from completed sales.</p>
          <p className="eyebrow">Eyebrow 12 / caps</p>
          <div className="num flex flex-col text-2xl font-bold"><span>$1,794.00</span><span>$   412.50</span><span>$     7.40</span></div>
        </div>
      </Block>

      <Block title="Buttons" note="One primary (gold) action per screen. Everything else is secondary, outline or ghost.">
        <div className="flex flex-wrap gap-3">
          <button className="btn-primary">Buy now · $1,788.00</button>
          <button className="btn-secondary">Add to cart</button>
          <LoginCTA>Track your collection free</LoginCTA>
          <button className="btn-ghost">Ghost</button>
          <LoginCTA variant="secondary">Open login modal</LoginCTA>
        </div>
      </Block>

      <Block title="Price change">
        <div className="flex flex-wrap items-center gap-5">
          <PriceChange pct={8.42} /><PriceChange pct={-3.18} /><PriceChange pct={0} />
          <PriceChange pct={1.18} abs={214.55} label="today" /><PriceChange pct={12.6} pill label="7d" /><PriceChange pct={-6.07} pill label="7d" />
        </div>
      </Block>

      <Block title="Card tile">
        <div className="grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          <CardTile card={card} /><CardTile card={sport} /><CardTile card={CARDS[4]} showOwned /><CardTileSkeleton />
        </div>
        <div className="mt-4 flex flex-wrap gap-2"><RarityBadge rarity="Special Illustration Rare" rare /><RarityBadge rarity="Common" /></div>
      </Block>

      <Block title="Variant & grade chips">
        <div className="max-w-xl space-y-5">
          <VariantChips variants={sport.variants} value={variant} onChange={setVariant} />
          <GradeChips grades={GRADES} value={grade} onChange={setGrade} priceOf={(g) => priceFor(sport, variant, g)} />
        </div>
      </Block>

      <Block title="Price chart">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="panel min-w-0 p-5"><PriceChart data={priceHistory("ds", 412.5)} /></div>
          <div className="panel min-w-0 p-5"><ChartSkeleton /></div>
        </div>
      </Block>

      <Block title="Listing row">
        <div className="panel overflow-hidden">
          <ul className="divide-y divide-line">{listingsFor(card, "Holo", "PSA 10").slice(0, 2).map((l, i) => <ListingRow key={l.id} l={l} best={i === 0} cardName={card.name} />)}</ul>
          <div className="border-t border-line"><ListingSkeleton rows={2} /></div>
        </div>
      </Block>

      <Block title="Price-alert toggle & set progress">
        <div className="grid max-w-3xl gap-6 md:grid-cols-2">
          <PriceAlertToggle defaultOn target={110} current={129} />
          <div className="space-y-4">
            <SetProgress name="Celestial Tides" owned={142} total={207} />
            <SetProgress name="First Light Base Set" owned={102} total={102} value="Complete — bar turns holographic" />
          </div>
        </div>
      </Block>

      <Block title="Trust badges"><TrustBadges /><TrustBadges layout="strip" className="mt-4" /></Block>

      <Block title="Empty states">
        <div className="grid gap-6 md:grid-cols-2">
          <EmptyState title="No results for “glimmer 299”" body="Check the card number or try the set name instead." icon={<Search size={22} />} />
          <EmptyState title="No price alerts yet" body="Add cards to your wishlist and we’ll ping you when they drop to your target price." icon={<Bell size={22} />} action={<button className="btn-secondary">Browse trending cards</button>} />
        </div>
      </Block>
    </div>
  );
}
