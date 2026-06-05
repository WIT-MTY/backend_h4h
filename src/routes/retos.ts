import { Router } from "express";
import * as RetosController from "../controllers/retos.js";
import { protectRoute } from "../middlewares/auth.js";

const router = Router();

router.use(protectRoute);

//PUT /retos/aceptar-clausula - líder acepta cláusula ARCA
router.put("/aceptarclausula", RetosController.aceptarClausulaArca);

// GET /retos - todos los retos disponibles
router.get("/", RetosController.getAllRetos);

// GET /retos/mi-equipo?usuarioBaseId=xxx - info del equipo
router.get("/mi-equipo", RetosController.getMiEquipo);

// PUT /retos/equipo/:equipoId - actualizar opciones (solo líder)
router.put("/elegir", RetosController.updateRetosEquipo);

// PUT/retos/asignar-reto - actualizar reto_asignado de un equipo (dentro del body: equipo_id, reto_id)
router.put("/asignar-reto", RetosController.defineRetoDefinitivo);

// GET /retos/equipos-por-reto - obtener cantidad de equipos por reto
router.get("/equipos-por-reto", RetosController.getEquiposPorReto);

export default router;
