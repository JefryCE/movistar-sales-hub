import type { Registro } from "./crm-data";

export async function exportarExcel(registros: Registro[], resumen: Record<string, string | number>) {
  const XLSX = await import("xlsx");

  const filas = registros.map((r) => ({
    ID: r.id,
    Fecha: r.fecha,
    Cliente: r.cliente,
    Documento: r.documento,
    Teléfono: r.telefono,
    Agente: r.agente,
    Equipo: r.equipo,
    Campaña: r.campania,
    Canal: r.canal,
    Producto: r.producto,
    Región: r.region,
    Estado: r.estado,
    "Monto (S/)": r.monto,
    "Duración (min)": r.duracionMin,
    Intentos: r.intentos,
  }));

  const wb = XLSX.utils.book_new();
  const hoja = XLSX.utils.json_to_sheet(filas);
  hoja["!cols"] = Object.keys(filas[0] ?? { a: "" }).map(() => ({ wch: 16 }));
  XLSX.utils.book_append_sheet(wb, hoja, "Gestiones");

  const resumenHoja = XLSX.utils.json_to_sheet(
    Object.entries(resumen).map(([Indicador, Valor]) => ({ Indicador, Valor })),
  );
  resumenHoja["!cols"] = [{ wch: 28 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(wb, resumenHoja, "Resumen KPIs");

  const fecha = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `movistar-crm-ventas-${fecha}.xlsx`);
}
