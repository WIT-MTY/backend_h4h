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
