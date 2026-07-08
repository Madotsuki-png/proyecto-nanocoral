import React, { useState } from 'react';
import axios from 'axios';
import { useLanguage } from './LanguageContext'; // 1. Importa el hook

export default function Login() {
  const { t } = useLanguage(); // 2. Extrae la función t
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', { email, password });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.rol);
      
      alert(t('alertaBienvenido')); // Traducción en alerta

      if (res.data.rol === 'ADMIN') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard-comprador';
      }
      
    } catch (err) {
      alert(t('alertaError')); // Traducción en alerta
    }
  };

  return (
    <div className="p-20 text-white flex justify-center">
      <form onSubmit={handleLogin} className="bg-neutral-800 p-8 rounded-lg w-80 flex flex-col gap-4">
        <h2 className="text-xl font-bold">{t('tituloLogin')}</h2>
        <input 
          type="email" 
          placeholder={t('placeholderEmail')} 
          className="p-2 text-white rounded bg-neutral-700" // Añadí un bg para mejor contraste
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder={t('placeholderPass')} 
          className="p-2 text-white rounded bg-neutral-700"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-teal-600 p-2 rounded font-bold">
          {t('btnEntrar')}
        </button>
      </form>
    </div>
  );
}