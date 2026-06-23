'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const IMAGEN_PLACEHOLDER = '/images/placeholder_cajas.jpg';

function Miniatura({ src, alt }: { src: string | null; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src || IMAGEN_PLACEHOLDER}
      alt={alt}
      width={48}
      height={48}
      className="w-12 h-12 object-cover rounded border border-gray-200 bg-gray-50"
      onError={(e) => { e.currentTarget.src = IMAGEN_PLACEHOLDER; }}
    />
  );
}

interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  cantidad_minima: number;
  imagen_url: string | null;
  activo: boolean;
}

export default function AdminProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [orden, setOrden] = useState<'original' | 'agrupado'>('original');

  const cargarProductos = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/productos/listado', { cache: 'no-store' });
      if (!res.ok) throw new Error('Error al cargar productos');
      const data = await res.json();
      setProductos(data);
    } catch {
      setError('No se pudieron cargar los productos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleDesactivar = async (id: string, nombre: string) => {
    const confirmar = window.confirm(`¿Desactivar el producto "${nombre}"? Dejará de verse en el catálogo público.`);
    if (!confirmar) return;

    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/productos/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al desactivar');
      await cargarProductos();
    } catch {
      alert('No se pudo desactivar el producto. Intenta nuevamente.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleActivar = async (id: string) => {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: true }),
      });
      if (!res.ok) throw new Error('Error al activar');
      await cargarProductos();
    } catch {
      alert('No se pudo activar el producto. Intenta nuevamente.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const productosFiltrados = (() => {
    const base = mostrarInactivos ? productos : productos.filter(p => p.activo);
    if (orden === 'agrupado') {
      return [...base].sort((a, b) => Number(b.activo) - Number(a.activo));
    }
    return base;
  })();

  return (
    <div className="min-h-screen bg-ihm-light">
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-ihm-dark">Gestión de Productos</h1>
          <Link href="/admin" className="text-sm text-gray-500 hover:text-ihm-blue transition">
            ← Volver al panel
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-3">
          <p className="text-gray-500 text-sm">
            {productosFiltrados.length < productos.length
              ? `${productosFiltrados.length} de ${productos.length} productos`
              : `${productos.length} producto${productos.length !== 1 ? 's' : ''} en total`}
          </p>
          <Link
            href="/admin/productos/nuevo"
            className="bg-ihm-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            + Nuevo Producto
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setMostrarInactivos(!mostrarInactivos)}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              mostrarInactivos
                ? 'bg-ihm-blue text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Mostrar inactivos
          </button>
          <button
            onClick={() => setOrden(orden === 'original' ? 'agrupado' : 'original')}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              orden === 'agrupado'
                ? 'bg-ihm-blue text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Agrupar por estado
          </button>
        </div>

        {loading && <p className="text-gray-500">Cargando productos...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && productos.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500">No hay productos creados todavía.</p>
          </div>
        )}

        {!loading && !error && productos.length > 0 && productosFiltrados.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500">No hay productos activos.</p>
            <p className="text-gray-400 text-sm mt-1">Activa el toggle para ver los inactivos.</p>
          </div>
        )}

        {!loading && !error && productosFiltrados.length > 0 && (
          <>
          <div className="hidden md:block">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-left">
                  <tr>
                    <th className="px-6 py-3 font-medium">Imagen</th>
                    <th className="px-6 py-3 font-medium">Nombre</th>
                    <th className="px-6 py-3 font-medium">Cant. Mínima</th>
                    <th className="px-6 py-3 font-medium">Estado</th>
                    <th className="px-6 py-3 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {productosFiltrados.map((producto) => (
                    <tr key={producto.id} className={!producto.activo ? 'opacity-50' : ''}>
                      <td className="px-6 py-4">
                        <Miniatura src={producto.imagen_url} alt={producto.nombre} />
                      </td>
                      <td className="px-6 py-4 text-ihm-dark font-medium">{producto.nombre}</td>
                      <td className="px-6 py-4 text-gray-600">{producto.cantidad_minima}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            producto.activo
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {producto.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <Link
                          href={`/admin/productos/${producto.id}/editar`}
                          className="text-ihm-blue hover:underline"
                        >
                          Editar
                        </Link>
                        {producto.activo ? (
                          <button
                            onClick={() => handleDesactivar(producto.id, producto.nombre)}
                            disabled={actionLoadingId === producto.id}
                            className="text-red-500 hover:underline disabled:opacity-50"
                          >
                            {actionLoadingId === producto.id ? 'Desactivando...' : 'Desactivar'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivar(producto.id)}
                            disabled={actionLoadingId === producto.id}
                            className="text-green-600 hover:underline disabled:opacity-50"
                          >
                            {actionLoadingId === producto.id ? 'Activando...' : 'Activar'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="md:hidden space-y-4">
            {productosFiltrados.map((producto) => (
              <div
                key={producto.id}
                className={`bg-white rounded-xl shadow-sm p-4 ${!producto.activo ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <Miniatura src={producto.imagen_url} alt={producto.nombre} />
                  <div className="flex-1 min-w-0">
                    <p className="text-ihm-dark font-medium text-sm">{producto.nombre}</p>
                    {producto.descripcion && (
                      <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{producto.descripcion}</p>
                    )}
                    <p className="text-gray-400 text-xs mt-1">Cant. mínima: {producto.cantidad_minima}</p>
                  </div>
                  <span
                    className={`shrink-0 px-2 py-1 rounded-full text-xs font-medium ${
                      producto.activo
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {producto.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="flex justify-end gap-4 mt-3 pt-3 border-t border-gray-100">
                  <Link
                    href={`/admin/productos/${producto.id}/editar`}
                    className="text-ihm-blue text-sm hover:underline"
                  >
                    Editar
                  </Link>
                  {producto.activo ? (
                    <button
                      onClick={() => handleDesactivar(producto.id, producto.nombre)}
                      disabled={actionLoadingId === producto.id}
                      className="text-red-500 text-sm hover:underline disabled:opacity-50"
                    >
                      {actionLoadingId === producto.id ? 'Desactivando...' : 'Desactivar'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivar(producto.id)}
                      disabled={actionLoadingId === producto.id}
                      className="text-green-600 text-sm hover:underline disabled:opacity-50"
                    >
                      {actionLoadingId === producto.id ? 'Activando...' : 'Activar'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          </>
        )}
      </div>
    </div>
  );
}