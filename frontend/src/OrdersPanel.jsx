import React, { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import ColorThemeSelector from './ColorThemeSelector';
import { CheckCircle, Truck, Clock } from 'lucide-react';

export default function OrdersPanel() {
  const { t } = useLanguage();
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDIENTE');

  useEffect(() => {
    fetchOrdenes();
  }, []);

  const fetchOrdenes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/ordenes');
      const data = await response.json();
      setOrdenes(data);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setLoading(false);
    }
  };

  const handleDespachar = async (ordenId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/ordenes/${ordenId}/despachar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        alert('Orden despachada correctamente');
        fetchOrdenes();
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al despachar la orden');
    }
  };

  const ordenesFiltradas = ordenes.filter(orden => orden.estado === filter);

  const getStatusIcon = (estado) => {
    switch(estado) {
      case 'PENDIENTE':
        return <Clock size={16} style={{ color: '#f59e0b' }} />;
      case 'DESPACHADO':
        return <Truck size={16} style={{ color: '#3b82f6' }} />;
      case 'ENTREGADO':
        return <CheckCircle size={16} style={{ color: '#10b981' }} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '40px', color: 'var(--text-primary)', backgroundColor: 'var(--bg-primary)', minHeight: '100vh', transition: 'all 0.3s ease', position: 'relative' }}>
      {/* Selector de Color */}
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <ColorThemeSelector />
      </div>

      <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--theme-color)', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Gestión de Órdenes
      </h1>

      {/* Filtros de estado */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
        {['PENDIENTE', 'DESPACHADO', 'ENTREGADO'].map(estado => (
          <button
            key={estado}
            onClick={() => setFilter(estado)}
            style={{
              padding: '10px 16px',
              borderRadius: '6px',
              border: filter === estado ? `2px solid var(--theme-color)` : `1px solid var(--border-color)`,
              backgroundColor: filter === estado ? 'var(--bg-secondary)' : 'transparent',
              color: filter === estado ? 'var(--theme-color)' : 'var(--text-secondary)',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textTransform: 'uppercase',
              fontSize: '12px'
            }}
            onMouseEnter={(e) => !filter === estado && (e.target.style.borderColor = 'var(--theme-color)')}
            onMouseLeave={(e) => !filter === estado && (e.target.style.borderColor = 'var(--border-color)')}
          >
            {estado}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Cargando órdenes...</p>
      ) : ordenesFiltradas.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>No hay órdenes en este estado</p>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {ordenesFiltradas.map(orden => (
            <div
              key={orden.id}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: `1px solid var(--border-color)`,
                borderRadius: '8px',
                padding: '20px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--theme-color)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    ORDEN #{orden.id}
                  </p>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    {orden.nombre_cliente}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    {getStatusIcon(orden.estado)}
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                      {orden.estado}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--theme-color)' }}>
                  ${orden.total} MXN
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px', paddingTop: '16px', borderTop: `1px solid var(--border-color)` }}>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Email</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{orden.email_cliente}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Teléfono</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{orden.telefono}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Dirección</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{orden.direccion}, {orden.ciudad}</p>
                </div>
              </div>

              {orden.estado === 'PENDIENTE' && (
                <button
                  onClick={() => handleDespachar(orden.id)}
                  style={{
                    backgroundColor: 'var(--theme-color)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--theme-light)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--theme-color)'}
                >
                  Despachar Orden
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
