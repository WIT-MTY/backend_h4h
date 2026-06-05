import { Router } from "express";
import * as EquipoController from "../controllers/equipos.js";
import { protectRoute } from "../middlewares/auth.js";
import { removeIntegranteFromEquipo } from "../controllers/equipos.js";

const router = Router();

router.use(protectRoute);

router.get("/retos/elegidos", EquipoController.getRetosElegidos);

router.get("/retos/porEquipo", EquipoController.getRetosElegidosPorEquipo);

router.post("/create", EquipoController.createTeam);
router.post("/join/:equipo_codigo_entrada", EquipoController.joinTeam);
router.get("/myteam", EquipoController.getMyTeam); // obtener equipo si el usuario es líder o participante o si no pertenece a ningún equipo
router.delete("/equipos/:equipo_id/integrantes/:usuario_base_id", protectRoute, removeIntegranteFromEquipo);
// router.post("/leave", protectRoute, teamController.leaveTeam);
router.delete("/delete/:equipo_id", protectRoute, EquipoController.deleteTeam);

router.get("/:resumen", EquipoController.getEquipos);
export default router;
