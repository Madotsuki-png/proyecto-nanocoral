import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from './LanguageContext'; // IMPORTAMOS EL TRADUCTOR

export default function LandingPage() {
  const { t } = useLanguage(); // INICIALIZAMOS EL TRADUCTOR
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const miNumero = "525566783099";

  useEffect(() => {
    axios.get('http://localhost:5000/api/resenas')
      .then(response => {
        setResenas(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al traer reseñas:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-neutral-900 min-h-screen text-white">
      
      {/* Sección Hero */}
      <section className="relative px-6 py-24 text-center max-w-3xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 uppercase">
          NanoCoral
        </h1>
        <p className="text-neutral-400 mt-4 max-w-xl leading-relaxed">
          {t('descripcionHero')} {/* TRADUCIDO */}
        </p>
        <Link to="/shop" className="mt-8 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-neutral-950 font-bold uppercase text-xs rounded transition shadow-lg">
          {t('btnExplorar')} {/* TRADUCIDO */}
        </Link>
      </section>

      {/* Sección de Servicios */}
      <div className="px-10 py-16 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Columna Izquierda: Textos */}
        <div className="flex flex-col gap-12">
          <section className="border-l-4 border-teal-500 pl-6">
            <h2 className="text-2xl font-bold mb-2 text-teal-400">{t('tituloDiseno')}</h2> {/* TRADUCIDO */}
            <p className="text-neutral-300 mb-4">{t('descDiseno')}</p> {/* TRADUCIDO */}
            <a href={`https://wa.me/${miNumero}?text=Hola, quiero info sobre diseño y montaje.`} target="_blank" rel="noopener noreferrer" className="bg-teal-600 px-6 py-2 rounded font-bold hover:bg-teal-700 transition inline-block">
              {t('btnContactar')} {/* TRADUCIDO */}
            </a>
          </section>

          <section className="border-l-4 border-blue-500 pl-6">
            <h2 className="text-2xl font-bold mb-2 text-blue-400">{t('tituloMantenimiento')}</h2> {/* TRADUCIDO */}
            <p className="text-neutral-300 mb-4">{t('descMantenimiento')}</p> {/* TRADUCIDO */}
            <a href={`https://wa.me/${miNumero}?text=Hola, quiero info sobre mantenimiento.`} target="_blank" rel="noopener noreferrer" className="bg-blue-600 px-6 py-2 rounded font-bold hover:bg-blue-700 transition inline-block">
              {t('btnContactar')} {/* TRADUCIDO */}
            </a>
          </section>
        </div>

        {/* Columna Derecha: Imagen */}
        <div className="hidden md:flex justify-center">
          <img 
            src="/pez-payaso.jpg" 
            alt="Pez Payaso NanoCoral" 
            className="rounded-lg shadow-2xl w-full max-w-sm object-cover"
          />
        </div>
      </div>

      {/* Sección de Reseñas */}
      <section className="bg-neutral-950 px-6 py-16 border-t border-neutral-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-xs uppercase tracking-widest font-semibold text-neutral-500 mb-12">
            {t('tituloOpiniones')} {/* TRADUCIDO */}
          </h2>
          {loading ? (
  <p className="text-center text-neutral-500 animate-pulse">
    {t('cargandoTestimonios')}
  </p>
) : (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {resenas.map((resena) => (
      <div key={resena.id} className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg">
        <p className="text-neutral-300 text-xs italic">"{resena.comentario}"</p>
        <div className="mt-6 border-t border-neutral-800 pt-4 flex justify-between">
          <span className="text-neutral-200 text-xs font-medium">{resena.usuario}</span>
          <span className="text-amber-400 text-xs">{'★'.repeat(resena.calificacion)}</span>
        </div>
      </div>
    ))}
  </div>
)}
        </div>
      </section>
    </div>
  );
}