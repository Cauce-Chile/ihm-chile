'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-ihm-light flex items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-ihm-light">
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-ihm-dark">Panel Administrador — IHM Chile</h1>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="text-sm text-gray-500 hover:text-red-500 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-gray-600">
          Bienvenido, <span className="font-medium text-ihm-dark">{session.user?.name}</span>.
        </p>
        <p className="text-gray-400 text-sm mt-1">
          Desde aquí podrás gestionar los productos y cotizaciones de IHM Chile.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Link href="/admin/productos" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition block">
            <h2 className="text-lg font-semibold text-ihm-dark mb-2">Productos</h2>
            <p className="text-gray-500 text-sm">Agregar, editar y desactivar productos del catálogo.</p>
          </Link>
          <div className="bg-white rounded-xl shadow-sm p-6 opacity-60 cursor-not-allowed">
            <h2 className="text-lg font-semibold text-ihm-dark mb-2">Cotizaciones</h2>
            <p className="text-gray-500 text-sm">Ver y gestionar las cotizaciones recibidas.</p>
            <p className="text-xs text-gray-400 mt-2 italic">Próximamente</p>
          </div>
        </div>
      </div>
    </div>
  );
}