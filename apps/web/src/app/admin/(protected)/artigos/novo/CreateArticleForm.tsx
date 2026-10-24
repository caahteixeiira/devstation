"use client";

import { useActionState, useState } from "react";
import type { ProjectSummary } from "@/types/project";
import {
  createArticleAction,
  type CreateArticleActionState,
} from "./actions";
import type { AdminArticleDetail } from "@/types/article";

type CreateArticleFormProps = {
  projects: ProjectSummary[];
};

const initialState: CreateArticleActionState = {
  message: "",
};

const initialValues = {
  projectId: "",
  title: "",
  slug: "",
  summary: "",
  content: "",
  category: "",
  status: "DRAFT",
};

const textFields = [
  { name: "title", label: "Título" },
  { name: "slug", label: "Slug" },
  { name: "category", label: "Categoria" },
] as const;

const contentFields = [
  { name: "summary", label: "Resumo", rows: 3 },
  { name: "content", label: "Conteúdo em Markdown", rows: 18 },
] as const;

const inputClassName =
  "mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus-visible:outline-2 focus-visible:outline-primary-strong";

export function ArticleForm({
  projects,
  initialArticle,
  action,
  submitLabel,
  pendingLabel,
}: ArticleFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialState,
  );

  const [values, setValues] = useState(() =>
    initialArticle
      ? {
          projectId: String(initialArticle.project.id),
          title: initialArticle.title,
          slug: initialArticle.slug,
          summary: initialArticle.summary,
          content: initialArticle.content,
          category: initialArticle.category,
          status: initialArticle.status,
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
      {projects.length === 0 && (
        <p className="mb-6 text-foreground-muted">
          Cadastre um projeto antes de criar um artigo.
        </p>
      )}

      <fieldset
        disabled={pending || projects.length === 0}
        className="space-y-6"
      >
        <legend className="sr-only">
          Dados do artigo
        </legend>

        <div>
          <label
            htmlFor="projectId"
            className="block text-sm font-medium"
          >
            Projeto
          </label>

          <select
            id="projectId"
            name="projectId"
            required
            value={values.projectId}
            onChange={(event) =>
              updateField("projectId", event.target.value)
            }
            className={inputClassName}
            {...errorProps("projectId")}
          >
            <option value="">Selecione um projeto</option>

            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>

          {fieldError("projectId")}
        </div>

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
              minLength={2}
              pattern={
                field.name === "slug"
                  ? "[a-z0-9]+(-[a-z0-9]+)*"
                  : undefined
              }
              value={values[field.name]}
              onChange={(event) =>
                updateField(field.name, event.target.value)
              }
              className={inputClassName}
              {...errorProps(field.name)}
            />

            {field.name === "slug" && (
              <p className="mt-2 text-sm text-foreground-muted">
                Use letras minúsculas, números e hífens.
                Exemplo: como-organizei-o-devstation.
              </p>
            )}

            {fieldError(field.name)}
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

            {field.name === "content" && (
              <p className="mt-2 text-sm text-foreground-muted">
                Use Markdown: ## para seções, **texto** para
                negrito e - para listas. O título principal será
                exibido pela página.
              </p>
            )}

            <textarea
              id={field.name}
              name={field.name}
              required
              minLength={2}
              rows={field.rows}
              value={values[field.name]}
              onChange={(event) =>
                updateField(field.name, event.target.value)
              }
              className={`${inputClassName} ${
                field.name === "content" ? "font-mono text-sm" : ""
              }`}
              {...errorProps(field.name)}
            />

            {fieldError(field.name)}
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
    <option value="DRAFT">Rascunho</option>
    <option value="PUBLISHED">Publicado</option>

    {initialArticle && (
      <option value="ARCHIVED">Arquivado</option>
    )}
  </select>

  {fieldError("status")}
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
          {pending ? pendingLabel : submitLabel}
        </button>
      </fieldset>
    </form>
  );
}

type ArticleFormProps = CreateArticleFormProps & {
  initialArticle?: AdminArticleDetail;
  action: (
    previousState: CreateArticleActionState,
    formData: FormData,
  ) => Promise<CreateArticleActionState>;
  submitLabel: string;
  pendingLabel: string;
};

export function CreateArticleForm({
  projects,
}: CreateArticleFormProps) {
  return (
    <ArticleForm
      projects={projects}
      action={createArticleAction}
      submitLabel="Cadastrar artigo"
      pendingLabel="Cadastrando…"
    />
  );
}