import { Router } from "express";
import * as catalogoController from "@/controllers/catalogo";

const router = Router();

router.get("/catalogo/semestre", catalogoController.listSemestres);

export default router;
