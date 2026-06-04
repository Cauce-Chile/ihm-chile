'use client';

import Link from 'next/link';
import { useState } from 'react';

// Datos de ejemplo (mismos productos del catálogo)
const products = [
  {
    id: '1',
    name: 'Manilla de Acero Inoxidable',
    description: 'Manilla de puerta de alta durabilidad, resistente a corrosión.',
    image: 'https://images.unsplash.com/photo-1580273455191-1c62238fa333?w=600&h=400&fit=crop',
    minOrder: 50,
    price: 2.50,
    specifications: 'Material: Acero Inoxidable 304, Acabado: Pulido espejo, Largo: 120mm, Peso: 450g por unidad',
    stock: 5000,
  },
  {
    id: '2',
    name: 'Cerradura de Seguridad',
    description: 'Cerradura cilíndrica de latón, sistema de doble vuelta.',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop',
    minOrder: 100,
    price: 12.00,
    specifications: 'Material: Latón, Tipo: Cilíndrica, Vueltas: Doble, Certificación: DIN',
    stock: 2000,
  },
  {
    id: '3',
    name: 'Bisagra Industrial',
    description: 'Bisagra de acero 304, carga máxima 150kg.',
    image: 'https://images.unsplash.com/photo-1565182999555-efaf395930a1?w=600&h=400&fit=crop',
    minOrder: 200,
    price: 8.75,
    specifications: 'Material: Acero 304, Carga Máxima: 150kg, Dimensiones: 100x100mm, Ángulo: 180°',
    stock: 3000,
  },
  {
    id: '4',
    name: 'Tornillo Cabeza Hexagonal',
    description: 'M8x30mm, acero galvanizado, caja de 100 unidades.',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=400&fit=crop',
    minOrder: 500,
    price: 0.15,
    specifications: 'Medida: M8x30mm, Material: Acero Galvanizado, Clase: 8.8, Acabado: Zinc',
    stock: 50000,
  },
  {
    id: '5',
    name: 'Tuerca Métrica',
    description: 'M8, acero inoxidable A4, caja de 50 unidades.',
    image: 'https://images.unsplash.com/photo-1586864387789-628dde76cce9?w=600&h=400&fit=crop',
    minOrder: 1000,
    price: 0.20,
    specifications: 'Medida: M8, Material: Acero Inoxidable A4, Tipo: Hexagonal, Acabado: Pulido',
    stock: 75000,
  },
  {
    id: '6',
    name: 'Arandela Plana',
    description: 'Acero galvanizado, variadas medidas disponibles.',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop',
    minOrder: 2000,
    price: 0.08,
    specifications: 'Material: Acero Galvanizado, Medidas: Variadas (M5-M16), Acabado: Zinc',
    stock: 100000,
  },
];

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);
  const [quantity, setQuantity] = useState(product?.minOrder || 1);

  if (!product) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-ihm-dark mb-4">Producto no encontrado</h1>
          <Link href="/catalogo" className="text-ihm-blue hover:underline">
            ← Volver al catálogo
          </Link>
        </div>
      </main>
    );
  }

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
          <div className="flex items-center justify-center bg-ihm-light rounded-lg p-8">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover rounded"
            />
          </div>

          {/* Información */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold text-ihm-dark mb-4">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-6">{product.description}</p>


              {/* Especificaciones */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-ihm-dark mb-3">Especificaciones</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{product.specifications}</p>
              </div>

              {/* Stock */}
              <div className="text-sm text-gray-600 mb-6">
                <span className="font-semibold text-ihm-dark">Stock disponible:</span> {product.stock.toLocaleString()} unidades
              </div>
            </div>

            {/* Cotizador */}
            <div className="border-t pt-6 mt-6">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-ihm-dark mb-2">
                  Cantidad (Mínimo: {product.minOrder})
                </label>
               <input
                  type="number"
                  min={product.minOrder}
                  step={product.minOrder}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(product.minOrder, parseInt(e.target.value) || 0))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ihm-blue"
                  style={{ color: '#2D2D2D', fontWeight: '600' }}
                />
              </div>


              {/* Botones */}
              <button
                onClick={() => alert(`Agregado ${quantity} unidades a cotización`)}
                className="w-full px-4 py-3 bg-ihm-blue text-white rounded-lg font-semibold hover:opacity-90 transition mb-3"
              >
                Agregar a Cotización
              </button>

              <Link
                href="/catalogo"
                className="block w-full px-4 py-3 border border-ihm-blue text-ihm-blue rounded-lg font-semibold hover:bg-ihm-light transition text-center"
              >
                Continuar Comprando
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}