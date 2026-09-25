import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Headphones, KeyRound, Lock, Mail } from "lucide-react";

import { CUENTA_DEMO, iniciarSesion, useSesion } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Iniciar sesión | CRM Movistar" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { usuario, cargando } = useSesion();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!cargando && usuario) navigate({ to: "/" });
  }, [cargando, usuario, navigate]);

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (iniciarSesion(email, password)) {
      navigate({ to: "/" });
    } else {
      setError("Correo o contraseña incorrectos.");
    }
  }

  function usarDemo() {
    setEmail(CUENTA_DEMO.email);
    setPassword(CUENTA_DEMO.password);
    setError("");
  }

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-movistar px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Headphones className="size-6" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Movistar</p>
            <h1 className="text-xl font-bold tracking-tight text-foreground">CRM de Ventas</h1>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">Ingresa con tu cuenta para acceder al panel.</p>

        <form onSubmit={enviar} className="mt-5 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Correo</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@movistar.demo"
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9"
              />
            </div>
          </div>
          {error && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full">
            Iniciar sesión
          </Button>
        </form>

        <div className="mt-6 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4 text-sm">
          <p className="flex items-center gap-2 font-semibold text-foreground">
            <KeyRound className="size-4 text-primary" /> Cuenta demo · {CUENTA_DEMO.rol}
          </p>
          <p className="mt-2 text-muted-foreground">
            Correo: <span className="font-mono text-foreground">{CUENTA_DEMO.email}</span>
          </p>
          <p className="text-muted-foreground">
            Contraseña: <span className="font-mono text-foreground">{CUENTA_DEMO.password}</span>
          </p>
          <Button type="button" variant="outline" size="sm" className="mt-3" onClick={usarDemo}>
            Autocompletar
          </Button>
        </div>
      </div>
    </div>
  );
}
