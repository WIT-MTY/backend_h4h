import { Router } from "express";
import * as EquipoController from "../controllers/equipos.js";
import { protectRoute } from "../middlewares/auth.js";

const router = Router();

router.use(protectRoute);

router.get(
    "/:equipoId",
    EquipoController.getEquipoById,
);

export default router;