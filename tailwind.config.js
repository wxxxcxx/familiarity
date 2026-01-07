/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./**/*.tsx"],
  theme: {
    extend: {
      colors: {
        // Semantic Token Mapping
        main: "var(--color-bg-main)",
        surface: "var(--color-bg-surface)",
        input: "var(--color-bg-input)",

        "text-primary": "var(--color-text-main)",
        "text-muted": "var(--color-text-muted)",
        "text-inverted": "var(--color-text-inverted)",

        border: "var(--color-border-main)",
        "border-highlight": "var(--color-border-highlight)",

        "star-fill": "var(--color-star-fill)",
        "star-text": "var(--color-star-text)"
      }
    }
  },
  plugins: []
}