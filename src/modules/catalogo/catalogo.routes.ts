import { Router } from "express";
import * as catalogoController from "./catalogo.controller.js";

const router = Router();

router.get("/catalogo/semestre", catalogoController.getSemestres);

export default router;
