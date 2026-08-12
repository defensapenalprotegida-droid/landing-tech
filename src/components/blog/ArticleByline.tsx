import { CalendarDays, RefreshCw, ShieldCheck } from "lucide-react";
import { formatPostDate } from "@/lib/blog";
import { TEAM } from "@/lib/team";

interface Props {
  author?: string;
  reviewer?: string;
  date: string;
  updated?: string;
}

const rolDe = (nombre?: string) =>
  nombre ? TEAM.find((m) => m.name === nombre)?.role : undefined;

/**
 * Autoría del artículo.
 *
 * En materias legales importa quién firma: el lector decide si confiar según
 * quién lo escribió y quién lo revisó. Los nombres se contrastan con el equipo
 * real para mostrar el cargo, en vez de una firma genérica del estudio.
 */
const ArticleByline = ({ author, reviewer, date, updated }: Props) => {
  const rolAutor = rolDe(author);
  const rolRevisor = rolDe(reviewer);

  return (
    <div className="not-prose border-y border-border py-4 my-8 space-y-2">
      {author && (
        <p className="font-body text-sm text-foreground">
          Por <strong className="font-semibold">{author}</strong>
          {rolAutor && (
            <span className="text-muted-foreground"> · {rolAutor}</span>
          )}
        </p>
      )}

      {reviewer && (
        <p className="font-body text-sm text-muted-foreground inline-flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          Revisado por <strong className="font-medium text-foreground">
            {reviewer}
          </strong>
          {rolRevisor && <span> · {rolRevisor}</span>}
        </p>
      )}

      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="w-3.5 h-3.5" />
          Publicado el {formatPostDate(date)}
        </span>
        {updated && updated !== date && (
          <span className="inline-flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            Actualizado el {formatPostDate(updated)}
          </span>
        )}
      </div>
    </div>
  );
};

export default ArticleByline;
