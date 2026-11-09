"use client";
import { useRef } from "react";
import type { Card } from "@/lib/data";
import { CardArt } from "./CardArt";
import { cx } from "@/lib/format";

/** Card image with pointer-driven tilt + light shine. Foil layer only for rare / holo prints. */
export function CardImage({ card, variant, className, tilt = true, priority }: { card: Card; variant?: string; className?: string; tilt?: boolean; priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const foil = card.rare || variant === "Refractor" || variant?.startsWith("Gold");

  const move = (e: React.PointerEvent) => {
    if (!tilt || e.pointerType === "touch" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const s = ref.current.style;
    s.setProperty("--ry", `${(x - 0.5) * 14}deg`);
    s.setProperty("--rx", `${(0.5 - y) * 14}deg`);
    s.setProperty("--mx", `${x * 100}%`);
    s.setProperty("--my", `${y * 100}%`);
    s.setProperty("--shine", "1");
  };
  const leave = () => {
    const s = ref.current?.style;
    if (!s) return;
    ["--rx", "--ry"].forEach((k) => s.setProperty(k, "0deg"));
    s.setProperty("--shine", "0");
  };

  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      data-priority={priority ? "" : undefined}
      className={cx("tilt relative aspect-[5/7] w-full overflow-hidden rounded-card bg-elevated shadow-lift", className)}
    >
      <CardArt id={card.slug + (variant ?? "")} name={card.name} number={card.number} hue={card.hue} game={card.game} subtitle={card.subtitle} rarity={card.rarity} variant={variant ?? card.variants[0]} />
      {foil && <div className="tilt-foil pointer-events-none absolute inset-0" />}
      <div className="tilt-shine pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 rounded-card ring-1 ring-inset ring-white/10" />
    </div>
  );
}
