'use client';

import Script from 'next/script';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

/**
 * Error que lanza `execute()` cuando el script de Turnstile no está disponible
 * (bloqueadores de anuncios, red corporativa, script aún sin cargar). El padre
 * lo captura para mostrar el mensaje de "conexión no verificable".
 */
export const TURNSTILE_UNAVAILABLE = 'TURNSTILE_UNAVAILABLE';

type TurnstileRenderOptions = {
  sitekey: string;
  execution?: 'render' | 'execute';
  callback?: (token: string) => void;
  'error-callback'?: () => void;
  'expired-callback'?: () => void;
};

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: TurnstileRenderOptions
  ) => string | undefined;
  execute: (widgetId: string) => void;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export type TurnstileWidgetHandle = {
  /** Dispara el challenge y resuelve con el token. Rechaza con
   *  `TURNSTILE_UNAVAILABLE` si el script no está disponible. */
  execute: () => Promise<string>;
  /** Resetea el widget para poder generar un token nuevo. */
  reset: () => void;
};

type TurnstileWidgetProps = {
  onSuccess?: (token: string) => void;
  onError?: () => void;
};

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const TurnstileWidget = forwardRef<TurnstileWidgetHandle, TurnstileWidgetProps>(
  function TurnstileWidget({ onSuccess, onError }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const pendingRef = useRef<{
      resolve: (token: string) => void;
      reject: (err: Error) => void;
    } | null>(null);
    const [scriptReady, setScriptReady] = useState(false);

    // Los callbacks del padre se guardan en refs para que `renderWidget` pueda
    // usarlos sin depender de su identidad (props inline cambian en cada render
    // del padre, lo que antes re-ejecutaba el effect y destruía el widget vivo).
    const onSuccessRef = useRef(onSuccess);
    const onErrorRef = useRef(onError);

    useEffect(() => {
      onSuccessRef.current = onSuccess;
      onErrorRef.current = onError;
    });

    const renderWidget = useCallback(() => {
      if (
        !window.turnstile ||
        !containerRef.current ||
        widgetIdRef.current !== null ||
        !SITE_KEY
      ) {
        return;
      }

      widgetIdRef.current =
        window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          execution: 'execute',
          callback: (token: string) => {
            onSuccessRef.current?.(token);
            pendingRef.current?.resolve(token);
            pendingRef.current = null;
          },
          'error-callback': () => {
            onErrorRef.current?.();
            pendingRef.current?.reject(new Error(TURNSTILE_UNAVAILABLE));
            pendingRef.current = null;
          },
          'expired-callback': () => {
            pendingRef.current?.reject(new Error(TURNSTILE_UNAVAILABLE));
            pendingRef.current = null;
          },
        }) ?? null;
    }, []); // deps vacías: renderWidget ahora es estable

    useEffect(() => {
      renderWidget();

      return () => {
        // Rechazar promesa en vuelo antes de destruir el widget
        pendingRef.current?.reject(new Error(TURNSTILE_UNAVAILABLE));
        pendingRef.current = null;

        if (window.turnstile && widgetIdRef.current !== null) {
          window.turnstile.remove(widgetIdRef.current);
        }
        widgetIdRef.current = null;
      };
    }, [renderWidget, scriptReady]);

    useImperativeHandle(
      ref,
      () => ({
        execute: () =>
          new Promise<string>((resolve, reject) => {
            if (!window.turnstile || widgetIdRef.current === null) {
              reject(new Error(TURNSTILE_UNAVAILABLE));
              return;
            }

            const timeout = setTimeout(() => {
              pendingRef.current = null;
              reject(new Error(TURNSTILE_UNAVAILABLE));
            }, 30_000);

            pendingRef.current = {
              resolve: (token) => {
                clearTimeout(timeout);
                resolve(token);
              },
              reject: (err) => {
                clearTimeout(timeout);
                reject(err);
              },
            };

            try {
              window.turnstile.execute(widgetIdRef.current);
            } catch {
              clearTimeout(timeout);
              pendingRef.current = null;
              reject(new Error(TURNSTILE_UNAVAILABLE));
            }
          }),
        reset: () => {
          if (window.turnstile && widgetIdRef.current !== null) {
            window.turnstile.reset(widgetIdRef.current);
          }
        },
      }),
      []
    );

    return (
      <>
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
          onLoad={() => setScriptReady(true)}
        />
        <div ref={containerRef} />
      </>
    );
  }
);

export default TurnstileWidget;
