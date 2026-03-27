import type { Request, Response } from "express";
import * as PerfilParticipanteService from "../services/perfilParticipante.js";

export const getPerfilParticipante = async (req: Request, res: Response) => {
  try {
    if (!req.params.usuario_base_id) {
      return res.status(400).json({ error: "ID inválido" });
    }
    const perfil = await PerfilParticipanteService.getPerfilParticipante(
      req.params.usuario_base_id,
    );
    if (!perfil) {
      return res.status(404).json({ error: "Participante no encontrado" });
    }
    res.json(perfil);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener perfil del participante" });
  }
};

export const getParticipanteEstatus = async (req: Request, res: Response) => {
  try {
    if (!req.params.usuario_base_id) {
      return res.status(400).json({ error: "ID inválido" });
    }
    const estatus = await PerfilParticipanteService.getParticipanteEstatus(
      req.params.usuario_base_id,
    );
    if (!estatus) {
      return res.status(404).json({ error: "Participante no encontrado" });
    }
    res.json({ estatus });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener estatus del participante" });
  }
};

export const getPerfilParticipantesByEstado = async (
  req: Request,
  res: Response,
) => {
  try {
    const estadoId = parseInt(req.params.estadoId as string);
    if (isNaN(estadoId)) {
      return res.status(400).json({ error: "ID de estado inválido" });
    }
    const perfiles =
      await PerfilParticipanteService.getPerfilParticipantesByEstado(estadoId);
    res.json(perfiles);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener perfiles de participantes por estado" });
  }
};
