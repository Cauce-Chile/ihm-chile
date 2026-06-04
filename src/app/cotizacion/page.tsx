'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <div className="bg-gradient-to-r from-ihm-blue to-blue-600 text-white py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-2">Mi Cotización</h1>
            <p className="text-blue-100">Productos seleccionados para cotizar</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <p className="text-gray-500 text-lg mb-6">Tu cotización está vacía.</p>
          <Link
            href="/catalogo"
            className="px-6 py-3 bg-ihm-blue text-white rounded-lg font-semibold hover:opacity-90 transition"
          >
            Ver Catálogo
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-ihm-blue to-blue-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Mi Cotización</h1>
          <p className="text-blue-100">Productos seleccionados para cotizar</p>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                {/* Imagen */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg bg-ihm-light"
                />

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-ihm-dark">{item.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">Mín. {item.minOrder} unidades</p>

                  {/* Cantidad */}
                  <div className="flex items-center gap-2 mt-3">
                    <label className="text-sm text-gray-600">Cantidad:</label>
                    <input
                      type="number"
                      min={item.minOrder}
                      step={item.minOrder}
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          item.id,
                          Math.max(item.minOrder, parseInt(e.target.value) || 0)
                        )
                      }
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-ihm-blue"
                      style={{ color: '#2D2D2D', fontWeight: '600' }}
                    />
                  </div>
                </div>

                {/* Eliminar */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-400 hover:text-red-600 transition text-sm font-medium"
                >
                  Eliminar
                </button>
              </div>
            ))}

            {/* Limpiar carrito */}
            <button
              onClick={clearCart}
              className="text-sm text-gray-400 hover:text-red-500 transition mt-2"
            >
              Vaciar cotización
            </button>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-ihm-light rounded-lg p-6 sticky top-6">
              <h2 className="text-lg font-bold text-ihm-dark mb-4">Resumen</h2>

              <ul className="space-y-2 mb-6">
                {items.map((item) => (
                  <li key={item.id} className="flex justify-between text-sm text-gray-600">
                    <span className="truncate flex-1 pr-2">{item.name}</span>
                    <span className="font-semibold text-ihm-dark whitespace-nowrap">
                      {item.quantity.toLocaleString()} u.
                    </span>
                  </li>
                ))}
              </ul>

              <div className="border-t pt-4 mb-6">
                <p className="text-sm text-gray-500">
                  {items.length} {items.length === 1 ? 'producto' : 'productos'} en tu cotización
                </p>
              </div>

              <Link
                href="/cotizar"
                className="block w-full px-4 py-3 bg-ihm-blue text-white rounded-lg font-semibold hover:opacity-90 transition text-center"
              >
                Completar Cotización →
              </Link>

              <Link
                href="/catalogo"
                className="block w-full px-4 py-3 text-ihm-blue text-center text-sm mt-3 hover:underline"
              >
                ← Seguir agregando productos
              </Link>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}