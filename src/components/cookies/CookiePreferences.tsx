import { Switch } from "@/components/ui/switch";
import {
  CATEGORIES,
  type CookiePreferences as Preferencias,
  type OptionalCategory,
} from "@/lib/cookies/categories";

interface Props {
  preferencias: Preferencias;
  onChange: (categoria: OptionalCategory, valor: boolean) => void;
}

/**
 * Listado de categorías con sus interruptores.
 *
 * Las necesarias aparecen igual que el resto pero con la etiqueta "Siempre
 * activas" en lugar de un toggle deshabilitado. Un interruptor apagado que no
 * se puede mover confunde: parece que algo falló.
 */
const CookiePreferencesList = ({ preferencias, onChange }: Props) => (
  <ul className="space-y-3">
    {CATEGORIES.map((categoria) => {
      const idTitulo = `cookie-cat-${categoria.id}`;
      const idDescripcion = `${idTitulo}-desc`;

      return (
        <li
          key={categoria.id}
          className="rounded-lg border border-border bg-card/60 p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3
                id={idTitulo}
                className="font-body text-sm font-bold text-foreground"
              >
                {categoria.title}
              </h3>
              <p
                id={idDescripcion}
                className="mt-1 font-body text-xs leading-relaxed text-muted-foreground"
              >
                {categoria.description}
              </p>
            </div>

            {categoria.alwaysOn ? (
              <span className="shrink-0 whitespace-nowrap rounded-full bg-muted px-3 py-1 font-body text-[11px] font-medium text-muted-foreground">
                Siempre activas
              </span>
            ) : (
              <Switch
                checked={preferencias[categoria.id as OptionalCategory]}
                onCheckedChange={(valor) =>
                  onChange(categoria.id as OptionalCategory, valor)
                }
                aria-labelledby={idTitulo}
                aria-describedby={idDescripcion}
                className="mt-0.5 shrink-0 data-[state=checked]:bg-legal-primary"
              />
            )}
          </div>
        </li>
      );
    })}
  </ul>
);

export default CookiePreferencesList;
