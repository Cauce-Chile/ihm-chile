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
  title: "IHM Chile — Importadora de productos desde China",
  description:
    "Catálogo de productos importados y sistema de cotización online para empresas chilenas.",
  keywords: "importadora, productos China, catálogo, cotización, Chile",
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