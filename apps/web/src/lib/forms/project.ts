import "server-only";

export function readProjectFormData(formData: FormData) {
  const featureTitles = formData.getAll("featureTitles");
  const featureDescriptions = formData.getAll("featureDescriptions");

  if (featureTitles.length !== featureDescriptions.length) {
    return {
      success: false as const,
      message: "Confira as funcionalidades informadas.",
    };
  }

  const imageUrls = formData.getAll("imageUrls");
  const imageAltTexts = formData.getAll("imageAltTexts");

  if (imageUrls.length !== imageAltTexts.length) {
    return {
      success: false as const,
      message: "Confira as imagens informadas.",
    };
  }

  const improvementsText = formData.get("improvements");

  if (typeof improvementsText !== "string") {
    return {
      success: false as const,
      message: "Confira as melhorias informadas.",
    };
  }

  const technologyIds = formData
    .getAll("technologyIds")
    .map((value) =>
      typeof value === "string" && /^[1-9]\d*$/.test(value)
        ? Number(value)
        : Number.NaN,
    );

  const features = featureTitles.map((title, index) => ({
    title,
    description: featureDescriptions[index],
  }));

  const improvements = improvementsText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const images = imageUrls.map((imageUrl, index) => ({
    imageUrl,
    altText: imageAltTexts[index],
  }));

  return {
    success: true as const,
    data: {
      title: formData.get("title"),
      slug: formData.get("slug"),
      summary: formData.get("summary"),
      problem: formData.get("problem"),
      solution: formData.get("solution"),
      architecture: formData.get("architecture"),
      status: formData.get("status"),
      githubUrl: formData.get("githubUrl"),
      demoUrl: formData.get("demoUrl"),
      technologyIds,
      features,
      improvements,
      images,
    },
  };
}
