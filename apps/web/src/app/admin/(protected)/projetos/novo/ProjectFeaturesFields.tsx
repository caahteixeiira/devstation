"use client";

import { useState } from "react";
import type { ProjectDetail } from "@/types/project";

type FeatureField = {
  key: string;
  title: string;
  description: string;
};

type ProjectFeaturesFieldsProps = {
  errors?: string[];
  initialFeatures?: ProjectDetail["features"];
};

const inputClassName =
  "mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground";

export function ProjectFeaturesFields({
  errors,
  initialFeatures = [],
}: ProjectFeaturesFieldsProps) {
  const [features, setFeatures] = useState<FeatureField[]>(() =>
    initialFeatures.map((feature) => ({
      key: String(feature.id),
      title: feature.title,
      description: feature.description,
    })),
  );

  function addFeature() {
    setFeatures((current) => [
      ...current,
      {
        key: crypto.randomUUID(),
        title: "",
        description: "",
      },
    ]);
  }

  function updateFeature(
    key: string,
    field: "title" | "description",
    value: string,
  ) {
    setFeatures((current) =>
      current.map((feature) =>
        feature.key === key ? { ...feature, [field]: value } : feature,
      ),
    );
  }

  function removeFeature(key: string) {
    setFeatures((current) => current.filter((feature) => feature.key !== key));
  }

  return (
    <fieldset>
      <legend className="text-sm font-medium">
        Funcionalidades — opcional
      </legend>

      <div className="mt-4 space-y-4">
        {features.map((feature, index) => (
          <div
            key={feature.key}
            className="rounded-xl border border-border p-4"
          >
            <label
              htmlFor={`feature-title-${feature.key}`}
              className="block text-sm font-medium"
            >
              Título da funcionalidade {index + 1}
            </label>

            <input
              id={`feature-title-${feature.key}`}
              name="featureTitles"
              value={feature.title}
              onChange={(event) =>
                updateFeature(feature.key, "title", event.target.value)
              }
              required
              minLength={2}
              className={inputClassName}
            />

            <label
              htmlFor={`feature-description-${feature.key}`}
              className="mt-4 block text-sm font-medium"
            >
              Descrição
            </label>

            <textarea
              id={`feature-description-${feature.key}`}
              name="featureDescriptions"
              value={feature.description}
              onChange={(event) =>
                updateFeature(feature.key, "description", event.target.value)
              }
              required
              minLength={10}
              rows={3}
              className={inputClassName}
            />

            <button
              type="button"
              onClick={() => removeFeature(feature.key)}
              className="mt-4 text-sm text-primary-strong hover:underline"
            >
              Remover funcionalidade {index + 1}
            </button>
          </div>
        ))}
      </div>

      {errors?.length ? (
        <p role="alert" className="mt-3 text-sm text-foreground-muted">
          {errors.join(" ")}
        </p>
      ) : null}

      <button
        type="button"
        onClick={addFeature}
        className="mt-4 rounded-lg border border-border px-4 py-2 text-sm"
      >
        Adicionar funcionalidade
      </button>
    </fieldset>
  );
}
