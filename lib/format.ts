const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const usd0 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const fmtUSD = (n: number, whole = false) => (whole ? usd0 : usd).format(n);
export const fmtPct = (n: number) => `${Math.abs(n).toFixed(2)}%`;
export const fmtInt = (n: number) => n.toLocaleString("en-US");
export const fmtDate = (iso: string | number, opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }) =>
  new Date(iso).toLocaleDateString("en-US", { timeZone: "UTC", ...opts });

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
