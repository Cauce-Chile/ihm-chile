'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import TurnstileWidget, {
  type TurnstileWidgetHandle,
  TURNSTILE_UNAVAILABLE,
} from '@/components/TurnstileWidget';

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    asunto: '',
    mensaje: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState(false);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validar = () => {
    const nuevosErrores: Record<string, string> = {};
    if (!formData.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio.';
    if (!formData.correo.trim()) {
      nuevosErrores.correo = 'El correo es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      nuevosErrores.correo = 'Ingresa un correo válido.';
    }
    if (!formData.asunto.trim()) nuevosErrores.asunto = 'El asunto es obligatorio.';
    if (!formData.mensaje.trim()) nuevosErrores.mensaje = 'El mensaje es obligatorio.';
    return nuevosErrores;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const erroresEncontrados = validar();
    if (Object.keys(erroresEncontrados).length > 0) {
      setErrors(erroresEncontrados);
      return;
    }

    setErrorEnvio(false);
    setTurnstileError(null);
    setEnviando(true);
    try {
      let token: string;
      try {
        token = await turnstileRef.current!.execute();
      } catch (err) {
        const isUnavailable =
          err instanceof Error && err.message === TURNSTILE_UNAVAILABLE;
        setTurnstileError(
          isUnavailable
            ? 'No pudimos verificar tu conexión. Si usas un bloqueador de anuncios o una red corporativa, intenta desactivarlo temporalmente o escríbenos directamente a cristobal@ihmchile.com'
            : 'La verificación de seguridad falló. Inténtalo nuevamente.'
        );
        return;
      }

      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, 'cf-turnstile-response': token }),
      });

      if (res.status === 400) {
        setTurnstileError(
          'La verificación de seguridad falló. Inténtalo nuevamente.'
        );
        return;
      }

      if (!res.ok) {
        setErrorEnvio(true);
        return;
      }

      setEnviado(true);
    } catch {
      setErrorEnvio(true);
    } finally {
      setEnviando(false);
      turnstileRef.current?.reset();
    }
  };

  if (enviado) {
    return (
      <main className="min-h-screen bg-ihm-light flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-10 max-w-md w-full text-center">
          <div className="mb-6">
            <svg className="w-20 h-20 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-ihm-dark mb-2">
            ¡Mensaje enviado!
          </h2>
          <p className="text-gray-600 mb-6">
            Gracias por contactarnos. Te responderemos a la brevedad.
          </p>
          <Link href="/catalogo" className="text-ihm-blue underline text-sm">
            Revisa nuestro catálogo
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ihm-light">
      <section className="bg-ihm-blue text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-3">Contáctanos</h1>
        <p className="text-blue-100 text-lg max-w-xl mx-auto">
          ¿Tienes preguntas sobre nuestros productos o servicios? Escríbenos y te
          respondemos a la brevedad.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold text-ihm-dark mb-6">Contacto directo</h2>
          <div className="space-y-5">
            <div>
              <p className="font-semibold text-ihm-dark mb-2">Correo electrónico</p>
              <a
                href="mailto:cristobal@ihmchile.com"
                className="inline-flex items-center gap-2 bg-ihm-blue hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-full transition-colors text-sm"
              >
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
                cristobal@ihmchile.com
              </a>
            </div>
            
              <div>
    
                <a
                  href="https://wa.me/56977755487"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-full transition-colors text-sm"
                >
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                  </svg>
                  Escríbenos por WhatsApp
                </a>
              </div>
            
          </div>
          <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-gray-600">
            💡 Si quieres cotizar productos, usa nuestro{' '}
            <Link href="/catalogo" className="text-ihm-blue font-medium hover:underline">
              catálogo online
            </Link>
            . Este formulario es para consultas generales.
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-ihm-dark mb-6">Envíanos un mensaje</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-ihm-dark mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Juan Pérez"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ihm-blue ${
                  errors.nombre ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {errors.nombre && (
                <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ihm-dark mb-1">
                Correo electrónico <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="juan@empresa.com"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ihm-blue ${
                  errors.correo ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {errors.correo && (
                <p className="text-red-500 text-xs mt-1">{errors.correo}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ihm-dark mb-1">
                Asunto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="asunto"
                value={formData.asunto}
                onChange={handleChange}
                placeholder="Consulta sobre productos o servicios"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ihm-blue ${
                  errors.asunto ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {errors.asunto && (
                <p className="text-red-500 text-xs mt-1">{errors.asunto}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ihm-dark mb-1">
                Mensaje <span className="text-red-500">*</span>
              </label>
              <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                rows={4}
                placeholder="Cuéntanos tu consulta o requerimiento..."
                className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ihm-blue resize-none ${
                  errors.mensaje ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {errors.mensaje && (
                <p className="text-red-500 text-xs mt-1">{errors.mensaje}</p>
              )}
            </div>

            {errorEnvio && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                No pudimos enviar tu mensaje. Por favor escríbenos directo a{' '}
                <a href="mailto:cristobal@ihmchile.com" className="font-medium underline">
                  cristobal@ihmchile.com
                </a>{' '}
                o por WhatsApp.
              </div>
            )}

            {turnstileError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {turnstileError}
              </div>
            )}

            <TurnstileWidget
              ref={turnstileRef}
              onError={() =>
                setTurnstileError(
                  'La verificación de seguridad falló. Inténtalo nuevamente.'
                )
              }
            />

            <button
              type="submit"
              disabled={enviando}
              className="w-full bg-ihm-blue text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {enviando ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}