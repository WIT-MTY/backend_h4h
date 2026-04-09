import type { Request, Response } from "express";
import * as RetosService from "../services/retos.js";

export const getAllRetos = async (req: Request, res: Response) => {
  try {
    const retos = await RetosService.getAllRetos();
    res.status(200).json(retos);
  } catch (error) {
    console.error("Error getting retos:", error);
    res.status(500).json({ error: "Error al obtener los retos" });
  }
};

export const getRetosEquipo = async (req: Request, res: Response) => {
  try {
    const equipoId = parseInt(req.params.equipoId);
    const participanteId = parseInt(req.query.participanteId as string);

    if (!participanteId) {
      return res.status(400).json({ error: "participanteId es requerido" });
    }

    const data = await RetosService.getRetosEquipo(equipoId, participanteId);

    if (!data) {
      return res.status(404).json({ error: "Equipo no encontrado" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error getting retos del equipo:", error);
    res.status(500).json({ error: "Error al obtener retos del equipo" });
  }
};

export const updateRetosEquipo = async (req: Request, res: Response) => {
  try {
    const equipoId = parseInt(req.params.equipoId);
    const { opcion1_reto_id, opcion2_reto_id, participante_id } = req.body;

    // Verificar que vengan todos los datos
    if (!opcion1_reto_id || !opcion2_reto_id || !participante_id) {
      return res.status(400).json({ 
        error: "opcion1_reto_id, opcion2_reto_id y participante_id son requeridos" 
      });
    }

    // Verificar si es líder
    const equipoData = await RetosService.getRetosEquipo(equipoId, participante_id);

    if (!equipoData) {
      return res.status(404).json({ error: "Equipo no encontrado" });
    }

    if (!equipoData.es_lider) {
      return res.status(403).json({ error: "Solo la líder puede seleccionar retos" });
    }

    const updated = await RetosService.updateRetosEquipo(
      equipoId,
      opcion1_reto_id,
      opcion2_reto_id
    );

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating retos:", error);
    res.status(500).json({ error: "Error al actualizar retos" });
  }
};