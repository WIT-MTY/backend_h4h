import type { Request, Response } from "express";
import * as CheckinService from "../services/checkin.js";

// Funnción para obtener todos los participantes que hicieron check-in (nombre, apellido, hora de llegada)
export const getParticipantesCheckIns = async (
  _req: Request,
  res: Response,
) => {
  try {
    const checkins = await CheckinService.getParticipantesCheckIns();
    res.json(checkins);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener personas que hicieron check-in" });
  }
};

// Función para obtener los equipos que ya tienen check-in junto con el número de personas que hicieron check-in por equipo
export const getEquiposCheckIn = async (_req: Request, res: Response) => {
  try {
    const equipos = await CheckinService.getEquiposCheckIn();
    res.json(equipos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener equipos con check-in" });
  }
};

// Función para registrar el check-in de un participante (actualizar registro_d1 a true y hora_llegada a la hora actual), regresa nombre, apellido y hora de llegada del participante
export const createCheckIn = async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (typeof userId !== "string") {
    res.status(400).json({ error: "userId es requerido" });
    return;
  }

  try {
    const checkin = await CheckinService.createCheckIn(userId);
    res.status(201).json(checkin);
  } catch (error) {
    res.status(500).json({ error: "Error al crear check-in" });
  }
};

export const getCheckInCode = async (req: Request, res: Response) => {
  const userId = req.user?.id as string | undefined;

  if (!userId) {
    res.status(400).json({ error: "userId es requerido" });
    return;
  }

  try {
    const checkinCode = await CheckinService.getCheckInCode(userId);
    res.json(checkinCode);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener código de check-in" });
  }
};

export const getTotalParticipantesCheckIn = async (
  req: Request,
  res: Response,
) => {
  try {
    const total = await CheckinService.getTotalParticipantesCheckIn();
    res.json(total);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener total de participantes con check-in" });
  }
};

export const getTotalEquiposCheckIn = async (req: Request, res: Response) => {
  try {
    const total = await CheckinService.getTotalEquiposCheckIn();
    res.json(total);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener total de equipos con check-in" });
  }
};

export const getMyCheckInStatus = async (req: Request, res: Response) => {
  const userId = req.user?.id as string | undefined;

  if (!userId) {
    res.status(400).json({ error: "userId es requerido" });
    return;
  }

  try {
    const checkinStatus = await CheckinService.getMyCheckInStatus(userId);
    res.json(checkinStatus);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estado de check-in" });
  }
};
