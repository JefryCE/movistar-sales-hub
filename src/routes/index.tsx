import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Download,
  Filter,
  Headphones,
  LogOut,
  PhoneCall,
  Search,
  Target,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";

import { KpiCard } from "@/components/crm/kpi-card";
import { CanalChart, EstadoChart, Panel, RankingChart, TendenciaChart } from "@/components/crm/graficos";
import { useSesion } from "@/lib/auth";
import { exportarExcel } from "@/lib/exportar-excel";
import {
  CAMPANIAS,
  CANALES,
  EQUIPOS,
  ESTADOS_LISTA,
  REGIONES,
  REGISTROS,
  moneda,
  type Registro,
} from "@/lib/crm-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CRM de Ventas Call Center | Movistar" },
      {
        name: "description",
        content:
          "Panel CRM de ventas para call center Movistar: KPIs, gráficos, filtros, búsqueda y exportación a Excel.",
      },
      { property: "og:title", content: "CRM de Ventas Call Center | Movistar" },
      {
        property: "og:description",
        content:
          "Indicadores de conversión, ranking de asesores, embudo por canal y descarga de gestiones en Excel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CrmDashboard,
});

const TODOS = "todos";

const badgeEstado: Record<string, string> = {
  Ganada: "bg-success/12 text-success",
  "En gestión": "bg-primary/12 text-primary",
  Pendiente: "bg-warning/25 text-warning-foreground",
  Perdida: "bg-destructive/12 text-destructive",
};

function CrmDashboard() {
  const navigate = useNavigate();
  const { usuario, cargando, salir } = useSesion();
  useEffect(() => {
    if (!cargando && !usuario) navigate({ to: "/login" });
  }, [cargando, usuario, navigate]);
  const [busqueda, setBusqueda] = useState("");
  const [campania, setCampania] = useState(TODOS);
  const [canal, setCanal] = useState(TODOS);
  const [estado, setEstado] = useState(TODOS);
  const [equipo, setEquipo] = useState(TODOS);
  const [region, setRegion] = useState(TODOS);
  const [rango, setRango] = useState("90");
  const [pagina, setPagina] = useState(1);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    const limite = new Date(Date.UTC(2026, 8, 25));
    limite.setUTCDate(limite.getUTCDate() - Number(rango));
    const limiteIso = limite.toISOString().slice(0, 10);

    return REGISTROS.filter((r) => {
      if (r.fecha < limiteIso) return false;
      if (campania !== TODOS && r.campania !== campania) return false;
      if (canal !== TODOS && r.canal !== canal) return false;
      if (estado !== TODOS && r.estado !== estado) return false;
      if (equipo !== TODOS && r.equipo !== equipo) return false;
      if (region !== TODOS && r.region !== region) return false;
      if (!q) return true;
      return (
        r.cliente.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.agente.toLowerCase().includes(q) ||
        r.telefono.includes(q) ||
        r.documento.includes(q) ||
        r.producto.toLowerCase().includes(q) ||
        r.region.toLowerCase().includes(q) ||
        r.campania.toLowerCase().includes(q)
      );
    });
  }, [busqueda, campania, canal, estado, equipo, region, rango]);

  const kpis = useMemo(() => calcularKpis(filtrados), [filtrados]);
  const tendencia = useMemo(() => calcularTendencia(filtrados), [filtrados]);
  const ranking = useMemo(() => calcularRanking(filtrados), [filtrados]);
  const porEstado = useMemo(() => calcularEstados(filtrados), [filtrados]);
  const porCanal = useMemo(() => calcularCanales(filtrados), [filtrados]);

  const porPagina = 10;
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / porPagina));
  const paginaActual = Math.min(pagina, totalPaginas);
  const visibles = filtrados.slice((paginaActual - 1) * porPagina, paginaActual * porPagina);

  const hayFiltros =
    busqueda !== "" ||
    [campania, canal, estado, equipo, region].some((v) => v !== TODOS) ||
    rango !== "90";

  function limpiar() {
    setBusqueda("");
    setCampania(TODOS);
    setCanal(TODOS);
    setEstado(TODOS);
    setEquipo(TODOS);
    setRegion(TODOS);
    setRango("90");
    setPagina(1);
  }

  function descargar() {
    void exportarExcel(filtrados, {
      "Gestiones filtradas": filtrados.length,
      "Ventas ganadas": kpis.ganadas,
      "Tasa de conversión": `${kpis.conversion.toFixed(1)}%`,
      "Ingresos (S/)": kpis.ingresos,
      "Ticket promedio (S/)": Math.round(kpis.ticket),
      "AHT promedio (min)": kpis.aht.toFixed(1),
      "Contactabilidad (%)": kpis.contactabilidad.toFixed(1),
      "Generado el": new Date().toISOString().slice(0, 19).replace("T", " "),
    });
  }

  if (cargando || !usuario) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-movistar text-navy-foreground">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-5 py-7 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-navy-foreground/15">
                <Headphones className="size-6" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-navy-foreground/70">
                  Movistar
                </p>
                <h1 className="text-2xl font-bold tracking-tight">CRM de Ventas · Call Center</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-xs text-navy-foreground/70">Periodo analizado</p>
                <p className="text-sm font-semibold">Últimos {rango} días · 2026</p>
              </div>
              <Button onClick={descargar} className="gap-2 bg-navy-foreground text-navy hover:bg-navy-foreground/90">
                <Download className="size-4" />
                Descargar Excel
              </Button>
              <div className="hidden text-right md:block">
                <p className="text-sm font-semibold">{usuario.nombre}</p>
                <p className="text-xs text-navy-foreground/70">{usuario.rol}</p>
              </div>
              <Button
                variant="ghost"
                onClick={() => {
                  salir();
                  navigate({ to: "/login" });
                }}
                className="gap-2 bg-navy-foreground/10 text-navy-foreground hover:bg-navy-foreground/20 hover:text-navy-foreground"
              >
                <LogOut className="size-4" />
                Salir
              </Button>
            </div>
          </div>

          <div className="grid gap-3 rounded-2xl bg-navy-foreground/10 p-3 backdrop-blur sm:grid-cols-2 lg:grid-cols-7">
            <div className="relative lg:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-navy-foreground/60" />
              <Input
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setPagina(1);
                }}
                placeholder="Buscar cliente, ID, asesor, DNI o teléfono..."
                className="border-navy-foreground/20 bg-navy-foreground/10 pl-9 text-navy-foreground placeholder:text-navy-foreground/55 focus-visible:ring-navy-foreground/40"
              />
            </div>
            <FiltroSelect valor={campania} set={setCampania} etiqueta="Campaña" opciones={CAMPANIAS} onChange={() => setPagina(1)} />
            <FiltroSelect valor={canal} set={setCanal} etiqueta="Canal" opciones={CANALES} onChange={() => setPagina(1)} />
            <FiltroSelect valor={estado} set={setEstado} etiqueta="Estado" opciones={[...ESTADOS_LISTA]} onChange={() => setPagina(1)} />
            <FiltroSelect valor={equipo} set={setEquipo} etiqueta="Equipo" opciones={EQUIPOS} onChange={() => setPagina(1)} />
            <FiltroSelect valor={region} set={setRegion} etiqueta="Región" opciones={REGIONES} onChange={() => setPagina(1)} />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 text-navy-foreground/70">
              <Filter className="size-3.5" /> Rango:
            </span>
            {["7", "30", "60", "90"].map((d) => (
              <button
                key={d}
                onClick={() => {
                  setRango(d);
                  setPagina(1);
                }}
                className={cn(
                  "rounded-full px-3 py-1 font-semibold transition-colors",
                  rango === d
                    ? "bg-navy-foreground text-navy"
                    : "bg-navy-foreground/10 text-navy-foreground/80 hover:bg-navy-foreground/20",
                )}
              >
                {d} días
              </button>
            ))}
            {hayFiltros && (
              <button
                onClick={limpiar}
                className="ml-1 inline-flex items-center gap-1 rounded-full bg-navy-foreground/10 px-3 py-1 font-semibold hover:bg-navy-foreground/20"
              >
                <X className="size-3" /> Limpiar filtros
              </button>
            )}
            <span className="ml-auto text-navy-foreground/70">
              {filtrados.length} gestiones coinciden
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] space-y-6 px-5 py-8 lg:px-8">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            titulo="Ventas ganadas"
            valor={String(kpis.ganadas)}
            detalle="vs. periodo anterior"
            variacion={kpis.varVentas}
            icono={BadgeCheck}
            destacado
          />
          <KpiCard
            titulo="Tasa de conversión"
            valor={`${kpis.conversion.toFixed(1)}%`}
            detalle="meta 45%"
            variacion={kpis.conversion - 45}
            icono={Target}
          />
          <KpiCard
            titulo="Ingresos generados"
            valor={moneda(kpis.ingresos)}
            detalle={`ticket ${moneda(Math.round(kpis.ticket))}`}
            variacion={kpis.varIngresos}
            icono={Wallet}
          />
          <KpiCard
            titulo="AHT promedio"
            valor={`${kpis.aht.toFixed(1)} min`}
            detalle={`contactabilidad ${kpis.contactabilidad.toFixed(0)}%`}
            variacion={-((kpis.aht - 8) / 8) * 100}
            icono={PhoneCall}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Panel titulo="Tendencia de ventas" subtitulo="Ventas cerradas e ingresos por semana" className="lg:col-span-2">
            <TendenciaChart data={tendencia} />
          </Panel>
          <Panel titulo="Distribución por estado" subtitulo="Pipeline actual">
            <EstadoChart data={porEstado} />
          </Panel>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Panel titulo="Ranking de asesores" subtitulo="Top 8 por ventas ganadas">
            <RankingChart data={ranking} />
          </Panel>
          <Panel titulo="Resultado por canal" subtitulo="Ganadas vs. perdidas">
            <CanalChart data={porCanal} />
          </Panel>
        </section>

        <section className="rounded-2xl border border-border bg-card shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide">Gestiones de venta</h3>
              <p className="text-xs text-muted-foreground">
                Mostrando {visibles.length} de {filtrados.length} registros
              </p>
            </div>
            <Button variant="outline" onClick={descargar} className="gap-2">
              <Download className="size-4" /> Exportar vista
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-semibold">ID</th>
                  <th className="px-5 py-3 font-semibold">Cliente</th>
                  <th className="px-5 py-3 font-semibold">Asesor</th>
                  <th className="px-5 py-3 font-semibold">Campaña</th>
                  <th className="px-5 py-3 font-semibold">Canal</th>
                  <th className="px-5 py-3 font-semibold">Estado</th>
                  <th className="px-5 py-3 text-right font-semibold">Monto</th>
                  <th className="px-5 py-3 text-right font-semibold">AHT</th>
                  <th className="px-5 py-3 font-semibold">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {visibles.map((r) => (
                  <tr key={r.id} className="border-b border-border/70 transition-colors last:border-0 hover:bg-accent/40">
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{r.id}</td>
                    <td className="px-5 py-3">
                      <p className="font-semibold">{r.cliente}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.telefono} · {r.region}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <p>{r.agente}</p>
                      <p className="text-xs text-muted-foreground">{r.equipo}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p>{r.campania}</p>
                      <p className="text-xs text-muted-foreground">{r.producto}</p>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{r.canal}</td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                          badgeEstado[r.estado],
                        )}
                      >
                        {r.estado}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-semibold">{moneda(r.monto)}</td>
                    <td className="px-5 py-3 text-right text-muted-foreground">{r.duracionMin} min</td>
                    <td className="px-5 py-3 text-muted-foreground">{r.fecha}</td>
                  </tr>
                ))}
                {visibles.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-5 py-12 text-center text-sm text-muted-foreground">
                      No se encontraron gestiones con los filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border p-4">
            <p className="text-xs text-muted-foreground">
              Página {paginaActual} de {totalPaginas}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={paginaActual === 1}
                onClick={() => setPagina(paginaActual - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={paginaActual === totalPaginas}
                onClick={() => setPagina(paginaActual + 1)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </section>

        <footer className="flex items-center gap-2 pb-4 text-xs text-muted-foreground">
          <TrendingUp className="size-3.5 text-primary" />
          Datos simulados con fines demostrativos · CRM Movistar Call Center
        </footer>
      </main>
    </div>
  );
}

function FiltroSelect({
  valor,
  set,
  etiqueta,
  opciones,
  onChange,
}: {
  valor: string;
  set: (v: string) => void;
  etiqueta: string;
  opciones: string[];
  onChange: () => void;
}) {
  return (
    <Select
      value={valor}
      onValueChange={(v) => {
        set(v);
        onChange();
      }}
    >
      <SelectTrigger className="border-navy-foreground/20 bg-navy-foreground/10 text-navy-foreground data-[placeholder]:text-navy-foreground/60">
        <SelectValue placeholder={etiqueta} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={TODOS}>{etiqueta}: todas</SelectItem>
        {opciones.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function calcularKpis(data: Registro[]) {
  const ganadas = data.filter((r) => r.estado === "Ganada");
  const ingresos = ganadas.reduce((s, r) => s + r.monto, 0);
  const conversion = data.length ? (ganadas.length / data.length) * 100 : 0;
  const aht = data.length ? data.reduce((s, r) => s + r.duracionMin, 0) / data.length : 0;
  const contactados = data.filter((r) => r.estado !== "Pendiente").length;
  const mitad = Math.floor(data.length / 2);
  const recientes = data.slice(0, mitad);
  const previos = data.slice(mitad);
  const gRec = recientes.filter((r) => r.estado === "Ganada");
  const gPrev = previos.filter((r) => r.estado === "Ganada");
  const varVentas = gPrev.length ? ((gRec.length - gPrev.length) / gPrev.length) * 100 : 0;
  const iRec = gRec.reduce((s, r) => s + r.monto, 0);
  const iPrev = gPrev.reduce((s, r) => s + r.monto, 0);

  return {
    ganadas: ganadas.length,
    ingresos,
    conversion,
    ticket: ganadas.length ? ingresos / ganadas.length : 0,
    aht,
    contactabilidad: data.length ? (contactados / data.length) * 100 : 0,
    varVentas,
    varIngresos: iPrev ? ((iRec - iPrev) / iPrev) * 100 : 0,
  };
}

function calcularTendencia(data: Registro[]) {
  const mapa = new Map<string, { ventas: number; ingresos: number }>();
  for (const r of data) {
    if (r.estado !== "Ganada") continue;
    const d = new Date(`${r.fecha}T00:00:00Z`);
    const jueves = new Date(d);
    jueves.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
    const clave = jueves.toISOString().slice(5, 10);
    const actual = mapa.get(clave) ?? { ventas: 0, ingresos: 0 };
    actual.ventas += 1;
    actual.ingresos += r.monto;
    mapa.set(clave, actual);
  }
  return Array.from(mapa.entries())
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([periodo, v]) => ({ periodo, ventas: v.ventas, ingresos: Math.round(v.ingresos / 10) }));
}

function calcularRanking(data: Registro[]) {
  const mapa = new Map<string, number>();
  for (const r of data) {
    if (r.estado !== "Ganada") continue;
    mapa.set(r.agente, (mapa.get(r.agente) ?? 0) + 1);
  }
  return Array.from(mapa.entries())
    .map(([nombre, ventas]) => ({ nombre, ventas }))
    .sort((a, b) => b.ventas - a.ventas)
    .slice(0, 8)
    .reverse();
}

function calcularEstados(data: Registro[]) {
  return ESTADOS_LISTA.map((e) => ({
    nombre: e,
    valor: data.filter((r) => r.estado === e).length,
  })).filter((d) => d.valor > 0);
}

function calcularCanales(data: Registro[]) {
  return CANALES.map((canal) => ({
    canal,
    ganadas: data.filter((r) => r.canal === canal && r.estado === "Ganada").length,
    perdidas: data.filter((r) => r.canal === canal && r.estado === "Perdida").length,
  }));
}
