import type { Request, Response } from "express";
import * as TeamService from "../services/team.js";

export const listTeams = async (_req: Request, res: Response) => {
  try {
    const teams = await TeamService.getTeams();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener semestres" });
  }
};

export const createTeam = async (req: Request, res: Response) => {
  const { name, members } = req.body;

  try {
    const newTeam = await TeamService.createTeam(name, members);
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el equipo" });
  }
};

export const joinTeam = async (req: Request, res: Response) => {
  const { teamId, userId } = req.body;

  try {
    const result = await TeamService.joinTeam(teamId, userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al unirse al equipo" });
  }
};

export const leaveTeam = async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const result = await TeamService.leaveTeam(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al salir del equipo" });
  }
};
