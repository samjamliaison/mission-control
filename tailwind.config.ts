import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        'sans': ['var(--font-geist)', 'system-ui', 'sans-serif'],
        'display': ['Clash Display', 'var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
        'heading': ['var(--font-plus-jakarta)', 'var(--font-geist)', 'system-ui', 'sans-serif'],
        'body': ['var(--font-geist)', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'command': {
          background: '#09090b',
          surface: 'rgba(255, 255, 255, 0.03)',
          'surface-elevated': 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.06)',
          'border-bright': 'rgba(255, 255, 255, 0.12)',
          accent: '#06b6d4',
          'accent-muted': 'rgba(6, 182, 212, 0.5)',
          success: '#22c55e',
          warning: '#f59e0b',
          danger: '#ef4444',
          text: 'rgba(255, 255, 255, 0.9)',
          'text-muted': 'rgba(255, 255, 255, 0.5)',
          'text-dim': 'rgba(255, 255, 255, 0.3)',
        },
        'spec': {
          background: '#09090b',
          surface: 'rgba(255, 255, 255, 0.03)',
          'surface-hover': 'rgba(255, 255, 255, 0.05)',
          'border-default': 'rgba(255, 255, 255, 0.06)',
          'border-bright': 'rgba(255, 255, 255, 0.12)',
          'text-primary': 'rgba(255, 255, 255, 0.9)',
          'text-secondary': 'rgba(255, 255, 255, 0.5)',
          'text-dim': 'rgba(255, 255, 255, 0.3)',
          accent: '#06b6d4',
          success: '#22c55e',
          warning: '#f59e0b',
          danger: '#ef4444',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "glow": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--command-accent) / 0.2)" },
          "50%": { boxShadow: "0 0 30px hsl(var(--command-accent) / 0.4)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "scale-up": {
          "from": { opacity: "0", transform: "scale(0.8)" },
          "to": { opacity: "1", transform: "scale(1)" },
        },
        "text-shimmer": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "status-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.6" },
          "50%": { transform: "scale(1.2)", opacity: "0.2" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "slide-up": "slide-up 0.6s ease-out",
        "glow": "glow 2s ease-in-out infinite alternate",
        "float": "float 3s ease-in-out infinite",
        "scale-up": "scale-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "text-shimmer": "text-shimmer 3s ease-in-out infinite",
        "status-pulse": "status-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config