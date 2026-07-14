// API Configuration
// Lee automáticamente desde variable de entorno en Railway

const API_URL = 
  import.meta.env.VITE_API_URL || 
  'https://proyecto-nanocoral-production.up.railway.app';

console.log('🔗 API URL configurada:', API_URL);

export default API_URL;
