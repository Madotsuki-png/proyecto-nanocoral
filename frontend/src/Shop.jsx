import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartContext';
import { useLanguage } from './LanguageContext';

function Shop() {
  const { t } = useLanguage();
  const { agregarAlCarrito } = useCart();
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/productos')
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
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-teal-400">
        <p className="text-xs uppercase tracking-widest animate-pulse">{t('cargandoCatalogo')}</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 min-h-screen px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold tracking-widest text-teal-400 uppercase mb-8 text-center">{t('tituloCatalogo')}</h1>
        
        <div className="flex justify-center gap-4 mb-10">
          <button onClick={() => setFiltro('todos')} className="text-neutral-400 hover:text-teal-400 uppercase text-xs font-bold tracking-widest transition">{t('filtroTodos')}</button>
          <button onClick={() => setFiltro(3)} className="text-neutral-400 hover:text-teal-400 uppercase text-xs font-bold tracking-widest transition">{t('filtroPeces')}</button>
          <button onClick={() => setFiltro(1)} className="text-neutral-400 hover:text-teal-400 uppercase text-xs font-bold tracking-widest transition">{t('filtroCorales')}</button>
          <button onClick={() => setFiltro(2)} className="text-neutral-400 hover:text-teal-400 uppercase text-xs font-bold tracking-widest transition">{t('filtroLamparas')}</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {productosFiltrados.map((producto) => (
            <div key={producto.id} className="bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden flex flex-col justify-between group hover:border-teal-500/50 transition duration-300">
              <div>
                <div className="h-56 bg-neutral-900 overflow-hidden relative">
                  <img 
                    src={`http://localhost:5000/images/${producto.imagen_url}`} 
                    alt={producto.nombre} 
                    onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                    style={{ width: '100%', height: '224px', objectFit: 'cover' }}
                  />
                </div>
                <div className="p-5">
                  <h2 className="text-sm font-semibold tracking-wider text-neutral-200 uppercase">{producto.nombre}</h2>
                </div>
              </div>
              
              <div className="p-5 pt-0 flex flex-col gap-2 mt-4 border-t border-neutral-900/50 pt-4">
                <p className="text-sm font-bold text-emerald-400">${producto.precio} MXN</p>
                
                <div className="flex gap-2">
                  <Link 
                    to={`/product/${producto.id}`} 
                    className="flex-1 text-center py-2 bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-teal-400 text-[10px] uppercase font-semibold rounded transition"
                  >
                    {t('btnDetalles')}
                  </Link>
                  <button 
                    onClick={() => agregarAlCarrito(producto)}
                    className="flex-1 py-2 bg-teal-600/20 border border-teal-500/50 text-teal-400 hover:bg-teal-600 hover:text-white text-[10px] uppercase font-semibold rounded transition"
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