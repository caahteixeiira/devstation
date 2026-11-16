import type { FastifyInstance } from "fastify";
import { requireAdmin } from "../auth/auth.middleware.js";
import * as controller from "./certification.controller.js";

export async function certificationRoutes(app: FastifyInstance) {
  app.get("/certifications", controller.listCertificationsController);
  app.get("/certifications/:id", controller.getCertificationController);
  const admin = { onRequest: requireAdmin };
  app.get("/admin/certifications", admin, controller.listAdminCertificationsController);
  app.get("/admin/certifications/:id", admin, controller.getAdminCertificationController);
  app.post("/certifications", admin, controller.createCertificationController);
  app.patch("/certifications/:id", admin, controller.updateCertificationController);
  app.delete("/certifications/:id", admin, controller.deleteCertificationController);
  app.post("/certifications/:id/image", admin, controller.uploadCertificationImageController);
  app.delete("/certifications/:id/image", admin, controller.removeCertificationImageController);
}
