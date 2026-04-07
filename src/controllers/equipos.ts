import type { Request, Response } from 'express';
import * as EquipoService from '../services/equipos.js';

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
    res.status(500).json({ error: 'Error al obtener la lista de equipos' });
  }
}

export const getRetosElegidos = async (req: Request, res: Response) => {
  try {
    const retos = await EquipoService.retosElegidos();
    res.json(retos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al obtener los retos elegidos' });
  }
}

export const getRetosElegidosPorEquipo = async (req: Request, res: Response) => {
  try {
    const retosPorEquipo = await EquipoService.retosElegidosPorEquipo();
    res.json(retosPorEquipo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al obtener los retos elegidos por equipo' });
  }
}