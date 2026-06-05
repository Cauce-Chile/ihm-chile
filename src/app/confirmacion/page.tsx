'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ConfirmationData {
  nombre: string;
  correo: string;
  codigoPais: string;
  telefono: string;
}

export default function ConfirmacionPage() {
  const [data, setData] = useState<ConfirmationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('confirmationData');
    if (stored) {
      try {
        setData(JSON.parse(stored));
        localStorage.removeItem('confirmationData');
      } catch (error) {
        console.error('Error al leer datos de confirmación:', error);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Cargando confirmación...</p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl font-bold text-ihm-dark mb-4">Algo salió mal</h1>
          <p className="text-gray-600 mb-8">
            No pudimos cargar los datos de tu cotización. Por favor, intenta nuevamente.
          </p>
          <Link
            href="/catalogo"
            className="inline-block px-6 py-3 bg-ihm-blue text-white rounded-lg font-semibold hover:opacity-90 transition"
          >
            ← Ir al Catálogo
          </Link>
        </div>
      </main>
    );
  }

  const telefonoFormato = `${data.codigoPais} ${data.telefono.slice(0, 1)} ${data.telefono.slice(1, 5)} ${data.telefono.slice(5)}`;

  return (
    <main className="min-h-screen bg-white">
      <div className="bg-ihm-light py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-ihm-dark">Confirmación de Cotización</h1>
        </div>
      </div>
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="mb-6">
            <svg className="w-20 h-20 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-ihm-dark mb-4">
            ¡{data.nombre}, tu cotización fue enviada con éxito!
          </h2>
        </div>
        <div className="bg-ihm-light rounded-lg p-8 mb-8">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Correo de confirmación</p>
              <p className="text-lg font-semibold text-ihm-dark">{data.correo}</p>
              <p className="text-sm text-gray-600 mt-2">Recibirás una copia de tu solicitud en este correo.</p>
            </div>
            <div className="border-t border-gray-300 pt-4">
              <p className="text-sm text-gray-600 mb-1">Teléfono de contacto</p>
              <p className="text-lg font-semibold text-ihm-dark">{telefonoFormato}</p>
              <p className="text-sm text-gray-600 mt-2">Nos pondremos en contacto contigo a través de este número.</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-ihm-blue rounded-lg p-6 mb-12">
          <h3 className="font-semibold text-ihm-dark mb-3">¿Qué sucede ahora?</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>✓ Hemos recibido tu cotización</li>
            <li>✓ Te enviaremos un correo de confirmación</li>
            <li>✓ Nuestro equipo revisará tu solicitud</li>
            <li>✓ Te contactaremos con una propuesta personalizada</li>
          </ul>
        </div>
        <div className="mb-12">
          <p className="text-gray-600 text-center mb-6">
            En caso de dudas, puedes escribirnos a WhatsApp:
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href="https://wa.me/56977755487"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Enviar WhatsApp 💬
            </a>
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <Link
            href="/catalogo"
            className="px-6 py-3 bg-ihm-blue text-white rounded-lg font-semibold hover:opacity-90 transition"
          >
            ← Volver al Catálogo
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border border-ihm-blue text-ihm-blue rounded-lg font-semibold hover:bg-ihm-light transition"
          >
            Ir al Inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
