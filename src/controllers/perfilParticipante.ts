import type { Request, Response } from "express";
import * as PerfilParticipanteService from "../services/perfilParticipante.js";

export const getPerfilParticipante = async (req: Request, res: Response) => {
    try{
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }
        const perfil = await PerfilParticipanteService.getPerfilParticipante(id);
        if (!perfil) {
            return res.status(404).json({ error: "Participante no encontrado" });
        }
        res.json(perfil);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener perfil del participante" });
    }
};