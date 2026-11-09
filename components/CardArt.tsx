import type { Game } from "@/lib/data";

/** Generic, invented card artwork drawn in SVG (placeholder for real scans).
 *  No real characters, players, logos or photos. */
export interface ArtProps { id: string; name: string; number: string; hue: number; game: Game; subtitle: string; rarity?: string; variant?: string }

export function CardArt(p: ArtProps) {
  return p.game === "pokemon" ? <CreatureArt {...p} /> : <AthleteArt {...p} />;
}

function CreatureArt({ id, name, number, hue, subtitle, rarity, variant }: ArtProps) {
  const g = `ca-${id}`;
  const h2 = (hue + 40) % 360;
  const reverse = variant === "Reverse Holo";
  const [type, hp] = subtitle.split(" · ");
  return (
    <svg viewBox="0 0 250 350" className="block h-full w-full" role="img" aria-label={`${name} card artwork`}>
      <defs>
        <linearGradient id={`${g}-f`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={`hsl(${hue} 70% 62%)`} /><stop offset=".5" stopColor={`hsl(${h2} 65% 74%)`} /><stop offset="1" stopColor={`hsl(${hue} 60% 46%)`} />
        </linearGradient>
        <radialGradient id={`${g}-a`} cx=".5" cy=".42" r=".75">
          <stop offset="0" stopColor={`hsl(${h2} 90% 82%)`} /><stop offset=".55" stopColor={`hsl(${hue} 60% 42%)`} /><stop offset="1" stopColor={`hsl(${hue} 55% 18%)`} />
        </radialGradient>
        <linearGradient id={`${g}-o`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".95" /><stop offset="1" stopColor={`hsl(${h2} 90% 70%)`} />
        </linearGradient>
        <pattern id={`${g}-r`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="5" height="10" fill="#fff" opacity=".12" />
        </pattern>
      </defs>
      <rect width="250" height="350" rx="14" fill={`url(#${g}-f)`} />
      {reverse && <rect width="250" height="350" rx="14" fill={`url(#${g}-r)`} />}
      <rect x="12" y="12" width="226" height="326" rx="9" fill={`hsl(${hue} 30% 92%)`} opacity=".9" />
      <text x="22" y="36" fontSize={name.length > 18 ? 12.5 : 15} fontWeight="700" fill="#111">{name}</text>
      <text x="228" y="36" fontSize="12" fontWeight="700" fill="#b4232a" textAnchor="end">{hp}</text>
      <rect x="22" y="46" width="206" height="150" rx="4" fill={`url(#${g}-a)`} stroke={`hsl(${hue} 50% 35%)`} strokeWidth="2" />
      {/* abstract "creature": orbits + crest */}
      <g opacity=".95">
        <circle cx="125" cy="122" r="44" fill={`url(#${g}-o)`} opacity=".9" />
        <path d={`M85 150 Q125 ${70 + (hue % 30)} 165 150 Q125 132 85 150Z`} fill={`hsl(${hue} 70% 30%)`} opacity=".75" />
        <ellipse cx="125" cy="122" rx="78" ry="20" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1.5" transform={`rotate(${-18 + (hue % 36)} 125 122)`} />
        <circle cx="111" cy="112" r="4.5" fill="#111" /><circle cx="139" cy="112" r="4.5" fill="#111" />
        <path d="M104 92 L96 66 L116 86 M146 92 L154 66 L134 86" fill={`hsl(${h2} 80% 60%)`} stroke={`hsl(${hue} 60% 25%)`} strokeWidth="2" strokeLinejoin="round" />
      </g>
      <rect x="22" y="202" width="206" height="16" rx="3" fill={`hsl(${hue} 40% 78%)`} />
      <text x="125" y="214" fontSize="9" fill="#333" textAnchor="middle" fontStyle="italic">{type} Type · Illus. Studio Placeholder</text>
      {[0, 1].map((i) => (
        <g key={i} transform={`translate(0 ${232 + i * 40})`}>
          <circle cx="34" cy="10" r="7" fill={`hsl(${hue} 70% 50%)`} />
          <rect x="48" y="4" width={80 - i * 20} height="6" rx="3" fill="#333" opacity=".75" />
          <rect x="48" y="15" width={140 - i * 30} height="4" rx="2" fill="#666" opacity=".45" />
          <text x="226" y="15" fontSize="14" fontWeight="700" fill="#111" textAnchor="end">{(i + 1) * 60 + (hue % 4) * 10}</text>
        </g>
      ))}
      <text x="22" y="328" fontSize="8.5" fill="#333">{number} · {rarity}</text>
    </svg>
  );
}

function AthleteArt({ id, name, number, hue, subtitle, game, variant }: ArtProps) {
  const g = `aa-${id}`;
  const gold = variant?.startsWith("Gold");
  const refr = variant === "Refractor";
  const c1 = gold ? "hsl(43 85% 58%)" : `hsl(${hue} 55% 42%)`;
  const c2 = gold ? "hsl(36 70% 32%)" : `hsl(${(hue + 200) % 360} 45% 18%)`;
  const jersey = (number.match(/\d+/)?.[0] ?? "7").slice(-2);
  const [pos, tag] = subtitle.split(" · ");
  return (
    <svg viewBox="0 0 250 350" className="block h-full w-full" role="img" aria-label={`${name} card artwork`}>
      <defs>
        <linearGradient id={`${g}-b`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={c1} /><stop offset="1" stopColor={c2} /></linearGradient>
        <linearGradient id={`${g}-s`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".5" stopColor="#fff" stopOpacity={refr ? ".35" : ".12"} /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="250" height="350" rx="14" fill="#0d0f14" />
      <rect x="8" y="8" width="234" height="334" rx="10" fill={`url(#${g}-b)`} />
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} x={-120 + i * 70} y="-40" width="26" height="460" fill={`url(#${g}-s)`} transform="rotate(28 125 175)" />
      ))}
      <text x="125" y="210" fontSize="190" fontWeight="800" textAnchor="middle" fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth="2">{jersey}</text>
      {/* generic geometric athlete figure */}
      <g fill="#0d0f14" opacity=".85">
        <circle cx="125" cy="98" r="26" />
        <path d="M70 250 Q72 150 125 136 Q178 150 180 250 Z" />
      </g>
      <g transform="translate(196 34)" stroke="#fff" strokeWidth="2" fill="none" opacity=".9">
        {game === "football" && <><ellipse cx="0" cy="0" rx="17" ry="10" /><path d="M-6 0h12M-3-3v6M0-3v6M3-3v6" /></>}
        {game === "basketball" && <><circle r="13" /><path d="M-13 0h26M0-13v26M-9-9q9 9 0 18M9-9q-9 9 0 18" /></>}
        {game === "baseball" && <><circle r="13" /><path d="M-7-10q5 10 0 20M7-10q-5 10 0 20" strokeDasharray="2 2" /></>}
      </g>
      <rect x="8" y="270" width="234" height="72" fill="#0d0f14" opacity=".88" />
      <rect x="8" y="268" width="234" height="3" fill={gold ? "#F5D27E" : `hsl(${hue} 80% 65%)`} />
      <text x="22" y="298" fontSize="17" fontWeight="800" fill="#fff" letterSpacing=".5">{name.toUpperCase().split(" ").slice(0, 2).join(" ")}</text>
      <text x="22" y="318" fontSize="10.5" fill="#cfd3da" letterSpacing="1.5">{pos?.toUpperCase()} · {tag?.toUpperCase()}</text>
      <text x="228" y="332" fontSize="9" fill="#9aa1ad" textAnchor="end">#{number}{gold ? "  ·  23/50" : ""}</text>
      {tag === "Rookie" && <g transform="translate(22 30)"><rect width="34" height="20" rx="4" fill="#fff" /><text x="17" y="14" fontSize="11" fontWeight="800" textAnchor="middle" fill="#111">RC</text></g>}
    </svg>
  );
}

export function SealedArt({ id, name, kind, hue }: { id: string; name: string; kind: string; hue: number }) {
  const g = `sa-${id}`;
  return (
    <svg viewBox="0 0 300 300" className="block h-full w-full" role="img" aria-label={`${name} product image`}>
      <defs>
        <linearGradient id={`${g}-t`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={`hsl(${hue} 65% 55%)`} /><stop offset="1" stopColor={`hsl(${(hue + 50) % 360} 55% 28%)`} /></linearGradient>
        <linearGradient id={`${g}-s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={`hsl(${hue} 50% 32%)`} /><stop offset="1" stopColor={`hsl(${hue} 50% 18%)`} /></linearGradient>
      </defs>
      <path d="M60 95 L150 60 L250 92 L160 128 Z" fill={`hsl(${hue} 60% 66%)`} />
      <path d="M60 95 L160 128 L160 248 L60 212 Z" fill={`url(#${g}-t)`} />
      <path d="M160 128 L250 92 L250 210 L160 248 Z" fill={`url(#${g}-s)`} />
      <circle cx="110" cy="160" r="26" fill="#fff" opacity=".25" />
      <path d="M78 196 L150 222" stroke="#fff" strokeOpacity=".5" strokeWidth="6" strokeLinecap="round" />
      <text x="110" y="166" fontSize="16" fontWeight="800" fill="#fff" textAnchor="middle" transform="skewY(18) translate(0 -36)">{kind.split(" ")[0].toUpperCase()}</text>
    </svg>
  );
}
