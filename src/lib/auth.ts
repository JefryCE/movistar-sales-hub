import { useCallback, useEffect, useState } from "react";

// Autenticación DEMO (solo cliente). No usar en producción: no hay backend
// y las credenciales viven en el bundle.
export type Usuario = { email: string; nombre: string; rol: "Administrador" };

export const CUENTA_DEMO = {
  email: "admin@movistar.demo",
  password: "Admin2026!",
  nombre: "Administrador Demo",
  rol: "Administrador",
} as const;

const KEY = "movistar-crm-sesion";

export function iniciarSesion(email: string, password: string): Usuario | null {
  if (email.trim().toLowerCase() !== CUENTA_DEMO.email || password !== CUENTA_DEMO.password) {
    return null;
  }
  const usuario: Usuario = { email: CUENTA_DEMO.email, nombre: CUENTA_DEMO.nombre, rol: CUENTA_DEMO.rol };
  try {
    localStorage.setItem(KEY, JSON.stringify(usuario));
  } catch {
    /* almacenamiento no disponible */
  }
  return usuario;
}

export function cerrarSesion() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}

function leerSesion(): Usuario | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Usuario) : null;
  } catch {
    return null;
  }
}

/** `cargando` es true hasta leer localStorage en el cliente (evita desajustes SSR). */
export function useSesion() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setUsuario(leerSesion());
    setCargando(false);
  }, []);

  const salir = useCallback(() => {
    cerrarSesion();
    setUsuario(null);
  }, []);

  return { usuario, cargando, salir };
}
