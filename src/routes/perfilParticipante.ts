import { Router } from "express";
import * as PerfilParticipanteController from "../controllers/perfilParticipante";

const router = Router();

router.get("/:id", PerfilParticipanteController.getPerfilParticipante);

export default router;