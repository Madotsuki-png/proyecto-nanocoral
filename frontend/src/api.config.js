// API Configuration
// Detecta automáticamente el ambiente

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('🔗 API URL configurada:', API_URL);

export default API_URL;
