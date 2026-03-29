import type { Request, Response } from "express";
import * as participanteService from "../services/participante.js";

export const updateEstatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estatus } = req.body;

    // Validación básica
    if (!estatus) {
      return res.status(400).json({
        error: "El estatus es requerido",
      });
    }

    // Validación de valores permitidos (ajústalos si cambian en tu DB)
    const validEstatusIds = [1, 2, 3];

    if (!validEstatusIds.includes(Number(estatus))) {
      return res.status(400).json({
        error: "estatus inválido",
      });
    }

    const result = await participanteService.updateEstatus(
      String(id),
      Number(estatus)
    );

    if (!result) {
      return res.status(404).json({
        error: "Participante no encontrado",
      });
    }

    return res.status(200).json({
      message: "Estatus actualizado correctamente",
      data: result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Error al actualizar el estatus",
    });
  }
};