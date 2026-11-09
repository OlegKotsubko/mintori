/* Mock catalog for the Mintori design mockups.
 * All names are invented placeholders. No real characters, players, leagues or teams. */

export type Game = "pokemon" | "football" | "basketball" | "baseball";
export type Grade = "Raw" | "PSA 10" | "PSA 9" | "BGS 9.5";
export type Range = "1M" | "3M" | "1Y" | "All";

export const GAMES: Record<Game, { label: string; short: string }> = {
  pokemon: { label: "Pokémon TCG", short: "Pokémon" },
  football: { label: "Football", short: "Football" },
  basketball: { label: "Basketball", short: "Basketball" },
  baseball: { label: "Baseball", short: "Baseball" },
};

export const GRADES: Grade[] = ["Raw", "PSA 10", "PSA 9", "BGS 9.5"];
const GRADE_MULT: Record<Grade, number> = { Raw: 1, "PSA 10": 4.35, "PSA 9": 1.62, "BGS 9.5": 2.48 };

export interface CardSet {
  slug: string;
  name: string;
  game: Game;
  releaseDate: string; // ISO
  official: number; // printed set size e.g. 165
  total: number; // incl. secret rares e.g. 207
  hue: number;
  series: string;
}

export interface Card {
  slug: string;
  name: string;
  game: Game;
  setSlug: string;
  number: string;
  rarity: string;
  hue: number;
  price: number; // market price, base variant, raw NM
  change7d: number; // percent
  variants: string[];
  subtitle: string; // e.g. "Fire · 230 HP" or "QB · Rookie"
  rare?: boolean; // gets holographic treatment
  owned?: boolean;
}

export interface SealedProduct {
  slug: string;
  name: string;
  setSlug: string;
  kind: string;
  price: number;
  change7d: number;
  hue: number;
}

export const SETS: CardSet[] = [
  { slug: "celestial-tides", name: "Celestial Tides", game: "pokemon", releaseDate: "2026-08-15", official: 165, total: 207, hue: 205, series: "Astral Era" },
  { slug: "ember-dominion", name: "Ember Dominion", game: "pokemon", releaseDate: "2026-11-21", official: 182, total: 226, hue: 18, series: "Astral Era" },
  { slug: "prism-vault", name: "Prism Vault", game: "pokemon", releaseDate: "2026-12-12", official: 98, total: 120, hue: 285, series: "Special Set" },
  { slug: "first-light-base", name: "First Light Base Set", game: "pokemon", releaseDate: "1999-01-09", official: 102, total: 102, hue: 48, series: "Vintage" },
  { slug: "2026-apex-chrome-football", name: "2026 Apex Chrome Football", game: "football", releaseDate: "2026-11-19", official: 300, total: 300, hue: 140, series: "Apex" },
  { slug: "2025-26-summit-select-basketball", name: "2025–26 Summit Select Basketball", game: "basketball", releaseDate: "2026-12-03", official: 250, total: 250, hue: 330, series: "Summit" },
  { slug: "2026-heritage-diamond-baseball", name: "2026 Heritage Diamond Baseball", game: "baseball", releaseDate: "2026-07-24", official: 400, total: 400, hue: 0, series: "Heritage" },
];

const P_VARIANTS = ["Holo", "Reverse Holo"];
const S_VARIANTS = ["Base", "Refractor", "Gold /50"];

export const CARDS: Card[] = [
  { slug: "tidecrest-leviathan-ex-199-165", name: "Tidecrest Leviathan ex", game: "pokemon", setSlug: "celestial-tides", number: "199/165", rarity: "Special Illustration Rare", hue: 200, price: 412.5, change7d: 8.42, variants: ["Holo"], subtitle: "Water · 280 HP", rare: true, owned: true },
  { slug: "emberwyrm-vmax-021-165", name: "Emberwyrm VMAX", game: "pokemon", setSlug: "celestial-tides", number: "021/165", rarity: "Ultra Rare", hue: 14, price: 64.99, change7d: -3.18, variants: P_VARIANTS, subtitle: "Fire · 320 HP", owned: true },
  { slug: "marcus-hale-rookie-auto-101", name: "Marcus Hale Rookie Auto", game: "football", setSlug: "2026-apex-chrome-football", number: "RA-MH", rarity: "Rookie Autograph", hue: 140, price: 289.0, change7d: 12.6, variants: S_VARIANTS, subtitle: "QB · Rookie", rare: true },
  { slug: "dante-okafor-base-44", name: "Dante Okafor", game: "basketball", setSlug: "2025-26-summit-select-basketball", number: "44", rarity: "Base", hue: 330, price: 18.75, change7d: -1.94, variants: S_VARIANTS, subtitle: "Guard · 2nd Year" },
  { slug: "voltferret-gx-088-165", name: "Voltferret GX", game: "pokemon", setSlug: "celestial-tides", number: "088/165", rarity: "Rare Holo", hue: 52, price: 7.4, change7d: 0.82, variants: P_VARIANTS, subtitle: "Lightning · 190 HP", owned: true },
  { slug: "eli-navarro-1st-bowman-style-7", name: "Eli Navarro 1st Prospect", game: "baseball", setSlug: "2026-heritage-diamond-baseball", number: "HP-7", rarity: "Prospect", hue: 0, price: 46.2, change7d: 21.35, variants: S_VARIANTS, subtitle: "SS · Prospect" },
  { slug: "glacivern-ex-176-165", name: "Glacivern ex", game: "pokemon", setSlug: "celestial-tides", number: "176/165", rarity: "Illustration Rare", hue: 190, price: 129.0, change7d: -6.07, variants: ["Holo"], subtitle: "Water · 240 HP", rare: true },
  { slug: "first-light-pyrodrake-4-102", name: "Pyrodrake (1st Edition)", game: "pokemon", setSlug: "first-light-base", number: "4/102", rarity: "Holo Rare", hue: 30, price: 2340.0, change7d: 2.11, variants: ["Holo"], subtitle: "Fire · 120 HP", rare: true },
  { slug: "jordan-vale-base-12", name: "Jordan Vale", game: "football", setSlug: "2026-apex-chrome-football", number: "12", rarity: "Base", hue: 120, price: 3.25, change7d: -0.61, variants: S_VARIANTS, subtitle: "WR · Veteran" },
  { slug: "mossling-reverse-012-165", name: "Mossling", game: "pokemon", setSlug: "celestial-tides", number: "012/165", rarity: "Common", hue: 110, price: 0.35, change7d: 0.0, variants: P_VARIANTS, subtitle: "Grass · 60 HP", owned: true },
  { slug: "tyrese-cole-gold-23", name: "Tyrese Cole Gold Wave", game: "basketball", setSlug: "2025-26-summit-select-basketball", number: "23", rarity: "Short Print", hue: 45, price: 610.0, change7d: -4.4, variants: S_VARIANTS, subtitle: "Forward · Rookie", rare: true },
  { slug: "duskmoth-v-131-165", name: "Duskmoth V", game: "pokemon", setSlug: "celestial-tides", number: "131/165", rarity: "Ultra Rare", hue: 270, price: 22.1, change7d: 4.75, variants: P_VARIANTS, subtitle: "Psychic · 210 HP" },
];

/* --- deterministic helpers ------------------------------------------------ */
export function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (n: number) => Math.round(n * 100) / 100;

export function variantMult(card: Card, variant: string) {
  const i = card.variants.indexOf(variant);
  if (card.game === "pokemon") return i <= 0 ? 1 : 0.58;
  return [1, 2.85, 11.4][Math.max(0, i)];
}
export function priceFor(card: Card, variant: string, grade: Grade) {
  return round(card.price * variantMult(card, variant) * GRADE_MULT[grade]);
}

/** Daily price series ending at `end`, newest last. */
export function priceHistory(seed: string, end: number, days = 730, pct7?: number) {
  const rnd = seeded(seed);
  const pts: number[] = [end];
  for (let i = 1; i < days; i++) {
    const prev = pts[pts.length - 1];
    const drift = (rnd() - 0.5) * 0.045 + (i < 120 ? -0.0008 : 0.0004);
    pts.push(Math.max(end * 0.25, prev * (1 - drift)));
  }
  if (pct7 !== undefined) {
    // pin the last 7 days so the chart agrees with the displayed 7-day change
    const start = end / (1 + pct7 / 100);
    const ratio = start / pts[Math.min(7, days - 1)];
    for (let i = 7; i < days; i++) pts[i] *= ratio;
    for (let i = 0; i <= 7 && i < days; i++) pts[i] = end + (start - end) * (i / 7) * (0.9 + rnd() * 0.2);
    pts[7] = start;
  }
  const today = new Date("2026-11-09T12:00:00Z").getTime();
  return pts.reverse().map((v, i) => ({ t: today - (days - 1 - i) * 864e5, v: round(v) }));
}
export const RANGE_DAYS: Record<Range, number> = { "1M": 30, "3M": 90, "1Y": 365, All: 730 };

export interface Listing {
  id: string;
  seller: string;
  rating: number;
  sales: number;
  condition: string;
  grade: Grade;
  price: number;
  shipping: number;
  state: string;
  verified: boolean;
}

const SELLERS = ["vaultkeeper_tx", "mintcondition.co", "slabhouse", "nwcardshop", "graded_gems", "the_pull_room", "boxbreak_ohio", "coastal_collects"];
const STATES = ["TX", "CA", "OH", "WA", "FL", "NY", "AZ", "NJ"];
const RAW_COND = ["Near Mint", "Near Mint", "Lightly Played", "Near Mint", "Moderately Played"];

export function listingsFor(card: Card, variant: string, grade: Grade): Listing[] {
  const rnd = seeded(card.slug + variant + grade);
  const base = priceFor(card, variant, grade);
  return Array.from({ length: 6 }, (_, i) => {
    const cond = grade === "Raw" ? RAW_COND[i % RAW_COND.length] : `${grade} slab`;
    const condMult = cond === "Lightly Played" ? 0.88 : cond === "Moderately Played" ? 0.76 : 1;
    const price = round(base * condMult * (0.93 + rnd() * 0.18));
    return {
      id: `${card.slug}-${i}`,
      seller: SELLERS[(i + Math.floor(rnd() * 8)) % SELLERS.length],
      rating: Math.round((97.2 + rnd() * 2.8) * 10) / 10,
      sales: Math.floor(120 + rnd() * 4800),
      condition: cond,
      grade,
      price,
      shipping: price >= 250 ? 0 : [0, 1.99, 4.99][Math.floor(rnd() * 3)],
      state: STATES[Math.floor(rnd() * STATES.length)],
      verified: rnd() > 0.25,
    };
  }).sort((a, b) => a.price + a.shipping - (b.price + b.shipping));
}

export function populationFor(card: Card) {
  const rnd = seeded(card.slug + "pop");
  const scale = card.rare ? 1 : 3.2;
  return [
    { grade: "PSA 10", count: Math.round((380 + rnd() * 900) * scale) },
    { grade: "PSA 9", count: Math.round((1100 + rnd() * 2600) * scale) },
    { grade: "PSA 8", count: Math.round((420 + rnd() * 900) * scale) },
    { grade: "PSA ≤7", count: Math.round((140 + rnd() * 400) * scale) },
  ];
}

/* --- set page: generate a fuller card list ------------------------------- */
const SYL_A = ["Aero", "Bram", "Cinder", "Drift", "Echo", "Fern", "Gale", "Hollow", "Ivy", "Jolt", "Kelp", "Lumen", "Mire", "Nimbus", "Onyx", "Pebble", "Quill", "Rift", "Sable", "Thorn"];
const SYL_B = ["fin", "paw", "wing", "shell", "horn", "tail", "fang", "bloom", "spark", "drake", "mite", "cub"];
const FIRST = ["Andre", "Caleb", "Darius", "Evan", "Isaiah", "Jalen", "Kai", "Luis", "Malik", "Nate", "Owen", "Rafael", "Theo", "Xavier"];
const LAST = ["Whitlock", "Brennan", "Okoro", "Delgado", "Fairchild", "Mercer", "Ashby", "Langford", "Quintero", "Rowe", "Sterling", "Vance"];
const POS: Record<string, string[]> = { football: ["QB", "WR", "RB"], basketball: ["Guard", "Forward", "Center"], baseball: ["SS", "OF", "P"] };
const SPORT_RAR = ["Base", "Base", "Insert", "Short Print", "Rookie Autograph", "Case Hit"];
const P_RARITIES = [
  { r: "Common", w: 0.42, p: [0.1, 0.45] },
  { r: "Uncommon", w: 0.28, p: [0.15, 0.9] },
  { r: "Rare Holo", w: 0.14, p: [1.5, 12] },
  { r: "Ultra Rare", w: 0.08, p: [8, 70] },
  { r: "Illustration Rare", w: 0.05, p: [25, 160] },
  { r: "Special Illustration Rare", w: 0.03, p: [120, 480] },
];

export function cardsInSet(set: CardSet): Card[] {
  const featured = CARDS.filter((c) => c.setSlug === set.slug);
  const rnd = seeded(set.slug);
  const out: Card[] = [...featured];
  const n = 40;
  for (let i = 0; out.length < n; i++) {
    const roll = rnd();
    let acc = 0;
    const rar = P_RARITIES.find((x) => (acc += x.w) >= roll) ?? P_RARITIES[0];
    const num = rar.r.includes("Illustration") ? set.official + 1 + Math.floor(rnd() * (set.total - set.official)) : 1 + Math.floor(rnd() * set.official);
    const poke = set.game === "pokemon";
    const name = poke
      ? SYL_A[Math.floor(rnd() * SYL_A.length)] + SYL_B[Math.floor(rnd() * SYL_B.length)] + (rar.r === "Ultra Rare" ? " ex" : "")
      : FIRST[Math.floor(rnd() * FIRST.length)] + " " + LAST[Math.floor(rnd() * LAST.length)];
    const pad = (x: number) => String(x).padStart(3, "0");
    const number = poke ? `${pad(num)}/${set.official}` : String(num);
    if (out.some((c) => c.number === number)) continue;
    out.push({
      slug: `${name.toLowerCase().replace(/\W+/g, "-")}-${num}-${set.official}`,
      name,
      game: set.game,
      setSlug: set.slug,
      number,
      rarity: poke ? rar.r : SPORT_RAR[P_RARITIES.indexOf(rar)],
      hue: Math.floor(rnd() * 360),
      price: round(rar.p[0] + rnd() * (rar.p[1] - rar.p[0])),
      change7d: Math.round((rnd() - 0.45) * 1600) / 100,
      variants: poke ? P_VARIANTS : S_VARIANTS,
      subtitle: !poke ? `${POS[set.game][Math.floor(rnd() * 3)]} · ${rnd() > 0.7 ? "Rookie" : "Veteran"}` : ["Grass", "Fire", "Water", "Lightning", "Psychic", "Fighting", "Metal"][Math.floor(rnd() * 7)] + ` · ${60 + Math.floor(rnd() * 20) * 10} HP`,
      rare: rar.r.includes("Illustration"),
      owned: rnd() > 0.55,
    });
  }
  return out.sort((a, b) => (parseInt(a.number) || 999) - (parseInt(b.number) || 999));
}

export const SEALED: SealedProduct[] = [
  { slug: "celestial-tides-elite-trainer-box", name: "Celestial Tides Elite Trainer Box", setSlug: "celestial-tides", kind: "Elite Trainer Box", price: 54.99, change7d: 3.2, hue: 205 },
  { slug: "celestial-tides-booster-box", name: "Celestial Tides Booster Box (36 packs)", setSlug: "celestial-tides", kind: "Booster Box", price: 149.0, change7d: -1.4, hue: 215 },
  { slug: "celestial-tides-booster-bundle", name: "Celestial Tides Booster Bundle", setSlug: "celestial-tides", kind: "Booster Bundle", price: 31.5, change7d: 0.6, hue: 195 },
  { slug: "apex-chrome-hobby-box", name: "2026 Apex Chrome Football Hobby Box", setSlug: "2026-apex-chrome-football", kind: "Hobby Box", price: 389.0, change7d: 6.8, hue: 140 },
  { slug: "summit-select-blaster", name: "Summit Select Basketball Blaster", setSlug: "2025-26-summit-select-basketball", kind: "Blaster Box", price: 39.99, change7d: -2.1, hue: 330 },
  { slug: "heritage-diamond-hobby", name: "2026 Heritage Diamond Hobby Box", setSlug: "2026-heritage-diamond-baseball", kind: "Hobby Box", price: 112.0, change7d: 1.9, hue: 0 },
];

export const getCard = (slug: string) => CARDS.find((c) => c.slug === slug);
export const getSet = (slug: string) => SETS.find((s) => s.slug === slug);

/* --- collection ----------------------------------------------------------- */
export const COLLECTION = {
  value: 18432.17,
  dayChange: 214.55,
  dayPct: 1.18,
  cost: 14210.0,
  cards: 1286,
  graded: 74,
};

export const WISHLIST = [
  { card: CARDS[6], target: 110, alert: true },
  { card: CARDS[2], target: 250, alert: true },
  { card: CARDS[10], target: 520, alert: false },
  { card: CARDS[11], target: 18, alert: false },
];

export const CART = [
  { card: CARDS[0], variant: "Holo", grade: "PSA 10" as Grade, price: 1788.0, seller: "slabhouse" },
  { card: CARDS[1], variant: "Reverse Holo", grade: "Raw" as Grade, price: 36.5, seller: "mintcondition.co" },
  { card: CARDS[4], variant: "Holo", grade: "Raw" as Grade, price: 7.25, seller: "nwcardshop" },
];
