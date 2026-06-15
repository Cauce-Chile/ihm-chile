import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar campos requeridos
    if (!body.nombre || body.cantidad_minima === undefined) {
      return NextResponse.json(
        { error: 'nombre y cantidad_minima son requeridos' },
        { status: 400 }
      );
    }

    // Insertar en Supabase
    const { data, error } = await supabase
      .from('productos')
      .insert([
        {
          nombre: body.nombre,
          descripcion: body.descripcion || null,
          cantidad_minima: body.cantidad_minima,
          imagen_url: body.imagen_url || null,
          precio: body.precio || null,
          activo: body.activo !== false, // true por defecto
        },
      ])
      .select();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}