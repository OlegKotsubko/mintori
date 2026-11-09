import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Site-wide Open Graph image, rendered to /og.png at build time. A route (rather than the
// opengraph-image convention) so the static export gets a .png extension and static hosts
// serve it as image/png. Referenced from metadata in app/layout.tsx.
export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

const font = (weight: number) =>
  readFile(join(process.cwd(), `node_modules/@fontsource/manrope/files/manrope-latin-${weight}-normal.woff`));

// Brand tokens from app/globals.css (dark theme).
const bg = "#0B0C0F";
const ink = "#F2F3F5";
const muted = "#A1A7B3";
const gold = "#E9B949";
const line = "#2B2F38";

/** A tilted card for the decorative fan on the right. */
function Card({ rotate, x, y, fill }: { rotate: number; x: number; y: number; fill: string }) {
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, width: 250, height: 350, borderRadius: 22,
        background: fill, border: `1px solid ${line}`, transform: `rotate(${rotate}deg)`,
        boxShadow: "0 30px 60px rgba(0,0,0,0.55)",
      }}
    />
  );
}

export async function GET() {
  const [medium, bold, extraBold] = await Promise.all([font(500), font(700), font(800)]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden",
          background: `radial-gradient(circle at 85% 40%, rgba(233,185,73,0.22), transparent 55%), ${bg}`,
          fontFamily: "Manrope", color: ink,
        }}
      >
        {/* Card fan */}
        <Card rotate={-14} x={760} y={150} fill="linear-gradient(160deg, #1D2027, #14161B)" />
        <Card rotate={-3} x={840} y={120} fill="linear-gradient(160deg, #23262E, #181A20)" />
        <div
          style={{
            position: "absolute", left: 920, top: 110, width: 250, height: 350, borderRadius: 22,
            background: "linear-gradient(150deg, #F5D27E, #D49A2A)", transform: "rotate(9deg)",
            boxShadow: "0 30px 70px rgba(212,154,42,0.35)", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width="120" height="120" viewBox="0 0 32 32">
            <path d="M10.5 21V11l5.5 6 5.5-6v10" fill="none" stroke="#1A1305" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Copy */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", width: 760 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <svg width="52" height="52" viewBox="0 0 32 32">
              <defs>
                <linearGradient id="mlg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#F5D27E" /><stop offset="1" stopColor="#D49A2A" />
                </linearGradient>
              </defs>
              <rect x="5" y="2.5" width="22" height="27" rx="4.5" fill="url(#mlg)" transform="rotate(-8 16 16)" />
              <path d="M10.5 21V11l5.5 6 5.5-6v10" fill="none" stroke="#1A1305" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-8 16 16)" />
            </svg>
            <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>Mintori</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2.5 }}>
              Trading card prices you can trust
            </div>
            <div style={{ fontSize: 28, fontWeight: 500, color: muted, lineHeight: 1.4 }}>
              Pokémon TCG and sports cards. Verified sellers, insured shipping.
            </div>
          </div>

          <div style={{ display: "flex", gap: 14, fontSize: 22, fontWeight: 700 }}>
            {["Price guide", "Marketplace", "Collection tracker"].map((t) => (
              <span key={t} style={{ whiteSpace: "nowrap", padding: "10px 20px", borderRadius: 999, border: `1px solid ${line}`, color: t === "Price guide" ? gold : ink }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Manrope", data: medium, weight: 500, style: "normal" },
        { name: "Manrope", data: bold, weight: 700, style: "normal" },
        { name: "Manrope", data: extraBold, weight: 800, style: "normal" },
      ],
    },
  );
}
