import { Router } from "express";
import * as participanteController from "../controllers/participante.js";

const router = Router();

// router.patch("/participante/:id/estatus", participanteController.updateEstatus);
router.patch("/:id/estatus", participanteController.updateEstatus);

export default router;
