/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#0a0f1e",
          900: "#0d1326",
          800: "#111827",
          700: "#1a2236",
          600: "#243046",
        },
        accent: {
          DEFAULT: "#3b82f6",
          light: "#60a5fa",
          dark: "#2563eb",
        },
        success: "#22c55e",
        warning: "#f97316",
        danger: "#ef4444",
        glioma: "#ef4444",
        meningioma: "#f97316",
        notumor: "#22c55e",
        pituitary: "#3b82f6",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "slide-in-left": "slideInLeft 0.5s ease-out forwards",
        "slide-in-right": "slideInRight 0.5s ease-out forwards",
        "pulse-ring": "pulseRing 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite",
        "pulse-ring-delay": "pulseRing 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) 0.4s infinite",
        "scan-line": "scanLine 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "count-up": "countUp 2s ease-out forwards",
        "progress-bar": "progressBar 1s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.5)", opacity: "1" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
        scanLine: {
          "0%, 100%": { transform: "translateY(-100%)" },
          "50%": { transform: "translateY(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(59,130,246,0.3), 0 0 20px rgba(59,130,246,0.1)" },
          "100%": { boxShadow: "0 0 20px rgba(59,130,246,0.5), 0 0 60px rgba(59,130,246,0.2)" },
        },
        progressBar: {
          "0%": { width: "0%" },
          "100%": { width: "var(--target-width)" },
        },
      },
    },
  },
  plugins: [],
};
