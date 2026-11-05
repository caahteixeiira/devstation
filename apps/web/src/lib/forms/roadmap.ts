import "server-only";

export function readRoadmapFormData(formData: FormData) {
  const order = formData.get("order");

  return {
    title: formData.get("title"),
    description: formData.get("description"),
    status: formData.get("status"),
    order:
      typeof order === "string" && /^\d+$/.test(order)
        ? Number(order)
        : Number.NaN,
  };
}