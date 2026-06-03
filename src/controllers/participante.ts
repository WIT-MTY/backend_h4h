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
      Number(estatus),
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

export const uploadCV = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const userId = req.user?.id;
    const cvFile = req.file;

    if (!userId) {
      return res.status(401).json({
        error: "Usuario no autenticado",
      });
    }

    if (!cvFile) {
      return res.status(400).json({
        error: "El archivo de currículum es requerido",
      });
    }

    // Multer's file type differs from the expected File type in the service.
    // Cast to the expected type to satisfy TypeScript. Ensure service can handle this shape at runtime.
    const cvURL = await participanteService.uploadCV(userId, cvFile as unknown as File);

    return res.status(200).json({
      message: "Currículum subido correctamente",

      data: {
        cvURL,
      },
    });
  } catch (error) {
    console.error("Error al subir CV:", error);

    return res.status(500).json({
      error: "Error al subir el currículum",
    });
  }
};
