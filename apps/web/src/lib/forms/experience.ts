import "server-only";

function parseLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export function readExperienceFormData(formData: FormData) {
  const responsibilities = formData.get("responsibilities");
  const achievements = formData.get("achievements");

  if (
    typeof responsibilities !== "string" ||
    typeof achievements !== "string"
  ) {
    return {
      success: false as const,
      message: "Confira as responsabilidades e conquistas informadas.",
    };
  }

  const technologyIds = formData
    .getAll("technologyIds")
    .map((value) =>
      typeof value === "string" && /^[1-9]\d*$/.test(value)
        ? Number(value)
        : Number.NaN,
    );

  const current = formData.get("current") === "on";
  const endDate = formData.get("endDate");

  return {
    success: true as const,
    data: {
      company: formData.get("company"),
      role: formData.get("role"),
      description: formData.get("description"),
      current,
      startDate: formData.get("startDate"),
      endDate: current || endDate === "" ? null : endDate,
      responsibilities: parseLines(responsibilities),
      achievements: parseLines(achievements),
      technologyIds,
    },
  };
}