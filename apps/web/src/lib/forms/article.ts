import "server-only";

export function readArticleFormData(formData: FormData) {
  const projectId = formData.get("projectId");

  return {
    projectId:
      typeof projectId === "string" && /^[1-9]\d*$/.test(projectId)
        ? Number(projectId)
        : Number.NaN,
    title: formData.get("title"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    content: formData.get("content"),
    category: formData.get("category"),
    status: formData.get("status"),
  };
}