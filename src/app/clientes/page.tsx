export const dynamic = 'force-dynamic';

interface Empresa {
  id: string;
  nombre: string;
  logo_url: string | null;
  activo: boolean;
}

async function getEmpresas(): Promise<Empresa[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/empresas`, {
      cache: 'no-store',
    });

    if (!res.ok) return [];

    return res.json();
  } catch {
    return [];
  }
}

export default async function ClientesPage() {
  const empresas = await getEmpresas();

  return (
    <main className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-ihm-blue to-blue-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Nuestros Clientes</h1>
          <p className="text-blue-100">
            Empresas que confían en IHM Chile para sus importaciones desde China
          </p>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {empresas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Próximamente agregaremos nuestros clientes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {empresas.map((empresa) => (
              <div
                key={empresa.id}
                className="w-32 h-24 bg-ihm-light rounded-lg flex items-center justify-center border border-gray-200 hover:border-ihm-blue transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={empresa.logo_url || ''}
                  alt={empresa.nombre}
                  className="max-w-full max-h-full object-contain p-2"
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
