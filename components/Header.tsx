"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/format";
import { useApp } from "./Providers";
import { SearchBar } from "./SearchBar";
import { Cart, Grid, Logo, Moon, Search, Sun, User } from "./Icons";

const NAV = [
  { href: "/set/celestial-tides", label: "Pokémon" },
  { href: "/set/2026-apex-chrome-football", label: "Football" },
  { href: "/set/2025-26-summit-select-basketball", label: "Basketball" },
  { href: "/set/2026-heritage-diamond-baseball", label: "Baseball" },
  { href: "/#releases", label: "Releases" },
];

export function Header() {
  const path = usePathname();
  const { cartCount, openLogin, theme, toggleTheme } = useApp();
  const home = path === "/";
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/85 backdrop-blur-xl">
        <div className="container flex h-16 items-center gap-4 lg:gap-8">
          <Link href="/" aria-label="Mintori home"><Logo /></Link>
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <Link key={n.label} href={n.href} className={cx("rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-surface hover:text-ink", path === n.href && "text-ink")}>{n.label}</Link>
            ))}
          </nav>
          <div className={cx("ml-auto hidden max-w-sm flex-1 md:block", home && "md:hidden")}><SearchBar /></div>
          <div className={cx("ml-auto flex items-center gap-1", !home && "md:ml-0")}>
            <Link href="/" className="btn-ghost h-10 w-10 px-0 md:hidden" aria-label="Search"><Search /></Link>
            <Link href="/collection" className="btn-ghost hidden h-10 md:inline-flex"><Grid size={17} /> My collection</Link>
            <button onClick={toggleTheme} className="btn-ghost h-10 w-10 px-0" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
              {theme === "dark" ? <Sun /> : <Moon />}
            </button>
            <Link href="/cart" className="btn-ghost relative h-10 w-10 px-0" aria-label={`Cart, ${cartCount} items`}>
              <Cart />
              {cartCount > 0 && <span className="num absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-gold-ink">{cartCount}</span>}
            </Link>
            <button onClick={openLogin} className="btn-secondary ml-1 hidden h-10 sm:inline-flex">Sign in</button>
          </div>
        </div>
      </header>

      {/* Mobile bottom tab bar (thumb-reachable on 375px) */}
      <nav aria-label="Mobile" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
        <ul className="grid grid-cols-4">
          {[
            { href: "/", label: "Home", Icon: Search },
            { href: "/collection", label: "Collection", Icon: Grid },
            { href: "/cart", label: "Cart", Icon: Cart },
          ].map(({ href, label, Icon }) => (
            <li key={href}>
              <Link href={href} className={cx("flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium", path === href ? "text-gold-text" : "text-muted")}>
                <Icon size={20} />{label}
              </Link>
            </li>
          ))}
          <li>
            <button onClick={openLogin} className="flex h-14 w-full flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-muted"><User size={20} />Account</button>
          </li>
        </ul>
      </nav>
    </>
  );
}
