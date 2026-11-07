"use client";
import { Button } from "@/components/ui/Button";

import { useActionState } from "react";
import {
  loginAction,
  type LoginActionState,
} from "./actions";

const initialState: LoginActionState = {
  message: "",
};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form action={formAction} className="mt-8 space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium"
        >
          E-mail
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          disabled={pending}
          className="admin-input"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium"
        >
          Senha
        </label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          maxLength={128}
          required
          disabled={pending}
          className="admin-input"
        />
      </div>

      {state.message && (
        <p role="alert" className="text-sm text-foreground-muted">
          {state.message}
        </p>
      )}

      <div className="admin-form-actions"><Button type="submit"
        disabled={pending}
        className="w-full"
      >
        {pending ? "Entrando…" : "Entrar"}
      </Button></div>
    </form>
  );
}