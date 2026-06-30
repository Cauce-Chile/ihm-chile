'use client';

import { useState } from 'react';

export interface ItemCotizacion {
  cantidad: number;
  productos: { nombre: string } | null;
}

export interface Cotizacion {
  id: string;
  numero: string;
  mensaje: string | null;
  creado_en: string;
  clientes: {
    nombre: string;
    correo: string;
    telefono: string | null;
    pais: string | null;
  } | null;
  items_cotizacion: ItemCotizacion[];
}

type FiltroFecha = 'todas' | 'hoy' | 'semana' | 'mes' | 'personalizado';

function formatearFecha(fechaISO: string): string {
  return new Date(fechaISO).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function toLocalDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const pill = (activo: boolean) =>
  `rounded-full px-4 py-1.5 text-sm transition ${activo ? 'bg-ihm-blue text-white' : 'bg-gray-200 text-gray-700'}`;

export default function CotizacionesAccordion({ cotizaciones }: { cotizaciones: Cotizacion[] }) {
  const [abierto, setAbierto] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroFecha, setFiltroFecha] = useState<FiltroFecha>('todas');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const cotizacionesFiltradas = (() => {
    const hoy = new Date();
    const todayStr = toLocalDateStr(hoy);
    const yearMonth = todayStr.slice(0, 7);
    const semanaDesde = new Date(hoy);
    semanaDesde.setDate(hoy.getDate() - 6);
    const semanaDesdeStr = toLocalDateStr(semanaDesde);

    return cotizaciones.filter((cot) => {
      if (busqueda.trim()) {
        const q = busqueda.toLowerCase();
        const nombre = (cot.clientes?.nombre ?? '').toLowerCase();
        const correo = (cot.clientes?.correo ?? '').toLowerCase();
        if (!nombre.includes(q) && !correo.includes(q)) return false;
      }

      const fechaCot = cot.creado_en.slice(0, 10);
      if (filtroFecha === 'hoy') {
        if (fechaCot !== todayStr) return false;
      } else if (filtroFecha === 'semana') {
        if (fechaCot < semanaDesdeStr || fechaCot > todayStr) return false;
      } else if (filtroFecha === 'mes') {
        if (fechaCot.slice(0, 7) !== yearMonth) return false;
      } else if (filtroFecha === 'personalizado') {
        if (fechaDesde && fechaCot < fechaDesde) return false;
        if (fechaHasta && fechaCot > fechaHasta) return false;
      }

      return true;
    });
  })();

  const hayFiltros = busqueda.trim() !== '' || filtroFecha !== 'todas';
  const n = cotizacionesFiltradas.length;
  const total = cotizaciones.length;

  const textoContador = hayFiltros
    ? `${n} cotizaci${n !== 1 ? 'ones' : 'ón'} encontrada${n !== 1 ? 's' : ''}`
    : `${total} cotizaci${total !== 1 ? 'ones' : 'ón'} recibida${total !== 1 ? 's' : ''}`;

  if (cotizaciones.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <p className="text-gray-500">Aún no hay cotizaciones recibidas.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Controles de búsqueda y filtro */}
      <div className="mb-4 space-y-3">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o correo..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-ihm-dark bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ihm-blue"
        />
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setFiltroFecha('todas')} className={pill(filtroFecha === 'todas')}>Todas</button>
          <button onClick={() => setFiltroFecha('hoy')} className={pill(filtroFecha === 'hoy')}>Hoy</button>
          <button onClick={() => setFiltroFecha('semana')} className={pill(filtroFecha === 'semana')}>Esta semana</button>
          <button onClick={() => setFiltroFecha('mes')} className={pill(filtroFecha === 'mes')}>Este mes</button>
          <button onClick={() => setFiltroFecha('personalizado')} className={pill(filtroFecha === 'personalizado')}>Personalizado</button>
          {filtroFecha === 'personalizado' && (
            <>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-ihm-dark focus:outline-none focus:ring-2 focus:ring-ihm-blue"
              />
              <span className="text-gray-400 text-sm">—</span>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-ihm-dark focus:outline-none focus:ring-2 focus:ring-ihm-blue"
              />
            </>
          )}
        </div>
      </div>

      {/* Contador */}
      <p className="text-gray-500 text-sm mb-4">{textoContador}</p>

      {/* Lista vacía por filtros */}
      {cotizacionesFiltradas.length === 0 && hayFiltros ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <p className="text-gray-500">No se encontraron cotizaciones con esos filtros.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="hidden md:grid grid-cols-[100px_160px_1fr_100px_32px] gap-4 bg-gray-50 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
            <span>N°</span>
            <span>Fecha</span>
            <span>Cliente</span>
            <span className="text-right">Productos</span>
            <span />
          </div>

          <div className="divide-y divide-gray-100">
            {cotizacionesFiltradas.map((cot) => {
              const totalProductos = cot.items_cotizacion.reduce((sum, item) => sum + item.cantidad, 0);
              const estaAbierto = abierto === cot.id;

              return (
                <div key={cot.id}>
                  <button
                    onClick={() => setAbierto(estaAbierto ? null : cot.id)}
                    className="w-full text-left px-6 py-4 hover:bg-gray-50 transition"
                  >
                    {/* Desktop */}
                    <div className="hidden md:grid grid-cols-[100px_160px_1fr_100px_32px] gap-4 items-center">
                      <span className="text-ihm-dark font-semibold text-sm">#{cot.numero}</span>
                      <span className="text-gray-600 text-sm">{formatearFecha(cot.creado_en)}</span>
                      <span className="text-gray-800 text-sm truncate">{cot.clientes?.nombre ?? '—'}</span>
                      <span className="text-right text-gray-500 text-sm">{totalProductos}</span>
                      <span className="text-gray-400 text-xs text-right">{estaAbierto ? '▲' : '▼'}</span>
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden flex justify-between items-center gap-3">
                      <div className="min-w-0">
                        <p className="text-ihm-dark font-semibold text-sm truncate">
                          #{cot.numero} — {cot.clientes?.nombre ?? '—'}
                        </p>
                        <p className="text-gray-400 text-xs mt-0.5">
                          {formatearFecha(cot.creado_en)} · {totalProductos} producto{totalProductos !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <span className="text-gray-400 text-xs shrink-0">{estaAbierto ? '▲' : '▼'}</span>
                    </div>
                  </button>

                  {estaAbierto && (
                    <div className="px-6 pb-6 pt-4 bg-gray-50 border-t border-gray-100">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                            Datos del cliente
                          </h3>
                          <dl className="space-y-1.5 text-sm">
                            <div className="flex gap-2">
                              <dt className="text-gray-400 w-20 shrink-0">Correo</dt>
                              <dd className="text-ihm-dark break-all">{cot.clientes?.correo ?? '—'}</dd>
                            </div>
                            {cot.clientes?.telefono && (
                              <div className="flex gap-2">
                                <dt className="text-gray-400 w-20 shrink-0">Teléfono</dt>
                                <dd className="text-ihm-dark">{cot.clientes.telefono}</dd>
                              </div>
                            )}
                          </dl>

                          {cot.mensaje && (
                            <div className="mt-4">
                              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                                Mensaje
                              </h3>
                              <p className="text-sm text-gray-700 bg-white border border-gray-200 rounded-lg p-3 whitespace-pre-wrap">
                                {cot.mensaje}
                              </p>
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                            Productos solicitados
                          </h3>
                          <ul className="space-y-2">
                            {cot.items_cotizacion.map((item, i) => (
                              <li key={i} className="flex justify-between items-center text-sm">
                                <span className="text-ihm-dark">{item.productos?.nombre ?? '—'}</span>
                                <span className="text-gray-400 ml-4 shrink-0">× {item.cantidad}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
