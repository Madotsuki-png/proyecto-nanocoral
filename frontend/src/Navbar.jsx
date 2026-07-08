import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { useLanguage } from './LanguageContext';

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
    <nav className="flex justify-between items-center px-6 py-4 bg-neutral-950 border-b border-neutral-800 sticky top-0 z-50">
      <Link to="/" className="text-lg font-bold tracking-widest text-teal-400 uppercase">NanoCoral</Link>
      
      <div className="space-x-6 text-xs font-medium uppercase tracking-wider flex items-center">
        <Link to="/" className="hover:text-teal-400 transition text-neutral-300">{t('inicio')}</Link>
        <Link to="/shop" className="hover:text-teal-400 transition text-neutral-300">{t('tienda')}</Link>
        
        {rol !== 'ADMIN' && (
          <Link to="/cart" className="hover:text-teal-400 transition text-neutral-300">
            {t('carrito')} ({cart ? cart.length : 0})
          </Link>
        )}

        {rol === 'ADMIN' && (
          <Link to="/admin" className="text-teal-400 hover:text-teal-300 font-bold border-b border-teal-400">
            {t('panelAdmin')}
          </Link>
        )}

        <select 
          value={lang} 
          onChange={(e) => setLang(e.target.value)}
          className="bg-neutral-800 text-white rounded p-1 text-[10px] uppercase"
        >
          <option value="es">Español</option>
          <option value="en">English</option>
          <option value="de">Deutsch</option>
        </select>

        {rol ? (
          <button onClick={handleLogout} className="bg-red-900 px-3 py-1 rounded text-white text-[10px] hover:bg-red-800">
            {t('salir')}
          </button>
        ) : (
          <Link to="/login" className="bg-teal-700 px-3 py-1 rounded text-white text-[10px] hover:bg-teal-600">
            {t('login')}
          </Link>
        )}
      </div>
    </nav>
  );
}