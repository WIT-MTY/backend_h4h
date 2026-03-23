import { Router } from "express";
import * as catalogoController from "@/controllers/catalogo.js";
import { protectRoute } from "@/middlewares/auth.js";

const router = Router();

router.use(protectRoute);

router.get("/catalogo/semestre", catalogoController.listSemestres);

export default router;
