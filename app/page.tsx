import Link from "next/link";
import { CARDS, COLLECTION, GAMES, SEALED, SETS, priceHistory } from "@/lib/data";
import { fmtDate, fmtUSD } from "@/lib/format";
import { SearchBar } from "@/components/SearchBar";
import { CardTile } from "@/components/CardTile";
import { CardImage } from "@/components/CardImage";
import { SealedTile } from "@/components/SealedTile";
import { SectionHead, TrustBadges } from "@/components/Blocks";
import { PriceChange } from "@/components/PriceChange";
import { Sparkline } from "@/components/PriceChart";
import { LoginCTA } from "@/components/LoginCTA";
import { Bell, Calendar, ChevronRight, Grid } from "@/components/Icons";

const POPULAR = ["Celestial Tides", "199/165", "Marcus Hale RC", "1st Edition holo", "PSA 10 under $100"];
const INDEXES = [
  { name: "Mintori Pokémon 250", pct: 2.41 },
  { name: "Football Rookies 100", pct: 5.08 },
  { name: "Basketball 100", pct: -0.86 },
  { name: "Vintage Baseball 50", pct: 0.37 },
];

export default function Home() {
  const trending = [...CARDS].sort((a, b) => Math.abs(b.change7d) - Math.abs(a.change7d)).slice(0, 10);
  const upcoming = SETS.filter((s) => s.releaseDate >= "2026-11-01").sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));
  const recent = SETS.filter((s) => s.releaseDate < "2026-11-01" && s.releaseDate > "2026-01-01");
  const hero = [CARDS[2], CARDS[0], CARDS[10]];

  return (
    <>
      {/* HERO — search is the single primary action */}
      <section className="relative overflow-hidden border-b border-line/60">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_0%,rgb(var(--gold)/0.12),transparent_70%)]" />
        <div className="container relative grid items-center gap-10 py-12 md:py-20 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="eyebrow">Price guide + marketplace · Pokémon &amp; US sports cards</p>
            <h1 className="mt-4 text-[34px] font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[56px]">
              Know what every card <br className="hidden sm:block" />is <span className="holo-text">really</span> worth.
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted sm:text-lg">
              Transparent prices from 4.2M completed sales — every brand, every era. Buy from verified sellers with insured shipping.
            </p>
            <div className="mt-8 max-w-2xl"><SearchBar size="lg" /></div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-faint">Popular:</span>
              {POPULAR.map((p) => <Link key={p} href="/card/tidecrest-leviathan-ex-199-165" className="rounded-full border border-line px-3 py-1 text-xs text-muted hover:border-faint hover:text-ink">{p}</Link>)}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(Object.keys(GAMES) as (keyof typeof GAMES)[]).map((g, i) => (
                <Link key={g} href={`/set/${SETS.find((s) => s.game === g)!.slug}`} className="rounded-xl border border-line bg-surface px-3.5 py-3 hover:border-faint">
                  <p className="text-sm font-semibold">{GAMES[g].label}</p>
                  <p className="num text-xs text-faint">{["38,214", "112,960", "97,431", "141,077"][i]} cards</p>
                </Link>
              ))}
            </div>
          </div>
          <div aria-hidden className="relative hidden h-[440px] lg:block">
            {hero.map((c, i) => (
              <div key={c.slug} className="absolute top-1/2 w-[230px]" style={{ left: `${8 + i * 26}%`, transform: `translateY(-50%) rotate(${(i - 1) * 9}deg) translateY(${i === 1 ? -18 : 12}px)`, zIndex: i === 1 ? 2 : 1 }}>
                <CardImage card={c} />
              </div>
            ))}
          </div>
        </div>
        {/* market index ticker */}
        <div className="border-t border-line/60 bg-surface/50">
          <ul className="container relative flex gap-6 overflow-x-auto py-3 text-sm [scrollbar-width:none]">
            {INDEXES.map((x) => (
              <li key={x.name} className="flex shrink-0 items-center gap-2"><span className="text-muted">{x.name}</span><PriceChange pct={x.pct} label="7d" /></li>
            ))}
          </ul>
        </div>
      </section>

      <div className="container space-y-16 py-12 md:space-y-20 md:py-16">
        {/* TRENDING */}
        <section aria-labelledby="trending">
          <SectionHead title="Trending this week" sub="Biggest 7-day moves by completed-sale volume" href="/set/celestial-tides" />
          <h2 id="trending" className="sr-only">Trending cards</h2>
          <div className="scroll-row">
            {trending.map((c) => <div key={c.slug} className="w-[44%] shrink-0 sm:w-[30%] md:w-[22%] lg:w-[calc((100%-4rem)/5)]"><CardTile card={c} /></div>)}
          </div>
        </section>

        {/* RELEASES + SEALED */}
        <div className="grid gap-12 lg:grid-cols-[1fr_1.35fr]">
          <section id="releases" aria-labelledby="rel-h" className="min-w-0 scroll-mt-24">
            <SectionHead title="Release calendar" sub="Pre-orders open on Mintori" />
            <h2 id="rel-h" className="sr-only">Release calendar</h2>
            <ol className="panel divide-y divide-line">
              {upcoming.map((s) => {
                const d = new Date(s.releaseDate);
                return (
                  <li key={s.slug}>
                    <Link href={`/set/${s.slug}`} className="flex items-center gap-4 p-4 hover:bg-elevated">
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-line bg-elevated text-center leading-none">
                        <span><span className="block text-[10px] font-bold uppercase tracking-wider text-gold-text">{fmtDate(s.releaseDate, { month: "short" })}</span><span className="num mt-1 block text-xl font-bold">{d.getUTCDate()}</span></span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold">{s.name}</span>
                        <span className="block text-xs text-faint">{GAMES[s.game].label} · <span className="num">{s.total}</span> cards · {fmtDate(s.releaseDate, { weekday: "long" })}</span>
                      </span>
                      <span className="hidden rounded-full bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold-text sm:inline">Pre-order</span>
                      <ChevronRight className="text-faint" />
                    </Link>
                  </li>
                );
              })}
              {recent.map((s) => (
                <li key={s.slug}>
                  <Link href={`/set/${s.slug}`} className="flex items-center gap-4 p-4 hover:bg-elevated">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-elevated text-faint"><Calendar /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{s.name}</span>
                      <span className="block text-xs text-faint">Released {fmtDate(s.releaseDate)} · <span className="num">{s.total}</span> cards</span>
                    </span>
                    <span className="text-xs font-medium text-muted">Out now</span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="sealed-h" className="min-w-0">
            <SectionHead title="Featured sealed" sub="Factory-sealed, shipped insured" href="/set/celestial-tides#sealed" />
            <h2 id="sealed-h" className="sr-only">Featured sealed products</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {SEALED.slice(0, 6).map((p) => <SealedTile key={p.slug} p={p} />)}
            </div>
          </section>
        </div>

        {/* COLLECTION CTA */}
        <section className="panel relative overflow-hidden p-6 md:p-10">
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="eyebrow">Free forever · no card upload limits</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">Track your collection like a portfolio.</h2>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li className="flex gap-2"><Grid size={18} className="text-gold" /> Add cards by search or scan — raw, graded and sealed.</li>
                <li className="flex gap-2"><Bell size={18} className="text-gold" /> Daily value updates and price alerts on your wishlist.</li>
              </ul>
              <LoginCTA className="mt-6">Track your collection free</LoginCTA>
            </div>
            <div className="rounded-xl2 border border-line bg-bg/60 p-5">
              <p className="eyebrow">Example portfolio</p>
              <div className="mt-2 flex flex-wrap items-baseline gap-3">
                <span className="num text-3xl font-bold">{fmtUSD(COLLECTION.value)}</span>
                <PriceChange pct={COLLECTION.dayPct} abs={COLLECTION.dayChange} label="today" />
              </div>
              <Sparkline data={priceHistory("portfolio", COLLECTION.value, 90).map((p) => p.v)} className="mt-4 h-20 w-full" />
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {[["1,286", "Cards"], ["74", "Graded"], ["6", "Sets tracked"]].map(([n, l]) => (
                  <div key={l} className="rounded-xl bg-surface py-2.5"><p className="num font-bold">{n}</p><p className="text-xs text-faint">{l}</p></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TRANSPARENCY */}
        <section className="grid gap-8 md:grid-cols-[1fr_1.4fr] md:items-center">
          <div>
            <h2 className="h-section">Collecting, not gambling.</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              You always see the card you’re buying, the seller, and the price history behind it. Our market prices are the
              median of verified completed sales over the last 30 days — methodology published, no hidden odds.
            </p>
            <Link href="#" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-gold-text hover:underline">How we price <ChevronRight size={16} /></Link>
          </div>
          <TrustBadges layout="row" />
        </section>
      </div>
    </>
  );
}
