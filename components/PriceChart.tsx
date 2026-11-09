"use client";
import { useMemo, useState } from "react";
import { RANGE_DAYS, type Range } from "@/lib/data";
import { cx, fmtDate, fmtUSD } from "@/lib/format";
import { PriceChange } from "./PriceChange";

type Pt = { t: number; v: number };
const W = 800;

function build(pts: Pt[], H: number, pad = 12) {
  const vs = pts.map((p) => p.v);
  let min = Math.min(...vs), max = Math.max(...vs);
  const span = max - min || max * 0.1 || 1;
  min -= span * 0.08; max += span * 0.08;
  const x = (i: number) => (i / (pts.length - 1)) * W;
  const y = (v: number) => pad + (1 - (v - min) / (max - min)) * (H - pad * 2);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(p.v).toFixed(1)}`).join("");
  return { line, area: `${line}L${W} ${H}L0 ${H}Z`, x, y, min, max };
}

/** Price history chart with range tabs + hover crosshair. Pure SVG, no chart lib. */
export function PriceChart({ data, height = 260, title = "Price history", defaultRange = "3M", ranges = ["1M", "3M", "1Y", "All"] as Range[], footnote }: {
  data: Pt[]; height?: number; title?: string; defaultRange?: Range; ranges?: Range[]; footnote?: string;
}) {
  const [range, setRange] = useState<Range>(defaultRange);
  const [hover, setHover] = useState<number | null>(null);
  const pts = useMemo(() => data.slice(-RANGE_DAYS[range]), [data, range]);
  const g = useMemo(() => build(pts, height), [pts, height]);
  const first = pts[0].v, last = pts[pts.length - 1].v;
  const shown = hover !== null ? pts[hover] : pts[pts.length - 1];
  const pct = ((shown.v - first) / first) * 100;
  const up = last >= first;
  const stroke = up ? "rgb(var(--up))" : "rgb(var(--down))";
  const ticks = [g.max, (g.max + g.min) / 2, g.min];

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - r.left) / r.width) * (pts.length - 1));
    setHover(Math.max(0, Math.min(pts.length - 1, i)));
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">{title}</p>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="num text-2xl font-bold tracking-tight">{fmtUSD(shown.v)}</span>
            <PriceChange pct={pct} abs={shown.v - first} label={hover !== null ? fmtDate(shown.t) : `past ${range === "All" ? "2Y" : range}`} />
          </div>
        </div>
        <div role="tablist" aria-label="Chart range" className="flex rounded-xl border border-line bg-elevated p-1">
          {ranges.map((r) => (
            <button key={r} role="tab" aria-selected={r === range} onClick={() => setRange(r)}
              className={cx("num h-8 min-w-11 rounded-lg px-2.5 text-xs font-semibold transition", r === range ? "bg-surface text-ink shadow" : "text-muted hover:text-ink")}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-4 select-none" style={{ height }} onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
        <svg viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          <defs>
            <linearGradient id="pc-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={stroke} stopOpacity=".22" /><stop offset="1" stopColor={stroke} stopOpacity="0" />
            </linearGradient>
          </defs>
          {ticks.map((t, i) => <line key={i} x1="0" x2={W} y1={g.y(t)} y2={g.y(t)} stroke="rgb(var(--line))" strokeDasharray="3 5" vectorEffect="non-scaling-stroke" />)}
          <path d={g.area} fill="url(#pc-fill)" />
          <path d={g.line} fill="none" stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          {hover !== null && <line x1={g.x(hover)} x2={g.x(hover)} y1="0" y2={height} stroke="rgb(var(--faint))" strokeWidth="1" vectorEffect="non-scaling-stroke" />}
        </svg>
        {hover !== null && (
          <span className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bg"
            style={{ left: `${(hover / (pts.length - 1)) * 100}%`, top: g.y(pts[hover].v), background: stroke }} />
        )}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex flex-col justify-between py-1 text-right">
          {ticks.map((t, i) => <span key={i} className="num rounded bg-bg/70 px-1 text-[11px] text-faint">{fmtUSD(t, t >= 100)}</span>)}
        </div>
      </div>
      <div className="num mt-2 flex justify-between text-[11px] text-faint">
        <span>{fmtDate(pts[0].t)}</span>
        <span className="hidden sm:inline">{fmtDate(pts[Math.floor(pts.length / 2)].t)}</span>
        <span>Today</span>
      </div>
      {footnote && <p className="mt-3 text-xs text-faint">{footnote}</p>}
      <p className="sr-only">Price moved from {fmtUSD(first)} to {fmtUSD(last)} over the selected range.</p>
    </div>
  );
}

export function Sparkline({ data, className }: { data: number[]; className?: string }) {
  const up = data[data.length - 1] >= data[0];
  const min = Math.min(...data), max = Math.max(...data);
  const d = data.map((v, i) => `${i ? "L" : "M"}${((i / (data.length - 1)) * 100).toFixed(1)} ${(28 - ((v - min) / (max - min || 1)) * 24).toFixed(1)}`).join("");
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className={cx("h-8 w-20", className)} aria-hidden>
      <path d={d} fill="none" stroke={up ? "rgb(var(--up))" : "rgb(var(--down))"} strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
