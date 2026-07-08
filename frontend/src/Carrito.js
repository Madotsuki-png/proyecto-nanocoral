import { useCart } from './CartContext';

const Carrito = () => {
  const { carrito } = useCart();
  return (
    <div className="p-10 text-white">
      <h2 className="text-xl font-bold">Tu Carrito ({carrito.length} items)</h2>
      {carrito.map((item, index) => (
        <div key={index} className="border-b border-neutral-700 py-2">
          {item.nombre} - ${item.precio}
        </div>
      ))}
    </div>
  );
};