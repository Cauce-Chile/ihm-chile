import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, correo, telefono, pais, mensaje, items } = body;

    console.log('🔍 POST /api/cotizaciones - body recibido:', JSON.stringify(body));

    // Validar campos obligatorios
    if (!nombre || !correo || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    // 1. Buscar si el cliente ya existe por correo
    console.log('🔍 Paso 1: Buscar cliente existente...');
    const { data: clienteExistente } = await supabase
      .from('clientes')
      .select('id')
      .eq('correo', correo)
      .single();

    console.log('🔍 Cliente existente:', JSON.stringify(clienteExistente));

    let clienteId: string;

    if (clienteExistente) {
      // Cliente existe — usar su ID directamente
      clienteId = clienteExistente.id;
      console.log('🔍 Cliente encontrado, ID:', clienteId);
    } else {
      // Cliente nuevo — insertar
      console.log('🔍 Cliente nuevo, insertando...');
      const { data: nuevoCliente, error: insertError } = await supabase
        .from('clientes')
        .insert({ nombre, correo, telefono, pais })
        .select('id')
        .single();

      console.log('🔍 Resultado insert cliente:', JSON.stringify(nuevoCliente));
      console.log('🔍 Error insert cliente:', JSON.stringify(insertError));

      if (insertError || !nuevoCliente) {
        return NextResponse.json(
          { error: insertError?.message || 'Error al crear cliente' },
          { status: 500 }
        );
      }

      clienteId = nuevoCliente.id;
    }

    // 2. Crear la cotización
    console.log('🔍 Paso 2: Crear cotización...');
    const { data: cotizacion, error: cotizacionError } = await supabase
      .from('cotizaciones')
      .insert({ cliente_id: clienteId, mensaje })
      .select('id')
      .single();

    console.log('🔍 Resultado cotización:', JSON.stringify(cotizacion));
    console.log('🔍 Error cotización:', JSON.stringify(cotizacionError));

    if (cotizacionError || !cotizacion) {
      return NextResponse.json(
        { error: cotizacionError?.message || 'Error al crear cotización' },
        { status: 500 }
      );
    }

    // 3. Insertar los items
    console.log('🔍 Paso 3: Insertar items...');
    const itemsData = items.map((item: { id: string; quantity: number }) => ({
      cotizacion_id: cotizacion.id,
      producto_id: item.id,
      cantidad: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('items_cotizacion')
      .insert(itemsData);

    console.log('🔍 Error items:', JSON.stringify(itemsError));

    if (itemsError) {
      return NextResponse.json(
        { error: itemsError.message },
        { status: 500 }
      );
    }

    console.log('✅ Cotización creada exitosamente');
    return NextResponse.json(
      { success: true, cotizacion_id: cotizacion.id },
      { status: 201 }
    );

  } catch (err) {
    console.error('❌ Exception:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}