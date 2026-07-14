import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { LanguageProvider } from './LanguageContext';
import { CartProvider } from './CartContext';
import { ThemeProvider } from './ThemeContext';
import { ColorThemeProvider } from './ColorThemeContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <ColorThemeProvider>
        <CartProvider>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </CartProvider>
      </ColorThemeProvider>
    </ThemeProvider>
  </StrictMode>
);
