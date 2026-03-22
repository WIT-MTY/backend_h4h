import type { Request, Response } from "express";
import * as CatalogoService from "@/services/catalogo";

export const listSemestres = async (_req: Request, res: Response) => {
  try {
    const semestres = await CatalogoService.getSemestres();
    res.json(semestres);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener semestres" });
  }
};
