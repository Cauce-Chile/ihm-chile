'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NuevoProductoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    cantidad_minima: '',
    imagen_url: '',
    precio: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nombre.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    if (!form.cantidad_minima || Number(form.cantidad_minima) <= 0) {
      setError('La cantidad mínima debe ser un número mayor a 0.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          descripcion: form.descripcion.trim() || null,
          cantidad_minima: Number(form.cantidad_minima),
          imagen_url: form.imagen_url.trim() || null,
          precio: form.precio ? Number(form.precio) : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al crear el producto');
      }

      router.push('/admin/productos');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ihm-light">
      <div className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-ihm-dark">Nuevo Producto</h1>
          <Link
            href="/admin/productos"
            className="text-sm text-gray-500 hover:text-ihm-blue transition"
          >
            ← Volver al listado
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-ihm-dark mb-1">
              Nombre *
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ihm-blue"
              placeholder="Ej: Caja de tornillos M6"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ihm-dark mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ihm-blue"
              placeholder="Especificaciones, material, uso, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ihm-dark mb-1">
              Cantidad mínima de pedido *
            </label>
            <input
              type="number"
              name="cantidad_minima"
              value={form.cantidad_minima}
              onChange={handleChange}
              min={1}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ihm-blue"
              placeholder="Ej: 50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ihm-dark mb-1">
              URL de imagen
            </label>
            <input
              type="text"
              name="imagen_url"
              value={form.imagen_url}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ihm-blue"
              placeholder="https://..."
            />
            <p className="text-xs text-gray-400 mt-1">
              Por ahora, pega la URL de una imagen ya alojada (la subida de archivos se implementará después).
            </p>
            <div className="mt-3">
              <p className="text-xs text-gray-400 mb-1">Vista previa:</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.imagen_url || '/images/placeholder_cajas.jpg'}
                alt="Vista previa"
                className="w-32 h-32 object-cover rounded border border-gray-200 bg-gray-50"
                onError={(e) => { e.currentTarget.src = '/images/placeholder_cajas.jpg'; }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ihm-dark mb-1">
              Precio (uso interno, no se muestra públicamente)
            </label>
            <input
              type="number"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              step="0.01"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ihm-blue"
              placeholder="Opcional"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-ihm-blue text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Crear Producto'}
            </button>
            <Link
              href="/admin/productos"
              className="px-5 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}