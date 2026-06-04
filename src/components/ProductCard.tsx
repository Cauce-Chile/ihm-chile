'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  minOrder: number;
}

export default function ProductCard({ id, name, description, image, minOrder }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({ id, name, image, minOrder, quantity: minOrder });
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full">
      {/* Imagen */}
      <div className="w-full h-48 bg-ihm-light overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenido */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-ihm-dark mb-2">{name}</h3>
        <p className="text-sm text-gray-600 mb-3 flex-1">{description}</p>
        <p className="text-xs text-ihm-blue font-medium mb-4">
          Mín. {minOrder} unidades
        </p>

        {/* Mensaje de confirmación */}
        {added && (
          <p className="text-xs text-green-600 font-medium mb-2">
            ✓ Agregado a cotización ({minOrder} unidades mínimas)
          </p>
        )}

        {/* Botones */}
        <div className="flex gap-2">
          <Link
            href={`/catalogo/${id}`}
            className="flex-1 px-3 py-2 bg-ihm-blue text-white text-sm rounded hover:opacity-90 transition text-center"
          >
            Ver Detalles
          </Link>
          <button
            onClick={handleAddToCart}
            className={`flex-1 px-3 py-2 border text-sm rounded transition ${
              added
                ? 'border-green-500 text-green-600 bg-green-50'
                : 'border-ihm-blue text-ihm-blue hover:bg-ihm-light'
            }`}
          >
            {added ? '✓ Agregado' : 'Cotizar'}
          </button>
        </div>
      </div>
    </div>
  );
}