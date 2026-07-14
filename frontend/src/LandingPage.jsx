import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from './LanguageContext';

export default function LandingPage() {
  const { t } = useLanguage();
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const miNumero = "525566783099";

  useEffect(() => {
    axios.get('http://localhost:5000/api/resenas')
      .then(response => {
        setResenas(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al traer reseñas:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)', transition: 'all 0.3s ease' }}>
      
      {/* Sección Hero */}
      <section style={{ position: 'relative', padding: '96px 24px', textAlign: 'center', maxWidth: '48rem', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--accent-color)' }}>
          NanoCoral
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '16px', maxWidth: '28rem', lineHeight: '1.625' }}>
          {t('descripcionHero')}
        </p>
        <Link to="/shop" style={{ marginTop: '32px', padding: '12px 24px', backgroundColor: 'var(--theme-color)', color: 'white', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', borderRadius: '4px', textDecoration: 'none', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.target.style.backgroundColor = 'var(--theme-light)'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = 'var(--theme-color)'; }}>
          {t('btnExplorar')}
        </Link>
      </section>

      {/* Sección de Servicios */}
      <div style={{ padding: '40px 64px', maxWidth: '72rem', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
        
        {/* Columna Izquierda: Textos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          <section style={{ borderLeft: `4px solid var(--theme-color)`, paddingLeft: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--theme-color)' }}>{t('tituloDiseno')}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>{t('descDiseno')}</p>
            <a href={`https://wa.me/${miNumero}?text=Hola, quiero info sobre diseño y montaje.`} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: 'var(--theme-color)', color: 'white', padding: '8px 24px', borderRadius: '4px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.target.style.backgroundColor = 'var(--theme-light)'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = 'var(--theme-color)'; }}>
              {t('btnContactar')}
            </a>
          </section>

          <section style={{ borderLeft: `4px solid var(--theme-color)`, paddingLeft: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--theme-color)' }}>{t('tituloMantenimiento')}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>{t('descMantenimiento')}</p>
            <a href={`https://wa.me/${miNumero}?text=Hola, quiero info sobre mantenimiento.`} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: 'var(--theme-color)', color: 'white', padding: '8px 24px', borderRadius: '4px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.target.style.backgroundColor = 'var(--theme-light)'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = 'var(--theme-color)'; }}>
              {t('btnContactar')}
            </a>
          </section>
        </div>

        {/* Columna Derecha: Imagen */}
        <div style={{ display: 'flex', justifyContent: 'center' }} className="md:flex">
          <img 
            src="/pez-payaso.jpg" 
            alt="Pez Payaso NanoCoral" 
            style={{ borderRadius: '8px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', width: '100%', maxWidth: '28rem', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* Sección de Reseñas */}
      <section style={{ backgroundColor: 'var(--footer-bg)', padding: '64px 24px', borderTop: `1px solid var(--border-color)`, transition: 'all 0.3s ease' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', color: 'var(--footer-text)', marginBottom: '48px' }}>
            {t('tituloOpiniones')}
          </h2>
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', animation: 'pulse 2s infinite' }}>
              {t('cargandoTestimonios')}
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
              {resenas.map((resena) => (
                <div key={resena.id} style={{ backgroundColor: 'var(--bg-secondary)', border: `1px solid var(--theme-color)`, padding: '24px', borderRadius: '8px', transition: 'all 0.3s ease' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontStyle: 'italic' }}>"{resena.comentario}"</p>
                  <div style={{ marginTop: '24px', borderTop: `1px solid var(--border-color)`, paddingTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-primary)', fontSize: '12px', fontWeight: '500' }}>{resena.usuario}</span>
                    <span style={{ color: 'var(--theme-color)', fontSize: '12px' }}>{'★'.repeat(resena.calificacion)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
