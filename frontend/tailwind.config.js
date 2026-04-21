/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // Legacy
                "primary": "#2463eb",
                "background-light": "#f6f6f8",
                "background-dark": "#111621",
                "surface-light": "#ffffff",
                "surface-dark": "#1e293b",
                "text-main": "#0f172a",
                "text-sub": "#64748b",

                // New Mockup Theme
                "inverse-surface": "#1e293b",
                "surface-container-highest": "#cbd5e1",
                "primary-fixed-dim": "#bfdbfe",
                "secondary-fixed-dim": "#cbd5e1",
                "secondary-fixed": "#e2e8f0",
                "secondary": "#64748b",
                "on-surface-variant": "#64748b",
                "on-primary-fixed": "#1e3a8a",
                "on-primary": "#ffffff",
                "background": "#f6f6f8",
                "on-tertiary-fixed-variant": "#b45309",
                "surface-bright": "#ffffff",
                "on-background": "#0f172a",
                "on-surface": "#0f172a",
                "surface-variant": "#f1f5f9",
                "error": "#ef4444",
                "primary-fixed": "#dbeafe",
                "surface-container": "#f1f5f9",
                "inverse-on-surface": "#f8fafc",
                "on-primary-container": "#1e40af",
                "surface-container-high": "#e2e8f0",
                "outline": "#e2e8f0",
                "surface-container-lowest": "#ffffff",
                "surface-container-low": "#f8fafc",
                "outline-variant": "#cbd5e1",
                "tertiary-fixed": "#fef3c7",
                "on-tertiary-container": "#92400e",
                "error-container": "#fee2e2",
                "tertiary-container": "#fef3c7",
                "inverse-primary": "#93c5fd",
                "on-secondary-container": "#0f172a",
                "on-tertiary-fixed": "#451a03",
                "on-secondary-fixed": "#0f172a",
                "on-primary-fixed-variant": "#1d4ed8",
                "surface-dim": "#f1f5f9",
                "surface-tint": "#2463eb",
                "on-secondary-fixed-variant": "#334155",
                "on-secondary": "#ffffff",
                "on-error": "#ffffff",
                "primary-container": "#dbeafe",
                "tertiary": "#f59e0b",
                "on-tertiary": "#ffffff",
                "secondary-container": "#f1f5f9",
                "tertiary-fixed-dim": "#fde68a",
                "on-error-container": "#991b1b",
                "surface": "#ffffff"
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.375rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "2xl": "1rem",
                "full": "9999px"
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries'),
    ],
}
