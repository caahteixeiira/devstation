export type ExperimentStatus = "idea" | "in-progress" | "completed";

export type Experiment = {
  id: string;
  title: string;
  objective: string;
  technologies: string[];
  status: ExperimentStatus;
  project?: string;
  result?: string;
};

export const experiments: Experiment[] = [
  {
    id: "1",
    title: "Processamento assíncrono com BullMQ",
    objective:
      "Validar o uso de filas para processar tarefas em segundo plano sem manter a requisição HTTP aguardando.",
    technologies: ["Node.js", "BullMQ", "Redis"],
    status: "idea",
    project: "Central de Notificações",
  },
  {
    id: "2",
    title: "Ambiente local com Docker Compose",
    objective:
      "Experimentar a padronização do ambiente de desenvolvimento utilizando containers.",
    technologies: ["Docker", "PostgreSQL"],
    status: "in-progress",
    project: "DevStation",
  },
];