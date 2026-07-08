import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from './LanguageContext'; // Importar el hook

export default function ProductDetail() {
  const { t } = useLanguage(); // Extraer t
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [relacionados, setRelacionados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/productos/${id}`)
      .then((res) => { if (!res.ok) throw new Error('Error'); return res.json(); })
      .then((data) => {
        setProducto(data);
        return fetch(`http://localhost:5000/api/productos?categoria=${data.categoria_id}`);
      })
      .then((res) => res.json())
      .then((data) => {
        setRelacionados(data.filter((p) => p.id !== parseInt(id)).slice(0, 3));
        setLoading(false);
      })
      .catch((err) => { console.error(err); setLoading(false); });
  }, [id]);

  if (loading) return <div className="text-center py-20 text-neutral-500 text-xs">{t('cargandoFicha')}</div>;
  if (!producto) return <div className="text-center py-20 text-xs text-red-400">{t('prodNoEncontrado')}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10 items-center bg-neutral-950 p-6 rounded-xl border border-neutral-800 mb-12">
        <img src={`http://localhost:5000/images/${producto.imagen_url}`} alt={producto.nombre} />

        <div>
          <span className="text-[10px] text-teal-400 font-mono tracking-widest uppercase">{t('stockStatus')}</span>
          <h1 className="text-2xl font-bold mt-1 text-white">{producto.nombre}</h1>
          <p className="text-xl font-bold text-teal-400 mt-4">${producto.precio} MXN</p>
          
          <p className="text-xs text-neutral-400 mt-4 leading-relaxed">
            {producto.descripcion || t('descDefault')}
          </p>

          <button className="mt-6 w-full bg-white text-neutral-950 font-bold py-2.5 rounded text-xs hover:bg-teal-500 hover:text-neutral-950 transition">
            {t('btnCarrito')}
          </button>
        </div>
      </div>

      <section className="border-t border-neutral-800 pt-8">
        <h2 className="text-sm font-bold mb-4 uppercase tracking-wider text-neutral-400">{t('tituloRelacionados')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {relacionados.map((item) => (
            <div key={item.id} className="bg-neutral-950 border border-neutral-800 rounded p-3 flex flex-col justify-between">
              <img 
                src={`http://localhost:5000/images/${item.imagen_url}`} 
                alt={item.nombre} 
                className="w-full h-24 object-cover rounded mb-2"
              />
              <div>
                <h3 className="text-xs font-semibold text-neutral-300 truncate">{item.nombre}</h3>
                <p className="text-teal-400 font-bold text-xs mt-1">${item.price || item.precio} MXN</p>
              </div>
              <Link to={`/product/${item.id}`} className="mt-2 block w-full text-center bg-neutral-900 border border-neutral-800 text-[11px] py-1 rounded text-neutral-400 hover:bg-neutral-800 transition">
                {t('btnVerArticulo')}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}