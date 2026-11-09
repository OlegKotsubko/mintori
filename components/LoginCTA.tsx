"use client";
import { useApp } from "./Providers";
import { cx } from "@/lib/format";

export function LoginCTA({ children, variant = "outline", className }: { children: React.ReactNode; variant?: "outline" | "primary" | "secondary"; className?: string }) {
  const { openLogin } = useApp();
  const cls = variant === "primary" ? "btn-primary" : variant === "secondary" ? "btn-secondary" : "btn-outline-gold";
  return <button onClick={openLogin} className={cx(cls, className)}>{children}</button>;
}
