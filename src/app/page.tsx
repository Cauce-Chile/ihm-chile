'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative w-full h-screen bg-gradient-to-br from-ihm-blue to-blue-900 flex items-center justify-center overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        </div>

        {/* Contenido del Hero */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Importación de Productos desde China
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Conectamos tu negocio con proveedores de confianza en China. Cotiza tus productos ahora y descubre cómo podemos ayudarte a crecer.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/catalogo"
              className="bg-white text-ihm-blue hover:bg-ihm-light px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              Ver Catálogo
            </Link>
            <Link
              href="/contacto"
              className="border-2 border-white text-white hover:bg-white hover:text-ihm-blue px-8 py-3 rounded-lg font-semibold transition-all"
            >
              Contactar
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Imagen placeholder (reemplazar con imagen real) */}
          <div className="relative h-96 md:h-full rounded-lg overflow-hidden shadow-lg">
            <div className="w-full h-full bg-ihm-light flex items-center justify-center">
              <span className="text-ihm-blue text-sm">Imagen de productos (placeholder)</span>
            </div>
          </div>

          {/* Contenido */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-ihm-dark mb-6">
              Quiénes Somos
            </h2>
            <p className="text-gray-600 text-lg mb-4 leading-relaxed">
              Somos una importadora especializada en conectar empresas chilenas con proveedores confiables en China. 
              Nuestro objetivo es simplificar el proceso de importación, ofreciendo productos de calidad a precios competitivos.
            </p>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              Con años de experiencia en el mercado asiático, garantizamos un servicio personalizado y profesional 
              para cada uno de nuestros clientes.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-ihm-blue text-xl font-bold">✓</span>
                <span>Acceso a múltiples categorías de productos</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-ihm-blue text-xl font-bold">✓</span>
                <span>Cotizaciones personalizadas y competitivas</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-ihm-blue text-xl font-bold">✓</span>
                <span>Asesoría especializada en importación</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-ihm-blue text-xl font-bold">✓</span>
                <span>Seguimiento completo de pedidos</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* BENEFICIOS SECTION */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-ihm-light">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-ihm-dark mb-12">
            ¿Por Qué Trabajar con IHM Chile?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Beneficio 1 */}
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-ihm-blue text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">
                💰
              </div>
              <h3 className="text-xl font-bold text-ihm-dark mb-3">Precios Competitivos</h3>
              <p className="text-gray-600">
                Acceso directo a proveedores en China con márgenes reducidos. 
                Tu mejor opción para importar productos de calidad.
              </p>
            </div>

            {/* Beneficio 2 */}
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-ihm-blue text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-ihm-dark mb-3">Rápido y Eficiente</h3>
              <p className="text-gray-600">
                Cotiza en línea en minutos. Nuestro sistema te permite comparar opciones 
                y enviar tu solicitud al instante.
              </p>
            </div>

            {/* Beneficio 3 */}
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-ihm-blue text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">
                🤝
              </div>
              <h3 className="text-xl font-bold text-ihm-dark mb-3">Soporte Profesional</h3>
              <p className="text-gray-600">
                Equipo dedicado para resolver tus dudas. Asesoría en cada paso 
                del proceso de importación.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENTES SECTION */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-ihm-dark mb-4">
          Empresas que Confían en Nosotros
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Más de 50 empresas en Chile trabajan con IHM Chile para sus necesidades de importación.
        </p>

        {/* Grid de logos (placeholder) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          {/* Estos serán reemplazados con logos reales */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((client) => (
            <div
              key={client}
              className="w-32 h-24 bg-ihm-light rounded-lg flex items-center justify-center border border-gray-200 hover:border-ihm-blue transition-colors"
            >
              <span className="text-gray-400 text-sm text-center px-2">Logo Cliente {client}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm mt-8 italic">
          Los logos serán agregados próximamente
        </p>
      </section>

      {/* CATALOGO PREVIEW SECTION */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-ihm-light">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-ihm-dark mb-6">
            Nuestro Catálogo
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Amplia variedad de productos importados desde China, disponibles para cotizar en línea.
          </p>

          {/* Grid placeholder de productos */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((product) => (
              <div
                key={product}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-500">Imagen Producto {product}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-ihm-dark mb-2">
                    Producto Ejemplo {product}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Descripción del producto importado desde China.
                  </p>
                  <p className="text-ihm-blue font-semibold mb-4">
                    Consultar precio
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/catalogo"
              className="bg-ihm-blue text-white hover:bg-blue-800 px-8 py-3 rounded-lg font-semibold transition-all inline-block"
            >
              Ver Catálogo Completo
            </Link>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-ihm-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Comienza Tu Cotización Hoy
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Selecciona los productos que necesitas y recibe una cotización personalizada 
            en el mismo día.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/catalogo"
              className="bg-ihm-blue hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              Ir al Cotizador
            </Link>
            <Link
              href="/contacto"
              className="border-2 border-white text-white hover:bg-white hover:text-ihm-dark px-8 py-3 rounded-lg font-semibold transition-all"
            >
              Enviar Consulta
            </Link>
          </div>
        </div>
      </section>

      {/* STATS SECTION (Opcional - para mostrar credibilidad) */}
      <section className="py-12 md:py-16 px-6 md:px-12 bg-ihm-light">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-ihm-blue mb-2">50+</div>
              <p className="text-gray-600">Empresas Clientes</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-ihm-blue mb-2">1000+</div>
              <p className="text-gray-600">Productos Disponibles</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-ihm-blue mb-2">24h</div>
              <p className="text-gray-600">Cotizaciones</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-ihm-blue mb-2">100%</div>
              <p className="text-gray-600">Satisfacción</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
