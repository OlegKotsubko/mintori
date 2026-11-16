import type { Metadata } from "next";
import Link from "next/link";
import { fmtUSD } from "@/lib/format";
import { PACK, POOL, SELLBACK, TIERS, TIER_ORDER, packEV, tierRange } from "@/lib/rip";
import { PackOpening } from "@/components/PackOpening";
import { TrustBadges } from "@/components/Blocks";
import { ChevronRight } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Rip a digital pack",
  description: `Open a ${PACK.name} online: every pull is a real card held in the Mintori vault. Odds are published, and you can sell back instantly or have the card shipped.`,
};

const STEPS = [
  { t: "Rip", b: "Buy a pack and open it. The card is assigned by our server the moment you pay, before any animation plays." },
  { t: "Reveal", b: "You see the exact card, its vault ID and its market value from verified completed sales." },
  { t: "Decide", b: `Sell it back instantly for ${SELLBACK * 100}% of market value, keep it in your vault, or have it shipped insured.` },
];

export default function Page() {
  return (
    <div className="container py-8 md:py-12">
      <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1 text-sm text-faint">
        <Link href="/" className="hover:text-ink">Home</Link><ChevronRight size={14} /><span className="text-muted">Rip packs</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,520px)_1fr] lg:gap-14">
        <div className="min-w-0">
          <p className="eyebrow">Digital pack · real card</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">{PACK.name}</h1>
          <p className="mt-2 text-muted">One real card from the vault in every pack. <span className="num font-semibold text-ink">{fmtUSD(PACK.price, true)}</span> per rip.</p>
          <div className="mt-6"><PackOpening /></div>
        </div>

        <div className="min-w-0 space-y-10 lg:pt-24">
          <section aria-labelledby="odds-h">
            <h2 id="odds-h" className="h-section">Published odds</h2>
            <p className="mt-1 text-sm text-muted">What you can pull, how often, and what it is worth today.</p>
            <div className="panel mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs text-faint">
                    <th scope="col" className="px-4 py-3 font-medium">Tier</th>
                    <th scope="col" className="px-4 py-3 text-right font-medium">Chance</th>
                    <th scope="col" className="px-4 py-3 text-right font-medium">Market value</th>
                    <th scope="col" className="hidden px-4 py-3 text-right font-medium xl:table-cell">Cards</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {TIER_ORDER.map((t) => {
                    const [lo, hi] = tierRange(t);
                    return (
                      <tr key={t}>
                        <th scope="row" className="whitespace-nowrap px-4 py-3 text-left font-semibold">
                          <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full align-middle" style={{ background: TIERS[t].color }} />{TIERS[t].label}
                        </th>
                        <td className="px-4 py-3 text-right font-semibold">{TIERS[t].odds}%</td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-muted">{fmtUSD(lo)} – {fmtUSD(hi)}</td>
                        <td className="hidden px-4 py-3 text-right text-muted xl:table-cell">{POOL[t].length}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="border-t border-line px-4 py-3 text-xs text-faint">
                Average pull value <b className="num text-muted">{fmtUSD(packEV())}</b> against a <span className="num">{fmtUSD(PACK.price, true)}</span> pack.
                Most rips return less than the pack price; a few return much more.
              </p>
            </div>
          </section>

          <section aria-labelledby="how-h">
            <h2 id="how-h" className="h-section">How a rip works</h2>
            <ol className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {STEPS.map((s, i) => (
                <li key={s.t} className="rounded-xl border border-line bg-surface p-4">
                  <p className="num text-xs font-bold text-gold-text">0{i + 1}</p>
                  <p className="mt-1 font-semibold">{s.t}</p>
                  <p className="mt-1 text-xs leading-relaxed text-faint">{s.b}</p>
                </li>
              ))}
            </ol>
          </section>

          <TrustBadges layout="stack" />
          <p className="text-xs leading-relaxed text-faint">
            Digital packs are for adults 18+ and are not available in every state. Set a budget before you rip.
            This page is a demo: the balance is not real money and no purchase is made.
          </p>
        </div>
      </div>
    </div>
  );
}
