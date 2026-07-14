import React, { useState } from 'react';
import { useCart } from './CartContext';
import { useLanguage } from './LanguageContext';
import { useNavigate } from 'react-router-dom';
import ColorThemeSelector from './ColorThemeSelector';
import { Trash2 } from 'lucide-react';
import API_URL from './api.config';

const CartView = () => {
  const { carrito, setCarrito } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isCheckout, setIsCheckout] = useState(false);

  const handleRemoveItem = (index) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index);
    setCarrito(nuevoCarrito);
  };

  const total = carrito.reduce((sum, item) => sum + item.precio, 0);

  const handleProceedCheckout = () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    setIsCheckout(true);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', padding: '40px', color: 'var(--text-primary)', transition: 'all 0.3s ease', position: 'relative' }}>
      {/* Selector de Color */}
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <ColorThemeSelector />
      </div>

      {!isCheckout ? (
        <>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--theme-color)', marginBottom: '24px' }}>
            {t('tituloCarrito')} ({carrito.length} {t('articulos')})
          </h2>
          
          {carrito.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>{t('carritoVacio')}</p>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                {carrito.map((item, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', border: `1px solid var(--border-color)` }}>
                    <img 
                      src={`${API_URL}/images/${item.imagen_url}`} 
                      alt={item.nombre} 
                      style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '4px' }} 
                    />
                    <div style={{ flex: 1, marginLeft: '16px' }}>
                      <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{item.nombre}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>${item.precio} MXN</p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(index)}
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#991b1b'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                    >
                      <Trash2 size={16} />
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>

              {/* Resumen de compra */}
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '24px', borderRadius: '8px', border: `1px solid var(--border-color)`, marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '16px' }}>
                  <span>Subtotal:</span>
                  <span style={{ fontWeight: 'bold' }}>${total} MXN</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '16px' }}>
                  <span>Envío:</span>
                  <span style={{ fontWeight: 'bold' }}>Gratis</span>
                </div>
                <div style={{ borderTop: `1px solid var(--border-color)`, paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', color: 'var(--theme-color)' }}>
                  <span>Total:</span>
                  <span>${total} MXN</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button
                  onClick={() => navigate('/shop')}
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    color: 'var(--theme-color)',
                    border: `2px solid var(--theme-color)`,
                    borderRadius: '4px',
                    padding: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.target.style.backgroundColor = 'var(--theme-color)'; e.target.style.color = 'white'; }}
                  onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = 'var(--theme-color)'; }}
                >
                  Seguir Comprando
                </button>
                <button
                  onClick={handleProceedCheckout}
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--theme-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--theme-light)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--theme-color)'}
                >
                  Proceder al Pago
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <CheckoutForm carrito={carrito} total={total} onBack={() => setIsCheckout(false)} />
      )}
    </div>
  );
};

function CheckoutForm({ carrito, total, onBack }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    estado_postal: '',
    numero_tarjeta: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const usuario_id = localStorage.getItem('userId');
      if (!usuario_id) {
        alert('Debes estar logueado para hacer una compra');
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/ordenes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: parseInt(usuario_id),
          productos: carrito,
          total,
          nombre_cliente: formData.nombre,
          email_cliente: formData.email,
          telefono: formData.telefono,
          direccion: formData.direccion,
          ciudad: formData.ciudad,
          estado_postal: formData.estado_postal,
          numero_tarjeta: formData.numero_tarjeta
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Error al procesar la orden');
        return;
      }

      alert('¡Compra realizada exitosamente!');
      localStorage.removeItem('carrito');
      navigate('/');
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert('Error al procesar la compra');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--theme-color)', marginBottom: '24px' }}>
        Formulario de Compra
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-secondary)', padding: '24px', borderRadius: '8px', border: `1px solid var(--border-color)` }}>
        <input 
          type="text"
          placeholder="Nombre completo"
          value={formData.nombre}
          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
          style={{ padding: '12px', borderRadius: '4px', border: `1px solid var(--border-color)`, backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
          required
        />
        
        <input 
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          style={{ padding: '12px', borderRadius: '4px', border: `1px solid var(--border-color)`, backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
          required
        />

        <input 
          type="tel"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={(e) => setFormData({...formData, telefono: e.target.value})}
          style={{ padding: '12px', borderRadius: '4px', border: `1px solid var(--border-color)`, backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
          required
        />

        <input 
          type="text"
          placeholder="Dirección"
          value={formData.direccion}
          onChange={(e) => setFormData({...formData, direccion: e.target.value})}
          style={{ padding: '12px', borderRadius: '4px', border: `1px solid var(--border-color)`, backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
          required
        />

        <input 
          type="text"
          placeholder="Ciudad"
          value={formData.ciudad}
          onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
          style={{ padding: '12px', borderRadius: '4px', border: `1px solid var(--border-color)`, backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
          required
        />

        <input 
          type="text"
          placeholder="Código postal"
          value={formData.estado_postal}
          onChange={(e) => setFormData({...formData, estado_postal: e.target.value})}
          style={{ padding: '12px', borderRadius: '4px', border: `1px solid var(--border-color)`, backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
          required
        />

        <input 
          type="text"
          placeholder="Número de tarjeta (últimos 4 dígitos)"
          value={formData.numero_tarjeta}
          onChange={(e) => setFormData({...formData, numero_tarjeta: e.target.value.slice(0, 4)})}
          maxLength="4"
          style={{ padding: '12px', borderRadius: '4px', border: `1px solid var(--border-color)`, backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
          required
        />

        <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '16px', borderRadius: '4px', marginTop: '16px' }}>
          <div style={{ fontSize: '14px', marginBottom: '8px' }}>Total a pagar: <span style={{ fontWeight: 'bold', color: 'var(--theme-color)' }}>${total} MXN</span></div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              color: 'var(--theme-color)',
              border: `2px solid var(--theme-color)`,
              borderRadius: '4px',
              padding: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = 'var(--theme-color)'; e.target.style.color = 'white'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = 'var(--theme-color)'; }}
          >
            Volver
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              backgroundColor: loading ? 'var(--border-color)' : 'var(--theme-color)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '12px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              opacity: loading ? 0.6 : 1
            }}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = 'var(--theme-light)')}
            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = 'var(--theme-color)')}
          >
            {loading ? 'Procesando...' : 'Completar Compra'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CartView;
