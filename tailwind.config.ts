import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'agro-green': '#059669', // Pour l'Agriculture [cite: 19]
                'agro-gold': '#FBBF24',  // Pour l'Élevage [cite: 20]
                'agro-blue': '#3B82F6',  // Pour la Pêche [cite: 21]
                'sidebar-bg': '#0f172b',
            },
        },
    },
    plugins: [],
};
export default config;