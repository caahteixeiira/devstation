"use client";

import { useActionState, useState } from "react";
import type { DeleteRoadmapActionState } from "./actions";

type DeleteRoadmapFormProps = {
  action: (
    previousState: DeleteRoadmapActionState,
    formData: FormData,
  ) => Promise<DeleteRoadmapActionState>;
};

const initialState: DeleteRoadmapActionState = {
  message: "",
};

export function DeleteRoadmapForm({
  action,
}: DeleteRoadmapFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialState,
  );

  const [confirmation, setConfirmation] = useState("");

  return (
    <form action={formAction} className="mt-8">
      <fieldset disabled={pending} className="space-y-5">
        <legend className="sr-only">
          Confirmar exclusão do item de planejamento
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
            O item será removido definitivamente do planejamento.
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
          {pending ? "Excluindo…" : "Excluir item definitivamente"}
        </button>
      </fieldset>
    </form>
  );
}