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

export const getEquipoById = async (req: Request, res: Response) => {
  try {
    if (!req.params.equipoId) {
      return res.status(400).json({ error: 'ID de equipo inválido' });
    }
    const equipo = await EquipoService.getEquipo(
      req.params.equipoId as string,
    );
    if (!equipo) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }
    res.json(equipo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al obtener el equipo' });
  }
}