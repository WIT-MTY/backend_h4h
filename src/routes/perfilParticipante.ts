import { Router } from "express";
import * as PerfilParticipanteController from "../controllers/perfilParticipante.js";
import { protectRoute } from "../middlewares/auth.js";

const router = Router();

router.use(protectRoute);

router.get(
  "/:usuario_base_id",
  PerfilParticipanteController.getPerfilParticipante,
);
// router.get(
//   "/estado/:estadoId",
//   PerfilParticipanteController.getPerfilParticipantesByEstado,
// );
router.get(
  "/estatus/:usuario_base_id",
  PerfilParticipanteController.getParticipanteEstatus,
);

router.get("/", PerfilParticipanteController.getParticipantes);

export default router;
