// Datos simulados del CRM de ventas (call center Movistar).
// Generación determinista para que servidor y cliente coincidan.

export type EstadoVenta = "Ganada" | "En gestión" | "Pendiente" | "Perdida";

export interface Registro {
  id: string;
  cliente: string;
  documento: string;
  telefono: string;
  agente: string;
  equipo: string;
  campania: string;
  canal: string;
  producto: string;
  region: string;
  estado: EstadoVenta;
  monto: number;
  duracionMin: number;
  intentos: number;
  fecha: string; // ISO yyyy-mm-dd
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NOMBRES = [
  "María","Juan","Lucía","Carlos","Ana","Diego","Valeria","Jorge","Camila","Luis",
  "Rosa","Andrés","Paola","Miguel","Sofía","Raúl","Daniela","Pedro","Karla","Iván",
];
const APELLIDOS = [
  "Quispe","Ramírez","Torres","Flores","Vargas","Castillo","Rojas","Mendoza","Salazar","Huamán",
  "Paredes","Chávez","Espinoza","Guerrero","Núñez","Ríos","Cabrera","Delgado","Fuentes","Ibarra",
];

export const AGENTES = [
  { nombre: "Valentina Ocampo", equipo: "Equipo Alfa" },
  { nombre: "Bruno Salcedo", equipo: "Equipo Alfa" },
  { nombre: "Camila Prado", equipo: "Equipo Alfa" },
  { nombre: "Héctor Villena", equipo: "Equipo Beta" },
  { nombre: "Nadia Correa", equipo: "Equipo Beta" },
  { nombre: "Omar Zapata", equipo: "Equipo Beta" },
  { nombre: "Lorena Aguirre", equipo: "Equipo Gamma" },
  { nombre: "Fabián Rueda", equipo: "Equipo Gamma" },
  { nombre: "Sandra Peña", equipo: "Equipo Gamma" },
  { nombre: "Ricardo Bustos", equipo: "Equipo Delta" },
  { nombre: "Elena Márquez", equipo: "Equipo Delta" },
  { nombre: "Tomás Herrera", equipo: "Equipo Delta" },
];

export const CAMPANIAS = [
  "Portabilidad Móvil",
  "Fibra Óptica Hogar",
  "Renovación Postpago",
  "Movistar TV",
  "Upgrade Plan Datos",
  "Movistar Total",
];

export const CANALES = ["Inbound", "Outbound", "WhatsApp", "Retención", "Web Callback"];

export const PRODUCTOS = [
  "Plan Ilimitado 89",
  "Plan Ilimitado 129",
  "Fibra 300 Mbps",
  "Fibra 600 Mbps",
  "Dúo TV + Fibra",
  "Línea Adicional",
  "Movistar Total 199",
];

export const REGIONES = ["Lima", "Arequipa", "Trujillo", "Cusco", "Piura", "Chiclayo"];

const ESTADOS: EstadoVenta[] = ["Ganada", "En gestión", "Pendiente", "Perdida"];

function pick<T>(rnd: () => number, arr: T[]): T {
  return arr[Math.floor(rnd() * arr.length)] as T;
}

function generar(): Registro[] {
  const rnd = mulberry32(20260925);
  const hoy = new Date(Date.UTC(2026, 8, 25));
  const out: Registro[] = [];

  for (let i = 0; i < 480; i++) {
    const agente = pick(rnd, AGENTES);
    const r = rnd();
    const estado: EstadoVenta =
      r < 0.42 ? "Ganada" : r < 0.64 ? "En gestión" : r < 0.8 ? "Pendiente" : "Perdida";
    const diasAtras = Math.floor(rnd() * 90);
    const fecha = new Date(hoy);
    fecha.setUTCDate(fecha.getUTCDate() - diasAtras);
    const producto = pick(rnd, PRODUCTOS);
    const base = 69 + Math.floor(rnd() * 14) * 10;

    out.push({
      id: `MOV-${(10240 + i).toString()}`,
      cliente: `${pick(rnd, NOMBRES)} ${pick(rnd, APELLIDOS)}`,
      documento: String(40000000 + Math.floor(rnd() * 49999999)),
      telefono: `9${String(Math.floor(rnd() * 100000000)).padStart(8, "0")}`,
      agente: agente.nombre,
      equipo: agente.equipo,
      campania: pick(rnd, CAMPANIAS),
      canal: pick(rnd, CANALES),
      producto,
      region: pick(rnd, REGIONES),
      estado,
      monto: estado === "Ganada" ? base : Math.round(base * 0.9),
      duracionMin: Math.round((2 + rnd() * 16) * 10) / 10,
      intentos: 1 + Math.floor(rnd() * 5),
      fecha: fecha.toISOString().slice(0, 10),
    });
  }
  return out.sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
}

export const REGISTROS: Registro[] = generar();
export const ESTADOS_LISTA = ESTADOS;

export const EQUIPOS = Array.from(new Set(AGENTES.map((a) => a.equipo)));

export function moneda(v: number) {
  return `S/ ${v.toLocaleString("es-PE", { maximumFractionDigits: 0 })}`;
}
