'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditarEmpresaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  const [nombre, setNombre] = useState('');

  const [logoUrl, setLogoUrl] = useState('');
  const [logoArchivo, setLogoArchivo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [subiendoLogo, setSubiendoLogo] = useState(false);
  const [errorLogo, setErrorLogo] = useState('');

  useEffect(() => {
    const cargarEmpresa = async () => {
      try {
        const res = await fetch(`/api/admin/empresas/${id}`, { cache: 'no-store' });
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (!res.ok) throw new Error('Error al cargar la empresa');
        const data = await res.json();
        setNombre(data.nombre || '');
        setLogoUrl(data.logo_url || '');
        setLogoPreview(data.logo_url || '');
      } catch {
        setError('No se pudo cargar la empresa.');
      } finally {
        setLoading(false);
      }
    };

    cargarEmpresa();
  }, [id]);

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(e.target.value);
    if (error) setError('');
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoArchivo(file);
    setLogoPreview(URL.createObjectURL(file));
    setErrorLogo('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      let urlFinal = logoUrl;

      if (logoArchivo) {
        setSubiendoLogo(true);
        const formData = new FormData();
        formData.append('file', logoArchivo);

        const uploadRes = await fetch('/api/admin/upload-logo', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          setErrorLogo(uploadData.error || 'Error al subir el logo');
          setSaving(false);
          setSubiendoLogo(false);
          return;
        }

        urlFinal = uploadData.url;
        setLogoUrl(urlFinal);
        setSubiendoLogo(false);
      }

      const res = await fetch(`/api/admin/empresas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          logo_url: urlFinal || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al guardar los cambios');
      }

      router.push('/admin/empresas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ihm-light flex items-center justify-center">
        <p className="text-gray-500">Cargando empresa...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-ihm-light flex items-center justify-center flex-col gap-4">
        <p className="text-gray-500">Empresa no encontrada.</p>
        <Link href="/admin/empresas" className="text-ihm-blue hover:underline text-sm">
          ← Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ihm-light">
      <div className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-ihm-dark">Editar Empresa</h1>
          <Link
            href="/admin/empresas"
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
              value={nombre}
              onChange={handleNombreChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ihm-blue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ihm-dark mb-1">
              Logo de la empresa
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleLogoChange}
              disabled={subiendoLogo}
              className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-ihm-blue file:text-white hover:file:bg-blue-700 disabled:opacity-50 cursor-pointer file:cursor-pointer"
            />
            <p className="text-xs text-gray-400 mt-1">JPG, PNG o WEBP · Máx. 2MB</p>
            {errorLogo && (
              <p className="text-xs text-red-500 mt-1">{errorLogo}</p>
            )}
            <div className="mt-3">
              <p className="text-xs text-gray-400 mb-1">Vista previa:</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoPreview || '/images/placeholder_cajas.jpg'}
                alt="Vista previa"
                className="w-32 h-32 object-cover rounded border border-gray-200 bg-gray-50"
                onError={(e) => { e.currentTarget.src = '/images/placeholder_cajas.jpg'; }}
              />
            </div>
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
              {subiendoLogo ? 'Subiendo logo...' : saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <Link
              href="/admin/empresas"
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
