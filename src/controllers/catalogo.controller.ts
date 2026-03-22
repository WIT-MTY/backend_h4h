import type { Request, Response } from "express";
import * as catalogoService from "../services/catalogo.service.js";

export const getSemestres = async (req: Request, res: Response) => {
  try {
    const semestres = await catalogoService.obtenerSemestres();

    res.json({
      success: true,
      data: semestres,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      success: false,
      message: errorMessage,
      details: error,
    });
  }
};
