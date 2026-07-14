import React, { useState } from 'react';
import { useColorTheme } from './ColorThemeContext';
import { useTheme } from './ThemeContext';
import { Palette } from 'lucide-react';

export default function ColorThemeSelector() {
  const { colorTheme, changeColorTheme } = useColorTheme();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { name: 'default', label: 'Original', color: theme === 'dark' ? '#ffffff' : '#000000' },
    { name: 'green', label: 'Verde', color: '#14b8a6' },
    { name: 'blue', label: 'Azul', color: '#3b82f6' },
    { name: 'purple', label: 'Morado', color: '#a855f7' }
  ];

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '8px 12px',
          backgroundColor: 'transparent',
          border: `1px solid var(--border-color)`,
          borderRadius: '6px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--text-primary)',
          transition: 'all 0.2s',
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}
        onMouseEnter={(e) => e.target.style.borderColor = 'var(--theme-color)'}
        onMouseLeave={(e) => e.target.style.borderColor = 'var(--border-color)'}
        title="Cambiar tema de color"
      >
        <Palette size={16} />
        Color
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            backgroundColor: 'var(--bg-secondary)',
            border: `1px solid var(--border-color)`,
            borderRadius: '8px',
            padding: '12px',
            zIndex: 1000,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            minWidth: '180px'
          }}
        >
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: '600' }}>
            Seleccionar color
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {themes.map((themeOption) => (
              <button
                key={themeOption.name}
                onClick={() => {
                  changeColorTheme(themeOption.name);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  backgroundColor: colorTheme === themeOption.name ? 'var(--bg-tertiary)' : 'transparent',
                  border: `2px solid ${colorTheme === themeOption.name ? themeOption.color : 'var(--border-color)'}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: 'var(--text-primary)',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--bg-tertiary)';
                  e.target.style.borderColor = themeOption.color;
                }}
                onMouseLeave={(e) => {
                  if (colorTheme !== themeOption.name) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.borderColor = 'var(--border-color)';
                  }
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: themeOption.color,
                    borderRadius: '4px',
                    flexShrink: 0,
                    border: themeOption.name === 'default' ? `1px solid var(--border-color)` : 'none'
                  }}
                />
                <span>{themeOption.label}</span>
                {colorTheme === themeOption.name && <span style={{ marginLeft: 'auto' }}>✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
