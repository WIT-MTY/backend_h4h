import { Router } from "express";
import * as PerfilParticipanteController from "../controllers/perfilParticipante.js";

const router = Router();

router.get(
  "/:usuario_base_id",
  PerfilParticipanteController.getPerfilParticipante,
);
router.get(
  "/estado/:estadoId",
  PerfilParticipanteController.getPerfilParticipantesByEstado,
);
router.get(
  "/estatus/:usuario_base_id",
  PerfilParticipanteController.getParticipanteEstatus,
);

export default router;
