import { Router } from "express";
import * as catalogoController from "@/controllers/catalogo";
import { protectRoute } from "@/middlewares/auth";

const router = Router();

router.use(protectRoute);

router.get("/catalogo/semestre", catalogoController.listSemestres);

export default router;
