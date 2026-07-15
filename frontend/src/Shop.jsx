import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartContext';
import { useLanguage } from './LanguageContext';
import API_URL from './api.config';

const getImageUrl = (imagen_url) => {
  if (!imagen_url) return '/corales-default.jpg';
  if (imagen_url.startsWith('http')) return imagen_url; // URL de Cloudinary
  return `/${imagen_url}`; // Nombre de archivo, sirve desde frontend/public
};

function Shop() {
  const { t } = useLanguage();
  const { agregarAlCarrito } = useCart();
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/api/productos`)
      .then(response => {
        setProductos(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al conectar con la base de datos:", error);
        setLoading(false);
      });
  }, []);

  const productosFiltrados = filtro === 'todos' 
    ? productos 
    : productos.filter(p => p.categoria_id === filtro);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)', color: 'var(--theme-color)', transition: 'all 0.3s ease' }}>
        <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', animation: 'pulse 2s infinite' }}>{t('cargandoCatalogo')}</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', padding: '48px 24px', transition: 'all 0.3s ease' }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '0.05em', color: 'var(--theme-color)', textTransform: 'uppercase', marginBottom: '32px', textAlign: 'center' }}>{t('tituloCatalogo')}</h1>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '40px', flexWrap: 'wrap' }}>
          <button onClick={() => setFiltro('todos')} style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.05em', transition: 'color 0.2s', cursor: 'pointer', background: 'none', border: 'none' }} onMouseEnter={(e) => e.target.style.color = 'var(--theme-color)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>{t('filtroTodos')}</button>
          <button onClick={() => setFiltro(3)} style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.05em', transition: 'color 0.2s', cursor: 'pointer', background: 'none', border: 'none' }} onMouseEnter={(e) => e.target.style.color = 'var(--theme-color)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>{t('filtroPeces')}</button>
          <button onClick={() => setFiltro(1)} style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.05em', transition: 'color 0.2s', cursor: 'pointer', background: 'none', border: 'none' }} onMouseEnter={(e) => e.target.style.color = 'var(--theme-color)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>{t('filtroCorales')}</button>
          <button onClick={() => setFiltro(2)} style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.05em', transition: 'color 0.2s', cursor: 'pointer', background: 'none', border: 'none' }} onMouseEnter={(e) => e.target.style.color = 'var(--theme-color)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>{t('filtroLamparas')}</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}>
          {productosFiltrados.map((producto) => (
            <div key={producto.id} style={{ backgroundColor: 'var(--bg-secondary)', border: `1px solid var(--border-color)`, borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--theme-color)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}>
              <div>
                <div style={{ height: '224px', backgroundColor: 'var(--bg-tertiary)', overflow: 'hidden', position: 'relative' }}>
  <img 
    src={getImageUrl(producto.imagen_url)} 
    alt={producto.nombre} 
    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
    onError={(e) => { e.target.src = '/corales-default.jpg'; }}
  />
</div>
                <div style={{ padding: '20px' }}>
                  <h2 style={{ fontSize: '14px', fontWeight: '600', letterSpacing: '0.05em', color: 'var(--text-primary)', textTransform: 'uppercase' }}>{producto.nombre}</h2>
                </div>
              </div>
              
              <div style={{ padding: '20px', paddingTop: 0, display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px', borderTop: `1px solid var(--border-color)`, paddingTop: '16px' }}>
                <p style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--theme-color)' }}>${producto.precio} MXN</p>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link 
                    to={`/product/${producto.id}`} 
                    style={{ flex: 1, textAlign: 'center', padding: '8px 16px', backgroundColor: 'var(--bg-tertiary)', border: `1px solid var(--border-color)`, color: 'var(--text-secondary)', fontSize: '10px', textTransform: 'uppercase', fontWeight: '600', borderRadius: '4px', textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer' }}
                    onMouseEnter={(e) => { e.target.style.color = 'var(--theme-color)'; e.target.style.borderColor = 'var(--theme-color)'; }}
                    onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; e.target.style.borderColor = 'var(--border-color)'; }}
                  >
                    {t('btnDetalles')}
                  </Link>
                  <button 
                    onClick={() => agregarAlCarrito(producto)}
                    style={{ flex: 1, padding: '8px 16px', backgroundColor: 'transparent', border: `1px solid var(--theme-color)`, color: 'var(--theme-color)', fontSize: '10px', textTransform: 'uppercase', fontWeight: '600', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = 'var(--theme-color)'; e.target.style.color = 'white'; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = 'var(--theme-color)'; }}
                  >
                    {t('btnAgregar')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Shop;
