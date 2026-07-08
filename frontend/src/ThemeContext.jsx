import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const [mounted, setMounted] = useState(false);

  // Al montar, aplicar el tema guardado inmediatamente
  useEffect(() => {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    if (savedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    setTheme(savedTheme);
    setMounted(true);
    console.log('ThemeProvider montado con tema:', savedTheme);
  }, []);

  // Cuando cambia el tema, actualizar el DOM
  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    console.log('Aplicando tema:', theme);
    
    if (theme === 'dark') {
      root.classList.add('dark');
      document.body.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      document.body.style.colorScheme = 'light';
    }
    
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    console.log('Toggle llamado, tema actual:', theme);
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};
