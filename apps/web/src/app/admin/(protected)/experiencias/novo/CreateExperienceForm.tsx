"use client";

import { useActionState, useState } from "react";
import type { Technology } from "@/types/technology";
import {
  createExperienceAction,
  type CreateExperienceActionState,
} from "./actions";
import type { Experience } from "@/types/experience";

type CreateExperienceFormProps = {
  technologies: Technology[];
};

const initialState: CreateExperienceActionState = {
  message: "",
};

const initialValues = {
  company: "",
  role: "",
  description: "",
  startDate: "",
  endDate: "",
  responsibilities: "",
  achievements: "",
};

const textFields = [
  { name: "company", label: "Empresa" },
  { name: "role", label: "Cargo" },
] as const;

const listFields = [
  { name: "responsibilities", label: "Responsabilidades" },
  { name: "achievements", label: "Conquistas" },
] as const;

const inputClassName =
  "mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus-visible:outline-2 focus-visible:outline-primary-strong";

export function ExperienceForm({
  technologies,
  initialExperience,
  action,
  submitLabel,
  pendingLabel,
}: ExperienceFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialState,
  );

  const [values, setValues] = useState(() =>
    initialExperience
      ? {
          company: initialExperience.company,
          role: initialExperience.role,
          description: initialExperience.description,
          startDate: initialExperience.startDate.slice(0, 10),
          endDate: initialExperience.endDate?.slice(0, 10) ?? "",
          responsibilities: initialExperience.responsibilities
            .map((item) => item.description)
            .join("\n"),
          achievements: initialExperience.achievements
            .map((item) => item.description)
            .join("\n"),
        }
      : { ...initialValues },
  );

  const [current, setCurrent] = useState(
    initialExperience?.current ?? false,
  );

  const [selectedTechnologyIds, setSelectedTechnologyIds] =
    useState<number[]>(() =>
      initialExperience
        ? initialExperience.technologies.map((technology) => technology.id)
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
          Dados da experiência profissional
        </legend>

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
              value={values[field.name]}
              onChange={(event) =>
                updateField(field.name, event.target.value)
              }
              className={inputClassName}
              {...errorProps(field.name)}
            />

            {fieldError(field.name)}
          </div>
        ))}

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
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="current"
              checked={current}
              onChange={(event) => setCurrent(event.target.checked)}
              {...errorProps("current")}
            />

            <span>Trabalho atualmente aqui</span>
          </label>

          {fieldError("current")}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium"
            >
              Data de início
            </label>

            <input
              id="startDate"
              name="startDate"
              type="date"
              required
              value={values.startDate}
              onChange={(event) =>
                updateField("startDate", event.target.value)
              }
              className={inputClassName}
              {...errorProps("startDate")}
            />

            {fieldError("startDate")}
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium"
            >
              Data de término
            </label>

            <input
              id="endDate"
              name="endDate"
              type="date"
              disabled={current}
              required={!current}
              min={values.startDate || undefined}
              value={current ? "" : values.endDate}
              onChange={(event) =>
                updateField("endDate", event.target.value)
              }
              className={inputClassName}
              {...errorProps("endDate")}
            />

            {fieldError("endDate")}
          </div>
        </div>

        {listFields.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium"
            >
              {field.label} — opcional
            </label>

            <p className="mt-2 text-sm text-foreground-muted">
              Escreva um item por linha, com pelo menos dois caracteres.
            </p>

            <textarea
              id={field.name}
              name={field.name}
              rows={5}
              value={values[field.name]}
              onChange={(event) =>
                updateField(field.name, event.target.value)
              }
              className={inputClassName}
              {...errorProps(field.name)}
            />

            {fieldError(field.name)}
          </div>
        ))}

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
          className="rounded-lg bg-primary px-5 py-3 font-medium text-foreground transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? pendingLabel : submitLabel}
        </button>
      </fieldset>
    </form>
  );
}

type ExperienceFormProps = CreateExperienceFormProps & {
  initialExperience?: Experience;
  action: (
    previousState: CreateExperienceActionState,
    formData: FormData,
  ) => Promise<CreateExperienceActionState>;
  submitLabel: string;
  pendingLabel: string;
};

export function CreateExperienceForm({
  technologies,
}: CreateExperienceFormProps) {
  return (
    <ExperienceForm
      technologies={technologies}
      action={createExperienceAction}
      submitLabel="Cadastrar experiência"
      pendingLabel="Cadastrando…"
    />
  );
}