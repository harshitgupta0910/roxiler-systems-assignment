/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        surface: "#f8fafc",
        card: "#ffffff",
        ink: "#0f172a",
        muted: "#64748b"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.08)",
        card: "0 12px 28px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};
