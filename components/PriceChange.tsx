import { ArrowDown, ArrowUp, Minus } from "./Icons";
import { cx, fmtPct, fmtUSD } from "@/lib/format";

/** Price delta: color + arrow + sign, so it never relies on color alone. */
export function PriceChange({ pct, abs, size = "sm", pill = false, label }: { pct: number; abs?: number; size?: "xs" | "sm" | "md"; pill?: boolean; label?: string }) {
  const dir = pct > 0.004 ? "up" : pct < -0.004 ? "down" : "flat";
  const Icon = dir === "up" ? ArrowUp : dir === "down" ? ArrowDown : Minus;
  const sign = dir === "up" ? "+" : dir === "down" ? "−" : "";
  const word = dir === "up" ? "up" : dir === "down" ? "down" : "unchanged";
  return (
    <span
      className={cx(
        "num relative inline-flex items-center gap-0.5 font-semibold",
        size === "xs" && "text-xs", size === "sm" && "text-sm", size === "md" && "text-base",
        dir === "up" && "text-up", dir === "down" && "text-down", dir === "flat" && "text-muted",
        pill && "rounded-full px-2 py-0.5",
        pill && dir === "up" && "bg-up/10", pill && dir === "down" && "bg-down/10", pill && dir === "flat" && "bg-elevated",
      )}
    >
      <Icon size={size === "md" ? 16 : 13} strokeWidth={2.4} />
      <span className="sr-only">{word} </span>
      {abs !== undefined && <span>{sign}{fmtUSD(Math.abs(abs))}&nbsp;(</span>}
      <span>{abs === undefined && sign}{fmtPct(pct)}</span>
      {abs !== undefined && <span>)</span>}
      {label && <span className="ml-1 font-medium text-faint">{label}</span>}
    </span>
  );
}
