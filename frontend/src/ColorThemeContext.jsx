import React, { createContext, useContext, useState, useEffect } from 'react';

const ColorThemeContext = createContext();

export function ColorThemeProvider({ children }) {
  const [colorTheme, setColorTheme] = useState(() => {
    if (typeof window === 'undefined') return 'default';
    const savedTheme = localStorage.getItem('colorTheme');
    return savedTheme || 'default';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remover todas las clases de tema
    root.classList.remove('theme-green', 'theme-blue', 'theme-purple');
    
    // Agregar la clase del tema actual (solo si no es default)
    if (colorTheme !== 'default') {
      root.classList.add(`theme-${colorTheme}`);
    }
    
    localStorage.setItem('colorTheme', colorTheme);
    console.log('Tema de color cambiado a:', colorTheme);
  }, [colorTheme]);

  const changeColorTheme = (theme) => {
    setColorTheme(theme);
  };

  return (
    <ColorThemeContext.Provider value={{ colorTheme, changeColorTheme }}>
      {children}
    </ColorThemeContext.Provider>
  );
}

export const useColorTheme = () => {
  const context = useContext(ColorThemeContext);
  if (!context) {
    throw new Error('useColorTheme debe usarse dentro de ColorThemeProvider');
  }
  return context;
};
