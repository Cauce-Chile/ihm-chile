'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import CotizacionesAccordion from '@/components/admin/CotizacionesAccordion';
import type { Cotizacion } from '@/components/admin/CotizacionesAccordion';

export default function AdminCotizacionesPage() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch('/api/admin/cotizaciones', { cache: 'no-store' });
        if (!res.ok) throw new Error('Error al cargar cotizaciones');
        const json = await res.json();
        setCotizaciones(json.data || []);
      } catch {
        setError('No se pudieron cargar las cotizaciones.');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  return (
    <div className="min-h-screen bg-ihm-light">
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-ihm-dark">Cotizaciones Recibidas</h1>
          <Link href="/admin" className="text-sm text-gray-500 hover:text-ihm-blue transition">
            ← Volver al panel
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {loading && <p className="text-gray-500">Cargando cotizaciones...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && <CotizacionesAccordion cotizaciones={cotizaciones} />}
      </div>
    </div>
  );
}
