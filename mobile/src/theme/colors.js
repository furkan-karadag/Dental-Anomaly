export const CLASS_COLORS_HEX = {
    rose: '#f43f5e',
    amber: '#f59e0b',
    emerald: '#10b981',
    blue: '#3b82f6',
    purple: '#a855f7',
    cyan: '#06b6d4',
    fuchsia: '#d946ef',
    indigo: '#6366f1',
    teal: '#14b8a6',
    lime: '#84cc16',
    pink: '#ec4899',
    orange: '#f97316'
};

export const getClassColorHex = (className) => {
    if (!className) return CLASS_COLORS_HEX.amber;
    const normalized = className.toLowerCase().trim();
    
    if (normalized.includes('caries') || normalized.includes('carries')) return CLASS_COLORS_HEX.rose;
    if (normalized.includes('periapical lesion') || normalized.includes('lesion')) return CLASS_COLORS_HEX.purple;
    if (normalized.includes('filling')) return CLASS_COLORS_HEX.emerald;
    if (normalized.includes('crown')) return CLASS_COLORS_HEX.blue;
    if (normalized.includes('impacted tooth') || normalized.includes('impacted')) return CLASS_COLORS_HEX.cyan;
    if (normalized.includes('missing teeth') || normalized.includes('missing')) return CLASS_COLORS_HEX.amber;
    
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
        hash = (hash << 5) - hash + normalized.charCodeAt(i);
        hash |= 0;
    }
    const COLORS_ARRAY = Object.values(CLASS_COLORS_HEX);
    const index = Math.abs(hash) % COLORS_ARRAY.length;
    return COLORS_ARRAY[index];
};

export const translateClass = (className) => {
    if (!className) return className;
    const normalized = className.toLowerCase().trim();
    if (normalized.includes('caries') || normalized.includes('carries')) return 'Çürük';
    if (normalized.includes('periapical lesion') || normalized.includes('lesion')) return 'Periapikal Lezyon';
    if (normalized.includes('filling')) return 'Dolgu';
    if (normalized.includes('crown')) return 'Kuron';
    if (normalized.includes('impacted tooth') || normalized.includes('impacted')) return 'Gömülü Diş';
    if (normalized.includes('missing teeth') || normalized.includes('missing')) return 'Eksik Diş';
    return className;
};

export const COLORS = {
    primary: "#136dec",
    backgroundLight: "#f6f7f8",
    backgroundDark: "#101822",
    surfaceLight: "#ffffff",
    surfaceDark: "#1c2431",
    slate900: "#0f172a",
    slate500: "#64748b",
    slate400: "#94a3b8",
    slate100: "#f1f5f9",
    green500: "#22c55e",
    green100: "#dcfce7",
    green700: "#15803d",
    blue100: "#dbeafe",
    blue700: "#1d4ed8",
    red500: "#ef4444",
    red100: "#fee2e2",
    red700: "#b91c1c",
    purple100: "#f3e8ff",
    purple700: "#7e22ce",
    purple700: "#7e22ce",
    white: "#ffffff",
    // New Design Colors
    medicalBlue: "#0066FF",
    medicalSoft: "#F0F7FF",
    clinicalGrey: "#F8FAFC",
    clinicalBorder: "#E2E8F0",
    abscessOrange: "#F97316",
    orange50: "#fff7ed",
    emerald50: "#ecfdf5",
    emerald600: "#059669",
};
