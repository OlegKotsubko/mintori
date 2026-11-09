import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size = 18): SVGProps<SVGSVGElement> => ({
  width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true,
});
const mk = (d: React.ReactNode) => function Icon({ size, ...p }: P) { return <svg {...base(size)} {...p}>{d}</svg>; };

export const Search = mk(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>);
export const ArrowUp = mk(<path d="M12 19V5m-6 6 6-6 6 6" />);
export const ArrowDown = mk(<path d="M12 5v14m6-6-6 6-6-6" />);
export const Shield = mk(<><path d="M12 3 4.5 6v6c0 4.4 3.2 7.9 7.5 9 4.3-1.1 7.5-4.6 7.5-9V6L12 3Z" /><path d="m8.8 12 2.2 2.2 4.4-4.4" /></>);
export const Truck = mk(<><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17.5" cy="17.5" r="1.8" /></>);
export const Return = mk(<><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" /></>);
export const Bell = mk(<><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10.3 20a1.9 1.9 0 0 0 3.4 0" /></>);
export const Cart = mk(<><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6" /><circle cx="10" cy="20.5" r="1" /><circle cx="17" cy="20.5" r="1" /></>);
export const User = mk(<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>);
export const ChevronRight = mk(<path d="m9 6 6 6-6 6" />);
export const ChevronDown = mk(<path d="m6 9 6 6 6-6" />);
export const Check = mk(<path d="m5 12 4.5 4.5L19 7" />);
export const Sun = mk(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>);
export const Moon = mk(<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />);
export const Filter = mk(<path d="M3 5h18M6 12h12M10 19h4" />);
export const Plus = mk(<path d="M12 5v14M5 12h14" />);
export const X = mk(<path d="M6 6l12 12M18 6 6 18" />);
export const Info = mk(<><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>);
export const Lock = mk(<><rect x="4.5" y="10.5" width="15" height="10" rx="2" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" /></>);
export const Calendar = mk(<><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>);
export const Grid = mk(<><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>);
export const Heart = mk(<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z" />);
export const Sparkle = mk(<path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7Z" />);
export const Menu = mk(<path d="M4 7h16M4 12h16M4 17h16" />);
export const Minus = mk(<path d="M5 12h14" />);

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden>
        <defs>
          <linearGradient id="mlg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F5D27E" /><stop offset="1" stopColor="#D49A2A" />
          </linearGradient>
        </defs>
        <rect x="5" y="2.5" width="22" height="27" rx="4.5" fill="url(#mlg)" transform="rotate(-8 16 16)" />
        <path d="M10.5 21V11l5.5 6 5.5-6v10" fill="none" stroke="#1A1305" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-8 16 16)" />
      </svg>
      <span className="text-[19px] font-bold tracking-tight">Mintori</span>
    </span>
  );
}
