import React, { useState } from 'react';
import axios from 'axios';
import { useLanguage } from './LanguageContext';
import { useNavigate } from 'react-router-dom';
import ColorThemeSelector from './ColorThemeSelector';
import API_URL from './api.config';

export default function Login() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Estado para login
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  // Estado para registro
  const [registerForm, setRegisterForm] = useState({
    nombre: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/login`, {
        email: loginForm.email,
        password: loginForm.password
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.rol);
      localStorage.setItem('userId', res.data.id);
      localStorage.setItem('userName', res.data.nombre);
      
      alert(t('alertaBienvenido'));

      if (res.data.rol === 'ADMIN') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/';
      }
      setLoading(false);
    } catch (err) {
      alert(err.response?.data?.error || t('alertaError'));
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/registro`, {
        nombre: registerForm.nombre,
        email: registerForm.email,
        password: registerForm.password,
        passwordConfirm: registerForm.passwordConfirm
      });

      alert('Registro exitoso. Por favor inicia sesión.');
      setIsLogin(true);
      setRegisterForm({
        nombre: '',
        email: '',
        password: '',
        passwordConfirm: ''
      });
      setLoading(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Error al registrar');
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 16px', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-primary)', minHeight: '100vh', transition: 'all 0.3s ease', gap: '16px' }}>
      {/* Selector de Color */}
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <ColorThemeSelector />
      </div>

      <div style={{ width: '100%', maxWidth: '400px' }}>
        
        {/* Toggle entre Login y Registro */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', backgroundColor: 'var(--bg-secondary)', padding: '4px', borderRadius: '8px' }}>
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: isLogin ? 'var(--theme-color)' : 'transparent',
              color: isLogin ? 'white' : 'var(--text-secondary)',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {t('tituloLogin') || 'Iniciar Sesión'}
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: !isLogin ? 'var(--theme-color)' : 'transparent',
              color: !isLogin ? 'white' : 'var(--text-secondary)',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Registrarse
          </button>
        </div>

        {/* Formulario de Login */}
        {isLogin ? (
          <form onSubmit={handleLogin} style={{ backgroundColor: 'var(--bg-secondary)', padding: '32px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '16px', border: `1px solid var(--border-color)` }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>{t('tituloLogin')}</h2>
            
            <input 
              type="email" 
              placeholder={t('placeholderEmail') || 'Email'} 
              style={{ padding: '12px', color: 'var(--text-primary)', borderRadius: '4px', backgroundColor: 'var(--bg-primary)', border: `1px solid var(--border-color)`, fontSize: '14px' }}
              value={loginForm.email}
              onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
              required
            />
            <input 
              type="password" 
              placeholder={t('placeholderPass') || 'Contraseña'} 
              style={{ padding: '12px', color: 'var(--text-primary)', borderRadius: '4px', backgroundColor: 'var(--bg-primary)', border: `1px solid var(--border-color)`, fontSize: '14px' }}
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              required
            />
            <button type="submit" disabled={loading} style={{ backgroundColor: loading ? 'var(--border-color)' : 'var(--theme-color)', padding: '12px', borderRadius: '4px', fontWeight: 'bold', color: 'white', fontSize: '14px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s', opacity: loading ? 0.6 : 1 }} onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = 'var(--theme-light)')} onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = 'var(--theme-color)')}>
              {loading ? 'Cargando...' : t('btnEntrar')}
            </button>
          </form>
        ) : (
          /* Formulario de Registro */
          <form onSubmit={handleRegister} style={{ backgroundColor: 'var(--bg-secondary)', padding: '32px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '16px', border: `1px solid var(--border-color)` }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>Crear Cuenta</h2>
            
            <input 
              type="text" 
              placeholder="Nombre completo" 
              style={{ padding: '12px', color: 'var(--text-primary)', borderRadius: '4px', backgroundColor: 'var(--bg-primary)', border: `1px solid var(--border-color)`, fontSize: '14px' }}
              value={registerForm.nombre}
              onChange={(e) => setRegisterForm({...registerForm, nombre: e.target.value})}
              required
            />
            
            <input 
              type="email" 
              placeholder="Email" 
              style={{ padding: '12px', color: 'var(--text-primary)', borderRadius: '4px', backgroundColor: 'var(--bg-primary)', border: `1px solid var(--border-color)`, fontSize: '14px' }}
              value={registerForm.email}
              onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
              required
            />
            
            <input 
              type="password" 
              placeholder="Contraseña (mínimo 6 caracteres)" 
              style={{ padding: '12px', color: 'var(--text-primary)', borderRadius: '4px', backgroundColor: 'var(--bg-primary)', border: `1px solid var(--border-color)`, fontSize: '14px' }}
              value={registerForm.password}
              onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
              required
            />
            
            <input 
              type="password" 
              placeholder="Confirmar contraseña" 
              style={{ padding: '12px', color: 'var(--text-primary)', borderRadius: '4px', backgroundColor: 'var(--bg-primary)', border: `1px solid var(--border-color)`, fontSize: '14px' }}
              value={registerForm.passwordConfirm}
              onChange={(e) => setRegisterForm({...registerForm, passwordConfirm: e.target.value})}
              required
            />
            
            <button type="submit" disabled={loading} style={{ backgroundColor: loading ? 'var(--border-color)' : 'var(--theme-color)', padding: '12px', borderRadius: '4px', fontWeight: 'bold', color: 'white', fontSize: '14px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s', opacity: loading ? 0.6 : 1 }} onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = 'var(--theme-light)')} onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = 'var(--theme-color)')}>
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>
        )}

        {/* Mensaje informativo */}
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '16px' }}>
          {isLogin ? '¿No tienes cuenta? Haz clic en Registrarse' : '¿Ya tienes cuenta? Haz clic en Iniciar Sesión'}
        </p>
      </div>
    </div>
  );
}
