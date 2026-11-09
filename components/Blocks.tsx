import Link from "next/link";
import { cx, fmtInt } from "@/lib/format";
import { Return, Search, Shield, Truck } from "./Icons";

/** Trust badges — authenticity guarantee, insured shipping, easy returns. */
export function TrustBadges({ layout = "row", className }: { layout?: "row" | "stack" | "strip"; className?: string }) {
  const items = [
    { Icon: Shield, title: "Authenticity guarantee", body: "Every card over $150 is inspected by our team." },
    { Icon: Truck, title: "Insured shipping", body: "Fully insured, tracked, signature over $500." },
    { Icon: Return, title: "Easy 14-day returns", body: "Not as described? Full refund, no fight." },
  ];
  if (layout === "strip")
    return (
      <ul className={cx("flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted", className)}>
        {items.map(({ Icon, title }) => <li key={title} className="flex items-center gap-1.5"><Icon size={15} className="text-gold" />{title}</li>)}
      </ul>
    );
  return (
    <ul className={cx(layout === "row" ? "grid gap-3 sm:grid-cols-3" : "grid gap-3", className)}>
      {items.map(({ Icon, title, body }) => (
        <li key={title} className="flex gap-3 rounded-xl border border-line bg-surface p-3.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold/10 text-gold"><Icon size={18} /></span>
          <div><p className="text-sm font-semibold">{title}</p><p className="text-xs leading-relaxed text-faint">{body}</p></div>
        </li>
      ))}
    </ul>
  );
}

/** Set completion progress bar. Turns holographic when complete. */
export function SetProgress({ name, owned, total, href, value }: { name: string; owned: number; total: number; href?: string; value?: string }) {
  const pct = Math.min(100, (owned / total) * 100);
  const done = owned >= total;
  const body = (
    <>
      <div className="flex items-baseline justify-between gap-3">
        <p className="truncate text-sm font-semibold">{name}</p>
        <p className="num shrink-0 text-xs text-muted"><b className="text-ink">{fmtInt(owned)}</b> / {fmtInt(total)} · {Math.floor(pct)}%</p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-elevated" role="progressbar" aria-valuenow={owned} aria-valuemin={0} aria-valuemax={total} aria-label={`${name} completion`}>
        <div className={cx("h-full rounded-full", done ? "holo-bg" : "bg-gold")} style={{ width: `${pct}%` }} />
      </div>
      {value && <p className="num mt-1.5 text-xs text-faint">{value}</p>}
    </>
  );
  return href ? <Link href={href} className="block rounded-xl p-3 -mx-3 hover:bg-elevated">{body}</Link> : <div>{body}</div>;
}

/** Empty state. */
export function EmptyState({ title, body, action, icon = <Search size={22} /> }: { title: string; body: string; action?: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-xl2 border border-dashed border-line px-6 py-12 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-elevated text-gold">{icon}</span>
      <p className="mt-4 font-semibold">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* Loading skeletons ---------------------------------------------------------- */
export function CardTileSkeleton() {
  return (
    <div aria-hidden>
      <div className="skeleton aspect-[5/7] rounded-card" />
      <div className="skeleton mt-3 h-3.5 w-4/5" />
      <div className="skeleton mt-2 h-3 w-3/5" />
      <div className="mt-2 flex justify-between"><div className="skeleton h-4 w-16" /><div className="skeleton h-4 w-12" /></div>
    </div>
  );
}
export function ChartSkeleton({ height = 260 }: { height?: number }) {
  return (
    <div aria-hidden>
      <div className="flex justify-between"><div><div className="skeleton h-3 w-24" /><div className="skeleton mt-2 h-7 w-40" /></div><div className="skeleton h-10 w-48 rounded-xl" /></div>
      <div className="skeleton mt-4 rounded-xl" style={{ height }} />
    </div>
  );
}
export function ListingSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <ul aria-hidden className="divide-y divide-line">
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="flex items-center gap-4 px-4 py-4">
          <div className="flex-1"><div className="skeleton h-3.5 w-32" /><div className="skeleton mt-2 h-3 w-24" /></div>
          <div className="skeleton hidden h-5 w-20 md:block" /><div className="skeleton h-5 w-16" /><div className="skeleton h-10 w-28 rounded-xl" />
        </li>
      ))}
    </ul>
  );
}

export function SectionHead({ title, href, cta = "View all", sub }: { title: string; href?: string; cta?: string; sub?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div><h2 className="h-section">{title}</h2>{sub && <p className="mt-0.5 text-sm text-muted">{sub}</p>}</div>
      {href && <Link href={href} className="shrink-0 text-sm font-semibold text-gold-text hover:underline">{cta}</Link>}
    </div>
  );
}
