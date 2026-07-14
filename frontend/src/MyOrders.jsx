import React, { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import ColorThemeSelector from './ColorThemeSelector';
import { Star, CheckCircle, Truck, Clock, AlertCircle, RefreshCw } from 'lucide-react';

export default function MyOrders() {
  const { t } = useLanguage();
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    comentario: '',
    calificacion: 5
  });
  const [reloading, setReloading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Recarga INMEDIATA cuando se abre el componente
    console.log('MyOrders montado, recargando órdenes...');
    fetchOrdenes();
    
    // Recarga cada 2 segundos
    const interval = setInterval(() => {
      console.log('Recargando órdenes automáticamente...');
      fetchOrdenes();
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchOrdenes = async () => {
    try {
      const usuario_id = localStorage.getItem('userId');
      console.log('📦 Buscando órdenes para usuario ID:', usuario_id);
      
      if (!usuario_id) {
        console.log('❌ No hay usuario_id en localStorage');
        setLoading(false);
        return;
      }

      // Agregar timestamp para evitar caché del navegador
      const timestamp = new Date().getTime();
      const response = await fetch(`http://localhost:5000/api/ordenes/cliente/${usuario_id}?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      const data = await response.json();
      console.log('✅ Órdenes recibidas:', data);
      setOrdenes(data);
      setLastUpdate(new Date());
      setLoading(false);
      setReloading(false);
    } catch (err) {
      console.error('❌ Error al obtener órdenes:', err);
      setLoading(false);
      setReloading(false);
    }
  };

  const handleReload = () => {
    console.log('🔄 Recarga manual solicitada');
    setReloading(true);
    fetchOrdenes();
  };

  const handleConfirmarRecepcion = async (ordenId) => {
    try {
      console.log('📍 Confirmando recepción de orden:', ordenId);
      const response = await fetch(`http://localhost:5000/api/ordenes/${ordenId}/confirmar-recepcion`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        alert('¡Recepción confirmada! Ahora puedes dejar tu opinión.');
        console.log('✅ Recepción confirmada');
        fetchOrdenes();
        setSelectedOrder(null);
      }
    } catch (err) {
      console.error('❌ Error:', err);
      alert('Error al confirmar recepción');
    }
  };

  const handleSubmitReview = async (ordenId) => {
    if (!reviewForm.comentario.trim()) {
      alert('Por favor escribe tu opinión');
      return;
    }

    try {
      const userName = localStorage.getItem('userName');
      console.log('📝 Enviando reseña para orden:', ordenId);
      const response = await fetch('http://localhost:5000/api/resenas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: userName,
          comentario: reviewForm.comentario,
          calificacion: reviewForm.calificacion,
          orden_id: ordenId
        })
      });

      if (response.ok) {
        alert('¡Gracias por tu opinión!');
        setReviewForm({ comentario: '', calificacion: 5 });
        setSelectedOrder(null);
        fetchOrdenes();
      }
    } catch (err) {
      console.error('❌ Error:', err);
      alert('Error al agregar reseña');
    }
  };

  const getStatusIcon = (estado) => {
    switch(estado) {
      case 'PENDIENTE':
        return <Clock size={20} style={{ color: '#f59e0b' }} />;
      case 'DESPACHADO':
        return <Truck size={20} style={{ color: '#3b82f6' }} />;
      case 'ENTREGADO':
        return <CheckCircle size={20} style={{ color: '#10b981' }} />;
      default:
        return null;
    }
  };

  const getStatusMessage = (estado) => {
    switch(estado) {
      case 'PENDIENTE':
        return 'Tu pedido está siendo preparado...';
      case 'DESPACHADO':
        return '¡Tu pedido está en camino! Por favor confirma cuando lo recibas.';
      case 'ENTREGADO':
        return '¡Pedido entregado! Cuéntanos tu experiencia.';
      default:
        return '';
    }
  };

  return (
    <div style={{ padding: '40px', color: 'var(--text-primary)', backgroundColor: 'var(--bg-primary)', minHeight: '100vh', transition: 'all 0.3s ease', position: 'relative' }}>
      {/* Selector de Color */}
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <ColorThemeSelector />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '32px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--theme-color)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Mis Órdenes
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Aquí puedes ver el estado de tus pedidos
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Última actualización: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={handleReload}
          disabled={reloading}
          style={{
            backgroundColor: 'var(--theme-color)',
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: reloading ? 'not-allowed' : 'pointer',
            fontSize: '12px',
            textTransform: 'uppercase',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            opacity: reloading ? 0.6 : 1
          }}
          onMouseEnter={(e) => !reloading && (e.target.style.backgroundColor = 'var(--theme-light)')}
          onMouseLeave={(e) => !reloading && (e.target.style.backgroundColor = 'var(--theme-color)')}
          title="Recarga para ver actualizaciones"
        >
          <RefreshCw size={16} style={{ animation: reloading ? 'spin 1s linear infinite' : 'none' }} />
          {reloading ? 'Cargando...' : 'Recargar'}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {loading ? (
        <p>Cargando órdenes...</p>
      ) : ordenes.length === 0 ? (
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '32px', borderRadius: '8px', textAlign: 'center', border: `1px solid var(--border-color)` }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>No tienes órdenes aún</p>
          <a href="/shop" style={{ color: 'var(--theme-color)', textDecoration: 'none', fontWeight: '600' }}>
            Empezar a comprar →
          </a>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {ordenes.map(orden => (
            <div
              key={orden.id}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: `2px solid ${
                  orden.estado === 'DESPACHADO' ? 'var(--theme-color)' : 'var(--border-color)'
                }`,
                borderRadius: '8px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => setSelectedOrder(orden.id === selectedOrder ? null : orden.id)}
              onMouseEnter={(e) => {
                if (orden.estado === 'DESPACHADO') {
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Alerta si está despachado y sin confirmar */}
              {orden.estado === 'DESPACHADO' && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  backgroundColor: 'var(--theme-color)',
                  color: 'white',
                  padding: '4px 12px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  animation: 'pulse 2s infinite'
                }}>
                  ⚠️ Acción Requerida
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px', paddingRight: '120px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    ORDEN #{orden.id}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    {getStatusIcon(orden.estado)}
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {orden.estado}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--theme-color)' }}>
                  ${orden.total} MXN
                </p>
              </div>

              {/* Mensaje de estado */}
              <div style={{
                backgroundColor: 'var(--bg-primary)',
                padding: '12px',
                borderRadius: '4px',
                marginBottom: '16px',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                borderLeft: `4px solid var(--theme-color)`
              }}>
                {getStatusMessage(orden.estado)}
              </div>

              {/* Detalles expandibles */}
              {selectedOrder === orden.id && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid var(--border-color)` }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                    <div>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Fecha de Orden</p>
                      <p style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                        {new Date(orden.fecha_orden).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>

                  {orden.estado === 'DESPACHADO' && (
                    <div style={{
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      padding: '16px',
                      borderRadius: '4px',
                      marginBottom: '16px',
                      border: `1px solid var(--theme-color)`,
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'start'
                    }}>
                      <AlertCircle size={20} style={{ color: 'var(--theme-color)', flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--theme-color)', marginBottom: '4px' }}>
                          ¡Tu pedido llegó!
                        </p>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          Por favor confirma la recepción de tu pedido haciendo clic en el botón de abajo.
                        </p>
                      </div>
                    </div>
                  )}

                  {orden.estado === 'DESPACHADO' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirmarRecepcion(orden.id);
                      }}
                      style={{
                        backgroundColor: 'var(--theme-color)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginRight: '8px',
                        transition: 'background-color 0.2s',
                        fontSize: '13px',
                        textTransform: 'uppercase'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--theme-light)'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--theme-color)'}
                    >
                      ✓ Confirmar que ya llegó
                    </button>
                  )}

                  {orden.estado === 'ENTREGADO' && (
                    <div style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: '4px', marginTop: '16px' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', color: 'var(--text-primary)' }}>
                        🌟 Cuéntanos tu experiencia
                      </h3>
                      
                      <textarea
                        placeholder="¿Qué te pareció tu compra? Comparte tu opinión..."
                        value={reviewForm.comentario}
                        onChange={(e) => setReviewForm({...reviewForm, comentario: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '4px',
                          border: `1px solid var(--border-color)`,
                          backgroundColor: 'var(--bg-secondary)',
                          color: 'var(--text-primary)',
                          minHeight: '100px',
                          marginBottom: '12px',
                          fontFamily: 'inherit',
                          resize: 'vertical',
                          fontSize: '13px'
                        }}
                      />

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600' }}>Calificación:</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              onClick={(e) => {
                                e.stopPropagation();
                                setReviewForm({...reviewForm, calificacion: star});
                              }}
                              type="button"
                              style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'transform 0.2s'
                              }}
                              onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            >
                              <Star
                                size={24}
                                fill={star <= reviewForm.calificacion ? 'var(--theme-color)' : 'none'}
                                color={star <= reviewForm.calificacion ? 'var(--theme-color)' : 'var(--border-color)'}
                              />
                            </button>
                          ))}
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {reviewForm.calificacion} de 5 estrellas
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubmitReview(orden.id);
                        }}
                        style={{
                          backgroundColor: 'var(--theme-color)',
                          color: 'white',
                          border: 'none',
                          padding: '12px 24px',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                          fontSize: '13px',
                          textTransform: 'uppercase'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--theme-light)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--theme-color)'}
                      >
                        Enviar Opinión
                      </button>
                    </div>
                  )}

                  {orden.estado === 'ENTREGADO' && reviewForm.comentario === '' && (
                    <div style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      padding: '12px',
                      borderRadius: '4px',
                      marginTop: '12px',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      borderLeft: `4px solid #10b981`
                    }}>
                      ✓ Este pedido fue entregado. Ayuda a otros compartiendo tu experiencia.
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
