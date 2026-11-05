import "server-only";

function parseId(value: FormDataEntryValue | null): number {
  return typeof value === "string" && /^[1-9]\d*$/.test(value)
    ? Number(value)
    : Number.NaN;
}

export function readExperimentFormData(formData: FormData) {
  const projectId = formData.get("projectId");
  const result = formData.get("result");

  return {
    projectId: projectId === "" ? null : parseId(projectId),
    title: formData.get("title"),
    objective: formData.get("objective"),
    result:
      typeof result === "string" && result.trim() === ""
        ? null
        : result,
    status: formData.get("status"),
    technologyIds: formData.getAll("technologyIds").map(parseId),
  };
}