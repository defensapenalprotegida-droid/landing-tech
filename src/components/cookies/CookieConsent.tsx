import { useCallback, useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { DialogOverlay } from "@/components/ui/dialog";
import CookiePreferencesList from "./CookiePreferences";
import {
  ALLOW_ALL,
  DENY_ALL,
  type CookiePreferences,
  type OptionalCategory,
} from "@/lib/cookies/categories";
import { getPreferences } from "@/lib/cookies/consentService";
import { onOpenCookiePreferences } from "@/lib/cookies/preferencesBus";
import { useCookieConsent } from "@/hooks/use-cookie-consent";

type Vista = "banner" | "preferencias";

/**
 * Banner de consentimiento y centro de preferencias.
 *
 * Se monta una sola vez, en el Layout, y decide solo cuándo mostrarse:
 * automáticamente en la primera visita y bajo demanda desde el enlace del
 * footer.
 *
 * Cerrar con la X o con ESC equivale a RECHAZAR: se guardan solo las cookies
 * necesarias. Esto es deliberado. La alternativa (cerrar sin guardar nada)
 * dejaría el banner reapareciendo en cada carga hasta que la persona pulse un
 * botón, que es exactamente la presión que la ley busca evitar. Si el modal se
 * abrió desde el footer, en cambio, cerrar no toca la decisión ya guardada:
 * ahí la X significa "me arrepentí de mirar", no "rechazo todo".
 */
const CookieConsent = () => {
  const { montado, hasResponded, acceptAll, rejectAll, save } =
    useCookieConsent();

  const [abiertoManual, setAbiertoManual] = useState(false);
  const [vista, setVista] = useState<Vista>("banner");
  const [borrador, setBorrador] = useState<CookiePreferences>({ ...DENY_ALL });
  const contenidoRef = useRef<HTMLDivElement>(null);

  // El footer puede pedir abrir el centro de preferencias en cualquier momento.
  useEffect(
    () =>
      onOpenCookiePreferences(() => {
        setBorrador(getPreferences());
        setVista("preferencias");
        setAbiertoManual(true);
      }),
    []
  );

  const primeraVisita = montado && !hasResponded;
  const abierto = primeraVisita || abiertoManual;

  const cerrar = useCallback(() => {
    setAbiertoManual(false);
    setVista("banner");
  }, []);

  /** X, ESC o cualquier cierre no explícito. */
  const alCambiarApertura = useCallback(
    (siguiente: boolean) => {
      if (siguiente) return;
      // Sin decisión previa, cerrar es rechazar lo opcional.
      if (!hasResponded) rejectAll();
      cerrar();
    },
    [cerrar, hasResponded, rejectAll]
  );

  const irAPreferencias = () => {
    setBorrador(getPreferences());
    setVista("preferencias");
  };

  const cambiarCategoria = (categoria: OptionalCategory, valor: boolean) =>
    setBorrador((previo) => ({ ...previo, [categoria]: valor }));

  const aceptarTodo = () => {
    acceptAll();
    cerrar();
  };

  const rechazar = () => {
    rejectAll();
    cerrar();
  };

  const guardar = () => {
    save(borrador);
    cerrar();
  };

  if (!montado || !abierto) return null;

  const enPreferencias = vista === "preferencias";

  const claseBotonPrimario =
    "inline-flex h-11 w-full items-center justify-center rounded-lg bg-legal-primary px-5 font-body text-sm font-bold text-white transition-colors hover:bg-legal-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
  const claseBotonSecundario =
    "inline-flex h-11 w-full items-center justify-center rounded-lg border border-legal-secondary/40 bg-transparent px-5 font-body text-sm font-bold text-legal-secondary transition-colors hover:bg-legal-secondary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  return (
    <DialogPrimitive.Root open onOpenChange={alCambiarApertura}>
      <DialogPrimitive.Portal>
        <DialogOverlay className="bg-legal-dark/70 backdrop-blur-[2px]" />
        <DialogPrimitive.Content
          ref={contenidoRef}
          tabIndex={-1}
          // Sin `aria-labelledby` ni `aria-describedby` a mano: Radix los
          // genera y los enlaza con Title y Description. Ponerlos acá pisaba
          // esos ids y el propio Radix avisaba de que el diálogo se quedaba
          // sin nombre accesible.
          // El foco arranca en el contenedor y no en el primer botón: así el
          // lector de pantalla anuncia el título y nadie acepta ni rechaza por
          // pulsar Enter de inercia.
          onOpenAutoFocus={(evento) => {
            evento.preventDefault();
            contenidoRef.current?.focus();
          }}
          // Clic fuera no cierra: es demasiado fácil hacerlo sin querer y
          // acabaría registrando un rechazo que nadie quiso expresar.
          onPointerDownOutside={(evento) => evento.preventDefault()}
          onInteractOutside={(evento) => evento.preventDefault()}
          className="fixed left-1/2 top-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-border bg-background shadow-[var(--shadow-elevated)] duration-200 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:w-full"
        >
          <DialogPrimitive.Close
            aria-label="Cerrar y continuar solo con las cookies necesarias"
            className="absolute right-3 top-3 rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>

          <div className="overflow-y-auto px-6 pb-2 pt-7 sm:px-8">
            <DialogPrimitive.Title
              className="pr-8 font-heading text-xl font-bold text-foreground sm:text-2xl"
            >
              {enPreferencias
                ? "Preferencias de privacidad"
                : "Valoramos tu privacidad"}
            </DialogPrimitive.Title>

            <DialogPrimitive.Description
              className="mt-3 font-body text-sm leading-relaxed text-muted-foreground"
            >
              {enPreferencias
                ? "Puedes elegir qué tipos de cookies permites. Las cookies estrictamente necesarias son indispensables para el funcionamiento del sitio y no pueden desactivarse."
                : "Utilizamos cookies para mejorar tu experiencia de navegación, analizar el funcionamiento de nuestro sitio y, cuando corresponda, ofrecer contenido personalizado. Puedes aceptar todas las cookies, rechazarlas o configurar tus preferencias."}
            </DialogPrimitive.Description>

            <p className="mt-3 font-body text-sm">
              <Link
                to="/cookies"
                className="text-legal-primary underline underline-offset-4 hover:text-legal-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Política de Cookies
              </Link>
            </p>

            {enPreferencias && (
              <div className="mt-5">
                <CookiePreferencesList
                  preferencias={borrador}
                  onChange={cambiarCategoria}
                />
              </div>
            )}
          </div>

          <div className="border-t border-border bg-card/50 px-6 py-5 sm:px-8">
            {enPreferencias ? (
              <div className="flex flex-col gap-3 sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={guardar}
                  className={claseBotonPrimario}
                >
                  Guardar preferencias
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBorrador({ ...ALLOW_ALL });
                    acceptAll();
                    cerrar();
                  }}
                  className={claseBotonSecundario}
                >
                  Aceptar todas
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row">
                {/* Aceptar y Rechazar comparten tamaño y peso tipográfico: la
                    única diferencia es el relleno. Hacer "Rechazar" más
                    pequeño o gris sería un patrón oscuro. */}
                <button
                  type="button"
                  onClick={aceptarTodo}
                  className={claseBotonPrimario}
                >
                  Aceptar todo
                </button>
                <button
                  type="button"
                  onClick={rechazar}
                  className={claseBotonSecundario}
                >
                  Rechazar
                </button>
                <button
                  type="button"
                  onClick={irAPreferencias}
                  className="inline-flex h-11 w-full items-center justify-center rounded-lg px-5 font-body text-sm font-medium text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Configurar
                </button>
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default CookieConsent;
