import { Router } from "express";
import * as participanteController from "../controllers/participante.js";
import { protectRoute } from "../middlewares/auth.js";

const router = Router();

router.use(protectRoute);

// router.patch("/participante/:id/estatus", participanteController.updateEstatus);
router.patch("/:id/estatus", participanteController.updateEstatus); //TODO: later change to updateEstatus route

export default router;
