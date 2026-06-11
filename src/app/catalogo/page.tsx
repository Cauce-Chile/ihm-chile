import ProductCard from '@/components/ProductCard';

// Tipo de dato que viene desde Supabase
interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  cantidad_minima: number;
  imagen_url: string | null;
  activo: boolean;
}

// Función que obtiene productos desde la API (se ejecuta en el servidor)
async function getProductos(): Promise<Producto[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'http://localhost:3000' : ''}/api/productos`, {
      cache: 'no-store',
    });

    if (!res.ok) return [];

    return res.json();
  } catch {
    return [];
  }
}

export default async function CatalogPage() {
  const productos = await getProductos();

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
        {productos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay productos disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productos.map((producto) => (
              <ProductCard
                key={producto.id}
                id={producto.id}
                name={producto.nombre}
                description={producto.descripcion || ''}
                image={producto.imagen_url || '/images/placeholder_cajas.jpg'}
                minOrder={producto.cantidad_minima}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}