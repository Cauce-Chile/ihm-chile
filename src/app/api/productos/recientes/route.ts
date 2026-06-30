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
    const { data, error } = await supabase
      .from('productos')
      .select('*');

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const recientes = (data || [])
      .filter((p: { activo: boolean }) => p.activo === true)
      .sort((a: { creado_en: string }, b: { creado_en: string }) =>
        new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime()
      )
      .slice(0, 3);

    return NextResponse.json(recientes);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
