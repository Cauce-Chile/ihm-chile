import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const LOGO_URL = `${BASE_URL}/logo.png`;
const IHM_BLUE = '#1E52D0';

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

interface ItemCotizado {
  nombre: string;
  cantidad: number;
}


function baseLayout(title: string, body: string): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f7fc;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f7fc;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background-color:${IHM_BLUE};padding:24px 32px;">
              <img src="${LOGO_URL}" alt="IHM Chile" width="48" height="48"
                   style="display:inline-block;vertical-align:middle;border-radius:4px;" />
              <span style="display:inline-block;vertical-align:middle;margin-left:12px;
                           color:#ffffff;font-size:22px;font-weight:700;">IHM Chile</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background-color:#f5f7fc;border-top:1px solid #e5e7eb;
                       color:#9ca3af;font-size:12px;text-align:center;">
              IHM Chile — Importaciones desde China<br/>
              Este correo fue generado automáticamente.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

interface ContactoData {
  nombre: string;
  correo: string;
  asunto: string;
  mensaje: string;
}

export async function sendContactoNotification(
  data: ContactoData
): Promise<{ success: boolean; error?: string }> {
  try {
    const body = `
      <h2 style="margin:0 0 4px;font-size:20px;color:${IHM_BLUE};font-weight:700;">
        Nuevo mensaje de contacto
      </h2>
      <p style="margin:0 0 24px;font-size:13px;color:#6b7280;">Asunto: <strong>${data.asunto}</strong></p>

      <table width="100%" cellpadding="0" cellspacing="0"
             style="margin-bottom:24px;border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">
        <tr style="background-color:#f5f7fc;">
          <td style="padding:10px 16px;font-size:12px;font-weight:700;color:#6b7280;
                     text-transform:uppercase;letter-spacing:0.05em;">Nombre</td>
          <td style="padding:10px 16px;font-size:12px;font-weight:700;color:#6b7280;
                     text-transform:uppercase;letter-spacing:0.05em;">Correo</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;font-size:14px;color:#2d2d2d;">${data.nombre}</td>
          <td style="padding:12px 16px;font-size:14px;color:#2d2d2d;">${data.correo}</td>
        </tr>
      </table>

      <div style="padding:16px;background-color:#f5f7fc;border-radius:6px;
                   border-left:4px solid ${IHM_BLUE};">
        <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#6b7280;
                   text-transform:uppercase;letter-spacing:0.05em;">Mensaje</p>
        <p style="margin:0;font-size:14px;color:#2d2d2d;white-space:pre-wrap;">${data.mensaje}</p>
      </div>`;

    const { error } = await resend.emails.send({
      from: 'IHM Chile <cotizaciones@ihmchile.com>',
      replyTo: data.correo,
      to: 'cristobal@ihmchile.com',
      subject: `Contacto web: ${data.asunto}`,
      html: baseLayout('Nuevo mensaje de contacto - IHM Chile', body),
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Error desconocido' };
  }
}

export async function sendCotizacionAdminNotification(
  cotizacion: CotizacionRef,
  cliente: Cliente,
  items: ItemCotizado[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const folio = String(cotizacion.numero).padStart(4, '0');

    const itemRows = items
      .map(
        (item) => `
        <tr>
          <td style="padding:10px 16px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#2d2d2d;">
            ${item.nombre}
          </td>
          <td style="padding:10px 16px;border-bottom:1px solid #f0f0f0;font-size:14px;
                     color:#2d2d2d;text-align:center;">
            ${item.cantidad}
          </td>
        </tr>`
      )
      .join('');

    const mensajeSection = cotizacion.mensaje
      ? `<div style="margin-top:24px;padding:16px;background-color:#f5f7fc;border-radius:6px;
                     border-left:4px solid ${IHM_BLUE};">
           <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#6b7280;
                     text-transform:uppercase;letter-spacing:0.05em;">Mensaje del cliente</p>
           <p style="margin:0;font-size:14px;color:#2d2d2d;">${cotizacion.mensaje}</p>
         </div>`
      : '';

    const body = `
      <h2 style="margin:0 0 4px;font-size:20px;color:${IHM_BLUE};font-weight:700;">
        Nueva cotización recibida
      </h2>
      <p style="margin:0 0 24px;font-size:13px;color:#6b7280;">Folio: <strong>#${folio}</strong></p>

      <table width="100%" cellpadding="0" cellspacing="0"
             style="margin-bottom:24px;border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">
        <tr style="background-color:#f5f7fc;">
          <td style="padding:10px 16px;font-size:12px;font-weight:700;color:#6b7280;
                     text-transform:uppercase;letter-spacing:0.05em;">Cliente</td>
          <td style="padding:10px 16px;font-size:12px;font-weight:700;color:#6b7280;
                     text-transform:uppercase;letter-spacing:0.05em;">Correo</td>
          ${cliente.empresa ? `<td style="padding:10px 16px;font-size:12px;font-weight:700;color:#6b7280;
                     text-transform:uppercase;letter-spacing:0.05em;">Empresa</td>` : ''}
          ${cliente.telefono ? `<td style="padding:10px 16px;font-size:12px;font-weight:700;color:#6b7280;
                     text-transform:uppercase;letter-spacing:0.05em;">Teléfono</td>` : ''}
        </tr>
        <tr>
          <td style="padding:12px 16px;font-size:14px;color:#2d2d2d;">${cliente.nombre}</td>
          <td style="padding:12px 16px;font-size:14px;color:#2d2d2d;">${cliente.correo}</td>
          ${cliente.empresa ? `<td style="padding:12px 16px;font-size:14px;color:#2d2d2d;">${cliente.empresa}</td>` : ''}
          ${cliente.telefono ? `<td style="padding:12px 16px;font-size:14px;color:#2d2d2d;">${cliente.telefono}</td>` : ''}
        </tr>
      </table>

      <h3 style="margin:0 0 8px;font-size:14px;font-weight:700;color:#2d2d2d;">
        Productos solicitados
      </h3>
      <table width="100%" cellpadding="0" cellspacing="0"
             style="border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">
        <tr style="background-color:#f5f7fc;">
          <th style="padding:10px 16px;font-size:12px;font-weight:700;color:#6b7280;
                     text-transform:uppercase;letter-spacing:0.05em;text-align:left;">Producto</th>
          <th style="padding:10px 16px;font-size:12px;font-weight:700;color:#6b7280;
                     text-transform:uppercase;letter-spacing:0.05em;text-align:center;">Cantidad</th>
        </tr>
        ${itemRows}
      </table>

      ${mensajeSection}`;

    const { error } = await resend.emails.send({
      from: 'IHM Chile <cotizaciones@ihmchile.com>',
      replyTo: 'cristobal@ihmchile.com',
      to: process.env.ADMIN_EMAIL!,
      subject: `Nueva cotización #${folio} recibida`,
      html: baseLayout(`Nueva cotización #${folio}`, body),
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Error desconocido' };
  }
}

export async function sendCotizacionClienteConfirmation(
  cliente: Cliente,
  cotizacion: CotizacionRef,
  items: ItemCotizado[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const folio = String(cotizacion.numero).padStart(4, '0');

    const itemList = items
      .map(
        (item) =>
          `<li style="padding:4px 0;font-size:14px;color:#2d2d2d;">
             ${item.nombre} <span style="color:#6b7280;">(${item.cantidad} ud.)</span>
           </li>`
      )
      .join('');

    const body = `
      <h2 style="margin:0 0 8px;font-size:20px;color:${IHM_BLUE};font-weight:700;">
        ¡Hemos recibido tu cotización!
      </h2>
      <p style="margin:0 0 24px;font-size:15px;color:#2d2d2d;">
        Hola <strong>${cliente.nombre}</strong>, gracias por contactarnos.<br/>
        Hemos registrado tu solicitud correctamente.
      </p>

      ${cliente.empresa ? `<p style="margin:0 0 24px;font-size:14px;color:#6b7280;">
        Empresa: <strong>${cliente.empresa}</strong>
      </p>` : ''}

      <div style="padding:16px;background-color:#f5f7fc;border-radius:6px;margin-bottom:24px;">
        <p style="margin:0;font-size:13px;color:#6b7280;">Número de referencia</p>
        <p style="margin:4px 0 0;font-size:22px;font-weight:700;color:${IHM_BLUE};">
          #${folio}
        </p>
      </div>

      <h3 style="margin:0 0 8px;font-size:14px;font-weight:700;color:#2d2d2d;">
        Productos solicitados
      </h3>
      <ul style="margin:0 0 24px;padding-left:20px;">
        ${itemList}
      </ul>

      <p style="margin:0;font-size:15px;color:#2d2d2d;line-height:1.6;">
        Un ejecutivo de IHM Chile revisará tu solicitud y se pondrá en contacto contigo
        a la brevedad para coordinar los detalles de tu importación.
      </p>`;

    const { error } = await resend.emails.send({
      from: 'IHM Chile <cotizaciones@ihmchile.com>',
      replyTo: 'cristobal@ihmchile.com',
      to: cliente.correo,
      subject: 'Hemos recibido tu cotización - IHM Chile',
      html: baseLayout('Confirmación de cotización - IHM Chile', body),
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Error desconocido' };
  }
}
