"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const prevScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > prevScrollY.current && currentY > 80) {
        setVisible(false);
      } else if (currentY < prevScrollY.current) {
        setVisible(true);
      }
      prevScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="IHM Chile"
              width={48}
              height={48}
              className="object-contain"
            />
            <span className="text-ihm-dark font-semibold text-lg">
              IHM Chile
            </span>
          </Link>

          {/* Links escritorio */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-ihm-dark hover:text-ihm-blue transition-colors font-medium">
              Inicio
            </Link>
            <Link href="/catalogo" className="text-ihm-dark hover:text-ihm-blue transition-colors font-medium">
              Catálogo
            </Link>
            <Link href="/clientes" className="text-ihm-dark hover:text-ihm-blue transition-colors font-medium">
              Clientes
            </Link>
            <Link href="/contacto" className="text-ihm-dark hover:text-ihm-blue transition-colors font-medium">
              Contacto
            </Link>
            <Link
              href="/cotizacion"
              className="bg-ihm-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Ver cotización
            </Link>
          </div>

          {/* Botón menú móvil */}
          <button
            className="md:hidden text-ihm-dark"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menú móvil desplegable */}
        {menuOpen && (
          <div className="md:hidden py-4 flex flex-col gap-4 border-t border-gray-100">
            <Link href="/" className="text-ihm-dark hover:text-ihm-blue font-medium" onClick={() => setMenuOpen(false)}>
              Inicio
            </Link>
            <Link href="/catalogo" className="text-ihm-dark hover:text-ihm-blue font-medium" onClick={() => setMenuOpen(false)}>
              Catálogo
            </Link>
            <Link href="/clientes" className="text-ihm-dark hover:text-ihm-blue font-medium" onClick={() => setMenuOpen(false)}>
              Clientes
            </Link>
            <Link href="/contacto" className="text-ihm-dark hover:text-ihm-blue font-medium" onClick={() => setMenuOpen(false)}>
              Contacto
            </Link>
            <Link
              href="/cotizacion"
              className="bg-ihm-blue text-white px-4 py-2 rounded-lg text-center font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Ver cotización
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}