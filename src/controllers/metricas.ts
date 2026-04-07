import type { Request, Response } from 'express';
import * as MetricaService from '../services/metricas.js';

export const getMetricaSeccion1 = async (req: Request, res: Response) => {
  try {
    const metrica = await MetricaService.getMetricaSeccion1();
    res.json(metrica);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al obtener las métricas' });
  }
}

export const getMetricaSeccion2 = async (req: Request, res: Response) => {
  try {
    const metrica = await MetricaService.getMetricaSeccion2();
    res.json(metrica);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al obtener las métricas' });
  }
}

export const getMetricaSeccion3 = async (req: Request, res: Response) => {
  try {
    const metrica = await MetricaService.getMetricaSeccion3();
    res.json(metrica);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al obtener las métricas' });
  }
}