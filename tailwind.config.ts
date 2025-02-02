import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
        sans: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle at bottom center, var(--tw-gradient-stops))',
      },
      colors: {
        siso: {
          bg: "#121212",
          "bg-alt": "#1A1A1A",
          red: "#FF5722",
          orange: "#FFA726",
          text: "#E0E0E0",
          "text-bold": "#FFFFFF",
          "text-muted": "#9E9E9E",
          border: "#2A2A2A",
          "border-hover": "#3A3A3A",
        },
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
        gradient: {
          "0%, 100%": {
            backgroundSize: "200% 200%",
            backgroundPosition: "left center",
          },
          "50%": {
            backgroundSize: "200% 200%",
            backgroundPosition: "right center",
          },
        },
        glow: {
          "0%, 100%": {
            boxShadow: "0 0 15px rgba(255, 87, 34, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 25px rgba(255, 167, 38, 0.5)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        gradient: "gradient 8s linear infinite",
        glow: "glow 3s ease-in-out infinite",
        fadeIn: "fadeIn 0.5s ease-out forwards",
        "float-slow": "float-slow 20s ease-in-out infinite",
        "float-slower": "float-slower 25s ease-in-out infinite",
        "slide-in-right": "slide-in-right 0.3s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
        ping: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        float: "float 3s ease-in-out infinite",
        'wave-pulse': 'wave-pulse 4s ease-in-out infinite',
        rainbow: "rainbow 3s infinite linear",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: '#E0E0E0',
            h1: {
              color: '#FFFFFF',
            },
            h2: {
              color: '#FFFFFF',
            },
            h3: {
              color: '#FFFFFF',
            },
            strong: {
              color: '#FFFFFF',
            },
            a: {
              color: '#FF5722',
              '&:hover': {
                color: '#FFA726',
              },
            },
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;