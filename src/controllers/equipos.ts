import type { Request, Response } from "express";
import * as EquipoService from "../services/equipos.js";
import type { EquipoData, CrearEquipoData } from "src/types/EquipoData.js";

// export const getEquipos = async (req: Request, res: Response) => {
//   try {
//     const equipos = await EquipoService.getEquipos();
//     res.json(equipos);
//   } catch (error) {
//     res.status(500).json({ error: 'Error al obtener la lista de equipos' });
//   }
// };

export const getEquipos = async (req: Request, res: Response) => {
  try {
    const equipos = await EquipoService.getEquipos();
    res.json(equipos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la lista de equipos" });
  }
};

export const getRetosElegidos = async (req: Request, res: Response) => {
  try {
    const retos = await EquipoService.retosElegidos();
    res.json(retos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener los retos elegidos" });
  }
};

export const getRetosElegidosPorEquipo = async (
  req: Request,
  res: Response,
) => {
  try {
    const retosPorEquipo = await EquipoService.retosElegidosPorEquipo();
    res.json(retosPorEquipo);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error al obtener los retos elegidos por equipo" });
  }
};

export const getMyTeam = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; //Obtener ID del usuario
    if (!userId) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const team: EquipoData | null = await EquipoService.getMyTeam(userId);
    if (!team) {
      return res.json({ message: "No perteneces a ningún equipo" });
    }

    res.json(team);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener tu equipo" });
  }
};

export const createTeam = async (req: Request, res: Response) => {
  try {
   
    const userId = req.user?.id; //Obtener ID del usuario
    const equipo_data: CrearEquipoData = {
      ...req.body,
      lider_id: userId,
    };  

    if (!userId) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const isInTeam = await EquipoService.getMyTeam(userId);
    if (isInTeam) {
      return res
        .status(400)
        .json({ error: "Ya perteneces a un equipo, no puedes crear otro" });
    }

    const newTeam = await EquipoService.createTeam(equipo_data);
    res.status(201).json(newTeam);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear el equipo" });
  }
};

export const joinTeam = async (req: Request, res: Response) => {
  try {
    const { equipo_codigo_entrada } = req.params;

    if (!equipo_codigo_entrada || typeof equipo_codigo_entrada !== "string") {
      return res.status(400).json({
        error: "El código de entrada es inválido o no fue proporcionado.",
      });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const isInTeam = await EquipoService.getMyTeam(userId);
    if (isInTeam) {
      return res
        .status(400)
        .json({ error: "Ya perteneces a un equipo, no puedes unirte a otro" });
    }

    const joinedTeam = await EquipoService.joinTeam(
      equipo_codigo_entrada,
      userId,
    );

    return res.json({
      message: "Te has unido al equipo con éxito",
      team: joinedTeam,
    });
  } catch (error: any) {
    // Manejo de mensajes distintos según el error lanzado
    if (error.message === "NOT_FOUND") {
      return res
        .status(404)
        .json({ error: "El código del equipo no es válido" });
    }

    if (error.message === "TEAM_FULL") {
      return res
        .status(400)
        .json({ error: "El equipo ya está lleno (máximo 4 integrantes)" });
    }

    console.error(error);
    return res.status(500).json({ error: "Ocurrió un error inesperado" });
  }
};
