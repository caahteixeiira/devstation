"use client";

import { useActionState, useState } from "react";
import type { DeleteExperienceActionState } from "./actions";

type DeleteExperienceFormProps = {
  action: (
    previousState: DeleteExperienceActionState,
    formData: FormData,
  ) => Promise<DeleteExperienceActionState>;
};

const initialState: DeleteExperienceActionState = {
  message: "",
};

export function DeleteExperienceForm({
  action,
}: DeleteExperienceFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialState,
  );

  const [confirmation, setConfirmation] = useState("");

  return (
    <form action={formAction} className="mt-8">
      <fieldset disabled={pending} className="space-y-5">
        <legend className="sr-only">
          Confirmar exclusão da experiência
        </legend>

        <div>
          <label
            htmlFor="confirmation"
            className="block text-sm font-medium"
          >
            Digite EXCLUIR para confirmar
          </label>

          <input
            id="confirmation"
            name="confirmation"
            type="text"
            required
            autoComplete="off"
            spellCheck={false}
            value={confirmation}
            onChange={(event) =>
              setConfirmation(event.target.value)
            }
            aria-describedby="confirmation-help"
            className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus-visible:outline-2 focus-visible:outline-primary-strong"
          />

          <p
            id="confirmation-help"
            className="mt-2 text-sm text-foreground-muted"
          >
            A exclusão é definitiva e também remove as
            responsabilidades e conquistas desta experiência.
          </p>
        </div>

        {state.message && (
          <p role="alert" className="text-sm text-foreground-muted">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending || confirmation !== "EXCLUIR"}
          className="rounded-lg border border-border px-5 py-3 font-medium transition hover:border-primary-strong disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending
            ? "Excluindo…"
            : "Excluir experiência definitivamente"}
        </button>
      </fieldset>
    </form>
  );
}