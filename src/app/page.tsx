'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LogosEmpresas from '@/components/LogosEmpresas';
import ProductCard from '@/components/ProductCard';

interface ProductoReciente {
  id: string;
  nombre: string;
  descripcion: string | null;
  imagen_url: string | null;
  cantidad_minima: number;
  activo: boolean;
  creado_en: string;
}

export default function Home() {
  const [productosRecientes, setProductosRecientes] = useState<ProductoReciente[]>([]);
  const [loadingProductos, setLoadingProductos] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch('/api/productos/recientes', { cache: 'no-store' });
        if (!res.ok) throw new Error('Error');
        const data = await res.json();
        setProductosRecientes(data);
      } catch {
        setProductosRecientes([]);
      } finally {
        setLoadingProductos(false);
      }
    };
    cargar();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <Image
            src="/images/home-contenedores.jpg"
            alt=""
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Overlay degradado */}
        <div className="absolute inset-0 bg-gradient-to-br from-ihm-blue/55 to-blue-900/55"></div>

        {/* Fondo decorativo */}
        <div className="absolute inset-0 opacity-10 z-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        </div>

        {/* Contenido del Hero */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Importación de Productos con Proveedores Auditados
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Conectamos tu negocio con proveedores confiables en China, Chile, Brasil y Perú. Cotiza tus productos ahora y descubre cómo podemos ayudarte a crecer.
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
            <Image
              src="/images/equipo-aduana.jpg"
              alt="Equipo IHM Chile"
              fill
              className="object-cover"
            />
          </div>

          {/* Contenido */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-ihm-dark mb-6">
              Quiénes Somos
            </h2>
            <p className="text-gray-600 text-lg mb-4 leading-relaxed">
              Somos una empresa dedicada a las importaciones, con Servicio Logístico, enfocados en Multi Productos con experiencia en Marketing Promocional, Vestuario, Envases Descartables, Material POP. Nos enfocamos en la búsqueda, diseño, creación y desarrollo de productos innovadores, lo que nos convierte en un excelente aliado para complementar campañas de alto impacto y así aumentar la imagen de marca a un precio competitivo.
            </p>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              Trabajamos con fábricas en China, Chile, Brasil y Perú, previamente auditadas y controladas por nuestra área de QC, lo que nos permite obtener mayor nivel de personalización, haciendo productos a medida de cada uno de nuestros clientes.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-ihm-blue text-xl font-bold">✓</span>
                <span>Servicio logístico integral</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-ihm-blue text-xl font-bold">✓</span>
                <span>Multi productos: Marketing Promocional, Vestuario, Envases Descartables, Material POP</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-ihm-blue text-xl font-bold">✓</span>
                <span>Fábricas auditadas y controladas por nuestra área de QC</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-ihm-blue text-xl font-bold">✓</span>
                <span>Personalización de productos a medida de cada cliente</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* VALORES SECTION */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Valor 1 */}
          <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-ihm-blue text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">
              💰
            </div>
            <h3 className="text-xl font-bold text-ihm-dark mb-3">El mejor producto al mejor precio</h3>
            <p className="text-gray-600">
              Estamos enfocados en optimizar los costos, con un producto de calidad y todo el servicio que tu empresa necesita.
            </p>
          </div>

          {/* Valor 2 */}
          <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-ihm-blue text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">
              🌱
            </div>
            <h3 className="text-xl font-bold text-ihm-dark mb-3">Siempre preocupados del medio ambiente</h3>
            <p className="text-gray-600">
              Contamos con diversos productos realizados a la medida de tus necesidades, además de ser 100% amigables con el ecosistema.
            </p>
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
          Conoce algunas de las empresas que ya han confiado en la experiencia de IHM Chile para satisfacer sus necesidades de importación.
        </p>

        <LogosEmpresas />
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

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {loadingProductos || productosRecientes.length === 0
              ? [1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="w-full h-48 bg-gray-300" />
                    <div className="p-6 space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                ))
              : productosRecientes.map((p) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    name={p.nombre}
                    description={p.descripcion ?? ''}
                    image={p.imagen_url ?? ''}
                    minOrder={p.cantidad_minima}
                  />
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
