"use client";
import {useCallback, useRef, useState} from "react";
import Link from "next/link";
import gsap from "gsap";
import {useGSAP} from "@gsap/react";
import {CARDS} from "@/lib/data";
import {cx, fmtUSD} from "@/lib/format";
import {PACK, ripPack, type RipResult, SELLBACK, type Tier, TIER_ORDER, TIERS} from "@/lib/rip";
import {CardImage} from "./CardImage";
import {PackArt} from "./PackArt";

gsap.registerPlugin(useGSAP);

type Phase = "idle" | "charging" | "revealing" | "revealed" | "resolving";

const START_BALANCE = 100;
const BURST_DUR = 0.95;   // seconds
const REVEAL_AT = 0.3;    // seconds into the burst when the card appears under it
const SHARD_COLORS = ["#F5D27E", "#D49A2A", "#8A5A12", "#FFF3C4"];

/** Optional video burst. The clip sits on a black background and is screen-blended,
 *  so it needs no alpha channel. Its first frame is the sealed pack. */
const CLIP = {
  src: "/explosion.mp4",
  revealAt: 1.25,   // second of the clip where the flash peaks; the card appears under it
  fade: 0.45,       // the clip ends while still bright, so it is faded out after the cue
  scale: 1.9,       // zoom so the pack in the clip is about the size of the card
  // The clip has ~1.2s of trembling before the blast. Rarer tiers get more of it.
  start: { common: 0.75, rare: 0.55, epic: 0.3, legendary: 0 } as Record<Tier, number>,
};
type Fx = "canvas" | "clip";

/* ---------------------------------------------------------------------------
 * Canvas helpers. Everything bright is drawn from one cached soft-dot sprite
 * per colour with additive blending: no CSS blur, no masks, no DOM particles.
 * ------------------------------------------------------------------------- */
const sprites = new Map<string, HTMLCanvasElement>();
function sprite(color: string) {
  let c = sprites.get(color);
  if (c) return c;
  c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, color);
  grad.addColorStop(0.4, color + "88");
  grad.addColorStop(1, color + "00");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  sprites.set(color, c);
  return c;
}

/** Paints the rays once. After that GSAP only rotates the canvas (compositor-only). */
function drawRays(canvas: HTMLCanvasElement, color: string) {
  const S = canvas.width, R = S / 2, n = 18;
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, S, S);
  ctx.translate(R, R);
  ctx.fillStyle = color;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, w = i % 2 ? 0.06 : 0.1;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, R, a - w, a + w); ctx.closePath(); ctx.fill();
  }
  ctx.globalCompositeOperation = "destination-in";   // fade the rays out toward the edge
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
  g.addColorStop(0, "rgba(0,0,0,.95)"); g.addColorStop(0.4, "rgba(0,0,0,.55)"); g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g; ctx.fillRect(-R, -R, S, S);
  ctx.globalCompositeOperation = "lighter";          // soft glow behind the card
  ctx.globalAlpha = 0.55;
  ctx.drawImage(sprite(color), -R * 0.62, -R * 0.62, R * 1.24, R * 1.24);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
}

const SHARDS = Array.from({ length: 18 }, (_, i) => ({
  a: (i / 18) * Math.PI * 2 + ((i * 37) % 10) * 0.03,
  d: 170 + ((i * 53) % 160),
  s: 14 + ((i * 29) % 22),
  rot: (((i * 17) % 20) - 10) / 2,
  c: SHARD_COLORS[i % 4],
}));

function drawBurst(canvas: HTMLCanvasElement, dpr: number, t: number, colors: string[]) {
  const ctx = canvas.getContext("2d")!;
  const w = canvas.width / dpr, h = canvas.height / dpr, cx0 = w / 2, cy0 = h / 2;
  const k = Math.min(t / BURST_DUR, 1), out = 1 - Math.pow(1 - k, 3);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  if (k >= 1) return;
  for (const s of SHARDS) {                           // foil shards
    ctx.save();
    ctx.translate(cx0 + Math.cos(s.a) * s.d * out, cy0 + Math.sin(s.a) * s.d * out + 90 * k * k);
    ctx.rotate(s.rot * k);
    ctx.globalAlpha = 1 - k;
    ctx.fillStyle = s.c;
    ctx.beginPath(); ctx.moveTo(-s.s / 2, -s.s / 3); ctx.lineTo(s.s / 2, 0); ctx.lineTo(-s.s / 4, s.s / 2); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 10; i++) {                      // coloured burst
    const a = i * 0.63, d = 150 * out, s = 120 + 260 * out;
    ctx.globalAlpha = 0.55 * (1 - k);
    ctx.drawImage(sprite(colors[i % 3]), cx0 + Math.cos(a) * d - s / 2, cy0 + Math.sin(a) * d - s / 2, s, s);
  }
  const fs = 200 + 520 * out;   // white-hot core, a soft dot, never a rectangle
  ctx.globalAlpha = Math.max(0, 1 - t / 0.32);
  ctx.drawImage(sprite("#ffffff"), cx0 - fs / 2, cy0 - fs / 2, fs, fs);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
}

/* ------------------------------------------------------------------------- */

export function PackOpening() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const pack = useRef<HTMLDivElement>(null);
  const cardWrap = useRef<HTMLDivElement>(null);
  const rays = useRef<HTMLCanvasElement>(null);
  const burst = useRef<HTMLCanvasElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const valueEl = useRef<HTMLElement>(null);
  const hint = useRef<HTMLParagraphElement>(null);
  const clipWrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  const phaseRef = useRef<Phase>("idle");
  const [phase, setPhaseState] = useState<Phase>("idle");
  const setPhase = useCallback((p: Phase) => { phaseRef.current = p; setPhaseState(p); }, []);

  const [result, setResult] = useState<RipResult | null>(null);
  const [balance, setBalance] = useState(START_BALANCE);
  const [kept, setKept] = useState(0);
  const [forced, setForced] = useState<Tier | "random">("random");
  const [note, setNote] = useState<string | null>(null);
  const fxRef = useRef<Fx>("canvas");
  const [fx, setFxState] = useState<Fx>("canvas");

  const dpr = useRef(1);
  const reduced = useRef(false);
  const idleTween = useRef<gsap.core.Tween | null>(null);
  const stopBurst = useRef<(() => void) | null>(null);

  /** Put every layer back to its sealed-pack state. Call only inside a GSAP context. */
  const applyIdle = (first: boolean) => {
    const clip = fxRef.current === "clip";
    // In clip mode the video's first frame is the pack, so the drawn pack is hidden.
    const packEl = clip ? clipWrap.current : pack.current;
    gsap.killTweensOf([pack.current, clipWrap.current, cardWrap.current, rays.current, panel.current, hint.current]);
    gsap.set(pack.current, { x: 0, y: 0, rotation: 0, scale: 1, autoAlpha: clip ? 0 : 1 });
    gsap.set(clipWrap.current, { x: 0, y: 0, autoAlpha: clip ? 1 : 0 });
    if (video.current) { video.current.pause(); if (clip) video.current.currentTime = 0; }
    // The card stays rendered at near-zero opacity, so its layer is already rasterised
    // when the reveal starts. That is what keeps the first play smooth.
    gsap.set(cardWrap.current, { y: 0, rotation: 0, scale: 0.7, opacity: 0.001, force3D: true });
    gsap.set(rays.current, { opacity: 0, scale: 0.6, rotation: 0 });
    gsap.set(panel.current, { autoAlpha: 0, y: 16 });
    gsap.set(hint.current, { opacity: 1 });
    if (reduced.current) return;
    if (!first) gsap.from(packEl, clip ? { opacity: 0, duration: 0.45 } : { scale: 0.6, autoAlpha: 0, duration: 0.45, ease: "back.out(1.6)" });
    idleTween.current = gsap.to(packEl, { y: -8, rotation: clip ? 0 : 1.2, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.fromTo(hint.current, { opacity: 0.35 }, { opacity: 1, duration: 0.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
  };

  // Event handlers run their GSAP work through `context.add`, so every tween they create
  // belongs to this component's GSAP context and is reverted on unmount.
  const { context } = useGSAP(
    () => {
      reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      dpr.current = Math.min(window.devicePixelRatio || 1, 2);

      const fit = () => {
        const b = stage.current!.getBoundingClientRect();
        burst.current!.width = Math.round(b.width * dpr.current);
        burst.current!.height = Math.round(b.height * dpr.current);
      };
      fit();
      window.addEventListener("resize", fit);
      rays.current!.width = rays.current!.height = Math.round(500 * Math.min(dpr.current, 1.5));

      // Warm-up: build the sprites and draw one frame of each effect before the first tap.
      for (const t of TIER_ORDER) { TIERS[t].burst.forEach(sprite); sprite(TIERS[t].color); }
      sprite("#ffffff");
      drawBurst(burst.current!, dpr.current, 0.1, TIERS.rare.burst);
      burst.current!.getContext("2d")!.clearRect(0, 0, burst.current!.width, burst.current!.height);
      drawRays(rays.current!, TIERS.rare.color);

      applyIdle(true);
      return () => {
        window.removeEventListener("resize", fit);
        stopBurst.current?.();
      };
    },
    { scope: root }
  );

  const showCard = (r: RipResult) => context.add(() => {
    const t = TIERS[r.tier];
    const instant = reduced.current;
    const val = { v: 0 };
    gsap
      .timeline({
        onComplete: () => {
          setPhase("revealed");
          if (instant) return;
          gsap.to(rays.current, { rotation: 360, duration: 28, ease: "none", repeat: -1 });
          // Gentle levitation only: a few pixels and a fraction of a degree.
          gsap.to(cardWrap.current, { y: -6, rotation: 0.6, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
        },
      })
      .to(cardWrap.current, { opacity: 1, scale: 1, duration: instant ? 0 : 0.5, ease: "back.out(1.5)" }, 0)
      .to(rays.current, { opacity: t.rays, scale: 1, duration: instant ? 0 : 0.7, ease: "power2.out" }, 0)
      .to(panel.current, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, 0.35)
      .to(val, { v: r.value, duration: instant ? 0 : 0.8, ease: "power2.out", onUpdate: () => { if (valueEl.current) valueEl.current.textContent = fmtUSD(val.v); } }, 0.35);
  });

  const playBurst = (colors: string[], onCue: () => void) => {
    const t0 = performance.now();
    let fired = false;
    const tick = () => {
      const t = (performance.now() - t0) / 1000;
      if (burst.current) drawBurst(burst.current, dpr.current, t, colors);
      if (!fired && t >= REVEAL_AT) { fired = true; onCue(); }
      if (t >= BURST_DUR) gsap.ticker.remove(tick); stopBurst.current = null;
    };
    stopBurst.current = () => {
      gsap.ticker.remove(tick);
      stopBurst.current = null;
    };
    gsap.ticker.add(tick);
  };

  /** Plays the video burst from `startAt`. The cue is read from video.currentTime, so the
   *  card stays in sync with the footage even if frames drop. */
  const playClip = (startAt: number, onCue: () => void) => {
    const v = video.current!;
    let fired = false;
    const fire = () => { if (!fired) { fired = true; onCue(); } };
    const tick = () => {
      if (v.currentTime >= CLIP.revealAt || v.ended) fire();
      if (v.ended) stop();
    };
    const stop = () => { gsap.ticker.remove(tick); stopBurst.current = null; };
    stopBurst.current = stop;
    v.currentTime = startAt;
    gsap.ticker.add(tick);
    v.play().catch(() => { stop(); fire(); });   // clip cannot play: reveal the card anyway
  };

  const reveal = (r: RipResult) => context.add(() => {
    const t = TIERS[r.tier];
    drawRays(rays.current!, t.color);
    const tl = gsap.timeline();
    if (fxRef.current === "clip") {
      // The clip carries its own trembling and blast: start it at the right offset,
      // show the card on the flash frame, then fade the clip away.
      tl.to(clipWrap.current, { x: 0, y: 0, duration: 0.1 })
        .add(() => playClip(reduced.current ? CLIP.revealAt : CLIP.start[r.tier], () => {
          showCard(r);
          context.add(() => gsap.to(clipWrap.current, { autoAlpha: 0, duration: CLIP.fade, ease: "power1.out" }));
        }));
      return;
    }
    if (!reduced.current) {
      // Suspense: the shake runs longer for rarer cards.
      tl.to(pack.current, { x: "random(-7,7)", rotation: "random(-4,4)", duration: 0.05, repeat: t.shakes, repeatRefresh: true, ease: "none" })
        .to(pack.current, { x: 0, rotation: 0, scale: 1.08, duration: 0.1, ease: "power2.out" });
    }
    tl.add(() => playBurst(t.burst, () => showCard(r)))
      .to(pack.current, { scale: 1.3, autoAlpha: 0, duration: 0.12, ease: "power1.in" });
  });

  const fail = () => context.add(() => {
    setBalance((b) => b + PACK.price);
    setNote("Couldn’t open the pack. You weren’t charged.");
    setPhase("idle");
    applyIdle(true);
  });

  const onTap = async () => {
    if (phaseRef.current !== "idle") return;
    if (balance < PACK.price) { setNote("Not enough demo balance. Reset the demo to keep going."); return; }
    setNote(null);
    setPhase("charging");
    setBalance((b) => b - PACK.price);
    const charge: { tween: gsap.core.Tween | null } = { tween: null };
    context.add(() => {
      idleTween.current?.kill();
      gsap.killTweensOf(hint.current);
      gsap.set(hint.current, { opacity: 0 });
      // A light shake while the request is in flight, so latency reads as anticipation.
      const clip = fxRef.current === "clip";
      if (!reduced.current)
        charge.tween = gsap.to(clip ? clipWrap.current : pack.current, { x: "random(-3,3)", rotation: clip ? 0 : "random(-2,2)", duration: 0.07, repeat: -1, repeatRefresh: true, ease: "none" });
    });
    try {
      // The server decides the card before anything is revealed.
      const r = await ripPack(forced === "random" ? undefined : forced);
      charge.tween?.kill();
      setResult(r);
      setPhase("revealing");
      reveal(r);
    } catch {
      charge.tween?.kill();
      fail();
    }
  };

  const resolve = (kind: "sell" | "keep") => context.add(() => {
    if (phaseRef.current !== "revealed" || !result) return;
    const r = result;
    setPhase("resolving");
    gsap.killTweensOf([cardWrap.current, rays.current]);
    gsap
      .timeline({
        onComplete: () => {
          if (kind === "sell") setBalance((b) => Math.round((b + r.value * SELLBACK) * 100) / 100);
          else setKept((k) => k + 1);
          setPhase("idle");
          applyIdle(false);
        },
      })
      .to(panel.current, { autoAlpha: 0, y: 10, duration: 0.2 }, 0)
      .to(rays.current, { opacity: 0, duration: 0.35 }, 0)
      .to(cardWrap.current, kind === "sell"
        ? { scale: 0.5, opacity: 0, duration: 0.35, ease: "power2.in" }
        : { y: 24, scale: 0.9, opacity: 0, duration: 0.35, ease: "power2.in" }, 0);
  });

  const resetDemo = () => context.add(() => {
    if (phaseRef.current === "charging" || phaseRef.current === "revealing") return;
    stopBurst.current?.();
    setBalance(START_BALANCE); setKept(0); setForced("random"); setNote(null);
    setPhase("idle");
    applyIdle(true);
  });

  /** Switch between the drawn burst and the video burst. Only while the pack is sealed. */
  const setFx = (next: Fx, message: string | null = null) => {
    if (phaseRef.current !== "idle") return;
    fxRef.current = next;
    setFxState(next);
    setNote(message);
    if (next === "clip" && video.current && video.current.readyState === 0) video.current.load();
    context.add(() => applyIdle(true));
  };

  const tier = result ? TIERS[result.tier] : TIERS.common;
  const shown = result?.card ?? CARDS[0];
  const busy = phase !== "revealed";

  return (
    <div ref={root}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm text-muted">Demo balance <b className="num ml-1 text-base text-ink">{fmtUSD(balance)}</b></p>
        {kept > 0 && <Link href="/collection" className="text-sm font-semibold text-gold-text hover:underline"><span className="num">{kept}</span> kept · View collection</Link>}
      </div>

      {/* The stage stays dark in both themes: the burst and rays are additive light. */}
      <div
        ref={stage}
        role="button"
        tabIndex={0}
        aria-label={`Rip a ${PACK.name} for ${fmtUSD(PACK.price, true)}`}
        aria-disabled={phase !== "idle"}
        onClick={onTap}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onTap(); } }}
        className={cx("relative h-[460px] select-none overflow-hidden rounded-xl2 border border-line bg-[#0B0C0F] [touch-action:manipulation] sm:h-[500px]", phase === "idle" && "cursor-pointer")}
      >
        {/* 1. rays, below the card */}
        <canvas ref={rays} aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -ml-[250px] -mt-[250px] h-[500px] w-[500px] opacity-0 will-change-transform" />
        {/* 2. the card */}
        <div ref={cardWrap} className="absolute left-1/2 top-1/2 -ml-[105px] -mt-[147px] w-[210px] opacity-0 will-change-transform" style={{ ["--tier" as string]: tier.color }}>
          <CardImage card={shown} tilt={phase === "revealed"} className="ring-2 ring-[var(--tier)]" />
        </div>
        {/* 3. sealed pack */}
        <div ref={pack} className="absolute left-1/2 top-1/2 -ml-[110px] -mt-[158px] w-[220px] will-change-transform">
          <PackArt name={PACK.name.replace(" Pack", "")} price={fmtUSD(PACK.price, true)} />
        </div>
        {/* 4. burst, above the card */}
        <canvas ref={burst} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
        {/* 4b. optional video burst. Screen blending turns the clip's black into transparency; the
            radial mask fades it out before the stage edge so a full-frame flash never shows as a box. */}
        <div ref={clipWrap} aria-hidden className="pointer-events-none invisible absolute inset-0 mix-blend-screen will-change-transform [mask-image:radial-gradient(circle_at_50%_50%,#000_40%,transparent_70%)]">
          <video
            ref={video}
            src={CLIP.src}
            muted
            playsInline
            preload="none"
            onError={() => { if (fxRef.current === "clip") setFx("canvas", "The video burst couldn’t load. Showing the drawn version."); }}
            className="h-full w-full object-cover"
            style={{ transform: `scale(${CLIP.scale})` }}
          />
        </div>
        <p ref={hint} className={cx("pointer-events-none absolute inset-x-0 bottom-4 text-center text-xs font-bold uppercase tracking-[0.22em] text-[#A1A7B3]", phase !== "idle" && "invisible")}>
          Tap to rip · {fmtUSD(PACK.price, true)}
        </p>
      </div>

      {note && <p role="status" className="mt-3 text-center text-sm text-down">{note}</p>}

      {/* Result */}
      <div className="min-h-[168px]">
        <div ref={panel} aria-live="polite" className="invisible pt-5 text-center opacity-0">
          <span className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0B0C0F]" style={{ background: tier.color }}>{tier.label}</span>
          <p className="mt-2 text-xl font-bold tracking-tight">{shown.name}</p>
          <p className="text-xs text-faint">{shown.rarity} · #{shown.number}{result && <> · Vault ID <span className="num">{result.serial}</span></>}</p>
          <p className="mt-1.5 text-sm text-muted">Market value <b ref={valueEl} className="num ml-1 text-xl text-ink" /></p>
          <div className="mx-auto mt-4 flex max-w-md gap-2.5">
            <button onClick={() => resolve("sell")} disabled={busy} className="btn-primary flex-1">
              Sell back · <span className="num">{fmtUSD((result?.value ?? 0) * SELLBACK)}</span>
            </button>
            <button onClick={() => resolve("keep")} disabled={busy} className="btn-secondary flex-1">Keep in vault</button>
          </div>
        </div>
      </div>

      {/* Demo controls: there is no backend yet, so the outcome can be forced for review. */}
      <div className="mt-2 border-t border-dashed border-line pt-4">
        <p className="eyebrow">Demo controls</p>
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          {(["random", ...TIER_ORDER] as const).map((t) => (
            <button key={t} type="button" aria-pressed={forced === t} onClick={() => setForced(t)} className="chip h-8 px-3 text-xs">
              {t === "random" ? "Random" : TIERS[t].label}
            </button>
          ))}
          <span className="ml-auto flex items-center gap-2">
            <button
              type="button"
              role="switch"
              aria-checked={fx === "clip"}
              aria-label="Video burst"
              disabled={phase !== "idle"}
              onClick={() => setFx(fx === "clip" ? "canvas" : "clip")}
              className={cx("relative h-6 w-11 shrink-0 rounded-full transition disabled:opacity-50", fx === "clip" ? "bg-gold" : "bg-line")}
            >
              <span className={cx("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", fx === "clip" ? "left-[22px]" : "left-0.5")} />
            </button>
            <span className="text-xs font-medium text-muted">Video burst</span>
            <button type="button" onClick={resetDemo} className="btn-ghost h-8 px-3 text-xs">Reset demo</button>
          </span>
        </div>
      </div>
    </div>
  );
}
