"use client";
import { Button } from "@/components/ui/Button";

import { useActionState, useState } from "react";
import type { DeleteDecisionActionState } from "./actions";

type DeleteDecisionFormProps = {
  action: (
    previousState: DeleteDecisionActionState,
    formData: FormData,
  ) => Promise<DeleteDecisionActionState>;
};

const initialState: DeleteDecisionActionState = { message: "" };

export function DeleteDecisionForm({ action }: DeleteDecisionFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [confirmation, setConfirmation] = useState("");

  return (
    <form action={formAction} className="mt-8">
      <fieldset disabled={pending} className="space-y-5">
        <legend className="sr-only">
          Confirmar exclusão da decisão técnica
        </legend>

        <div>
          <label htmlFor="confirmation" className="block text-sm font-medium">
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
            onChange={(event) => setConfirmation(event.currentTarget.value)}
            className="admin-input"
          />
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
          {pending ? "Excluindo…" : "Excluir decisão definitivamente"}
        </Button></div>
      </fieldset>
    </form>
  );
}
