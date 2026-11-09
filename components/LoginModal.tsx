"use client";
import { useEffect, useRef, useState } from "react";
import { Logo, X } from "./Icons";

const Apple = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9-.1 0-2.7-1-2.7-4.1ZM13.9 5c.7-.9 1.2-2 1-3.2-1 0-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.1 1.2.1 2.3-.6 3.1-1.5Z" /></svg>
);
const Google = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
    <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.7 3.3-8Z" />
    <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.7H2.1v2.8A11 11 0 0 0 12 23Z" />
    <path fill="#FBBC05" d="M5.7 14a6.6 6.6 0 0 1 0-4.2V7H2.1a11 11 0 0 0 0 9.9L5.7 14Z" />
    <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.1-3.1A11 11 0 0 0 2.1 7l3.6 2.8C6.6 7.3 9.1 5.4 12 5.4Z" />
  </svg>
);

/** Login modal — centered dialog on desktop, bottom sheet on mobile. */
export function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const first = useRef<HTMLButtonElement>(null);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [wasOpen, setWasOpen] = useState(open);

  // Reset the "link sent" view each time the modal opens.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setSent(false);
  }

  useEffect(() => {
    if (!open) return;
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  if (!open) return null;
  const valid = /^\S+@\S+\.\S+$/.test(email);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="presentation">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby="login-title"
        className="relative w-full animate-fade-in rounded-t-3xl border border-line bg-surface p-6 pb-8 shadow-lift sm:max-w-[400px] sm:rounded-3xl sm:p-8">
        <button onClick={onClose} aria-label="Close" className="btn-ghost absolute right-3 top-3 h-10 w-10 px-0"><X /></button>
        <Logo />
        <h2 id="login-title" className="mt-6 text-2xl font-bold tracking-tight">Sign in to Mintori</h2>
        <p className="mt-1.5 text-sm text-muted">Track your collection, set price alerts and check out faster.</p>

        {sent ? (
          <div className="mt-6 rounded-xl border border-line bg-elevated p-4 text-sm">
            <p className="font-semibold">Check your inbox</p>
            <p className="mt-1 text-muted">We sent a sign-in link to <span className="text-ink">{email}</span>. It expires in 15 minutes.</p>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-2.5">
              <button ref={first} className="btn h-12 bg-ink text-bg hover:opacity-90"><Apple /> Continue with Apple</button>
              <button className="btn-secondary h-12"><Google /> Continue with Google</button>
            </div>
            <div className="my-5 flex items-center gap-3 text-xs text-faint"><span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" /></div>
            <form onSubmit={(e) => { e.preventDefault(); if (valid) setSent(true); }} className="grid gap-2.5">
              <label htmlFor="login-email" className="text-xs font-semibold text-muted">Email</label>
              <input id="login-email" type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="input h-12" />
              <button type="submit" disabled={!valid} className="btn-primary mt-1 h-12">Continue with email</button>
            </form>
          </>
        )}
        <p className="mt-5 text-center text-xs leading-relaxed text-faint">
          By continuing you agree to Mintori’s <a href="#" className="underline hover:text-ink">Terms</a> and <a href="#" className="underline hover:text-ink">Privacy Policy</a>. US residents 18+ only.
        </p>
      </div>
    </div>
  );
}
