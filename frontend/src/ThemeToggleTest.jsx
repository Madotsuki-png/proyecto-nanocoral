import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggleTest() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const hasDark = document.documentElement.classList.contains('dark');
    setIsDark(hasDark);
    console.log('Al montar, html tiene clase dark:', hasDark);
  }, []);

  const handleToggle = () => {
    console.log('Antes del toggle, isDark:', isDark);
    
    const root = document.documentElement;
    
    if (isDark) {
      root.classList.remove('dark');
      setIsDark(false);
      localStorage.setItem('theme', 'light');
      console.log('Removido dark, nuevo isDark:', false);
    } else {
      root.classList.add('dark');
      setIsDark(true);
      localStorage.setItem('theme', 'dark');
      console.log('Agregado dark, nuevo isDark:', true);
    }
    
    console.log('HTML clases después:', document.documentElement.className);
  };

  return (
    <button 
      onClick={handleToggle}
      style={{
        padding: '10px 14px',
        backgroundColor: isDark ? '#374151' : '#d1d5db',
        color: isDark ? '#fbbf24' : '#000',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'background-color 0.2s, color 0.2s'
      }}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
