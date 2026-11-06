import type { Experiment } from "@/types/experiment";
import type { ProjectSummary } from "@/types/project";
import type { RoadmapItem } from "@/types/roadmap";
import type { BadgeTone } from "./Badge";

/**
 * Mapa único de rótulo e tom visual por status.
 * É apenas apresentação: não altera valores nem contratos da API.
 */
export type StatusMeta = { label: string; tone: BadgeTone };

export const projectStatus: Record<ProjectSummary["status"], StatusMeta> = {
  PLANNED: { label: "Planejado", tone: "accent" },
  IN_DEVELOPMENT: { label: "Em desenvolvimento", tone: "primary" },
  COMPLETED: { label: "Concluído", tone: "success" },
  ARCHIVED: { label: "Arquivado", tone: "neutral" },
};

export const experimentStatus: Record<Experiment["status"], StatusMeta> = {
  IDEA: { label: "Ideia", tone: "accent" },
  IN_PROGRESS: { label: "Em andamento", tone: "primary" },
  COMPLETED: { label: "Concluído", tone: "success" },
};

export const roadmapStatus: Record<RoadmapItem["status"], StatusMeta> = {
  NOW: { label: "Agora", tone: "primary" },
  NEXT: { label: "Próximo", tone: "accent" },
  FUTURE: { label: "Futuro", tone: "neutral" },
  COMPLETED: { label: "Concluído", tone: "success" },
};

export type StatusRef =
  | { kind: "project"; status: ProjectSummary["status"] }
  | { kind: "experiment"; status: Experiment["status"] }
  | { kind: "roadmap"; status: RoadmapItem["status"] };

export function getStatusMeta(ref: StatusRef): StatusMeta {
  switch (ref.kind) {
    case "project":
      return projectStatus[ref.status];
    case "experiment":
      return experimentStatus[ref.status];
    case "roadmap":
      return roadmapStatus[ref.status];
  }
}
