import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GAMES, SEALED, SETS, cardsInSet, getSet } from "@/lib/data";
import { fmtDate, fmtUSD } from "@/lib/format";
import { SealedTile } from "@/components/SealedTile";
import { SectionHead, SetProgress } from "@/components/Blocks";
import { ChevronRight, Sparkle } from "@/components/Icons";
import { SetBrowser } from "./SetBrowser";

export function generateStaticParams() {
  return SETS.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getSet(slug);
  return s ? { title: `${s.name} price guide & card list`, description: `All ${s.total} cards in ${s.name} with live market prices, rarity and sealed product prices.` } : {};
}

export default async function SetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const set = getSet(slug);
  if (!set) notFound();
  const cards = cardsInSet(set);
  const sealed = SEALED.filter((p) => p.setSlug === set.slug);
  const owned = cards.filter((c) => c.owned).length;
  const ownedScaled = Math.round((owned / cards.length) * set.total);
  const setValue = cards.reduce((s, c) => s + c.price, 0) * (set.total / cards.length);
  const upcoming = set.releaseDate > "2026-11-09";

  return (
    <div className="pb-10">
      <header className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(70% 90% at 85% 0%, hsl(${set.hue} 70% 50% / .16), transparent 70%)` }} />
        <div className="container relative py-8 md:py-12">
          <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1 text-sm text-faint">
            <Link href="/" className="hover:text-ink">{GAMES[set.game].label}</Link><ChevronRight size={14} /><span className="text-muted">{set.name}</span>
          </nav>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-center gap-4 md:gap-5">
              <span className="holo-border grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-surface md:h-20 md:w-20">
                <Sparkle size={30} style={{ color: `hsl(${set.hue} 80% 65%)` }} />
              </span>
              <div>
                <p className="eyebrow">{set.series} · {GAMES[set.game].label}</p>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight md:text-4xl">{set.name}</h1>
              </div>
            </div>
            <dl className="grid grid-cols-3 gap-3 md:flex md:gap-8">
              <div><dt className="text-xs text-faint">{upcoming ? "Releases" : "Released"}</dt><dd className="num mt-0.5 font-semibold">{fmtDate(set.releaseDate)}</dd></div>
              <div><dt className="text-xs text-faint">Cards</dt><dd className="num mt-0.5 font-semibold">{set.official}{set.total > set.official && <span className="text-muted"> + {set.total - set.official} secret</span>}</dd></div>
              <div><dt className="text-xs text-faint">Set value</dt><dd className="num mt-0.5 font-semibold">{fmtUSD(setValue, true)}</dd></div>
            </dl>
          </div>
          <div className="mt-6 max-w-md"><SetProgress name="Your progress" owned={ownedScaled} total={set.total} value={`${set.total - ownedScaled} cards to complete · est. ${fmtUSD(setValue * 0.42, true)}`} /></div>
        </div>
      </header>

      <div className="container py-8">
        <SetBrowser cards={cards} total={set.total} />

        <section id="sealed" className="mt-16 scroll-mt-24">
          <SectionHead title={`Sealed ${set.name} products`} sub="Factory-sealed · authenticity guaranteed" />
          {sealed.length ? (
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">{sealed.map((p) => <SealedTile key={p.slug} p={p} />)}</div>
          ) : <p className="text-sm text-muted">No sealed products listed for this set yet.</p>}
        </section>
      </div>
    </div>
  );
}
