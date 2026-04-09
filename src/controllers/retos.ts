import type { Request, Response } from "express";
import * as RetosService from "../services/retos.js";

export const getAllRetos = async (req: Request, res: Response) => {
  try {
    const retos = await RetosService.getAllRetos();
    const retos_disponibles = retos.length > 0;

    res.status(200).json({
      retos_disponibles,
      retos,
      ...(retos_disponibles ? {} : { mensaje: "Aún no hay retos disponibles" })
    });
  } catch (error) {
    console.error("Error getting retos:", error);
    res.status(500).json({ error: "Error al obtener los retos" });
  }
};

export const getMiEquipo = async (req: Request, res: Response) => {
  try {
    const usuarioBaseId = req.query.usuarioBaseId as string;

    if (!usuarioBaseId) {
      return res.status(400).json({ error: "usuarioBaseId es requerido" });
    }

    const equipoData = await RetosService.getMiEquipo(usuarioBaseId);

    // Si no tiene equipo
    if (!equipoData || !equipoData.equipo_id) {
      return res.status(200).json({ tiene_equipo: false });
    }

    // Obtener todos los retos disponibles
    const retos = await RetosService.getAllRetos();

    res.status(200).json({
      tiene_equipo: true,
      equipo_id: equipoData.equipo_id,
      es_lider: equipoData.es_lider,
      tiene_seleccion: equipoData.tiene_seleccion,
      retos_disponibles: retos.length > 0,
      retos,
      opcion1_reto_id: equipoData.opcion1_reto_id,
      opcion1_titulo: equipoData.opcion1_titulo,
      opcion1_descripcion: equipoData.opcion1_descripcion,
      opcion2_reto_id: equipoData.opcion2_reto_id,
      opcion2_titulo: equipoData.opcion2_titulo,
      opcion2_descripcion: equipoData.opcion2_descripcion
    });
  } catch (error) {
    console.error("Error getting mi equipo:", error);
    res.status(500).json({ error: "Error al obtener info del equipo" });
  }
};

export const updateRetosEquipo = async (req: Request, res: Response) => {
  try {
    const equipoId = parseInt(req.params.equipoId);
    const { opcion1_reto_id, opcion2_reto_id, usuario_base_id } = req.body;

    if (!opcion1_reto_id || !opcion2_reto_id || !usuario_base_id) {
      return res.status(400).json({
        error: "opcion1_reto_id, opcion2_reto_id y usuario_base_id son requeridos"
      });
    }

    const reto1Exists = await RetosService.retoExists(opcion1_reto_id);
    const reto2Exists = await RetosService.retoExists(opcion2_reto_id);

    if (!reto1Exists || !reto2Exists) {
      return res.status(400).json({ error: "Uno o más retos seleccionados no existen" });
    }

    const equipoData = await RetosService.getMiEquipo(usuario_base_id);

    if (!equipoData || !equipoData.equipo_id) {
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