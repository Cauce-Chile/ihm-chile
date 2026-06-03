import ProductCard from '@/components/ProductCard';

// Datos de ejemplo (estáticos por ahora)
const products = [
  {
    id: '1',
    name: 'Manilla de Acero Inoxidable',
    description: 'Manilla de puerta de alta durabilidad, resistente a corrosión.',
    image: 'https://images.unsplash.com/photo-1580273455191-1c62238fa333?w=400&h=300&fit=crop',
    minOrder: 50,
  },
  {
    id: '2',
    name: 'Cerradura de Seguridad',
    description: 'Cerradura cilíndrica de latón, sistema de doble vuelta.',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop',
    minOrder: 100,
  },
  {
    id: '3',
    name: 'Bisagra Industrial',
    description: 'Bisagra de acero 304, carga máxima 150kg.',
    image: 'https://images.unsplash.com/photo-1565182999555-efaf395930a1?w=400&h=300&fit=crop',
    minOrder: 200,
  },
  {
    id: '4',
    name: 'Tornillo Cabeza Hexagonal',
    description: 'M8x30mm, acero galvanizado, caja de 100 unidades.',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop',
    minOrder: 500,
  },
  {
    id: '5',
    name: 'Tuerca Métrica',
    description: 'M8, acero inoxidable A4, caja de 50 unidades.',
    image: 'https://images.unsplash.com/photo-1586864387789-628dde76cce9?w=400&h=300&fit=crop',
    minOrder: 1000,
  },
  {
    id: '6',
    name: 'Arandela Plana',
    description: 'Acero galvanizado, variadas medidas disponibles.',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop',
    minOrder: 2000,
  },
];

export default function CatalogPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-ihm-blue to-blue-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Nuestro Catálogo</h1>
          <p className="text-blue-100">Explora nuestros productos de calidad para la construcción e industria</p>
        </div>
      </div>

      {/* Grid de productos */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>
    </main>
  );
}