import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';
import { Moon, Sun } from 'lucide-react';
import ThemeToggleTest from './ThemeToggleTest';
import ColorThemeSelector from './ColorThemeSelector';

export default function Navbar() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const { t, lang, setLang } = useLanguage();
  const rol = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 24px',
      backgroundColor: 'var(--navbar-bg)',
      borderBottom: `1px solid var(--navbar-border)`,
      position: 'sticky',
      top: 0,
      zIndex: 50,
      transition: 'background-color 0.3s ease, border-color 0.3s ease',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      <Link to="/" style={{
        fontSize: '18px',
        fontWeight: 'bold',
        letterSpacing: '0.125em',
        color: 'var(--accent-color)',
        textTransform: 'uppercase',
        textDecoration: 'none'
      }}>
        NanoCoral
      </Link>
      
      <div style={{
        display: 'flex',
        gap: '16px',
        fontSize: '12px',
        fontWeight: '500',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <ThemeToggleTest />
        <ColorThemeSelector />

        <Link to="/" style={{
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          transition: 'color 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.color = 'var(--accent-light)'}
        onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
        >
          {t('inicio')}
        </Link>
        <Link to="/shop" style={{
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          transition: 'color 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.color = 'var(--accent-light)'}
        onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
        >
          {t('tienda')}
        </Link>
        
        {rol !== 'ADMIN' && (
          <Link to="/cart" style={{
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.color = 'var(--accent-light)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
          >
            {t('carrito')} ({cart ? cart.length : 0})
          </Link>
        )}

        {rol === 'CLIENT' && (
          <Link to="/mis-ordenes" style={{
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.color = 'var(--accent-light)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
          >
            Mis Órdenes
          </Link>
        )}

        {rol === 'ADMIN' && (
          <Link to="/admin" style={{
            color: 'var(--accent-color)',
            fontWeight: 'bold',
            borderBottom: `1px solid var(--accent-color)`,
            textDecoration: 'none'
          }}>
            {t('panelAdmin')}
          </Link>
        )}

        <select 
          value={lang} 
          onChange={(e) => setLang(e.target.value)}
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '10px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease, color 0.3s ease'
          }}
        >
          <option value="es">Español</option>
          <option value="en">English</option>
          <option value="de">Deutsch</option>
        </select>

        {rol ? (
          <button onClick={handleLogout} style={{
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '4px 12px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '10px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#991b1b'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
          >
            {t('salir')}
          </button>
        ) : (
          <Link to="/login" style={{
            backgroundColor: 'var(--accent-color)',
            color: 'var(--button-text)',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '10px',
            textDecoration: 'none',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent-light)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--accent-color)'}
          >
            {t('login')}
          </Link>
        )}
      </div>
    </nav>
  );
}
