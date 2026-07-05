import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const [resenas, setResenas] = useState([]);
  const [corales, setCorales] = useState([]);

  useEffect(() => {
    // Cargar reseñas desde el backend
    fetch('http://localhost:5000/api/resenas')
      .then(res => res.json())
      .then(data => setResenas(data))
      .catch(err => console.error("Error cargando reseñas:", err));

    // Cargar corales destacados para la sección inicial
    fetch('http://localhost:5000/api/productos?categoria=1')
      .then(res => res.json())
      .then(data => setCorales(data.slice(0, 3)))
      .catch(err => console.error("Error cargando corales:", err));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Hero Section */}
      <section className="text-center my-12">
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">NanoCoral</h1>
        <p className="text-neutral-400 max-w-2xl mx-auto text-sm leading-relaxed">
          En NanoCoral unimos la belleza de la vida marina con la tecnología de vanguardia para que puedas crear un ecosistema espectacular en tu hogar. Nos especializamos en tres pilares fundamentales para el éxito de tu acuario.
        </p>
      </section>

      {/* Banner Principal Estilo Acuario */}
      <div className="w-full h-80 bg-neutral-950 rounded-xl mb-16 flex items-center justify-center overflow-hidden relative border border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950/40 via-purple-950/30 to-neutral-950/50"></div>
        <span className="text-neutral-500 text-sm font-mono tracking-widest z-10">[ Banner Multimedia: Ecosistema Reef Principal ]</span>
      </div>

      {/* Sección: Corales que pueden ser tuyos */}
      <section className="mb-16">
        <h2 className="text-xl font-bold mb-6 text-neutral-200">Corales que pueden ser tuyos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {corales.map((coral) => (
            <div key={coral.id} className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
              <div className="w-full h-40 bg-neutral-900 rounded mb-3 flex items-center justify-center text-xs text-neutral-600">[ {coral.nombre} ]</div>
              <h3 className="text-sm font-bold text-neutral-300">{coral.nombre}</h3>
              <p className="text-teal-400 text-xs font-semibold mt-1">${coral.precio} MXN</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sección Informativa / Servicios */}
      <section className="grid md:grid-cols-2 gap-8 items-center my-16 bg-neutral-950 p-8 rounded-xl border border-neutral-800">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">¿No sabes cómo empezar?</h2>
          
          <div>
            <h3 className="text-teal-400 font-semibold text-sm">Servicio de montaje de acuarios marinos</h3>
            <p className="text-neutral-400 text-xs mt-1 leading-relaxed">
              ¿Quieres iniciar en el acuarismo marino pero no sabes por dónde empezar? Nuestro equipo de expertos se encarga del diseño, montaje e instalación técnica de tu acuario a domicilio. Garantizamos la estabilidad de tu sistema desde el primer día.
            </p>
          </div>

          <div>
            <h3 className="text-teal-400 font-semibold text-sm">Servicio de mantenimiento</h3>
            <p className="text-neutral-400 text-xs mt-1 leading-relaxed">
              Si no dispones del tiempo necesario, nuestros especialistas realizan el mantenimiento preventivo a domicilio: monitoreo químico de parámetros, cambios de agua programados y limpieza profunda. Tú solo disfruta de tus corales.
            </p>
          </div>
          
          <Link to="/shop" className="inline-block bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold px-4 py-2 rounded transition">
            Saber más
          </Link>
        </div>

        <div className="w-full h-64 bg-neutral-900 rounded-lg flex items-center justify-center border border-neutral-800 text-xs text-neutral-500">
          [ Imagen Ilustrativa: Pez Payaso / Reef Tank ]
        </div>
      </section>

      {/* Sección: Reseñas */}
      <section className="my-12">
        <h2 className="text-xl font-bold mb-6 text-center text-neutral-200">Reseñas</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {resenas.map((r) => (
            <div key={r.id} className="bg-neutral-950 p-5 rounded-lg border border-neutral-800 flex flex-col justify-between">
              <p className="text-xs text-neutral-400 italic leading-relaxed">"{r.comentario}"</p>
              <div className="mt-4 pt-3 border-t border-neutral-900 flex items-center gap-2">
                <div className="w-6 h-6 bg-neutral-800 rounded-full flex items-center justify-center text-[10px] text-teal-400 font-bold">
                  {r.usuario.charAt(0)}
                </div>
                <h4 className="text-xs font-semibold text-neutral-300">{r.usuario}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}