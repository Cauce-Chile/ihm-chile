import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad | IHM Chile',
  description:
    'Política de privacidad y tratamiento de datos personales de IHM Chile.',
};

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-ihm-light">
      <section className="bg-ihm-blue text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-3">Política de Privacidad</h1>
        <p className="text-blue-100 text-lg">
          IHM Chile — Importaciones desde China
        </p>
        <p className="text-blue-100 text-sm mt-1">
          Última actualización: agosto de 2026
        </p>
      </section>

      <article className="max-w-3xl mx-auto px-4 py-16 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-ihm-dark mb-4">
            1. Responsable del tratamiento
          </h2>
          <p>
            IHM Chile es responsable del tratamiento de los datos personales
            recopilados a través de este sitio web. Para cualquier consulta
            relacionada con la privacidad, puede contactarnos en{' '}
            <a
              href="mailto:cristobal@ihmchile.com"
              className="text-ihm-blue font-medium hover:underline"
            >
              cristobal@ihmchile.com
            </a>
            .
          </p>
        </section>

        <section className="mt-10 pt-10 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-ihm-dark mb-4">
            2. Datos que recopilamos y para qué
          </h2>
          <p>
            A través del formulario de contacto y del cotizador de productos
            recopilamos: nombre, correo electrónico, teléfono, nombre de empresa
            y detalle de los productos consultados. Estos datos se utilizan
            exclusivamente para (a) responder mensajes de contacto y (b) procesar
            y enviar cotizaciones solicitadas.
          </p>
        </section>

        <section className="mt-10 pt-10 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-ihm-dark mb-4">
            3. Marco legal
          </h2>
          <p>
            Este sitio opera en cumplimiento de la Ley N° 19.628 sobre Protección
            de la Vida Privada. Adicionalmente, nos preparamos para la plena
            entrada en vigor de la Ley N° 21.719 (que moderniza el marco de
            protección de datos personales en Chile), vigente a partir del 1 de
            diciembre de 2026. Esta nueva ley introduce principios de licitud,
            transparencia, finalidad, proporcionalidad, seguridad y
            responsabilidad proactiva, y fortalece los derechos de los titulares.
          </p>
        </section>

        <section className="mt-10 pt-10 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-ihm-dark mb-4">
            4. Derechos del titular
          </h2>
          <p>
            En conformidad con la legislación vigente y la próxima Ley 21.719,
            usted tiene derecho a acceder, rectificar, cancelar u oponerse al
            tratamiento de sus datos personales, así como a solicitar su
            portabilidad. Para ejercer cualquiera de estos derechos, escríbanos a{' '}
            <a
              href="mailto:cristobal@ihmchile.com"
              className="text-ihm-blue font-medium hover:underline"
            >
              cristobal@ihmchile.com
            </a>
            .
          </p>
        </section>

        <section className="mt-10 pt-10 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-ihm-dark mb-4">
            5. Protección contra bots (Cloudflare Turnstile)
          </h2>
          <p>
            Este sitio utiliza Cloudflare Turnstile, una herramienta de seguridad
            desarrollada por Cloudflare, Inc., para proteger nuestros formularios
            contra el uso automatizado por bots. Turnstile opera de manera
            invisible para el usuario y procesa únicamente señales técnicas
            mínimas del navegador (como dirección IP, User-Agent y TLS
            fingerprint) con el exclusivo propósito de distinguir usuarios
            humanos de tráfico automatizado. Cloudflare no utiliza estos datos
            para identificar, perfilar ni rastrear usuarios individuales. Para más
            información, consulte la{' '}
            <a
              href="https://www.cloudflare.com/privacypolicy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ihm-blue font-medium hover:underline"
            >
              política de privacidad de Cloudflare
            </a>
            .
          </p>
        </section>

        <section className="mt-10 pt-10 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-ihm-dark mb-4">
            6. Conservación y eliminación de datos
          </h2>
          <p>
            Los datos personales se conservan únicamente durante el tiempo
            necesario para la finalidad declarada. Puede solicitar su eliminación
            en cualquier momento escribiendo a{' '}
            <a
              href="mailto:cristobal@ihmchile.com"
              className="text-ihm-blue font-medium hover:underline"
            >
              cristobal@ihmchile.com
            </a>
            .
          </p>
        </section>
      </article>
    </main>
  );
}
