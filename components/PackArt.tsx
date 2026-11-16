import { cx } from "@/lib/format";

/** The sealed foil pack. Plain markup so it works in server and client components. */
export function PackArt({ name, price, className }: { name: string; price: string; className?: string }) {
  return (
    <div className={cx("relative aspect-[23/33] w-full select-none", className)}>
      <div className="absolute inset-x-0 top-0 h-[16%] rounded-t-[10px] bg-[repeating-linear-gradient(90deg,rgb(0_0_0/.2)_0_3px,transparent_3px_8px),linear-gradient(160deg,#F5D27E,#D49A2A)]" />
      <div className="absolute inset-x-0 bottom-0 top-[13.5%] flex flex-col items-center justify-center gap-2.5 rounded-b-[10px] bg-[linear-gradient(160deg,#F5D27E_0%,#D49A2A_48%,#8A5A12_100%)] text-[#1A1305] shadow-lift">
        <span className="grid h-[34%] aspect-square place-items-center rounded-full bg-[#1A1305]/90 ring-4 ring-white/25">
          <svg viewBox="0 0 32 32" className="h-[58%] w-[58%]" aria-hidden>
            <path d="M8 23V9l8 8.5L24 9v14" fill="none" stroke="#F5D27E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="px-2 text-center text-[15px] font-extrabold uppercase leading-tight tracking-[0.16em]">{name}</span>
        <span className="num text-[10px] font-semibold uppercase tracking-[0.16em] opacity-80">1 card · {price}</span>
        <span className="absolute inset-x-0 bottom-0 h-[7%] rounded-b-[10px] bg-[repeating-linear-gradient(90deg,rgb(0_0_0/.2)_0_3px,transparent_3px_8px)]" />
      </div>
    </div>
  );
}
