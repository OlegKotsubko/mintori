# Mintori — design prototype (Next.js 14 + Tailwind)

Premium, dark-first marketplace + price guide for Pokémon TCG and US sports cards.
All card names, art, players and sets are invented placeholders.

```bash
npm install
npm run dev   # http://localhost:3000
```

## Screens
| Route | Screen |
|---|---|
| `/` | Homepage — hero search, trending (7d), release calendar, featured sealed, collection CTA |
| `/card/tidecrest-leviathan-ex-199-165` | Card detail (SEO landing) — breadcrumbs, variant + grade chips, price chart, listings, population, related |
| `/set/celestial-tides` | Set page — header, filters (rarity / price / owned), grid, sealed |
| `/collection` | Portfolio — value + daily change, chart, top movers, set completion, wishlist alerts |
| `/cart` | Cart + checkout — insured shipping w/ signature rule, Card / Apple Pay / PayPal / USDC |
| Sign in (header / CTA) | Login modal — Apple, Google, email magic link |
| `/design-system` | Tokens + every component, empty states and skeletons |

## Structure
- `tailwind.config.ts` + `app/globals.css` — tokens as CSS variables (dark default, `.light` override, AA contrast notes), holo foil, tilt/shine, skeletons
- `components/` — CardTile, CardImage (tilt + shine), CardArt (generic SVG art), PriceChart (pure SVG, range tabs, hover), PriceChange (arrow + sign + color), Chips (variant/grade radiogroups), Commerce (ListingRow, PriceAlertToggle, BuyButton), Blocks (TrustBadges, SetProgress, EmptyState, skeletons), Header (+ mobile tab bar), SearchBar, LoginModal
- `lib/data.ts` — deterministic mock data (prices, history, listings, population)

Font: Manrope (self-hosted via `@fontsource-variable/manrope`), tabular numerals on every price.
