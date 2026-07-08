import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import Shop from './Shop';
import ProductDetail from './ProductDetail';
import { CartProvider } from './CartContext';
import CartView from './CartView';
import AdminPanel from './AdminPanel';
import Login from './Login';
import Navbar from './Navbar';

const RutaAdmin = ({ children }) => {
  const role = localStorage.getItem('role');
  return role === 'ADMIN' ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <CartProvider>
      <Router>
        <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', transition: 'background-color 0.3s ease' }}>
          <Navbar /> 
          
          <main style={{ minHeight: 'calc(100vh - 160px)' }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<CartView />} />
              <Route path="/admin" element={<RutaAdmin><AdminPanel /></RutaAdmin>} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>

          <footer style={{
            backgroundColor: 'var(--footer-bg)',
            textAlign: 'center',
            padding: '24px',
            borderTop: `1px solid var(--border-color)`,
            color: 'var(--footer-text)',
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease'
          }}>
            <p>© 2026 NanoCoral. Desarrollado con Stack MERN.</p>
          </footer>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
