"use client";

import { useActionState, useState } from "react";
import {
  createTechnologyAction,
  type CreateTechnologyActionState,
} from "./actions";

import type { Technology } from "@/types/technology";

type TechnologyFormProps = {
  initialTechnology?: Technology;
  action: (
    previousState: CreateTechnologyActionState,
    formData: FormData,
  ) => Promise<CreateTechnologyActionState>;
  submitLabel: string;
  pendingLabel: string;
};

const initialState: CreateTechnologyActionState = {
  message: "",
};


const fields = [
  { name: "name", label: "Nome", placeholder: "Ex.: PostgreSQL" },
  {
    name: "category",
    label: "Categoria",
    placeholder: "Ex.: Banco de dados",
  },
] as const;

export function TechnologyForm({
  initialTechnology,
  action,
  submitLabel,
  pendingLabel,
}: TechnologyFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialState,
  );

  const [values, setValues] = useState(() => ({
    name: initialTechnology?.name ?? "",
    category: initialTechnology?.category ?? "",
  }));

  return (
    <form action={formAction} className="mt-8">
      <fieldset disabled={pending} className="space-y-6">
        <legend className="sr-only">
          Dados da tecnologia
        </legend>

        {fields.map((field) => {
          const errors = state.fieldErrors?.[field.name];
          const hasError = Boolean(errors?.length);

          return (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium"
              >
                {field.label}
              </label>

              <input
                id={field.name}
                name={field.name}
                type="text"
                required
                minLength={2}
                maxLength={100}
                placeholder={field.placeholder}
                value={values[field.name]}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [field.name]: event.target.value,
                  }))
                }
                aria-invalid={hasError}
                aria-describedby={
                  hasError ? `${field.name}-error` : undefined
                }
                className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus-visible:outline-2 focus-visible:outline-primary-strong"
              />

              {hasError && (
                <p
                  id={`${field.name}-error`}
                  className="mt-2 text-sm text-foreground-muted"
                >
                  {errors?.join(" ")}
                </p>
              )}
            </div>
          );
        })}

        {state.message && (
          <p role="alert" className="text-sm text-foreground-muted">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          className="rounded-lg bg-primary px-5 py-3 font-medium text-foreground transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? pendingLabel : submitLabel}
        </button>
      </fieldset>
    </form>
  );
}
export function CreateTechnologyForm() {
  return (
    <TechnologyForm
      action={createTechnologyAction}
      submitLabel="Cadastrar tecnologia"
      pendingLabel="Cadastrando…"
    />
  );
}