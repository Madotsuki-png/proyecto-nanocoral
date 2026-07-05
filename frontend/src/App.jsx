import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './LandingPage';
import Shop from './Shop';
import ProductDetail from './ProductDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-900 text-white font-sans antialiased">
        {/* Barra de Navegación Global */}
        <nav className="flex justify-between items-center px-6 py-4 bg-neutral-950 border-b border-neutral-800 sticky top-0 z-50">
          <Link to="/" className="text-lg font-bold tracking-widest text-teal-400 uppercase">NanoCoral</Link>
          <div className="space-x-6 text-xs font-medium uppercase tracking-wider">
            <Link to="/" className="hover:text-teal-400 transition text-neutral-300">Inicio</Link>
            <Link to="/shop" className="hover:text-teal-400 transition text-neutral-300">Tienda</Link>
          </div>
        </nav>

        {/* Inyección de Páginas según la Ruta */}
        <main className="min-h-[calc(100--160px)]">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-neutral-950 text-center py-6 border-t border-neutral-800 text-neutral-600 text-[10px] tracking-wider uppercase">
          <p>© 2026 NanoCoral. Desarrollado con Stack MERN.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;