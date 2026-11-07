"use client";
import { Button } from "@/components/ui/Button";

import { useActionState, useState } from "react";
import type { DeleteTechnologyActionState } from "./actions";

type DeleteTechnologyFormProps = {
  action: (
    previousState: DeleteTechnologyActionState,
    formData: FormData,
  ) => Promise<DeleteTechnologyActionState>;
};

const initialState: DeleteTechnologyActionState = {
  message: "",
};

export function DeleteTechnologyForm({
  action,
}: DeleteTechnologyFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialState,
  );

  const [confirmation, setConfirmation] = useState("");

  return (
    <form action={formAction} className="mt-8">
      <fieldset disabled={pending} className="space-y-5">
        <legend className="sr-only">
          Confirmar exclusão da tecnologia
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
            className="admin-input"
          />

          <p
            id="confirmation-help"
            className="mt-2 text-sm text-foreground-muted"
          >
            A exclusão é definitiva e remove os vínculos desta
            tecnologia com os conteúdos cadastrados.
          </p>
        </div>

        {state.message && (
          <p role="alert" className="text-sm text-foreground-muted">
            {state.message}
          </p>
        )}

        <div className="admin-form-actions"><Button type="submit"
          disabled={pending || confirmation !== "EXCLUIR"}
          className="admin-button-danger"
        >
          {pending ? "Excluindo…" : "Excluir tecnologia definitivamente"}
        </Button></div>
      </fieldset>
    </form>
  );
}