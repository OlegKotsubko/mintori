import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CARDS, GAMES, cardsInSet, getCard, getSet, listingsFor } from "@/lib/data";
import { fmtUSD } from "@/lib/format";
import { CardDetail } from "./CardDetail";

export function generateStaticParams() {
  return CARDS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCard(slug);
  if (!c) return {};
  const set = getSet(c.setSlug)!;
  return {
    title: `${c.name} ${c.number} — ${set.name} price guide`,
    description: `${c.name} (${set.name} ${c.number}) market price ${fmtUSD(c.price)}. See PSA 10, PSA 9 and raw prices, price history, population and listings from verified sellers.`,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const card = getCard(slug);
  if (!card) notFound();
  const set = getSet(card.setSlug)!;
  const related = [...cardsInSet(set).filter((c) => c.slug !== card.slug && c.price > 5).slice(0, 6), ...CARDS.filter((c) => c.setSlug !== card.setSlug && c.game === card.game)].slice(0, 6);
  const low = listingsFor(card, card.variants[0], "Raw")[0];

  // Product structured data for SEO
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${card.name} ${card.number}`,
    category: `${GAMES[card.game].label} > ${set.name}`,
    sku: card.slug,
    offers: { "@type": "AggregateOffer", priceCurrency: "USD", lowPrice: low.price, offerCount: 6, availability: "https://schema.org/InStock" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <CardDetail card={card} set={set} related={related} />
    </>
  );
}
