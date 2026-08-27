/**
 * Verificación server-side de tokens de Cloudflare Turnstile.
 *
 * El token que genera el widget en el navegador se envía al backend en el campo
 * `cf-turnstile-response` y se valida aquí contra la API de siteverify de
 * Cloudflare antes de procesar cualquier formulario.
 */

const SITEVERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * Valida un token de Turnstile contra Cloudflare.
 *
 * @param token Valor de `cf-turnstile-response` recibido desde el formulario.
 * @returns `true` sólo si Cloudflare responde `success: true`; `false` en
 *          cualquier otro caso (token vacío, expirado, ya usado, error de red).
 * @throws  Error si `TURNSTILE_SECRET_KEY` no está configurada en el entorno.
 */
export async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    throw new Error('TURNSTILE_SECRET_KEY no está configurada');
  }

  if (!token) {
    return false;
  }

  try {
    const body = new URLSearchParams();
    body.append('secret', secret);
    body.append('response', token);

    const res = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    if (!res.ok) {
      return false;
    }

    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error('Error al verificar token de Turnstile:', err);
    return false;
  }
}
