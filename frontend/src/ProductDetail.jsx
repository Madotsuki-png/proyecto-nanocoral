import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import API_URL from './api.config';

export default function ProductDetail() {
  const { t } = useLanguage();
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [relacionados, setRelacionados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/productos/${id}`)
      .then((res) => { if (!res.ok) throw new Error('Error'); return res.json(); })
      .then((data) => {
        setProducto(data);
        return fetch(`${API_URL}/api/productos?categoria=${data.categoria_id}`);
      })
      .then((res) => res.json())
      .then((data) => {
        setRelacionados(data.filter((p) => p.id !== parseInt(id)).slice(0, 3));
        setLoading(false);
      })
      .catch((err) => { console.error(err); setLoading(false); });
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', paddingTop: '80px', color: 'var(--text-secondary)', fontSize: '12px', backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>{t('cargandoFicha')}</div>;
  if (!producto) return <div style={{ textAlign: 'center', paddingTop: '80px', fontSize: '12px', color: '#ef4444', backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>{t('prodNoEncontrado')}</div>;

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '16px', backgroundColor: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)', transition: 'all 0.3s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', padding: '24px', borderRadius: '12px', border: `1px solid var(--border-color)`, marginBottom: '48px' }}>
        <img src={producto.imagen_url} alt={producto.nombre} style={{ width: '100%', borderRadius: '8px' }} onError={(e) => { e.target.src = '/corales-default.jpg'; }} />

        <div>
          <span style={{ fontSize: '10px', color: 'var(--theme-color)', fontFamily: 'monospace', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t('stockStatus')}</span>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '4px', color: 'var(--text-primary)' }}>{producto.nombre}</h1>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--theme-color)', marginTop: '16px' }}>${producto.precio} MXN</p>
          
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '16px', lineHeight: '1.625' }}>
            {producto.descripcion || t('descDefault')}
          </p>

          <button style={{ marginTop: '24px', width: '100%', backgroundColor: 'var(--theme-color)', color: 'white', fontWeight: 'bold', padding: '12px', borderRadius: '4px', fontSize: '12px', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.target.style.backgroundColor = 'var(--theme-light)'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = 'var(--theme-color)'; }}>
            {t('btnCarrito')}
          </button>
        </div>
      </div>

      <section style={{ borderTop: `1px solid var(--border-color)`, paddingTop: '32px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>{t('tituloRelacionados')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {relacionados.map((item) => (
            <div key={item.id} style={{ backgroundColor: 'var(--bg-secondary)', border: `1px solid var(--border-color)`, borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.3s ease' }}>
              <img 
                src={item.imagen_url} 
                alt={item.nombre} 
                style={{ width: '100%', height: '96px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }}
                onError={(e) => { e.target.src = '/corales-default.jpg'; }}
              />
              <div>
                <h3 style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.nombre}</h3>
                <p style={{ color: 'var(--theme-color)', fontWeight: 'bold', fontSize: '12px', marginTop: '4px' }}>${item.price || item.precio} MXN</p>
              </div>
              <Link to={`/product/${item.id}`} style={{ marginTop: '8px', display: 'block', textAlign: 'center', backgroundColor: 'var(--bg-tertiary)', border: `1px solid var(--border-color)`, fontSize: '11px', paddingTop: '8px', paddingBottom: '8px', borderRadius: '4px', textDecoration: 'none', color: 'var(--text-secondary)', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.target.style.backgroundColor = 'var(--theme-color)'; e.target.style.color = 'white'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = 'var(--bg-tertiary)'; e.target.style.color = 'var(--text-secondary)'; }}>
                {t('btnVerArticulo')}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
