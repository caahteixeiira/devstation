"use client";
import { Button } from "@/components/ui/Button";
import { AdminFormSection } from "@/components/admin/AdminFormSection";

import { useActionState, useState } from "react";
import type { CreateDecisionActionState } from "./actions";
import type { Decision } from "@/types/decision";

type CreateDecisionFormProps = {
  action: (
    previousState: CreateDecisionActionState,
    formData: FormData,
  ) => Promise<CreateDecisionActionState>;
};

type DecisionFormProps = CreateDecisionFormProps & {
  initialDecision?: Decision;
  submitLabel: string;
  pendingLabel: string;
};

const initialState: CreateDecisionActionState = { message: "" };

const fields = [
  { name: "title", label: "Título", minLength: 2 },
  { name: "context", label: "Contexto", minLength: 10 },
  { name: "decision", label: "Decisão", minLength: 10 },
  { name: "consequences", label: "Consequências", minLength: 10 },
] as const;

export function DecisionForm({
  action,
  initialDecision,
  submitLabel,
  pendingLabel,
}: DecisionFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  const [values, setValues] = useState(() => ({
    title: initialDecision?.title ?? "",
    context: initialDecision?.context ?? "",
    decision: initialDecision?.decision ?? "",
    consequences: initialDecision?.consequences ?? "",
  }));

  return (
    <form action={formAction} className="mt-8">
      <fieldset disabled={pending} className="space-y-6">
        <legend className="sr-only">Dados da decisão técnica</legend>

        <AdminFormSection id="decision-section-0" title="Registro da decisão técnica">
          {fields.map(({ name, label, minLength }) => {
            const errors = state.fieldErrors?.[name];
            const hasError = Boolean(errors?.length);

            const fieldProps = {
              id: name,
              name,
              required: true,
              minLength,
              value: values[name],
              onChange: (
                event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
              ) => {
                const value = event.currentTarget.value;
                setValues((previous) => ({ ...previous, [name]: value }));
              },
              "aria-invalid": hasError,
              "aria-describedby": hasError ? `${name}-error` : undefined,
              className:
                "admin-input",
            };

            return (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium">
                  {label}
                </label>

                {name === "title" ? (
                  <input type="text" {...fieldProps} />
                ) : (
                  <textarea rows={5} {...fieldProps} />
                )}

                {hasError && (
                  <p
                    id={`${name}-error`}
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

export function CreateDecisionForm({ action }: CreateDecisionFormProps) {
  return (
    <DecisionForm
      action={action}
      submitLabel="Cadastrar decisão"
      pendingLabel="Cadastrando…"
    />
  );
}
