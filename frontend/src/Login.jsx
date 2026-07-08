import React, { useState } from 'react';
import axios from 'axios';
import { useLanguage } from './LanguageContext';

export default function Login() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', { email, password });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.rol);
      
      alert(t('alertaBienvenido'));

      if (res.data.rol === 'ADMIN') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard-comprador';
      }
      
    } catch (err) {
      alert(t('alertaError'));
    }
  };

  return (
    <div style={{ padding: '80px 16px', color: 'var(--text-primary)', display: 'flex', justifyContent: 'center', backgroundColor: 'var(--bg-primary)', minHeight: '100vh', transition: 'all 0.3s ease' }}>
      <form onSubmit={handleLogin} style={{ backgroundColor: 'var(--bg-secondary)', padding: '32px', borderRadius: '8px', width: '320px', display: 'flex', flexDirection: 'column', gap: '16px', border: `1px solid var(--border-color)` }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{t('tituloLogin')}</h2>
        <input 
          type="email" 
          placeholder={t('placeholderEmail')} 
          style={{ padding: '8px', color: 'var(--text-primary)', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', border: `1px solid var(--border-color)`, fontSize: '14px' }}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder={t('placeholderPass')} 
          style={{ padding: '8px', color: 'var(--text-primary)', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', border: `1px solid var(--border-color)`, fontSize: '14px' }}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" style={{ backgroundColor: 'var(--accent-color)', padding: '8px', borderRadius: '4px', fontWeight: 'bold', color: 'var(--button-text)', fontSize: '14px', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent-light)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--accent-color)'}>
          {t('btnEntrar')}
        </button>
      </form>
    </div>
  );
}
