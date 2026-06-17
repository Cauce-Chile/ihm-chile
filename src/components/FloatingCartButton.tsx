'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function FloatingCartButton() {
  const pathname = usePathname();
  const { items } = useCart();

  const itemCount = items.length;

  // Ocultar si:
  // 1. No hay items en el carrito
  // 2. Estamos en /cotizacion o /cotizar
  if (itemCount === 0 || pathname === '/cotizacion' || pathname === '/cotizar' || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <Link
      href="/cotizacion"
      className="fixed bottom-6 right-6 w-16 h-16 bg-ihm-blue text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-transform duration-200 z-40"
      title="Ver cotización"
    >
      {/* Ícono carrito (SVG simple) */}
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>

      {/* Badge con contador */}
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </Link>
  );
}