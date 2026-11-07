"use client";
import { Button } from "@/components/ui/Button";

import { useActionState, useState } from "react";
import type { DeleteArticleActionState } from "./actions";

type DeleteArticleFormProps = {
  slug: string;
  action: (
    previousState: DeleteArticleActionState,
    formData: FormData,
  ) => Promise<DeleteArticleActionState>;
};

const initialState: DeleteArticleActionState = {
  message: "",
};

export function DeleteArticleForm({
  slug,
  action,
}: DeleteArticleFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialState,
  );

  const [confirmation, setConfirmation] = useState("");

  return (
    <form action={formAction} className="mt-8">
      <fieldset disabled={pending} className="space-y-5">
        <legend className="sr-only">
          Confirmar exclusão do artigo
        </legend>

        <div>
          <label
            htmlFor="confirmation"
            className="block text-sm font-medium"
          >
            Digite {slug} para confirmar
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
            A exclusão remove definitivamente o artigo e seu
            conteúdo. O projeto vinculado será mantido.
          </p>
        </div>

        {state.message && (
          <p role="alert" className="text-sm text-foreground-muted">
            {state.message}
          </p>
        )}

        <div className="admin-form-actions"><Button type="submit"
          disabled={pending || confirmation !== slug}
          className="admin-button-danger"
        >
          {pending ? "Excluindo…" : "Excluir artigo definitivamente"}
        </Button></div>
      </fieldset>
    </form>
  );
}