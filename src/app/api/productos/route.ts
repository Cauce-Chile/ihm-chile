import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    global: {
      fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }),
    },
  }
);

export async function GET() {
  try {
    // Obtener TODOS los productos (sin filtro)
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) {
      console.error('❌ Error Supabase:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Filtrar en JavaScript los que tengan activo = true
    const productosActivos = (data || []).filter(
      (producto: { activo: boolean }) => producto.activo === true
    );

    console.log('✅ Productos activos:', productosActivos.length);
    return NextResponse.json(productosActivos);
  } catch (err) {
    console.error('❌ Exception:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}