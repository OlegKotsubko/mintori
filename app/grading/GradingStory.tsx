"use client";
/* eslint-disable @next/next/no-img-element -- static export, pre-sized local images */
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronRight } from "@/components/Icons";

/**
 * Scroll story: a raw card is graded, sealed in a 3D slab, then flipped to show the back.
 * The left stage is sticky; each text section on the right drives one phase of the animation.
 *   s1 → intro tilt · s2 → grading overlays · t → slab assembly · u → 180° flip
 */

type Progress = { s1: number; s2: number; t: number; u: number; active: number };

const GOLD = "rgb(var(--gold))";
const goldA = (a: number) => `rgb(var(--gold) / ${a})`;

const cl = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => v * v * (3 - 2 * v);
const seg = (v: number, a: number, b: number) => ease(cl((v - a) / (b - a)));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

const STEPS = ["The card", "The grading", "The slab", "The back"];

const SUBGRADES: [string, number][] = [["Centering", 0.22], ["Corners", 0.4], ["Edges", 0.56], ["Surface", 0.8]];

const LADDER = [
  { g: "10 Pristine", d: "Virtually flawless. Perfect centering, nothing visible even under magnification. This card.", hi: true },
  { g: "10 Gem Mint", d: "Flawless to the eye; a tiny flaw may show under magnification." },
  { g: "9.5 Mint+", d: "One minor imperfection — slightly off-center or a soft corner." },
  { g: "9 Mint", d: "A few small flaws that only a close look finds." },
];

const CHECKS = [
  { t: "Centering", b: "How even the borders are, left to right and top to bottom. 50/50 is perfect." },
  { t: "Corners", b: "Sharp and square, with no rounding, fraying or dings." },
  { t: "Edges", b: "Clean cuts — no whitening, chipping or nicks along the sides." },
  { t: "Surface", b: "Scratches, print lines, dents and stains, checked under magnification." },
];

const PRICE_FACTORS = [
  { t: "The grade.", b: "Buyers pay for certainty. Each step up the scale is a step up in price — often a big one between 9.5 and 10." },
  { t: "Population.", b: "Graders publish how many copies exist at each grade. The fewer Pristine 10s, the higher the ceiling." },
  { t: "Demand.", b: "Character, set, language and age. A fan-favorite Pokémon from a niche Japanese product draws collectors from both worlds." },
  { t: "Comparable sales.", b: "The real price tag: what the same card, same grade, same grader sold for recently." },
];

const CSS = `
.gs-scrolly{display:flex;align-items:stretch}
.gs-stage-col{flex:1 1 50%;min-width:0}
/* Sticky animation frame: never shorter than 560px, never taller than 840px; anything outside is clipped. */
.gs-stage{position:sticky;top:80px;height:calc(100vh - 96px);min-height:560px;max-height:840px;margin:16px 0;perspective:1700px;overflow:hidden;border-radius:20px;border:1px solid rgb(var(--line));background:#0B0C0F}
.gs-fit{position:absolute;left:50%;top:calc(50% + 24px);width:0;height:0;transform-style:preserve-3d;transform:scale(1)}
.gs-3d{transform-style:preserve-3d}
.gs-bf{backface-visibility:hidden;-webkit-backface-visibility:hidden}
.gs-text-col{flex:1 1 50%;min-width:0;padding-left:2rem}
.gs-sec1{min-height:calc(100vh - 64px)}
.gs-sec2{min-height:min(150vh,1350px)}
.gs-sec3{min-height:min(260vh,2300px)}
.gs-sec4{min-height:min(200vh,1800px)}
@media (max-height:820px){.gs-fit{transform:scale(.82)}}
@media (max-height:700px){.gs-fit{transform:scale(.72)}}
@media (max-width:1023px){
  .gs-scrolly{display:block}
  .gs-stage-col{display:contents}
  .gs-stage{top:72px;height:52vh;min-height:420px;margin:8px 0;z-index:2}
  .gs-fit{transform:scale(.58)}
  .gs-text-col{padding-left:0}
  .gs-sec1,.gs-sec2{min-height:auto;padding-top:2.5rem;padding-bottom:4rem}
  .gs-sec3{min-height:1700px}
  .gs-sec4{min-height:1300px}
}
`;

export function GradingStory() {
  const ref1 = useRef<HTMLElement>(null);
  const ref2 = useRef<HTMLElement>(null);
  const ref3 = useRef<HTMLElement>(null);
  const ref4 = useRef<HTMLElement>(null);
  const [p, setP] = useState<Progress>({ s1: 0, s2: 0, t: 0, u: 0, active: 1 });

  const measure = useCallback(() => {
    const els = [ref1.current, ref2.current, ref3.current, ref4.current];
    if (els.some((e) => !e)) return;
    const vh = window.innerHeight || 800;
    const [r1, r2, r3, r4] = els.map((e) => e!.getBoundingClientRect());
    setP({
      s1: cl((vh * 0.5 - r1.top) / Math.max(1, r1.height)),
      s2: cl((vh * 0.6 - r2.top) / Math.max(1, r2.height - vh * 0.3)),
      t: cl((vh * 0.6 - r3.top) / Math.max(1, r3.height - vh * 1.1)),
      u: cl((vh * 0.6 - r4.top) / Math.max(1, r4.height - vh * 0.9)),
      active: r4.top < vh * 0.55 ? 4 : r3.top < vh * 0.55 ? 3 : r2.top < vh * 0.55 ? 2 : 1,
    });
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; measure(); });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    measure();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [measure]);

  const { s1, s2, t, u, active } = p;

  // Pivot: intro tilt → turn while the slab assembles → 180° flip for the back.
  const intro = 1 - seg(s1, 0, 1);
  const turn = Math.sin(Math.PI * cl(t / 0.9));
  const flip = seg(u, 0.05, 0.65);
  const lift = Math.sin(Math.PI * flip);
  const shrink = seg(t, 0, 0.4);
  const rotY = -16 * intro - 34 * turn - 180 * flip;
  const rotX = 4 * intro + 9 * turn + 6 * lift;
  const scale = lerp(1.12, 0.92, shrink) * (1 - 0.08 * lift);
  const pivot = `translateY(${55 * shrink}px) scale(${scale}) rotateX(${rotX}deg) rotateY(${rotY}deg)`;

  // Slab parts.
  const back = seg(t, 0, 0.28);
  const label = seg(t, 0.22, 0.48);
  const front = seg(t, 0.42, 0.72);
  const weld = Math.sin(Math.PI * cl((t - 0.7) / 0.18));
  const sheen = cl((t - 0.82) / 0.18);

  // Grading overlays.
  const g = seg(s2, 0, 0.08) * (1 - seg(t, 0, 0.15));
  const centerO = seg(s2, 0.06, 0.18);
  const cornerO = seg(s2, 0.25, 0.35);
  const edgeO = seg(s2, 0.42, 0.52);
  const scanY = cl((s2 - 0.58) / 0.22) * 398;
  const scanO = seg(s2, 0.56, 0.6) * (1 - seg(s2, 0.8, 0.84));

  // Stage captions.
  const rawHudO = (1 - g) * (1 - back) * (1 - seg(s2, 0, 0.04));
  const certO = seg(t, 0.86, 1) * (1 - seg(u, 0, 0.12));
  const backHudO = seg(u, 0.62, 0.78);

  const side = "linear-gradient(90deg, rgba(255,255,255,.34), rgba(255,255,255,.10), rgba(255,255,255,.30))";
  const sideV = "linear-gradient(rgba(255,255,255,.34), rgba(255,255,255,.10), rgba(255,255,255,.30))";
  const tag = "absolute rounded px-[7px] py-[5px] text-[11px] font-bold leading-none text-gold-ink";
  const ring = "absolute h-11 w-11 rounded-full border-[1.5px]";

  return (
    <>
      <style>{CSS}</style>
      <div className="container gs-scrolly">
        {/* STAGE */}
        <div className="gs-stage-col">
          <div className="gs-stage" aria-hidden>
            <div className="absolute inset-0" style={{ background: `radial-gradient(60% 55% at 50% 50%, ${goldA(0.1)}, transparent 70%)` }} />

            <ol className="absolute left-6 top-5 z-10 flex gap-4 text-xs font-semibold">
              {STEPS.map((s, i) => (
                <li key={s} className="num transition-colors" style={{ color: active === i + 1 ? "#F2F3F5" : "#6B7280" }}>
                  0{i + 1}<span className="ml-1.5 hidden xl:inline">{s}</span>
                </li>
              ))}
            </ol>

            <div className="gs-fit">
              <div className="gs-3d absolute left-0 top-0 h-0 w-0" style={{ transform: pivot }}>
                {/* back shell + sides + inserts */}
                <div className="gs-3d absolute" style={{ left: -177, top: -359, width: 354, height: 598, transform: `translateZ(${lerp(-260, 0, back)}px)`, opacity: back }}>
                  <div className="absolute inset-0 rounded-[18px]" style={{ transform: "translateZ(-14px)", background: "linear-gradient(160deg, rgba(210,220,235,.16), rgba(210,220,235,.05))", border: "1.5px solid rgba(255,255,255,.28)" }} />
                  <div className="absolute left-0 top-0 rounded" style={{ width: 28, height: 598, transform: "translateX(-14px) rotateY(-90deg)", background: side }} />
                  <div className="absolute top-0 rounded" style={{ left: 340, width: 28, height: 598, transform: "rotateY(90deg)", background: side }} />
                  <div className="absolute left-0 rounded" style={{ top: -14, width: 354, height: 28, transform: "rotateX(90deg)", background: sideV }} />
                  <div className="absolute left-0 rounded" style={{ top: 584, width: 354, height: 28, transform: "rotateX(90deg)", background: sideV }} />
                  <div className="gs-bf absolute rounded-xl bg-[#050506]" style={{ left: 12, top: 10, width: 330, height: 578, transform: "translateZ(-6px)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.06)" }} />
                  <div className="gs-bf absolute rounded-xl bg-[#050506]" style={{ left: 12, top: 10, width: 330, height: 578, transform: "translateZ(6px) rotateY(180deg)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.06)" }} />
                </div>

                {/* card back (placeholder until a photo of the back is added) */}
                <div className="gs-bf absolute flex flex-col items-center justify-center gap-3 rounded-[10px] border-[1.5px] border-dashed border-white/30 bg-[#16171B] text-center text-[13px] text-[#A1A7B3]"
                  style={{ left: -130, top: -199, width: 260, height: 398, transform: "translateZ(-0.5px) rotateY(180deg)" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="M21 16l-5-5-8 8" /></svg>
                  <span className="text-[15px] font-bold text-[#F2F3F5]">[CARD BACK PHOTO]</span>
                  <span className="max-w-[180px] leading-snug">Back of the Mimikyu A♦ playing card</span>
                </div>

                {/* card front */}
                <div className="gs-bf absolute rounded-[10px]" style={{ left: -130, top: -199, width: 260, height: 398, transform: "translateZ(0.5px)", boxShadow: `0 ${30 * (1 - back)}px ${60 * (1 - back)}px rgba(0,0,0,${0.55 * (1 - back)})` }}>
                  <img src="/grading/card.webp" alt="" width={260} height={398} className="block h-[398px] w-[260px] rounded-[10px]" />
                </div>

                {/* grading overlays */}
                <div className="absolute" style={{ left: -130, top: -199, width: 260, height: 398, transform: "translateZ(2px)", opacity: g }}>
                  <div className="absolute inset-6 border border-dashed" style={{ borderColor: GOLD, opacity: centerO }} />
                  <div className="absolute inset-x-0 top-1/2 h-px" style={{ background: goldA(0.5), opacity: centerO }} />
                  <div className="absolute inset-y-0 left-1/2 w-px" style={{ background: goldA(0.5), opacity: centerO }} />
                  <span className={tag} style={{ left: -62, top: 186, background: GOLD, opacity: centerO }}>L 50</span>
                  <span className={tag} style={{ right: -62, top: 186, background: GOLD, opacity: centerO }}>R 50</span>
                  <span className={tag} style={{ left: 112, top: -34, background: GOLD, opacity: centerO }}>T 50</span>
                  <span className={tag} style={{ left: 112, bottom: -34, background: GOLD, opacity: centerO }}>B 50</span>
                  <span className={ring} style={{ left: -23, top: -23, borderColor: GOLD, opacity: cornerO }} />
                  <span className={ring} style={{ right: -23, top: -23, borderColor: GOLD, opacity: cornerO }} />
                  <span className={ring} style={{ left: -23, bottom: -23, borderColor: GOLD, opacity: cornerO }} />
                  <span className={ring} style={{ right: -23, bottom: -23, borderColor: GOLD, opacity: cornerO }} />
                  <div className="absolute -inset-[3px] rounded-xl" style={{ boxShadow: `0 0 0 1.5px ${GOLD}, 0 0 18px ${goldA(0.45)}`, opacity: edgeO }} />
                  <div className="absolute -inset-x-4 h-0.5" style={{ top: scanY, background: GOLD, boxShadow: `0 0 16px 3px ${goldA(0.6)}`, opacity: scanO }} />
                  <div className="absolute inset-x-0 top-0" style={{ height: scanY, background: `linear-gradient(transparent, ${goldA(0.12)})`, opacity: scanO }} />
                </div>

                {/* back label: hologram + QR placeholder */}
                <div className="gs-bf absolute flex items-center gap-[18px] overflow-hidden rounded-md border border-white/50 px-5"
                  style={{ left: -146, top: -343, width: 291, height: 128, transform: `translateY(${lerp(-180, 0, label)}px) translateZ(-4px) rotateY(180deg)`, opacity: label, background: "linear-gradient(135deg, #D9DBDF, #B9BCC2 55%, #D3D5DA)" }}>
                  <img src="/grading/holo.webp" alt="" width={96} height={88} className="block h-[88px] w-[96px]" />
                  <div className="grid h-[76px] w-[76px] place-items-center rounded border-[1.5px] border-dashed border-[#4A4C52] text-[11px] font-bold text-[#2A2B2F]">[QR]</div>
                </div>

                {/* front label */}
                <div className="gs-bf absolute overflow-hidden rounded-md" style={{ left: -146, top: -343, width: 291, height: 128, transform: `translateY(${lerp(-180, 0, label)}px) translateZ(4px)`, opacity: label }}>
                  <img src="/grading/label.webp" alt="" width={291} height={128} className="block h-[128px] w-[291px] object-cover" />
                </div>

                {/* front shell */}
                <div className="absolute overflow-hidden rounded-[18px]"
                  style={{
                    left: -177, top: -359, width: 354, height: 598, boxSizing: "border-box",
                    transform: `translateZ(${lerp(340, 14, front)}px)`, opacity: front,
                    border: "1.5px solid rgba(255,255,255,.45)",
                    background: "linear-gradient(115deg, rgba(255,255,255,.16) 0%, rgba(255,255,255,.03) 28%, rgba(255,255,255,0) 58%, rgba(255,255,255,.08) 100%)",
                    boxShadow: `0 0 0 2px ${goldA(weld)}, 0 0 48px ${goldA(weld * 0.55)}`,
                  }}>
                  <div className="absolute inset-2 rounded-xl border border-white/20" />
                  <div className="absolute rounded-lg border border-white/20" style={{ left: 24, top: 9, width: 304, height: 140 }} />
                  <div className="absolute rounded-[13px] border border-white/20" style={{ left: 39, top: 152, width: 274, height: 414 }} />
                  <div className="absolute" style={{ top: "-20%", height: "140%", width: "34%", left: `${lerp(-60, 130, sheen)}%`, transform: "skewX(-18deg)", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.38), transparent)", opacity: Math.sin(Math.PI * sheen) }} />
                </div>
              </div>
            </div>

            {/* captions */}
            <div className="absolute inset-x-0 bottom-6 flex justify-center px-4 text-[13px]">
              <p className="absolute bottom-0 flex items-center gap-2.5 text-[#A1A7B3]" style={{ opacity: rawHudO }}>
                <span className="h-2 w-2 rounded-full border-[1.5px] border-current" />Ungraded · condition unknown
              </p>
              <ul className="flex flex-wrap justify-center gap-2" style={{ opacity: g }}>
                {SUBGRADES.map(([k, th]) => {
                  const done = s2 > th;
                  return (
                    <li key={k} className="flex h-9 items-center gap-2 rounded-full border bg-[#0B0C0F]/75 px-3" style={{ borderColor: done ? GOLD : "rgba(255,255,255,.16)", color: done ? "#F2F3F5" : "#8E8D87" }}>
                      {k}<span className="num font-bold">{done ? "10" : "—"}</span>
                    </li>
                  );
                })}
              </ul>
              <p className="absolute bottom-0 flex items-center gap-3 rounded-full border bg-[#0B0C0F]/70 px-3.5 py-2 text-[#F2F3F5]" style={{ borderColor: GOLD, opacity: certO }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></svg>
                Sealed · Pristine 10 · Cert <span className="num">6125987045</span>
              </p>
              <p className="absolute bottom-0 flex items-center gap-3 rounded-full border bg-[#0B0C0F]/70 px-3.5 py-2 text-[#F2F3F5]" style={{ borderColor: GOLD, opacity: backHudO }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3" /></svg>
                Back · hologram + QR verification
              </p>
            </div>
          </div>
        </div>

        {/* TEXT */}
        <div className="gs-text-col">
          <section ref={ref1} className="gs-sec1 flex flex-col justify-center gap-7 py-12">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-faint">
              <Link href="/" className="hover:text-ink">Home</Link><ChevronRight size={14} /><span className="text-muted">Card to slab</span>
            </nav>
            <p className="eyebrow !text-gold-text">01 — The card</p>
            <h1 className="max-w-[560px] text-[40px] font-extrabold leading-[1.02] tracking-tight lg:text-[58px]">How a Pokémon card becomes money.</h1>
            <p className="max-w-[520px] text-lg leading-relaxed text-muted">
              Before grading, a card is worth whatever someone guesses its condition is. Grading replaces the guess with a number — and puts that number in a sealed case anyone can verify.
            </p>
            <dl className="grid max-w-[560px] grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line">
              {[["Character", "Mimikyu · ミミッキュ"], ["Card", "Ace of Diamonds · A♦"], ["Product", "Pokémon Playing Cards (2016)"], ["Deck · Language", "Sun & Moon: Solgaleo · JPN"]].map(([k, v]) => (
                <div key={k} className="bg-bg px-5 py-4"><dt className="mb-1.5 text-xs text-faint">{k}</dt><dd className="font-semibold">{v}</dd></div>
              ))}
            </dl>
            <p className="flex items-center gap-2.5 text-sm text-faint">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M12 5v14" /><path d="M6 13l6 6 6-6" /></svg>
              Scroll to send it for grading
            </p>
          </section>

          <section ref={ref2} className="gs-sec2 flex flex-col gap-7 pb-20 pt-28">
            <p className="eyebrow !text-gold-text">02 — The grading</p>
            <h2 className="max-w-[540px] text-[32px] font-extrabold leading-[1.05] tracking-tight lg:text-[44px]">Every millimeter gets a score.</h2>
            <p className="max-w-[520px] leading-relaxed text-muted">
              The card is authenticated first — real stock, real print, no trimming or restoration. Then graders inspect it under light and magnification, front and back, on four things:
            </p>
            <ol className="flex max-w-[540px] flex-col gap-4">
              {CHECKS.map((c, i) => (
                <li key={c.t} className="flex gap-4">
                  <span className="num w-8 shrink-0 text-sm font-bold leading-relaxed text-gold-text">0{i + 1}</span>
                  <div><p className="font-semibold">{c.t}</p><p className="mt-1 leading-relaxed text-muted">{c.b}</p></div>
                </li>
              ))}
            </ol>
            <div className="max-w-[540px] overflow-hidden rounded-card border border-line">
              <p className="border-b border-line px-5 py-3.5 text-sm text-faint">10 or 9.5 — where the line falls</p>
              {LADDER.map((l) => (
                <div key={l.g} className={`flex items-baseline gap-4 border-b border-line px-5 py-4 last:border-b-0 ${l.hi ? "bg-gold/10" : ""}`}>
                  <span className={`w-28 shrink-0 text-lg font-bold ${l.hi ? "text-gold-text" : ""}`}>{l.g}</span>
                  <span className="leading-relaxed text-muted">{l.d}</span>
                </div>
              ))}
            </div>
          </section>

          <section ref={ref3} className="gs-sec3 flex flex-col justify-between gap-16 pb-40 pt-28">
            <div className="flex max-w-[540px] flex-col gap-6">
              <p className="eyebrow !text-gold-text">03 — The slab</p>
              <h2 className="text-[32px] font-extrabold leading-[1.05] tracking-tight lg:text-[44px]">Sealed, numbered, priced.</h2>
              <p className="leading-relaxed text-muted">Once graded, the card is locked inside a clear, tamper-evident holder. The two shells are sealed shut — opening it means breaking it, and breaking it voids the grade.</p>
            </div>
            <div className="flex max-w-[540px] flex-col gap-4">
              <p className="text-xl font-bold">The label is the receipt.</p>
              <p className="leading-relaxed text-muted">
                It names the card, the set and the grade, and carries a unique certificate number — <span className="num font-semibold text-ink">6125987045</span>. The back of the holder has a hologram and a QR code, so any buyer can check the record online in seconds.
              </p>
            </div>
            <div className="flex max-w-[540px] flex-col gap-6">
              <p className="text-xl font-bold">How it gets a cost</p>
              <ul className="flex flex-col gap-3.5">
                {PRICE_FACTORS.map((f) => (
                  <li key={f.t} className="flex gap-3.5 leading-relaxed">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span className="text-muted"><strong className="font-semibold text-ink">{f.t}</strong> {f.b}</span>
                  </li>
                ))}
              </ul>
              <div className="grid grid-cols-3 gap-px overflow-hidden rounded-card border border-line bg-line">
                {[["Raw", false], ["Graded 9.5", false], ["Pristine 10", true]].map(([k, hi]) => (
                  <div key={k as string} className={hi ? "bg-gold/10 p-4" : "bg-bg p-4"}>
                    <p className={`text-xs ${hi ? "text-gold-text" : "text-faint"}`}>{k}</p>
                    <p className="num mt-2 text-lg font-bold">[PRICE]</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section ref={ref4} className="gs-sec4 flex flex-col justify-between gap-16 pb-40 pt-28">
            <div className="flex max-w-[540px] flex-col gap-6">
              <p className="eyebrow !text-gold-text">04 — The back</p>
              <h2 className="text-[32px] font-extrabold leading-[1.05] tracking-tight lg:text-[44px]">Turn it over. The back counts too.</h2>
              <p className="leading-relaxed text-muted">A 10 isn’t a 10 on one side only. Graders check the back for its own centering, and the back is where wear shows first — white specks on the edges and corners, scuffs from shuffling, dents from a binder ring.</p>
            </div>
            <div className="flex max-w-[540px] flex-col gap-4">
              <p className="text-xl font-bold">The back of the slab is the security layer.</p>
              <ul className="flex flex-col gap-3.5">
                <li className="flex gap-3.5 leading-relaxed"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /><span className="text-muted"><strong className="font-semibold text-ink">Hologram.</strong> A shifting foil sticker that is hard to copy — the first sign a slab is genuine.</span></li>
                <li className="flex gap-3.5 leading-relaxed"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /><span className="text-muted"><strong className="font-semibold text-ink">QR code.</strong> Opens the certificate record for this exact case: card, grade and number.</span></li>
              </ul>
            </div>
            <div className="panel flex max-w-[540px] flex-col gap-3 p-6">
              <p className="eyebrow">Before you buy</p>
              <p className="leading-relaxed text-muted">Scan the code and check that the certificate number, card and grade match the label on the front. If they don’t, walk away.</p>
            </div>
          </section>
        </div>
      </div>

      {/* CTA */}
      <section className="container">
        <div className="panel relative flex flex-wrap items-center justify-between gap-8 overflow-hidden p-6 md:p-10">
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
          <div className="relative max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Have a card like this in a binder?</h2>
            <p className="mt-2 text-muted">Look it up to see raw and graded prices from completed sales.</p>
          </div>
          <Link href="/" className="btn-primary relative">Check a card’s value <ChevronRight size={16} /></Link>
        </div>
      </section>
    </>
  );
}
