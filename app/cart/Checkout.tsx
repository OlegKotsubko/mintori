"use client";
import Link from "next/link";
import { useId, useState } from "react";
import { CART, getSet } from "@/lib/data";
import { cx, fmtUSD } from "@/lib/format";
import { CardImage } from "@/components/CardImage";
import { EmptyState, TrustBadges } from "@/components/Blocks";
import { Cart, Check, Info, Lock, Shield, Truck, X } from "@/components/Icons";

const SIG_THRESHOLD = 500;
const SHIPPING = [
  { id: "std", name: "Standard insured", eta: "3–5 business days", price: 4.99, sig: false, note: "Insured up to $500" },
  { id: "pri", name: "Priority insured + signature", eta: "2–3 business days", price: 14.99, sig: true, note: "Fully insured · adult signature" },
  { id: "exp", name: "Express insured + signature", eta: "1–2 business days", price: 34.99, sig: true, note: "Fully insured · adult signature" },
];
type Pay = "card" | "apple" | "paypal" | "usdc";

function Radio({ checked, name, value, onChange, disabled, children }: { checked: boolean; name: string; value: string; onChange: (v: string) => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <label className={cx("flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition", checked ? "border-gold bg-gold/[0.06]" : "border-line hover:border-faint", disabled && "cursor-not-allowed opacity-50")}>
      <input type="radio" name={name} value={value} checked={checked} disabled={disabled} onChange={() => onChange(value)} className="peer sr-only" />
      <span aria-hidden className={cx("mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 peer-focus-visible:ring-2 peer-focus-visible:ring-gold", checked ? "border-gold" : "border-faint")}>
        {checked && <span className="h-2.5 w-2.5 rounded-full bg-gold" />}
      </span>
      <span className="min-w-0 flex-1">{children}</span>
    </label>
  );
}

function UsdcTooltip() {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type="button" aria-label="What is USDC?" aria-describedby={id} aria-expanded={open}
        onClick={(e) => { e.preventDefault(); setOpen(!open); }} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}
        className="grid h-6 w-6 place-items-center rounded-full text-faint hover:text-ink"><Info size={15} /></button>
      <span id={id} role="tooltip" className={cx("absolute bottom-full left-1/2 z-20 mb-2 w-64 -translate-x-1/2 rounded-xl border border-line bg-elevated p-3 text-xs font-normal leading-relaxed text-muted shadow-lift sm:left-0 sm:translate-x-0", open ? "block" : "hidden")}>
        <b className="text-ink">USDC is a digital US dollar.</b> Each USDC is backed 1:1 by cash and short-term US Treasuries, so the price doesn’t swing like other crypto. Pay from any wallet on Ethereum, Base or Solana — you get the same Mintori buyer protection.
      </span>
    </span>
  );
}

export function Checkout() {
  const [items, setItems] = useState(CART);
  const [ship, setShip] = useState("pri");
  const [pay, setPay] = useState<Pay>("card");
  const subtotal = items.reduce((s, i) => s + i.price, 0);
  const needsSig = items.some((i) => i.price >= SIG_THRESHOLD);
  const opt = SHIPPING.find((s) => s.id === ship)!;
  const tax = Math.round(subtotal * 0.0825 * 100) / 100;
  const total = subtotal + (items.length ? opt.price : 0) + tax;
  const top = items.reduce((m, i) => (i.price > m ? i.price : m), 0);

  if (!items.length)
    return (
      <div className="container max-w-2xl py-16">
        <EmptyState icon={<Cart size={22} />} title="Your cart is empty" body="Search any card, set or player — every listing shows price history so you know you’re paying a fair price." action={<Link href="/" className="btn-primary">Start searching</Link>} />
      </div>
    );

  return (
    <div className="container py-6 md:py-10">
      <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">Checkout</h1>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted"><Lock size={14} /> Secure checkout · prices in USD · ships to US addresses only</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px] lg:items-start">
        <div className="space-y-8">
          {/* ITEMS */}
          <section aria-labelledby="items-h">
            <h2 id="items-h" className="mb-3 font-semibold">Items <span className="num text-faint">({items.length})</span></h2>
            <ul className="panel divide-y divide-line">
              {items.map((it, i) => (
                <li key={it.card.slug} className="flex gap-4 p-4">
                  <div className="w-16 shrink-0 sm:w-20"><CardImage card={it.card} variant={it.variant} tilt={false} /></div>
                  <div className="min-w-0 flex-1">
                    <Link href={`/card/${it.card.slug}`} className="font-semibold hover:underline">{it.card.name}</Link>
                    <p className="text-xs text-faint">{getSet(it.card.setSlug)?.name} · <span className="num">{it.card.number}</span></p>
                    <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                      <span className="rounded-md bg-elevated px-2 py-0.5 text-muted">{it.variant}</span>
                      <span className={cx("rounded-md px-2 py-0.5", it.grade === "Raw" ? "bg-elevated text-muted" : "bg-info/10 text-info")}>{it.grade === "Raw" ? "Raw · Near Mint" : it.grade}</span>
                      {it.price >= 150 && <span className="inline-flex items-center gap-1 rounded-md bg-gold/10 px-2 py-0.5 font-semibold text-gold-text"><Shield size={12} /> Authenticated</span>}
                    </div>
                    <p className="mt-2 text-xs text-faint">Sold by {it.seller}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <p className="num font-bold">{fmtUSD(it.price)}</p>
                    <button onClick={() => setItems(items.filter((_, j) => j !== i))} className="inline-flex items-center gap-1 text-xs text-faint hover:text-down" aria-label={`Remove ${it.card.name}`}><X size={14} /> Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* ADDRESS */}
          <section aria-labelledby="addr-h">
            <h2 id="addr-h" className="mb-3 font-semibold">Ship to</h2>
            <div className="panel flex items-start justify-between gap-4 p-4">
              <div className="text-sm"><p className="font-semibold">Alex Rivera</p><p className="text-muted">2210 S Lamar Blvd, Apt 4B<br />Austin, TX 78704</p></div>
              <button className="text-sm font-semibold text-gold-text hover:underline">Change</button>
            </div>
          </section>

          {/* SHIPPING */}
          <section aria-labelledby="ship-h">
            <h2 id="ship-h" className="mb-3 font-semibold">Insured shipping</h2>
            {needsSig && (
              <p className="mb-3 flex gap-2 rounded-xl border border-gold/30 bg-gold/[0.06] p-3 text-sm text-muted">
                <Shield size={18} className="mt-0.5 shrink-0 text-gold" />
                <span>Your order includes a <b className="num text-ink">{fmtUSD(top)}</b> card. Items over {fmtUSD(SIG_THRESHOLD, true)} ship fully insured with adult signature on delivery.</span>
              </p>
            )}
            <div className="grid gap-2.5" role="radiogroup" aria-labelledby="ship-h">
              {SHIPPING.map((s) => {
                const disabled = needsSig && !s.sig;
                return (
                  <Radio key={s.id} name="ship" value={s.id} checked={ship === s.id} onChange={setShip} disabled={disabled}>
                    <span className="flex items-start justify-between gap-3">
                      <span>
                        <span className="flex items-center gap-2 text-sm font-semibold"><Truck size={16} className="text-faint" />{s.name}{s.id === "pri" && <span className="rounded bg-gold/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-text">Recommended</span>}</span>
                        <span className="mt-0.5 block text-xs text-faint">{s.eta} · {disabled ? "Not available for items over $500" : s.note}</span>
                      </span>
                      <span className="num text-sm font-bold">{fmtUSD(s.price)}</span>
                    </span>
                  </Radio>
                );
              })}
            </div>
          </section>

          {/* PAYMENT */}
          <section aria-labelledby="pay-h">
            <h2 id="pay-h" className="mb-3 font-semibold">Payment</h2>
            <div className="grid gap-2.5 sm:grid-cols-2" role="radiogroup" aria-labelledby="pay-h">
              <Radio name="pay" value="card" checked={pay === "card"} onChange={(v) => setPay(v as Pay)}>
                <span className="text-sm font-semibold">Credit or debit card</span><span className="block text-xs text-faint">Visa, Mastercard, Amex, Discover</span>
              </Radio>
              <Radio name="pay" value="apple" checked={pay === "apple"} onChange={(v) => setPay(v as Pay)}>
                <span className="text-sm font-semibold">Apple Pay</span><span className="block text-xs text-faint">Face ID or Touch ID</span>
              </Radio>
              <Radio name="pay" value="paypal" checked={pay === "paypal"} onChange={(v) => setPay(v as Pay)}>
                <span className="text-sm font-semibold">PayPal</span><span className="block text-xs text-faint">Pay in 4 available</span>
              </Radio>
              <Radio name="pay" value="usdc" checked={pay === "usdc"} onChange={(v) => setPay(v as Pay)}>
                <span className="flex items-center gap-1 text-sm font-semibold">Pay with USDC <UsdcTooltip /></span><span className="block text-xs text-faint">Stablecoin · 1 USDC = $1.00</span>
              </Radio>
            </div>
            {pay === "card" && (
              <div className="mt-4 grid gap-3 sm:grid-cols-[2fr_1fr_1fr]">
                <label className="grid gap-1.5 text-xs font-semibold text-muted sm:col-span-3">Card number<input className="input num" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" /></label>
                <label className="grid gap-1.5 text-xs font-semibold text-muted">Name on card<input className="input" autoComplete="cc-name" defaultValue="Alex Rivera" /></label>
                <label className="grid gap-1.5 text-xs font-semibold text-muted">Expiry<input className="input num" autoComplete="cc-exp" placeholder="MM / YY" /></label>
                <label className="grid gap-1.5 text-xs font-semibold text-muted">CVC<input className="input num" autoComplete="cc-csc" inputMode="numeric" placeholder="123" /></label>
              </div>
            )}
            {pay === "usdc" && (
              <p className="mt-4 rounded-xl border border-line bg-elevated p-3 text-sm text-muted">After you place the order we’ll show a wallet QR code for <b className="num text-ink">{total.toFixed(2)} USDC</b>. The price is locked for 15 minutes. No network fee on Base or Solana.</p>
            )}
          </section>
        </div>

        {/* SUMMARY */}
        <aside className="lg:sticky lg:top-24" aria-labelledby="sum-h">
          <div className="panel p-5">
            <h2 id="sum-h" className="font-semibold">Order summary</h2>
            <dl className="num mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Subtotal ({items.length} items)</dt><dd>{fmtUSD(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">{opt.name}</dt><dd>{fmtUSD(opt.price)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Insurance (full value)</dt><dd className="text-up">Included</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Authentication</dt><dd className="text-up">Free</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Est. sales tax (TX)</dt><dd>{fmtUSD(tax)}</dd></div>
              <div className="flex items-baseline justify-between border-t border-line pt-3 text-base"><dt className="font-semibold">Total</dt><dd className="text-xl font-extrabold">{fmtUSD(total)}</dd></div>
            </dl>
            <button className="btn-primary mt-5 h-12 w-full text-base">
              {pay === "apple" ? "Pay with Apple Pay" : pay === "paypal" ? "Continue to PayPal" : pay === "usdc" ? "Pay with USDC" : "Place order"} · <span className="num">{fmtUSD(total)}</span>
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-faint"><Check size={14} className="text-up" /> Covered by Mintori Buyer Protection</p>
          </div>
          <TrustBadges layout="stack" className="mt-4" />
        </aside>
      </div>
    </div>
  );
}
