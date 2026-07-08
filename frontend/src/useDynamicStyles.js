// Este archivo proporciona funciones auxiliares para estilos dinámicos basados en tema

export const getDynamicBg = (lightBg, darkBg) => {
  return {
    backgroundColor: lightBg === 'neutral-900' ? 'var(--bg-secondary)' : lightBg === 'neutral-950' ? 'var(--bg-tertiary)' : lightBg,
  };
};

export const getThemeStyles = (isDark) => {
  return {
    // Backgrounds
    bgPrimary: isDark ? '#111827' : '#ffffff',
    bgSecondary: isDark ? '#1f2937' : '#f5f5f5',
    bgTertiary: isDark ? '#374151' : '#e5e5e5',
    
    // Text
    textPrimary: isDark ? '#f3f4f6' : '#1a1a1a',
    textSecondary: isDark ? '#d1d5db' : '#666666',
    
    // Borders
    borderColor: isDark ? '#4b5563' : '#d4d4d8',
  };
};
