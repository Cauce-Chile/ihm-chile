import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-ihm-dark text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="IHM Chile"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="font-semibold text-lg">IHM Chile</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Importadora de productos desde China. Soluciones de calidad para empresas chilenas.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-ihm-blue mb-1">Navegación</h3>
            <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">Inicio</Link>
            <Link href="/catalogo" className="text-gray-400 hover:text-white transition-colors text-sm">Catálogo</Link>
            <Link href="/clientes" className="text-gray-400 hover:text-white transition-colors text-sm">Clientes</Link>
            <Link href="/contacto" className="text-gray-400 hover:text-white transition-colors text-sm">Contacto</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-ihm-blue mb-1">Contacto</h3>
            <p className="text-gray-400 text-sm">cristobal@ihmchile.com</p>
            <p className="text-gray-400 text-sm">Santiago, Chile</p>
            <a href="https://wa.me/56977755487" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm">+56 9 7775 5487</a>
          </div>

        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} IHM Chile. Todos los derechos reservados. |{" "}
          <a href="https://www.caucechile.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">Desarrollado por Cauce Chile</a>
          {" | "}
<Link href="/admin/login" className="hover:text-gray-300 transition-colors">Acceso Admin</Link>
        </div>

      </div>
    </footer>
  );
}