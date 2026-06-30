'use client';

import { useEffect, useState } from 'react';

interface Empresa {
  id: string;
  nombre: string;
  logo_url: string | null;
  activo: boolean;
}

function GridPlaceholder({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-32 h-24 bg-ihm-light rounded-lg flex items-center justify-center border border-gray-200"
        />
      ))}
    </div>
  );
}

export default function LogosEmpresas() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [logos, setLogos] = useState<Empresa[]>([]);

  useEffect(() => {
    const cargarLogos = async () => {
      try {
        const res = await fetch('/api/empresas', { cache: 'no-store' });
        if (!res.ok) throw new Error('Error al cargar empresas');
        const data = await res.json();
        setLogos(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    cargarLogos();
  }, []);

  if (loading) {
    return <GridPlaceholder count={8} />;
  }

  if (error || logos.length === 0) {
    return <GridPlaceholder count={4} />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
      {logos.map((empresa) => (
        <div
          key={empresa.id}
          className="w-32 h-24 bg-ihm-light rounded-lg flex items-center justify-center border border-gray-200 hover:border-ihm-blue transition-colors"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={empresa.logo_url || ''}
            alt={empresa.nombre}
            className="max-w-full max-h-full object-contain p-2"
          />
        </div>
      ))}
    </div>
  );
}
