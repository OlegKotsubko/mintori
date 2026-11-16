/* Digital pack rips — mock data + a stand-in for the rip API.
 * In production `ripPack` is a POST to the backend: the server picks the card,
 * the client only reveals it. Nothing here decides an outcome in a way a real
 * client would be allowed to. */
import { CARDS, type Card } from "./data";

export type Tier = "common" | "rare" | "epic" | "legendary";
export const TIER_ORDER: Tier[] = ["common", "rare", "epic", "legendary"];

export const TIERS: Record<Tier, {
  label: string;
  color: string;                      // rays, chip, card glow
  burst: [string, string, string];    // colours of the opening burst
  rays: number;                       // ray opacity: louder for rarer pulls
  shakes: number;                     // suspense length before the pack opens
  odds: number;                       // percent, published on the page
  min: number;                        // market value floor for the tier (USD)
}> = {
  common:    { label: "Common",    color: "#9fb4cc", burst: ["#6f88a8", "#9fb4cc", "#4d6585"], rays: 0.18, shakes: 6,  odds: 78,  min: 0 },
  rare:      { label: "Rare",      color: "#7daaff", burst: ["#2f7bff", "#35d0ff", "#6a5bff"], rays: 0.42, shakes: 10, odds: 18,  min: 10 },
  epic:      { label: "Epic",      color: "#b06cff", burst: ["#8f3dff", "#ff4fd8", "#5b6bff"], rays: 0.52, shakes: 14, odds: 3.5, min: 100 },
  legendary: { label: "Legendary", color: "#e9b949", burst: ["#ff8a1f", "#ffd84d", "#ff3d6e"], rays: 0.68, shakes: 22, odds: 0.5, min: 500 },
};

export const PACK = { slug: "prism-vault-pack", name: "Prism Vault Pack", setSlug: "prism-vault", price: 25 };
/** Share of market value paid on an instant sell-back. */
export const SELLBACK = 0.9;

export const tierOf = (price: number): Tier =>
  price >= TIERS.legendary.min ? "legendary" : price >= TIERS.epic.min ? "epic" : price >= TIERS.rare.min ? "rare" : "common";

/** Cards available in the pack, grouped by tier. */
export const POOL: Record<Tier, Card[]> = { common: [], rare: [], epic: [], legendary: [] };
for (const c of CARDS) POOL[tierOf(c.price)].push(c);

export const tierRange = (t: Tier): [number, number] => {
  const prices = POOL[t].map((c) => c.price);
  return [Math.min(...prices), Math.max(...prices)];
};

/** Odds-weighted average market value of one pull. */
export const packEV = () =>
  TIER_ORDER.reduce((sum, t) => sum + (TIERS[t].odds / 100) * (POOL[t].reduce((s, c) => s + c.price, 0) / POOL[t].length), 0);

export interface RipResult {
  tier: Tier;
  card: Card;
  value: number;   // market value at the moment of the rip
  serial: string;  // id of the physical card held in the vault
}

/** Mock of `POST /api/rips`. `force` exists only for the demo controls. */
export function ripPack(force?: Tier): Promise<RipResult> {
  return new Promise((resolve) => {
    let tier: Tier = force ?? "common";
    if (!force) {
      let roll = Math.random() * 100;
      for (const t of TIER_ORDER) { if ((roll -= TIERS[t].odds) <= 0) { tier = t; break; } }
    }
    const pool = POOL[tier];
    const card = pool[Math.floor(Math.random() * pool.length)];
    const serial = "MV-" + String(Math.floor(Math.random() * 1e8)).padStart(8, "0");
    // Simulated latency: the UI turns this wait into anticipation.
    window.setTimeout(() => resolve({ tier, card, value: card.price, serial }), 450 + Math.random() * 450);
  });
}
