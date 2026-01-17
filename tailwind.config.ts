import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Elder Scrolls inspired color palette
        "tes-gold": "#C9A959",
        "tes-gold-dark": "#8B7355",
        "tes-dark": "#1A1A1A",
        "tes-darker": "#0D0D0D",
        "tes-parchment": "#F4E4BC",
        "tes-red": "#8B0000",
      },
    },
  },
  plugins: [],
}

export default config
