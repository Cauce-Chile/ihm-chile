import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from '@/context/CartContext';
import FloatingCartButton from "@/components/FloatingCartButton";
import SessionProviderWrapper from '@/components/SessionProviderWrapper';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ihmchile.com'),
  title: "IHM Chile — Importadora de Productos con Proveedores Auditados",
  description:
    "Catálogo de productos importados desde China, Chile, Brasil y Perú, con proveedores auditados. Cotización online para empresas chilenas.",
  keywords: "importadora Chile, productos China, marketing promocional, vestuario, envases descartables, material POP, cotización online",
  openGraph: {
    title: "IHM Chile — Importadora de Productos con Proveedores Auditados",
    description:
      "Catálogo de productos importados desde China, Chile, Brasil y Perú, con proveedores auditados. Cotización online para empresas chilenas.",
    url: 'https://ihmchile.com',
    siteName: 'IHM Chile',
    images: [
      {
        url: '/images/home-contenedores.jpg',
        width: 1200,
        height: 630,
        alt: 'IHM Chile — Importadora de Productos',
      },
    ],
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "IHM Chile — Importadora de Productos con Proveedores Auditados",
    description:
      "Catálogo de productos importados desde China, Chile, Brasil y Perú, con proveedores auditados.",
    images: ['/images/home-contenedores.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <SessionProviderWrapper>
          <CartProvider>
            <Navbar />
            <FloatingCartButton />
            <main className="flex-1 pt-16">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}