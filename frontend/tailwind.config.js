/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '375px',    // iPhone SE, small phones
      'sm': '640px',    // Large phones landscape
      'md': '768px',    // iPad Mini / iPad Air portrait
      'lg': '1024px',   // iPad Pro 12.9" / landscape tablets
      'xl': '1280px',   // MacBook Air 13"
      '2xl': '1440px',  // MacBook Air 15" / large desktops
    },
    extend: {
      colors: {
        primary: "#0284C7",    // Bright Sky / Moviy Blue
        secondary: "#0369A1",  // Deep Ocean Blue
        accent: "#38BDF8",     // Soft Ice Blue Accent
        bgWarm: "#F0F7FF",     // Soft Ice White
        charcoal: "#0F172A",   // Deep Slate Navy Text
        dark: "#0F172A",       // Deep Ocean Navy (Navbar & Footer)
        light: "#F0F7FF",
        greyText: "#64748B",   // Steel Gray Text
        borderGrey: "#E2E8F0"  // Soft Light Gray Border
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        serif: ['Nunito', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 10px 30px rgba(0,0,0,0.15)',
        'nav': '0 4px 15px rgba(0,0,0,0.05)',
      }
    },
  },
  plugins: [],
}
