"use client";
import { useRef } from "react";
import type { Grade } from "@/lib/data";
import { cx, fmtUSD } from "@/lib/format";
import { Sparkle } from "./Icons";

type Opt = { value: string; label: string; hint?: string; holo?: boolean };

/** Accessible single-select chip group (radiogroup with arrow-key support). */
export function ChipGroup({ label, options, value, onChange, size = "md" }: { label: string; options: Opt[]; value: string; onChange: (v: string) => void; size?: "md" | "lg" }) {
  const ref = useRef<HTMLDivElement>(null);
  const onKey = (e: React.KeyboardEvent) => {
    const i = options.findIndex((o) => o.value === value);
    const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = options[(i + d + options.length) % options.length];
    onChange(next.value);
    (ref.current?.querySelector(`[data-v="${CSS.escape(next.value)}"]`) as HTMLElement | null)?.focus();
  };
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-muted">{label}</p>
      <div ref={ref} role="radiogroup" aria-label={label} onKeyDown={onKey} className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = o.value === value;
          return (
            <button key={o.value} data-v={o.value} role="radio" aria-checked={on} tabIndex={on ? 0 : -1} onClick={() => onChange(o.value)}
              className={cx("chip", size === "lg" && "h-auto flex-col items-start gap-0 rounded-xl px-3.5 py-2", o.holo && on && "holo-border")}>
              <span className="inline-flex items-center gap-1 text-ink">
                {o.holo && <Sparkle size={12} className="text-gold" />}{o.label}
              </span>
              {o.hint && <span className="num text-xs font-semibold text-muted">{o.hint}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function VariantChips({ variants, value, onChange }: { variants: string[]; value: string; onChange: (v: string) => void }) {
  return <ChipGroup label="Variant / parallel" value={value} onChange={onChange}
    options={variants.map((v) => ({ value: v, label: v, holo: v.startsWith("Gold") || v === "Refractor" }))} />;
}

export function GradeChips({ grades, value, onChange, priceOf }: { grades: Grade[]; value: Grade; onChange: (g: Grade) => void; priceOf: (g: Grade) => number }) {
  return <ChipGroup label="Grade" size="lg" value={value} onChange={(v) => onChange(v as Grade)}
    options={grades.map((g) => ({ value: g, label: g, hint: fmtUSD(priceOf(g)) }))} />;
}
