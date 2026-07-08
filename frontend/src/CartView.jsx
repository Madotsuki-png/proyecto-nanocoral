import React from 'react';
import { useCart } from './CartContext';
import { useLanguage } from './LanguageContext';

const CartView = () => {
  const { carrito } = useCart();
  const { t } = useLanguage();

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', padding: '40px', color: 'var(--text-primary)', transition: 'all 0.3s ease' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#14b8a6', marginBottom: '24px' }}>
        {t('tituloCarrito')} ({carrito.length} {t('articulos')})
      </h2>
      
      {carrito.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>{t('carritoVacio')}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {carrito.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid var(--border-color)`, paddingBottom: '16px' }}>
              <img 
                src={`http://localhost:5000/images/${item.imagen_url}`} 
                alt={item.nombre} 
                style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '4px' }} 
              />
              <p style={{ flex: 1, marginLeft: '16px', color: 'var(--text-primary)' }}>{item.nombre}</p>
              <p style={{ color: '#10b981', fontWeight: 'bold' }}>${item.precio} MXN</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartView;
