export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export interface ThemeSettings {
  colors: ThemeColors;
  fonts: {
    primary: string;
    secondary: string;
    heading: string;
  };
  layout: {
    headerStyle: string;
    footerStyle: string;
  };
}

export const defaultTheme: ThemeSettings = {
  colors: {
    primary: '#7c3aed',
    secondary: '#3b82f6',
    accent: '#10b981',
    background: '#ffffff'
  },
  fonts: {
    primary: 'Inter',
    secondary: 'Noto Sans Devanagari',
    heading: 'Inter'
  },
  layout: {
    headerStyle: 'modern',
    footerStyle: 'minimal'
  }
};

export const colorPresets = [
  { 
    name: 'पर्पल थीम', 
    colors: { primary: '#7c3aed', secondary: '#3b82f6', accent: '#10b981', background: '#ffffff' }
  },
  { 
    name: 'ब्लू थीम', 
    colors: { primary: '#3b82f6', secondary: '#1d4ed8', accent: '#06b6d4', background: '#ffffff' }
  },
  { 
    name: 'ग्रीन थीम', 
    colors: { primary: '#10b981', secondary: '#059669', accent: '#84cc16', background: '#ffffff' }
  },
  { 
    name: 'ऑरेंज थीम', 
    colors: { primary: '#f59e0b', secondary: '#d97706', accent: '#ef4444', background: '#ffffff' }
  },
  { 
    name: 'पिंक थीम', 
    colors: { primary: '#ec4899', secondary: '#be185d', accent: '#f97316', background: '#ffffff' }
  }
];

export function applyTheme(theme: ThemeSettings) {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  
  // Apply color variables
  root.style.setProperty('--theme-primary', theme.colors.primary);
  root.style.setProperty('--theme-secondary', theme.colors.secondary);
  root.style.setProperty('--theme-accent', theme.colors.accent);
  root.style.setProperty('--theme-background', theme.colors.background);
  
  // Apply font variables
  root.style.setProperty('--font-primary', theme.fonts.primary);
  root.style.setProperty('--font-secondary', theme.fonts.secondary);
  root.style.setProperty('--font-heading', theme.fonts.heading);
  
  // Store theme in localStorage
  localStorage.setItem('website-theme', JSON.stringify(theme));
}

export function getStoredTheme(): ThemeSettings | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem('website-theme');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function initializeTheme() {
  const storedTheme = getStoredTheme();
  if (storedTheme) {
    applyTheme(storedTheme);
  } else {
    applyTheme(defaultTheme);
  }
}
