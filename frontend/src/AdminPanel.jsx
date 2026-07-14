import React, { useState } from 'react';
import axios from 'axios';
import { useLanguage } from './LanguageContext';
import ColorThemeSelector from './ColorThemeSelector';
import OrdersPanel from './OrdersPanel';

export default function AdminPanel() {
  const { t } = useLanguage();
  const [view, setView] = useState('productos'); // 'productos' o 'ordenes'
  const [producto, setProducto] = useState({
    nombre: '', precio: '', descripcion: '', categoria_id: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const rol = localStorage.getItem('role');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!producto.nombre || !producto.precio || !producto.categoria_id || !imageFile) {
      alert('Por favor completa todos los campos incluida la imagen');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('nombre', producto.nombre);
      formData.append('precio', producto.precio);
      formData.append('descripcion', producto.descripcion);
      formData.append('categoria_id', producto.categoria_id);
      formData.append('imagen', imageFile);

      const response = await axios.post('http://localhost:5000/api/productos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert(t('alertaExito'));
      setProducto({ nombre: '', precio: '', descripcion: '', categoria_id: '' });
      setImageFile(null);
      setImagePreview(null);
      setShowModal(false);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || t('alertaError'));
      setLoading(false);
    }
  };

  if (view === 'ordenes') {
    return (
      <>
        <button
          onClick={() => setView('productos')}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            backgroundColor: 'var(--theme-color)',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.2s',
            zIndex: 10
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--theme-light)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--theme-color)'}
        >
          ← Volver a Productos
        </button>
        <OrdersPanel />
      </>
    );
  }

  return (
    <div style={{ padding: '40px', color: 'var(--text-primary)', maxWidth: '32rem', margin: '0 auto', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: `1px solid var(--border-color)`, transition: 'all 0.3s ease', position: 'relative' }}>
      {/* Selector de Color */}
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <ColorThemeSelector />
      </div>

      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '32px', color: 'var(--theme-color)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', marginTop: '20px' }}>
        Panel Admin
      </h1>

      {/* Botones de navegación */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        {rol === 'ADMIN' && (
          <>
            <button 
              onClick={() => setView('productos')}
              style={{ flex: 1, backgroundColor: 'var(--theme-color)', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', textTransform: 'uppercase' }}
            >
              Productos
            </button>
            <button 
              onClick={() => setView('ordenes')}
              style={{ flex: 1, backgroundColor: 'var(--theme-color)', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', textTransform: 'uppercase' }}
            >
              Órdenes
            </button>
          </>
        )}
      </div>

      {/* Sección de Productos */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '32px' }}>
          {rol === 'ADMIN' && (
            <button 
              onClick={() => setShowModal(!showModal)}
              style={{ backgroundColor: 'var(--theme-color)', color: 'white', padding: '8px 24px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.2s' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--theme-light)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--theme-color)'}
            >
              {showModal ? t('cerrarFormulario') : t('agregarProducto')}
            </button>
          )}
        </div>

        {showModal && rol === 'ADMIN' && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderTop: `1px solid var(--border-color)`, paddingTop: '20px' }}>
            <input 
              placeholder={t('nombrePlaceholder')} 
              style={{ backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: '4px', border: `1px solid var(--border-color)`, color: 'var(--text-primary)', fontSize: '14px' }}
              value={producto.nombre}
              onChange={(e) => setProducto({...producto, nombre: e.target.value})} 
              required
            />
            <input 
              type="number"
              placeholder={t('precioPlaceholder')} 
              style={{ backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: '4px', border: `1px solid var(--border-color)`, color: 'var(--text-primary)', fontSize: '14px' }}
              value={producto.precio}
              onChange={(e) => setProducto({...producto, precio: e.target.value})} 
              required
            />
            <textarea 
              placeholder={t('descPlaceholder')} 
              style={{ backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: '4px', border: `1px solid var(--border-color)`, color: 'var(--text-primary)', fontSize: '14px', minHeight: '80px', resize: 'vertical' }}
              value={producto.descripcion}
              onChange={(e) => setProducto({...producto, descripcion: e.target.value})} 
            />
            <input 
              placeholder={t('catPlaceholder')} 
              style={{ backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: '4px', border: `1px solid var(--border-color)`, color: 'var(--text-primary)', fontSize: '14px' }}
              value={producto.categoria_id}
              onChange={(e) => setProducto({...producto, categoria_id: e.target.value})} 
              required
            />

            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '10px' }}>
              Seleccionar Imagen
            </label>
            <input 
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ backgroundColor: 'var(--bg-primary)', padding: '8px', borderRadius: '4px', border: `1px solid var(--border-color)`, color: 'var(--text-primary)', fontSize: '12px', cursor: 'pointer' }}
              required
            />

            {imagePreview && (
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Vista previa:</p>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px', border: `1px solid var(--border-color)` }}
                />
              </div>
            )}

            <button type="submit" disabled={loading} style={{ backgroundColor: loading ? 'var(--border-color)' : 'var(--theme-color)', color: 'white', padding: '12px', borderRadius: '4px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s', opacity: loading ? 0.6 : 1 }} onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = 'var(--theme-light)')} onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = 'var(--theme-color)')}>
              {loading ? 'Subiendo...' : t('guardarProducto')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
