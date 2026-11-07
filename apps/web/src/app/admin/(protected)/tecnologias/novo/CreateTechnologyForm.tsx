"use client";
import { Button } from "@/components/ui/Button";
import { AdminFormSection } from "@/components/admin/AdminFormSection";

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

        <AdminFormSection id="technology-section-0" title="Dados da tecnologia">
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
                  className="admin-input"
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
        </AdminFormSection>

        {state.message && (
          <p role="alert" className="text-sm text-foreground-muted">
            {state.message}
          </p>
        )}

        <div className="admin-form-actions"><Button type="submit"
        >
          {pending ? pendingLabel : submitLabel}
        </Button></div>
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