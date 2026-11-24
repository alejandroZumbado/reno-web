"use client";

import { useActionState, useState } from "react";
import { loginAction, type LoginState } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});
  const [show, setShow] = useState(false);
  return (
    <form action={action} className="mt-8 space-y-4">
      <div>
        <label htmlFor="password" className="mb-2 block text-sm">Contraseña</label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            autoFocus
            aria-invalid={!!state.error}
            aria-describedby={state.error ? "login-error" : undefined}
            className="admin-input pr-24"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute inset-y-1 right-1 min-w-20 rounded-md px-3 text-sm text-muted hover:text-gold"
            aria-pressed={show}
          >
            {show ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        {state.error && <p id="login-error" role="alert" className="mt-2 text-sm text-alert">{state.error}</p>}
      </div>
      <button type="submit" disabled={pending} className="flex min-h-12 w-full items-center justify-center rounded-full foil-bg font-medium disabled:opacity-60">
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
