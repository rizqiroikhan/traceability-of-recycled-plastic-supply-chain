import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F7F8F3",
        forest: "#245B45",
        recycled: "#3D7EA6",
        amber: "#D99A3D",
        charcoal: "#24302B",
        mist: "#E8EEE8",
      },
      boxShadow: {
        card: "0 12px 30px rgba(36, 91, 69, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
