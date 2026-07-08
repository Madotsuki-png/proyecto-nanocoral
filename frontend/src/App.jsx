import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Agregué Navigate
import LandingPage from './LandingPage';
import Shop from './Shop';
import ProductDetail from './ProductDetail';
import { CartProvider } from './CartContext'; // Quitamos useCart de aquí, ya no se usa en App
import CartView from './CartView';
import AdminPanel from './AdminPanel';
import Login from './Login';
import Navbar from './Navbar'; // Este es el único Navbar que necesitamos

const RutaAdmin = ({ children }) => {
  const role = localStorage.getItem('role');
  return role === 'ADMIN' ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-neutral-900 text-white font-sans antialiased">
          <Navbar /> 
          
          <main className="min-h-[calc(100vh-160px)]">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<CartView />} />
              <Route path="/admin" element={<RutaAdmin><AdminPanel /></RutaAdmin>} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>

          <footer className="bg-neutral-950 text-center py-6 border-t border-neutral-800 text-neutral-600 text-[10px] tracking-wider uppercase">
            <p>© 2026 NanoCoral. Desarrollado con Stack MERN.</p>
          </footer>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;