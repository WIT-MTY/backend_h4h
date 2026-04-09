import { Router } from "express";
import * as RetosController from "../controllers/retos.js";
import { protectRoute } from "../middlewares/auth.js";

const router = Router();

router.use(protectRoute);

// GET /retos - todos los retos disponibles
router.get("/", RetosController.getAllRetos);

// GET /retos/mi-equipo?usuarioBaseId=xxx - info del equipo
router.get("/mi-equipo", RetosController.getMiEquipo);

// PUT /retos/equipo/:equipoId - actualizar opciones (solo líder)
router.put("/equipo/:equipoId", RetosController.updateRetosEquipo);

export default router;