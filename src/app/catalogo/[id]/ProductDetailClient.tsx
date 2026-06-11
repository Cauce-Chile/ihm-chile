'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  cantidad_minima: number;
  imagen_url: string | null;
  activo: boolean;
}

const IMAGEN_PLACEHOLDER =
  '/images/placeholder_cajas.jpg';

export default function ProductDetailClient({
  producto,
}: {
  producto: Producto;
}) {
  const [quantity, setQuantity] = useState(producto.cantidad_minima);
  const [inputValue, setInputValue] = useState(String(producto.cantidad_minima));
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const imagenSrc = producto.imagen_url || IMAGEN_PLACEHOLDER;

  const handleAddToCart = () => {
    const safeQuantity = Math.max(producto.cantidad_minima, quantity);
    if (safeQuantity !== quantity) {
      setQuantity(safeQuantity);
      setInputValue(String(safeQuantity));
    }
    addItem({
      id: producto.id,
      name: producto.nombre,
      image: imagenSrc,
      minOrder: producto.cantidad_minima,
      quantity: safeQuantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-ihm-light py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/catalogo" className="text-ihm-blue hover:underline">
            ← Catálogo
          </Link>
        </div>
      </div>

      {/* Producto */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Imagen */}
          <div className="relative flex items-center justify-center bg-ihm-light rounded-lg p-8 min-h-[300px]">
            <Image
              src={imagenSrc}
              alt={producto.nombre}
              fill
              className="object-contain rounded p-4"
            />
          </div>

          {/* Información */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold text-ihm-dark mb-4">
                {producto.nombre}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {producto.descripcion || 'Sin descripción disponible.'}
              </p>
            </div>

            {/* Cotizador */}
            <div className="border-t pt-6 mt-6">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-ihm-dark mb-2">
                  Cantidad (Mínimo: {producto.cantidad_minima})
                </label>
                <input
                  type="number"
                  min={producto.cantidad_minima}
                  step={producto.cantidad_minima}
                  value={inputValue}
                  onFocus={() => setInputValue('')}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    const parsed = parseInt(e.target.value);
                    if (!isNaN(parsed)) setQuantity(parsed);
                  }}
                  onBlur={() => {
                    const parsed = parseInt(inputValue);
                    const safe =
                      isNaN(parsed) || parsed < producto.cantidad_minima
                        ? producto.cantidad_minima
                        : parsed;
                    setQuantity(safe);
                    setInputValue(String(safe));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ihm-blue"
                  style={{ color: '#2D2D2D', fontWeight: '600' }}
                />
              </div>

              {added && (
                <p className="text-xs text-green-600 font-medium mb-3">
                  ✓ Agregado a cotización ({quantity} unidades)
                </p>
              )}

              <button
                onClick={handleAddToCart}
                className={`w-full px-4 py-3 rounded-lg font-semibold transition mb-3 ${
                  added
                    ? 'bg-green-500 text-white'
                    : 'bg-ihm-blue text-white hover:opacity-90'
                }`}
              >
                {added ? '✓ Agregado a Cotización' : 'Agregar a Cotización'}
              </button>

              <Link
                href="/catalogo"
                className="block w-full px-4 py-3 border border-ihm-blue text-ihm-blue rounded-lg font-semibold hover:bg-ihm-light transition text-center mb-3"
              >
                Continuar Cotizando
              </Link>

              <Link
                href="/cotizacion"
                className="block w-full px-4 py-3 bg-ihm-blue text-white rounded-lg font-semibold hover:opacity-90 transition text-center"
              >
                Ver Cotización
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}