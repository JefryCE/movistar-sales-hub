import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AZUL = "var(--color-chart-1)";
const VERDE = "var(--color-chart-2)";
const AMARILLO = "var(--color-chart-3)";
const AZULOSCURO = "var(--color-chart-4)";
const ROJO = "var(--color-chart-5)";

const COLORES_ESTADO: Record<string, string> = {
  Ganada: VERDE,
  "En gestión": AZUL,
  Pendiente: AMARILLO,
  Perdida: ROJO,
};

const tooltipStyle = {
  backgroundColor: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: "12px",
  fontSize: "12px",
  color: "var(--color-card-foreground)",
};

export function Panel({
  titulo,
  subtitulo,
  children,
  className,
}: {
  titulo: string;
  subtitulo?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-5 shadow-card ${className ?? ""}`}>
      <div className="mb-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">{titulo}</h3>
        {subtitulo && <p className="text-xs text-muted-foreground">{subtitulo}</p>}
      </div>
      {children}
    </div>
  );
}

export function TendenciaChart({ data }: { data: { periodo: string; ventas: number; ingresos: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ left: -18, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="gradVentas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={AZUL} stopOpacity={0.45} />
            <stop offset="100%" stopColor={AZUL} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="periodo" tickLine={false} axisLine={false} fontSize={11} stroke="var(--color-muted-foreground)" />
        <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="var(--color-muted-foreground)" />
        <Tooltip contentStyle={tooltipStyle} />
        <Area type="monotone" dataKey="ventas" name="Ventas" stroke={AZUL} strokeWidth={2.5} fill="url(#gradVentas)" />
        <Area type="monotone" dataKey="ingresos" name="Ingresos (S/ x10)" stroke={VERDE} strokeWidth={2} fillOpacity={0} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function RankingChart({ data }: { data: { nombre: string; ventas: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ left: 40, right: 12 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} fontSize={11} stroke="var(--color-muted-foreground)" />
        <YAxis
          type="category"
          dataKey="nombre"
          width={120}
          tickLine={false}
          axisLine={false}
          fontSize={11}
          stroke="var(--color-muted-foreground)"
        />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-accent)" }} />
        <Bar dataKey="ventas" name="Ventas ganadas" fill={AZUL} radius={[0, 8, 8, 0]} barSize={14} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function EstadoChart({ data }: { data: { nombre: string; valor: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="valor" nameKey="nombre" innerRadius={62} outerRadius={96} paddingAngle={3}>
          {data.map((d) => (
            <Cell key={d.nombre} fill={COLORES_ESTADO[d.nombre] ?? AZULOSCURO} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function CanalChart({ data }: { data: { canal: string; ganadas: number; perdidas: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ left: -18, right: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="canal" tickLine={false} axisLine={false} fontSize={11} stroke="var(--color-muted-foreground)" />
        <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="var(--color-muted-foreground)" />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-accent)" }} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="ganadas" name="Ganadas" stackId="a" fill={AZUL} radius={[0, 0, 0, 0]} barSize={26} />
        <Bar dataKey="perdidas" name="Perdidas" stackId="a" fill={AMARILLO} radius={[6, 6, 0, 0]} barSize={26} />
      </BarChart>
    </ResponsiveContainer>
  );
}
