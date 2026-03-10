import type { Request, Response } from "express";
import * as catalogoService from "./catalogo.service.js";

export const getSemestres = async (req: Request, res: Response) => {
  try {
    const semestres = await catalogoService.obtenerSemestres();

    res.json({
      success: true,
      data: semestres,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error retrieving semestre catalog",
    });
  }
};
