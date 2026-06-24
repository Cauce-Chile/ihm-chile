'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditarProductoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    cantidad_minima: '',
    precio: '',
  });

  const [imagenUrl, setImagenUrl] = useState('');
  const [imagenArchivo, setImagenArchivo] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState('');
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [errorImagen, setErrorImagen] = useState('');

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const res = await fetch(`/api/productos/${id}`, { cache: 'no-store' });
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (!res.ok) throw new Error('Error al cargar el producto');
        const data = await res.json();
        setForm({
          nombre: data.nombre || '',
          descripcion: data.descripcion || '',
          cantidad_minima: data.cantidad_minima?.toString() || '',
          precio: data.precio?.toString() || '',
        });
        setImagenUrl(data.imagen_url || '');
        setImagenPreview(data.imagen_url || '');
      } catch {
        setError('No se pudo cargar el producto.');
      } finally {
        setLoading(false);
      }
    };

    cargarProducto();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagenArchivo(file);
    setImagenPreview(URL.createObjectURL(file));
    setErrorImagen('');
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

    setSaving(true);
    setError('');

    try {
      let urlFinal = imagenUrl;

      if (imagenArchivo) {
        setSubiendoImagen(true);
        const formData = new FormData();
        formData.append('file', imagenArchivo);

        const uploadRes = await fetch('/api/admin/upload-imagen', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          setErrorImagen(uploadData.error || 'Error al subir la imagen');
          setSaving(false);
          setSubiendoImagen(false);
          return;
        }

        urlFinal = uploadData.url;
        setImagenUrl(urlFinal);
        setSubiendoImagen(false);
      }

      const res = await fetch(`/api/admin/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          descripcion: form.descripcion.trim() || null,
          cantidad_minima: Number(form.cantidad_minima),
          imagen_url: urlFinal || null,
          precio: form.precio ? Number(form.precio) : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al guardar los cambios');
      }

      router.push('/admin/productos');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ihm-light flex items-center justify-center">
        <p className="text-gray-500">Cargando producto...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-ihm-light flex items-center justify-center flex-col gap-4">
        <p className="text-gray-500">Producto no encontrado.</p>
        <Link href="/admin/productos" className="text-ihm-blue hover:underline text-sm">
          ← Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ihm-light">
      <div className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-ihm-dark">Editar Producto</h1>
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ihm-dark mb-1">
              Imagen del producto
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImagenChange}
              disabled={subiendoImagen}
              className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-ihm-blue file:text-white hover:file:bg-blue-700 disabled:opacity-50 cursor-pointer file:cursor-pointer"
            />
            <p className="text-xs text-gray-400 mt-1">JPG, PNG o WEBP · Máx. 2MB</p>
            {errorImagen && (
              <p className="text-xs text-red-500 mt-1">{errorImagen}</p>
            )}
            <div className="mt-3">
              <p className="text-xs text-gray-400 mb-1">Vista previa:</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagenPreview || '/images/placeholder_cajas.jpg'}
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
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-ihm-blue text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {subiendoImagen ? 'Subiendo imagen...' : saving ? 'Guardando...' : 'Guardar Cambios'}
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
