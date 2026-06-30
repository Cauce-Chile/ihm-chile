'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const LOGO_PLACEHOLDER = '/images/placeholder_cajas.jpg';

function LogoMiniatura({ src, alt }: { src: string | null; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src || LOGO_PLACEHOLDER}
      alt={alt}
      width={48}
      height={48}
      className="w-12 h-12 object-cover rounded border border-gray-200 bg-gray-50"
      onError={(e) => { e.currentTarget.src = LOGO_PLACEHOLDER; }}
    />
  );
}

interface Empresa {
  id: string;
  nombre: string;
  logo_url: string | null;
  activo: boolean;
}

export default function AdminEmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [mostrarInactivas, setMostrarInactivas] = useState(false);

  const cargarEmpresas = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/empresas', { cache: 'no-store' });
      if (!res.ok) throw new Error('Error al cargar empresas');
      const data = await res.json();
      setEmpresas(data);
    } catch {
      setError('No se pudieron cargar las empresas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEmpresas();
  }, []);

  const handleDesactivar = async (id: string, nombre: string) => {
    const confirmar = window.confirm(`¿Desactivar la empresa "${nombre}"? Dejará de verse en el sitio público.`);
    if (!confirmar) return;

    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/empresas/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al desactivar');
      await cargarEmpresas();
    } catch {
      alert('No se pudo desactivar la empresa. Intenta nuevamente.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleActivar = async (id: string) => {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/empresas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: true }),
      });
      if (!res.ok) throw new Error('Error al activar');
      await cargarEmpresas();
    } catch {
      alert('No se pudo activar la empresa. Intenta nuevamente.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const empresasFiltradas = mostrarInactivas ? empresas : empresas.filter(e => e.activo);

  return (
    <div className="min-h-screen bg-ihm-light">
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-ihm-dark">Gestión de Empresas</h1>
          <Link href="/admin" className="text-sm text-gray-500 hover:text-ihm-blue transition">
            ← Volver al panel
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-3">
          <p className="text-gray-500 text-sm">
            {empresasFiltradas.length < empresas.length
              ? `${empresasFiltradas.length} de ${empresas.length} empresas`
              : `${empresas.length} empresa${empresas.length !== 1 ? 's' : ''} en total`}
          </p>
          <Link
            href="/admin/empresas/nuevo"
            className="bg-ihm-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            + Agregar empresa
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setMostrarInactivas(!mostrarInactivas)}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              mostrarInactivas
                ? 'bg-ihm-blue text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Mostrar inactivas
          </button>
        </div>

        {loading && <p className="text-gray-500">Cargando empresas...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && empresas.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500">No hay empresas creadas todavía.</p>
          </div>
        )}

        {!loading && !error && empresas.length > 0 && empresasFiltradas.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500">No hay empresas activas.</p>
            <p className="text-gray-400 text-sm mt-1">Activa el toggle para ver las inactivas.</p>
          </div>
        )}

        {!loading && !error && empresasFiltradas.length > 0 && (
          <>
          <div className="hidden md:block">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-left">
                  <tr>
                    <th className="px-6 py-3 font-medium">Logo</th>
                    <th className="px-6 py-3 font-medium">Nombre</th>
                    <th className="px-6 py-3 font-medium">Estado</th>
                    <th className="px-6 py-3 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {empresasFiltradas.map((empresa) => (
                    <tr key={empresa.id} className={!empresa.activo ? 'opacity-50' : ''}>
                      <td className="px-6 py-4">
                        <LogoMiniatura src={empresa.logo_url} alt={empresa.nombre} />
                      </td>
                      <td className="px-6 py-4 text-ihm-dark font-medium">{empresa.nombre}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            empresa.activo
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {empresa.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <Link
                          href={`/admin/empresas/${empresa.id}/editar`}
                          className="text-ihm-blue hover:underline"
                        >
                          Editar
                        </Link>
                        {empresa.activo ? (
                          <button
                            onClick={() => handleDesactivar(empresa.id, empresa.nombre)}
                            disabled={actionLoadingId === empresa.id}
                            className="text-red-500 hover:underline disabled:opacity-50"
                          >
                            {actionLoadingId === empresa.id ? 'Desactivando...' : 'Desactivar'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivar(empresa.id)}
                            disabled={actionLoadingId === empresa.id}
                            className="text-green-600 hover:underline disabled:opacity-50"
                          >
                            {actionLoadingId === empresa.id ? 'Activando...' : 'Activar'}
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
            {empresasFiltradas.map((empresa) => (
              <div
                key={empresa.id}
                className={`bg-white rounded-xl shadow-sm p-4 ${!empresa.activo ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <LogoMiniatura src={empresa.logo_url} alt={empresa.nombre} />
                  <div className="flex-1 min-w-0">
                    <p className="text-ihm-dark font-medium text-sm">{empresa.nombre}</p>
                  </div>
                  <span
                    className={`shrink-0 px-2 py-1 rounded-full text-xs font-medium ${
                      empresa.activo
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {empresa.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="flex justify-end gap-4 mt-3 pt-3 border-t border-gray-100">
                  <Link
                    href={`/admin/empresas/${empresa.id}/editar`}
                    className="text-ihm-blue text-sm hover:underline"
                  >
                    Editar
                  </Link>
                  {empresa.activo ? (
                    <button
                      onClick={() => handleDesactivar(empresa.id, empresa.nombre)}
                      disabled={actionLoadingId === empresa.id}
                      className="text-red-500 text-sm hover:underline disabled:opacity-50"
                    >
                      {actionLoadingId === empresa.id ? 'Desactivando...' : 'Desactivar'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivar(empresa.id)}
                      disabled={actionLoadingId === empresa.id}
                      className="text-green-600 text-sm hover:underline disabled:opacity-50"
                    >
                      {actionLoadingId === empresa.id ? 'Activando...' : 'Activar'}
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
