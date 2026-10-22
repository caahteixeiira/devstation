"use client";

import { useActionState, useState } from "react";
import {
  createProjectAction,
  type CreateProjectActionState,
} from "./actions";
import type { Technology } from "@/types/technology";
import { ProjectFeaturesFields } from "./ProjectFeaturesFields";
import { ProjectImagesFields } from "./ProjectImagesFields";

const initialState: CreateProjectActionState = {
  message: "",
};

const textFields = [
  { name: "title", label: "Título", minLength: 3 },
  { name: "slug", label: "Slug", minLength: 1 },
] as const;

const contentFields = [
  { name: "summary", label: "Resumo" },
  { name: "problem", label: "Problema" },
  { name: "solution", label: "Solução" },
  { name: "architecture", label: "Arquitetura" },
] as const;

const inputClassName =
  "mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus-visible:outline-2 focus-visible:outline-primary-strong";

function FieldError({
  name,
  errors,
}: {
  name: string;
  errors: CreateProjectActionState["fieldErrors"];
}) {
  const messages = errors?.[name];

  if (!messages?.length) {
    return null;
  }

  return (
    <p
      id={`${name}-error`}
      className="mt-2 text-sm text-foreground-muted"
    >
      {messages.join(" ")}
    </p>
  );
}

const initialValues = {
  title: "",
  slug: "",
  summary: "",
  problem: "",
  solution: "",
  architecture: "",
  status: "PLANNED",
  githubUrl: "",
  demoUrl: "",
  improvements: "",
};

type ProjectFormValues = typeof initialValues;

type CreateProjectFormProps = {
  technologies: Technology[];
};

export function CreateProjectForm({ technologies }: CreateProjectFormProps) {
  const [state, formAction, pending] = useActionState(
    
    createProjectAction,
    initialState,
  );

  const [values, setValues] = useState(initialValues);

  const [selectedTechnologyIds, setSelectedTechnologyIds] =
  useState<number[]>([]);

function toggleTechnology(id: number, checked: boolean) {
  setSelectedTechnologyIds((current) =>
    checked
      ? [...new Set([...current, id])]
      : current.filter((technologyId) => technologyId !== id),
  );
}

function updateField(
  name: keyof ProjectFormValues,
  value: string,
) {
  setValues((current) => ({
    ...current,
    [name]: value,
  }));
}

  function errorProps(name: string) {
    const hasError = Boolean(state.fieldErrors?.[name]?.length);

    return {
      "aria-invalid": hasError,
      "aria-describedby": hasError
        ? `${name}-error`
        : undefined,
    };
  }

  return (
    
<form action={formAction} className="mt-8">
  <fieldset disabled={pending} className="space-y-6">
        <legend className="sr-only">Dados do projeto</legend>

        {textFields.map((field) => (
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
              minLength={field.minLength}
              pattern={
                field.name === "slug"
                  ? "[a-z0-9]+(-[a-z0-9]+)*"
                  : undefined
              }
              className={inputClassName}
              {...errorProps(field.name)}
              value={values[field.name]}
onChange={(event) =>
  updateField(field.name, event.target.value)
}
            />

            {field.name === "slug" && (
              <p className="mt-2 text-sm text-foreground-muted">
                Use letras minúsculas, números e hífens.
                Exemplo: sistema-de-chamados.
              </p>
            )}

            <FieldError
              name={field.name}
              errors={state.fieldErrors}
            />
          </div>
        ))}

        {contentFields.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium"
            >
              {field.label}
            </label>

            <textarea
              id={field.name}
              name={field.name}
              required
              minLength={10}
              rows={field.name === "summary" ? 3 : 5}
              className={inputClassName}
              {...errorProps(field.name)}
              value={values[field.name]}
onChange={(event) =>
  updateField(field.name, event.target.value)
}
            />

            <FieldError
              name={field.name}
              errors={state.fieldErrors}
            />
          </div>
        ))}

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
            <option value="PLANNED">Planejado</option>
            <option value="IN_DEVELOPMENT">
              Em desenvolvimento
            </option>
            <option value="COMPLETED">Concluído</option>
            <option value="ARCHIVED">Arquivado</option>
          </select>

          <FieldError name="status" errors={state.fieldErrors} />
        </div>
        <fieldset>
  <legend className="text-sm font-medium">
    Tecnologias — opcional
  </legend>

  {technologies.length === 0 ? (
    <p className="mt-3 text-sm text-foreground-muted">
      Nenhuma tecnologia cadastrada.
    </p>
  ) : (
    <div className="mt-3 grid gap-3 sm:grid-cols-2">
      {technologies.map((technology) => (
        <label
          key={technology.id}
          className="flex items-start gap-3 rounded-lg border border-border p-3"
        >
          <input
            type="checkbox"
            name="technologyIds"
            value={technology.id}
            checked={selectedTechnologyIds.includes(technology.id)}
            onChange={(event) =>
              toggleTechnology(
                technology.id,
                event.target.checked,
              )
            }
            className="mt-1"
          />

          <span>
            <span className="block text-sm font-medium">
              {technology.name}
            </span>

            <span className="block text-sm text-foreground-muted">
              {technology.category}
            </span>
          </span>
        </label>
      ))}
    </div>
  )}

  <FieldError
    name="technologyIds"
    errors={state.fieldErrors}
  />
</fieldset>
<ProjectFeaturesFields
  errors={state.fieldErrors?.features}
/>

<div>
  <label
    htmlFor="improvements"
    className="block text-sm font-medium"
  >
    Melhorias — opcional
  </label>

  <p
    id="improvements-help"
    className="mt-2 text-sm text-foreground-muted"
  >
    Escreva uma melhoria por linha.
  </p>

  <textarea
    id="improvements"
    name="improvements"
    value={values.improvements}
    onChange={(event) =>
      updateField("improvements", event.target.value)
    }
    rows={5}
    className={inputClassName}
    aria-invalid={Boolean(state.fieldErrors?.improvements?.length)}
    aria-describedby={
      state.fieldErrors?.improvements?.length
        ? "improvements-help improvements-error"
        : "improvements-help"
    }
  />

  <FieldError
    name="improvements"
    errors={state.fieldErrors}
  />
</div>
    <ProjectImagesFields errors={state.fieldErrors?.images} />
        <div>
          <label
            htmlFor="githubUrl"
            className="block text-sm font-medium"
          >
            URL do GitHub — opcional
          </label>

          <input
            id="githubUrl"
            name="githubUrl"
            type="url"
            className={inputClassName}
            {...errorProps("githubUrl")}
            value={values.githubUrl}
onChange={(event) =>
  updateField("githubUrl", event.target.value)
}
          />

          <FieldError
            name="githubUrl"
            errors={state.fieldErrors}
          />
        </div>

        <div>
          <label
            htmlFor="demoUrl"
            className="block text-sm font-medium"
          >
            URL da demonstração — opcional
          </label>

          <input
            id="demoUrl"
            name="demoUrl"
            type="url"
            className={inputClassName}
            {...errorProps("demoUrl")}
            value={values.demoUrl}
onChange={(event) =>
  updateField("demoUrl", event.target.value)
}
          />

          <FieldError
            name="demoUrl"
            errors={state.fieldErrors}
          />
        </div>

        {state.message && (
          <p role="alert" className="text-sm text-foreground-muted">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          className="rounded-lg bg-primary px-5 py-3 font-medium text-foreground transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Cadastrando…" : "Cadastrar projeto"}
        </button>
      </fieldset>
    </form>
  );
}