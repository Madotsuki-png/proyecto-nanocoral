import React from 'react';
import { useCart } from './CartContext';
import { useLanguage } from './LanguageContext'; // 1. Importa el hook de traducción

const CartView = () => {
  const { carrito } = useCart();
  const { t } = useLanguage(); // 2. Extrae la función t

  return (
    <div className="bg-neutral-900 min-h-screen p-10 text-white">
      {/* 3. Usamos las nuevas traducciones */}
      <h2 className="text-2xl font-bold text-teal-400 mb-6">
        {t('tituloCarrito')} ({carrito.length} {t('articulos')})
      </h2>
      
      {carrito.length === 0 ? (
        <p className="text-neutral-500">{t('carritoVacio')}</p>
      ) : (
        <div className="space-y-4">
          {carrito.map((item, index) => (
            <div key={index} className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <img 
                src={`http://localhost:5000/images/${item.imagen_url}`} 
                alt={item.nombre} 
                className="w-16 h-16 object-cover rounded" 
              />
              <p className="flex-1 ml-4">{item.nombre}</p>
              <p className="text-emerald-400 font-bold">${item.precio} MXN</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartView;