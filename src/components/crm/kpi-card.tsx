import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  titulo: string;
  valor: string;
  detalle: string;
  variacion: number;
  icono: LucideIcon;
  destacado?: boolean;
}

export function KpiCard({ titulo, valor, detalle, variacion, icono: Icono, destacado }: KpiCardProps) {
  const sube = variacion >= 0;
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card transition-transform hover:-translate-y-0.5",
        destacado && "border-transparent bg-gradient-movistar text-navy-foreground shadow-elevado",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-wider",
              destacado ? "text-navy-foreground/70" : "text-muted-foreground",
            )}
          >
            {titulo}
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{valor}</p>
        </div>
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-xl",
            destacado ? "bg-navy-foreground/15" : "bg-accent text-primary",
          )}
        >
          <Icono className="size-5" />
        </span>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold",
            destacado
              ? "bg-navy-foreground/15 text-navy-foreground"
              : sube
                ? "bg-success/12 text-success"
                : "bg-destructive/12 text-destructive",
          )}
        >
          {sube ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
          {sube ? "+" : ""}
          {variacion.toFixed(1)}%
        </span>
        <span className={destacado ? "text-navy-foreground/70" : "text-muted-foreground"}>{detalle}</span>
      </div>
    </div>
  );
}
