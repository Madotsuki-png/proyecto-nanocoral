import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Shop() {
  const [productos, setProductos] = useState([]);
  const [categoriaFiltrada, setCategoriaFiltrada] = useState('');

  useEffect(() => {
    let url = 'http://localhost:5000/api/productos';
    if (categoriaFiltrada) {
      url += `?categoria=${categoriaFiltrada}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error("Error en catálogo:", err));
  }, [categoriaFiltrada]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Banner Principal de la Tienda */}
      <div className="bg-gradient-to-b from-purple-950/40 to-neutral-950 p-12 rounded-xl text-center border border-purple-900/30 mb-8 relative overflow-hidden">
        <h1 className="text-3xl font-extrabold text-purple-200 tracking-wide">Iluminación</h1>
        <p className="text-xs text-neutral-400 mt-2">Todo para el óptimo crecimiento y fluorescencia de tus LPS y blandos</p>
        <div className="mt-4 flex justify-center gap-3">
          <button onClick={() => setCategoriaFiltrada('')} className={`px-3 py-1.5 rounded text-xs transition ${!categoriaFiltrada ? 'bg-teal-500 text-neutral-950 font-bold' : 'bg-neutral-800 text-neutral-400'}`}>Todos</button>
          <button onClick={() => setCategoriaFiltrada('2')} className={`px-3 py-1.5 rounded text-xs transition ${categoriaFiltrada === '2' ? 'bg-teal-500 text-neutral-950 font-bold' : 'bg-neutral-800 text-neutral-400'}`}>Iluminación</button>
          <button onClick={() => setCategoriaFiltrada('1')} className={`px-3 py-1.5 rounded text-xs transition ${categoriaFiltrada === '1' ? 'bg-teal-500 text-neutral-950 font-bold' : 'bg-neutral-800 text-neutral-400'}`}>Corales</button>
        </div>
      </div>

      {/* Grid del Catálogo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {productos.map((prod) => (
          <div key={prod.id} className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 flex flex-col justify-between hover:border-neutral-700 transition">
            <div>
              <div className="w-full h-36 bg-neutral-900 rounded mb-4 flex items-center justify-center text-[10px] text-neutral-600 border border-neutral-900">
                [ {prod.imagen_url} ]
              </div>
              <h3 className="text-xs font-bold text-neutral-200 truncate">{prod.nombre}</h3>
              <p className="text-[11px] text-neutral-500 my-1 line-clamp-2 h-8 leading-tight">{prod.descripcion || 'Sin descripción disponible.'}</p>
            </div>
            <div>
              <p className="text-teal-400 font-bold text-sm mt-2">${prod.precio} MXN</p>
              <Link 
                to={`/product/${prod.id}`} 
                className="mt-3 block w-full text-center bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs py-2 rounded hover:bg-teal-600 hover:text-neutral-950 hover:font-bold transition"
              >
                Ver detalles
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Sección Informativa Adicional del Diseño */}
      <section className="mt-20 border-t border-neutral-800 pt-12 grid md:grid-cols-3 gap-8 text-neutral-400 text-xs">
        <div>
          <h4 className="text-neutral-200 font-semibold mb-2">¿Por qué es importante la iluminación?</h4>
          <p className="leading-relaxed text-neutral-500">La luz provee energía a las zooxantelas, microalgas que viven simbióticamente dentro del tejido del coral aportándoles hasta el 90% de sus requerimientos nutricionales.</p>
        </div>
        <div>
          <h4 className="text-neutral-200 font-semibold mb-2">Blanqueamiento coralino</h4>
          <p className="leading-relaxed text-neutral-500">Una iluminación deficiente o un exceso térmico puede estresar al coral, obligándolo a expulsar sus zooxantelas y perdiendo su color vivo, dejándolo vulnerable.</p>
        </div>
        <div>
          <h4 className="text-neutral-200 font-semibold mb-2">Fluorescencia</h4>
          <p className="leading-relaxed text-neutral-500">Los espectros de luz azul o actínica estimulan las proteínas fluorescentes del coral, un mecanismo natural de protección contra la radiación UV.</p>
        </div>
      </section>
    </div>
  );
}