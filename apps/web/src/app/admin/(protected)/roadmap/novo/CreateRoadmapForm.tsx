"use client";

import { useActionState, useState } from "react";
import {
  createRoadmapAction,
  type CreateRoadmapActionState,
} from "./actions";
import type { RoadmapItem } from "@/types/roadmap";

const initialState: CreateRoadmapActionState = {
  message: "",
};

const initialValues = {
  title: "",
  description: "",
  status: "FUTURE",
  order: "0",
};

const inputClassName =
  "mt-2 w-full rounded-lg border border-border-input bg-surface px-4 py-3 text-foreground focus-visible:outline-2 focus-visible:outline-primary-strong";


  type RoadmapFormProps = {
  initialItem?: RoadmapItem;
  action: (
    previousState: CreateRoadmapActionState,
    formData: FormData,
  ) => Promise<CreateRoadmapActionState>;
  submitLabel: string;
  pendingLabel: string;
};

export function RoadmapForm({
  initialItem,
  action,
  submitLabel,
  pendingLabel,
}: RoadmapFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialState,
  );

  const [values, setValues] = useState(() =>
    initialItem
      ? {
          title: initialItem.title,
          description: initialItem.description,
          status: initialItem.status,
          order: String(initialItem.order),
        }
      : { ...initialValues },
  );

  function updateField(
    name: keyof typeof initialValues,
    value: string,
  ) {
    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function errorProps(name: string) {
    const hasError = Boolean(state.fieldErrors?.[name]?.length);

    return {
      "aria-invalid": hasError,
      "aria-describedby": hasError ? `${name}-error` : undefined,
    };
  }

  function fieldError(name: string) {
    const errors = state.fieldErrors?.[name];

    if (!errors?.length) {
      return null;
    }

    return (
      <p
        id={`${name}-error`}
        className="mt-2 text-sm text-foreground-muted"
      >
        {errors.join(" ")}
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-8">
      <fieldset disabled={pending} className="space-y-6">
        <legend className="sr-only">
          Dados do item de planejamento
        </legend>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium"
          >
            Título
          </label>

          <input
            id="title"
            name="title"
            type="text"
            required
            minLength={2}
            value={values.title}
            onChange={(event) =>
              updateField("title", event.target.value)
            }
            className={inputClassName}
            {...errorProps("title")}
          />

          {fieldError("title")}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium"
          >
            Descrição
          </label>

          <textarea
            id="description"
            name="description"
            required
            minLength={10}
            rows={5}
            value={values.description}
            onChange={(event) =>
              updateField("description", event.target.value)
            }
            className={inputClassName}
            {...errorProps("description")}
          />

          {fieldError("description")}
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium"
          >
            Status
          </label>

          <select
            id="status"
            name="status"
            value={values.status}
            onChange={(event) =>
              updateField("status", event.target.value)
            }
            className={inputClassName}
            {...errorProps("status")}
          >
            <option value="NOW">Agora</option>
            <option value="NEXT">Próximo</option>
            <option value="FUTURE">Futuro</option>
            <option value="COMPLETED">Concluído</option>
          </select>

          {fieldError("status")}
        </div>

        <div>
          <label
            htmlFor="order"
            className="block text-sm font-medium"
          >
            Ordem
          </label>

          <p
            id="order-help"
            className="mt-2 text-sm text-foreground-muted"
          >
            Números menores aparecem primeiro. Use um número
            inteiro a partir de zero.
          </p>

          <input
            id="order"
            name="order"
            type="number"
            required
            min={0}
            step={1}
            value={values.order}
            onChange={(event) =>
              updateField("order", event.target.value)
            }
            className={inputClassName}
            aria-invalid={Boolean(state.fieldErrors?.order?.length)}
            aria-describedby={
              state.fieldErrors?.order?.length
                ? "order-help order-error"
                : "order-help"
            }
          />

          {fieldError("order")}
        </div>

        {state.message && (
          <p role="alert" className="text-sm text-foreground-muted">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          className="rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? pendingLabel : submitLabel}
        </button>
      </fieldset>
    </form>
  );
}

export function CreateRoadmapForm() {
  return (
    <RoadmapForm
      action={createRoadmapAction}
      submitLabel="Cadastrar item"
      pendingLabel="Cadastrando…"
    />
  );
}