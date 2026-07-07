'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

function formatTelefonoDisplay(digits: string): string {
  const limpio = digits.slice(0, 9); // máximo 9 dígitos
  const parte1 = limpio.slice(0, 1);
  const parte2 = limpio.slice(1, 5);
  const parte3 = limpio.slice(5, 9);
  return [parte1, parte2, parte3].filter(Boolean).join(' ');
}

// Dado el string ya formateado, devuelve la posición (índice) justo
// después del n-ésimo dígito (digitCount), contando espacios incluidos.
function getPosForDigitCount(formatted: string, digitCount: number): number {
  if (digitCount <= 0) return 0;
  let count = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      count++;
      if (count === digitCount) return i + 1;
    }
  }
  return formatted.length;
}

export default function CotizarPage() {
  // Hooks al inicio
  const { items, clearCart } = useCart();
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    correo: '',
    codigoPais: '+56',
    telefono: '',
    mensaje: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const telefonoInputRef = useRef<HTMLInputElement>(null);

  // Funciones
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const newErrors: Record<string, string> = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    // Validar empresa
    if (!formData.empresa.trim()) {
      newErrors.empresa = 'La empresa es obligatoria';
    }

    // Validar correo
    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es obligatorio';
    } else if (!validateEmail(formData.correo)) {
      newErrors.correo = 'Correo inválido. Usa formato: ejemplo@dominio.com';
    }

    // Validar teléfono
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    }

    // Si hay errores, mostrarlos y detener
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);
      // Enviar cotización a la API
      const response = await fetch('/api/cotizaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          empresa: formData.empresa,
          correo: formData.correo,
          telefono: `${formData.codigoPais}${formData.telefono}`,
          pais: formData.codigoPais,
          mensaje: formData.mensaje,
          items: items.map((item: { id: string; quantity: number }) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar la cotización');
      }

      // Limpiar carrito
      clearCart();

      // Guardar datos en localStorage para la página de confirmación
      localStorage.setItem('confirmationData', JSON.stringify({
        nombre: formData.nombre,
        correo: formData.correo,
        codigoPais: formData.codigoPais,
        telefono: formData.telefono,
      }));

      // Redirigir a página de confirmación
      window.location.href = '/confirmacion';

    } catch {
      setSubmitting(false);
      setErrors({ general: 'Hubo un error al enviar tu cotización. Por favor intenta de nuevo.' });
    }
  };

  // Si no hay items en el carrito, mostrar mensaje
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl font-bold text-ihm-dark mb-4">Tu Cotización está vacía</h1>
          <p className="text-gray-600 mb-8">Agrega productos al catálogo para crear una cotización.</p>
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

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-ihm-light py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-ihm-dark">Completar Cotización</h1>
        </div>
      </div>

      {/* Contenido */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Resumen de Productos */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-ihm-dark mb-4">Productos en tu Cotización</h2>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-4 border-b border-gray-200 last:border-b-0">
                <div>
                  <p className="font-semibold text-ihm-dark">{item.name}</p>
                  <p className="text-sm text-gray-600">Cantidad: {item.quantity} unidades</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulario */}
        <div>
          <h2 className="text-xl font-semibold text-ihm-dark mb-6">Tus Datos</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-ihm-dark mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                placeholder="Juan Pérez"
                value={formData.nombre}
                onChange={(e) => {
                  const nuevoNombre = e.target.value;
                  setFormData({ ...formData, nombre: nuevoNombre });
                  if (nuevoNombre.trim()) {
                    setErrors({ ...errors, nombre: '' });
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ihm-blue placeholder-gray-400 text-gray-900"
              />
              {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
            </div>

            {/* Empresa */}
            <div>
              <label className="block text-sm font-semibold text-ihm-dark mb-2">
                Empresa *
              </label>
              <input
                type="text"
                placeholder="Mi Empresa Ltda."
                value={formData.empresa}
                onChange={(e) => {
                  const nuevaEmpresa = e.target.value;
                  setFormData({ ...formData, empresa: nuevaEmpresa });
                  if (nuevaEmpresa.trim()) {
                    setErrors({ ...errors, empresa: '' });
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ihm-blue placeholder-gray-400 text-gray-900"
              />
              {errors.empresa && <p className="text-red-500 text-xs mt-1">{errors.empresa}</p>}
            </div>

            {/* Correo */}
            <div>
              <label className="block text-sm font-semibold text-ihm-dark mb-2">
                Correo Electrónico *
              </label>
              <input
                type="email"
                placeholder="juan@empresa.com"
                value={formData.correo}
                onChange={(e) => {
                  const nuevoCorreo = e.target.value;
                  setFormData({ ...formData, correo: nuevoCorreo });
                  if (nuevoCorreo && !validateEmail(nuevoCorreo)) {
                    setErrors({ ...errors, correo: 'Correo inválido. Usa formato: ejemplo@dominio.com' });
                  } else {
                    setErrors({ ...errors, correo: '' });
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ihm-blue placeholder-gray-400 text-gray-900"
              />
              {errors.correo && <p className="text-red-500 text-xs mt-1">{errors.correo}</p>}
            </div>

            {/* Teléfono con Código de País */}
            <div>
              <label className="block text-sm font-semibold text-ihm-dark mb-2">
                Teléfono *
              </label>
              <div className="flex gap-3">
                {/* Dropdown Código de País */}
                <select
                  value={formData.codigoPais}
                  onChange={(e) => setFormData({ ...formData, codigoPais: e.target.value })}
                  className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ihm-blue placeholder-gray-400 text-gray-900"
                >
                  <option value="+56">🇨🇱 +56</option>
                  <option value="+51">🇵🇪 +51</option>
                  <option value="+57">🇨🇴 +57</option>
                  <option value="+55">🇧🇷 +55</option>
                  <option value="+34">🇪🇸 +34</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+49">🇩🇪 +49</option>
                  <option value="+39">🇮🇹 +39</option>
                </select>

                {/* Input Teléfono - Solo números */}
                <input
                  ref={telefonoInputRef}
                  type="tel"
                  placeholder="9 1234 5678"
                  value={formatTelefonoDisplay(formData.telefono)}
                  onChange={(e) => {
                    const cursorPos = e.target.selectionStart ?? 0;
                    const digitsBeforeCursor = e.target.value
                      .slice(0, cursorPos)
                      .replace(/\D/g, '').length;

                    const soloNumeros = e.target.value.replace(/\D/g, '');
                    setFormData({ ...formData, telefono: soloNumeros });
                    if (soloNumeros.trim()) {
                      setErrors({ ...errors, telefono: '' });
                    }

                    requestAnimationFrame(() => {
                      const formatted = formatTelefonoDisplay(soloNumeros);
                      const nuevaPos = getPosForDigitCount(formatted, digitsBeforeCursor);
                      telefonoInputRef.current?.setSelectionRange(nuevaPos, nuevaPos);
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ihm-blue placeholder-gray-400 text-gray-900"
                />
              </div>
              {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
            </div>

            {/* Mensaje Opcional */}
            <div>
              <label className="block text-sm font-semibold text-ihm-dark mb-2">
                Mensaje (Opcional)
              </label>
              <textarea
                placeholder="Cuéntanos si tienes algún requerimiento especial..."
                value={formData.mensaje}
                onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ihm-blue placeholder-gray-400 text-gray-900"
              />
            </div>

          {/* Error general */}
            {errors.general && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-3 pt-6">
              <Link
                href="/cotizacion"
                className="flex-1 px-4 py-3 border border-ihm-blue text-ihm-blue rounded-lg font-semibold hover:bg-ihm-light transition text-center"
              >
                ← Volver
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-3 bg-ihm-blue text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Enviando...' : 'Enviar Cotización'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}