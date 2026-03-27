import { Router } from "express";
import * as PerfilParticipanteController from "../controllers/perfilParticipante.js";

const router = Router();

router.get("/:id", PerfilParticipanteController.getPerfilParticipante);
router.get(
  "/:estadoId",
  PerfilParticipanteController.getPerfilParticipantesByEstado,
);

export default router;
