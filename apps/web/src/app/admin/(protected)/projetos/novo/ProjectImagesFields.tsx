"use client";

import { useState } from "react";

type ImageField = {
  key: string;
  imageUrl: string;
  altText: string;
};

type ProjectImagesFieldsProps = {
  errors?: string[];
};

const inputClassName =
  "mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground";

export function ProjectImagesFields({
  errors,
}: ProjectImagesFieldsProps) {
  const [images, setImages] = useState<ImageField[]>([]);

  function addImage() {
    setImages((current) => [
      ...current,
      {
        key: crypto.randomUUID(),
        imageUrl: "",
        altText: "",
      },
    ]);
  }

  function updateImage(
    key: string,
    field: "imageUrl" | "altText",
    value: string,
  ) {
    setImages((current) =>
      current.map((image) =>
        image.key === key
          ? { ...image, [field]: value }
          : image,
      ),
    );
  }

  function removeImage(key: string) {
    setImages((current) =>
      current.filter((image) => image.key !== key),
    );
  }

  return (
    <fieldset>
      <legend className="text-sm font-medium">
        Imagens — opcional
      </legend>

      <p className="mt-2 text-sm text-foreground-muted">
        Coloque o arquivo em public/images/projects e informe
        seu caminho, como /images/projects/devstation/home.webp.
      </p>

      <div className="mt-4 space-y-4">
        {images.map((image, index) => (
          <div
            key={image.key}
            className="rounded-xl border border-border p-4"
          >
            <label
              htmlFor={`image-url-${image.key}`}
              className="block text-sm font-medium"
            >
              Caminho da imagem {index + 1}
            </label>

            <input
              id={`image-url-${image.key}`}
              name="imageUrls"
              type="text"
              value={image.imageUrl}
              onChange={(event) =>
                updateImage(
                  image.key,
                  "imageUrl",
                  event.target.value,
                )
              }
              required
              placeholder="/images/projects/devstation/home.webp"
              className={inputClassName}
            />

            <label
              htmlFor={`image-alt-${image.key}`}
              className="mt-4 block text-sm font-medium"
            >
              Texto alternativo
            </label>

            <input
              id={`image-alt-${image.key}`}
              name="imageAltTexts"
              type="text"
              value={image.altText}
              onChange={(event) =>
                updateImage(
                  image.key,
                  "altText",
                  event.target.value,
                )
              }
              required
              minLength={2}
              className={inputClassName}
            />

            <p className="mt-2 text-sm text-foreground-muted">
              Descreva o que a imagem apresenta.
            </p>

            <button
              type="button"
              onClick={() => removeImage(image.key)}
              className="mt-4 text-sm text-primary-strong hover:underline"
            >
              Remover imagem {index + 1}
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
        onClick={addImage}
        className="mt-4 rounded-lg border border-border px-4 py-2 text-sm"
      >
        Adicionar imagem
      </button>
    </fieldset>
  );
}