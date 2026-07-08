import React, { useState } from 'react';
import axios from 'axios';
import { useLanguage } from './LanguageContext';

export default function AdminPanel() {
  const { t } = useLanguage();
  const [producto, setProducto] = useState({
    nombre: '', precio: '', descripcion: '', categoria_id: '', imagen_url: ''
  });

  const [showModal, setShowModal] = useState(false);
  const rol = localStorage.getItem('role');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/productos', producto);
      alert(t('alertaExito'));
      setProducto({ nombre: '', precio: '', descripcion: '', categoria_id: '', imagen_url: '' });
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert(t('alertaError'));
    }
  };

  return (
    <div className="p-10 text-white max-w-2xl mx-auto bg-neutral-950 rounded-lg border border-neutral-800">
      <h1 className="text-2xl font-bold mb-8 text-teal-400 uppercase tracking-widest text-center">
        {t('agregarProducto')}
      </h1>

      <div className="flex justify-center gap-4 mb-8">
        {rol === 'ADMIN' && (
          <button 
            onClick={() => setShowModal(!showModal)}
            className="bg-teal-600 px-6 py-2 rounded hover:bg-teal-700 transition"
          >
            {showModal ? t('cerrarFormulario') : t('agregarProducto')}
          </button>
        )}
      </div>

      {showModal && rol === 'ADMIN' && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 border-t border-neutral-800 pt-5">
          <input 
            placeholder={t('nombrePlaceholder')} 
            className="bg-neutral-900 p-3 rounded border border-neutral-700"
            value={producto.nombre}
            onChange={(e) => setProducto({...producto, nombre: e.target.value})} 
          />
          <input 
            type="number"
            placeholder={t('precioPlaceholder')} 
            className="bg-neutral-900 p-3 rounded border border-neutral-700"
            value={producto.precio}
            onChange={(e) => setProducto({...producto, precio: e.target.value})} 
          />
          <input 
            placeholder={t('descPlaceholder')} 
            className="bg-neutral-900 p-3 rounded border border-neutral-700"
            value={producto.descripcion}
            onChange={(e) => setProducto({...producto, descripcion: e.target.value})} 
          />
          <input 
            placeholder={t('catPlaceholder')} 
            className="bg-neutral-900 p-3 rounded border border-neutral-700"
            value={producto.categoria_id}
            onChange={(e) => setProducto({...producto, categoria_id: e.target.value})} 
          />
          <input 
            placeholder={t('imgPlaceholder')} 
            className="bg-neutral-900 p-3 rounded border border-neutral-700"
            value={producto.imagen_url}
            onChange={(e) => setProducto({...producto, imagen_url: e.target.value})} 
          />
          <button type="submit" className="bg-teal-600 py-3 rounded font-bold uppercase tracking-widest hover:bg-teal-700 transition">
            {t('guardarProducto')}
          </button>
        </form>
      )}
    </div>
  );
}