"use client";

import { useActionState, useState } from "react";
import type { ProjectSummary } from "@/types/project";
import type { Technology } from "@/types/technology";
import {
  createExperimentAction,
  type CreateExperimentActionState,
} from "./actions";
import type { Experiment } from "@/types/experiment";

type CreateExperimentFormProps = {
  projects: ProjectSummary[];
  technologies: Technology[];
};

const initialState: CreateExperimentActionState = {
  message: "",
};

const initialValues = {
  projectId: "",
  title: "",
  objective: "",
  result: "",
  status: "IDEA",
};

const inputClassName =
  "mt-2 w-full rounded-lg border border-border-input bg-surface px-4 py-3 text-foreground focus-visible:outline-2 focus-visible:outline-primary-strong";

export function ExperimentForm({
  projects,
  technologies,
  initialExperiment,
  action,
  submitLabel,
  pendingLabel,
}: ExperimentFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialState,
  );

  const [values, setValues] = useState(() =>
    initialExperiment
      ? {
          projectId:
            initialExperiment.projectId === null
              ? ""
              : String(initialExperiment.projectId),
          title: initialExperiment.title,
          objective: initialExperiment.objective,
          result: initialExperiment.result ?? "",
          status: initialExperiment.status,
        }
      : { ...initialValues },
  );

  const [selectedTechnologyIds, setSelectedTechnologyIds] =
    useState<number[]>(() =>
      initialExperiment
        ? initialExperiment.technologies.map(
            (technology) => technology.id,
          )
        : [],
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

  function toggleTechnology(id: number, checked: boolean) {
    setSelectedTechnologyIds((previous) =>
      checked
        ? [...new Set([...previous, id])]
        : previous.filter((item) => item !== id),
    );
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
          Dados do experimento
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
            htmlFor="objective"
            className="block text-sm font-medium"
          >
            Objetivo
          </label>

          <textarea
            id="objective"
            name="objective"
            required
            minLength={10}
            rows={5}
            value={values.objective}
            onChange={(event) =>
              updateField("objective", event.target.value)
            }
            className={inputClassName}
            {...errorProps("objective")}
          />

          {fieldError("objective")}
        </div>

        <div>
          <label
            htmlFor="projectId"
            className="block text-sm font-medium"
          >
            Projeto — opcional
          </label>

          <select
            id="projectId"
            name="projectId"
            value={values.projectId}
            onChange={(event) =>
              updateField("projectId", event.target.value)
            }
            className={inputClassName}
            {...errorProps("projectId")}
          >
            <option value="">Sem projeto vinculado</option>

            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>

          {fieldError("projectId")}
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
            <option value="IDEA">Ideia</option>
            <option value="IN_PROGRESS">Em andamento</option>
            <option value="COMPLETED">Concluído</option>
          </select>

          {fieldError("status")}
        </div>

        <div>
          <label
            htmlFor="result"
            className="block text-sm font-medium"
          >
            Resultado
            {values.status === "COMPLETED"
              ? " — obrigatório"
              : " — opcional"}
          </label>

          <p
            id="result-help"
            className="mt-2 text-sm text-foreground-muted"
          >
            Quando preenchido, escreva pelo menos 10 caracteres.
          </p>

          <textarea
            id="result"
            name="result"
            required={values.status === "COMPLETED"}
            minLength={10}
            rows={5}
            value={values.result}
            onChange={(event) =>
              updateField("result", event.target.value)
            }
            className={inputClassName}
            aria-invalid={Boolean(state.fieldErrors?.result?.length)}
            aria-describedby={
              state.fieldErrors?.result?.length
                ? "result-help result-error"
                : "result-help"
            }
          />

          {fieldError("result")}
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
                    checked={selectedTechnologyIds.includes(
                      technology.id,
                    )}
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

          {fieldError("technologyIds")}
        </fieldset>

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

type ExperimentFormProps = CreateExperimentFormProps & {
  initialExperiment?: Experiment;
  action: (
    previousState: CreateExperimentActionState,
    formData: FormData,
  ) => Promise<CreateExperimentActionState>;
  submitLabel: string;
  pendingLabel: string;
};

export function CreateExperimentForm({
  projects,
  technologies,
}: CreateExperimentFormProps) {
  return (
    <ExperimentForm
      projects={projects}
      technologies={technologies}
      action={createExperimentAction}
      submitLabel="Cadastrar experimento"
      pendingLabel="Cadastrando…"
    />
  );
}