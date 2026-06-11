import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';

interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  cantidad_minima: number;
  imagen_url: string | null;
  activo: boolean;
}

async function getProducto(id: string): Promise<Producto | null> {
  try {
    const res = await fetch(`http://localhost:3000/api/productos/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const producto = await getProducto(params.id);

  if (!producto || !producto.activo) {
    notFound();
  }

  return <ProductDetailClient producto={producto} />;
}