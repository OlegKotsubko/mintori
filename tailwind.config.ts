import type { Config } from "tailwindcss";

/**
 * Mintori design tokens.
 * Every color is a CSS variable (see app/globals.css) so the dark (default)
 * and light themes share one set of utility classes.
 */
const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1rem", lg: "2rem" }, screens: { "2xl": "1320px" } },
    extend: {
      colors: {
        bg: v("bg"),
        surface: v("surface"),
        elevated: v("elevated"),
        line: v("line"),
        ink: v("ink"),
        muted: v("muted"),
        faint: v("faint"),
        gold: { DEFAULT: v("gold"), ink: v("gold-ink"), soft: v("gold-soft"), text: v("gold-text") },
        up: v("up"),
        down: v("down"),
        info: v("info"),
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: { card: "14px", xl2: "20px" },
      boxShadow: {
        lift: "0 1px 0 rgb(255 255 255 / 0.04) inset, 0 12px 32px -12px rgb(0 0 0 / 0.55)",
        gold: "0 0 0 1px rgb(var(--gold) / 0.35), 0 10px 30px -10px rgb(var(--gold) / 0.45)",
      },
      keyframes: {
        shimmer: { "100%": { transform: "translateX(100%)" } },
        holo: { "0%": { backgroundPosition: "0% 50%" }, "100%": { backgroundPosition: "200% 50%" } },
        "fade-in": { from: { opacity: "0", transform: "translateY(6px) scale(.98)" }, to: { opacity: "1", transform: "none" } },
      },
      animation: {
        shimmer: "shimmer 1.6s infinite",
        holo: "holo 6s linear infinite",
        "fade-in": "fade-in .18s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
