import { Router } from "express";
import * as catalogoController from "../controllers/catalogo.js";
import { protectRoute } from "../middlewares/auth.js";

const router = Router();

// router.use(protectRoute);

router.get("/catalogo/pais", catalogoController.listPaises);
router.get("/catalogo/estado", catalogoController.listEstados);
router.get("/catalogo/universidad", catalogoController.listUniversidades);
router.get("/catalogo/genero", catalogoController.listGeneros);
router.get("/catalogo/talla", catalogoController.listTallas);
router.get("/catalogo/carrera", catalogoController.listCarreras);
router.get("/catalogo/semestre", catalogoController.listSemestres);


export default router;
