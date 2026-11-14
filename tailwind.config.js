/** @type {import('tailwindcss').Config} */
const palette = {
  page: "#F5F6F2",      // warm off-white page
  surface: "#FFFFFF",   // cards
  surface2: "#EEF1EC",  // hovers, wells
  line: "#E1E5DF",      // borders
  ink: "#14211C",       // primary text
  muted: "#5E6E67",     // secondary text
  brand: "#0E6B52",     // deep packaging green
  brandDark: "#0A5240",
  brandSoft: "#E3F1EC",
  amber: "#F2A93B",     // highlight / badges
};

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        ...palette,
        // Legacy names used across older pages — mapped onto the new light theme.
        darkBg: palette.page,
        darkCard: palette.surface,
        lightText: palette.ink,
        mutedText: palette.muted,
        accent: palette.brand,
        accentDark: palette.brandDark,
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,33,28,.04), 0 4px 16px rgba(20,33,28,.06)",
        lift: "0 2px 4px rgba(20,33,28,.06), 0 12px 32px rgba(20,33,28,.12)",
      },
    },
  },
  plugins: [],
};
