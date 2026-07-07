import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

interface Cliente {
  nombre: string;
  correo: string;
  telefono?: string | null;
  pais?: string | null;
  empresa?: string | null;
}

interface CotizacionRef {
  id: string;
  numero: number;
  mensaje?: string | null;
}

export async function sendCotizacionAdminWhatsApp(
  cotizacion: CotizacionRef,
  cliente: Cliente
): Promise<{ success: boolean; error?: string }> {
  try {
    const folio = String(cotizacion.numero).padStart(4, '0');

    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM!,
      to: process.env.ADMIN_WHATSAPP!,
      contentSid: process.env.TWILIO_CONTENT_SID_ADMIN,
      contentVariables: JSON.stringify({ '1': folio, '2': cliente.nombre, '3': cliente.empresa ?? '' }),
    });

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Error desconocido' };
  }
}
