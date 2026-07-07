import { NextResponse } from 'next/server';
import { sendContactoNotification } from '@/lib/resend';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, correo, asunto, mensaje } = body;

    if (!nombre || !correo || !asunto || !mensaje) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    const { success, error } = await sendContactoNotification({
      nombre,
      correo,
      asunto,
      mensaje,
    });

    if (!success) {
      console.error('Error al enviar correo de contacto:', error);
      return NextResponse.json(
        { error: 'No se pudo enviar el mensaje' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error en POST /api/contacto:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
