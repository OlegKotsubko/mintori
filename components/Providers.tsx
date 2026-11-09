"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { LoginModal } from "./LoginModal";
import { Check } from "./Icons";

type Ctx = {
  cartCount: number;
  addToCart: (label: string) => void;
  openLogin: () => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
};
const AppCtx = createContext<Ctx | null>(null);
export const useApp = () => {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp outside <Providers>");
  return c;
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [cartCount, setCart] = useState(3);
  const [login, setLogin] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("light") ? "light" : "dark");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("light", next === "light");
      try { localStorage.setItem("mintori-theme", next); } catch {}
      return next;
    });
  }, []);

  const addToCart = useCallback((label: string) => {
    setCart((n) => n + 1);
    setToast(label);
    window.setTimeout(() => setToast(null), 2600);
  }, []);

  return (
    <AppCtx.Provider value={{ cartCount, addToCart, openLogin: () => setLogin(true), theme, toggleTheme }}>
      {children}
      <LoginModal open={login} onClose={() => setLogin(false)} />
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
        {toast && (
          <div className="pointer-events-auto flex animate-fade-in items-center gap-3 rounded-xl border border-line bg-elevated px-4 py-3 text-sm shadow-lift">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-up/15 text-up"><Check size={14} strokeWidth={3} /></span>
            <span><b className="font-semibold">Added to cart</b> · {toast}</span>
            <a href="/cart" className="font-semibold text-gold-text hover:underline">View cart</a>
          </div>
        )}
      </div>
    </AppCtx.Provider>
  );
}
