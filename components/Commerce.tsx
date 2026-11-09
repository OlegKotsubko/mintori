"use client";
import { useId, useState } from "react";
import type { Listing } from "@/lib/data";
import { cx, fmtInt, fmtUSD } from "@/lib/format";
import { useApp } from "./Providers";
import { Bell, Check, Shield } from "./Icons";

/** Listing row — table row on desktop, stacked card on mobile. */
export function ListingRow({ l, best, cardName }: { l: Listing; best?: boolean; cardName: string }) {
  const { addToCart } = useApp();
  const [added, setAdded] = useState(false);
  return (
    <li className={cx("grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 px-4 py-4 md:grid-cols-[minmax(0,1.6fr)_1fr_.6fr_1fr_auto] md:py-3.5", best && "bg-gold/[0.04]")}>
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 truncate text-sm font-semibold">
          {l.seller}
          {l.verified && <span title="Verified seller" className="text-gold"><Shield size={14} /></span>}
        </p>
        <p className="num text-xs text-faint">{l.rating}% positive · {fmtInt(l.sales)} sales</p>
      </div>
      <div className="order-3 col-span-2 flex items-center gap-2 md:order-none md:col-span-1">
        <span className={cx("rounded-md px-2 py-0.5 text-xs font-semibold", l.grade === "Raw" ? "bg-elevated text-muted" : "bg-info/10 text-info")}>{l.condition}</span>
        {best && <span className="rounded-md bg-gold/15 px-2 py-0.5 text-xs font-semibold text-gold-text">Best price</span>}
        <span className="text-xs text-faint md:hidden">· Ships from {l.state}</span>
      </div>
      <p className="hidden text-sm text-muted md:block">{l.state}</p>
      <div className="text-right md:text-left">
        <p className="num text-base font-bold">{fmtUSD(l.price)}</p>
        <p className="num text-xs text-faint">{l.shipping === 0 ? "Free insured shipping" : `+ ${fmtUSD(l.shipping)} shipping`}</p>
      </div>
      <button
        onClick={() => { addToCart(`${cardName} · ${l.condition}`); setAdded(true); }}
        className={cx("btn-secondary order-4 col-span-2 h-10 md:order-none md:col-span-1", added && "border-up/50 text-up")}
        aria-label={`Add ${cardName}, ${l.condition}, ${fmtUSD(l.price)} from ${l.seller} to cart`}
      >
        {added ? <><Check size={16} /> In cart</> : "Add to cart"}
      </button>
    </li>
  );
}

/** Price alert toggle with target price. */
export function PriceAlertToggle({ defaultOn = false, target, current, compact = false }: { defaultOn?: boolean; target: number; current: number; compact?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  const [val, setVal] = useState(String(target));
  const id = useId();
  const hit = Number(val) >= current;
  return (
    <div className={cx("flex items-center gap-3", compact ? "" : "rounded-xl border border-line bg-elevated p-3")}>
      <button role="switch" aria-checked={on} aria-labelledby={`${id}-l`} onClick={() => setOn(!on)}
        className={cx("relative h-6 w-11 shrink-0 rounded-full transition", on ? "bg-gold" : "bg-line")}>
        <span className={cx("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", on ? "left-[22px]" : "left-0.5")} />
      </button>
      <div className="min-w-0 flex-1">
        <p id={`${id}-l`} className="flex items-center gap-1.5 text-sm font-semibold"><Bell size={14} className={on ? "text-gold" : "text-faint"} /> Alert me below</p>
        {!compact && <p className="text-xs text-faint">{on ? (hit ? "Target is at or above market — you’ll be notified now." : "We’ll email & push you when a listing hits this price.") : "Off"}</p>}
      </div>
      <label className="relative">
        <span className="sr-only">Target price</span>
        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-faint">$</span>
        <input inputMode="decimal" value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d.]/g, ""))}
          className="num h-9 w-24 rounded-lg border border-line bg-surface pl-6 pr-2 text-right text-sm font-semibold focus:border-gold focus:outline-none" />
      </label>
    </div>
  );
}

export function BuyButton({ price, label }: { price: number; label: string }) {
  const { addToCart } = useApp();
  return (
    <button onClick={() => addToCart(label)} className="btn-primary h-12 w-full text-base">
      Buy now · <span className="num">{fmtUSD(price)}</span>
    </button>
  );
}
