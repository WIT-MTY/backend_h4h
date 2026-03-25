import type { Request, Response } from "express";
import * as CatalogoService from "../services/catalogo.js";

//
export const listPaises = async (_req: Request, res: Response) => {
  try {
    const paises = await CatalogoService.getPaises();
    res.json(paises);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener paises" });
  }
};

//
export const listEstados = async (_req: Request, res: Response) => {
  try {
    const estados = await CatalogoService.getEstados();
    res.json(estados);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estados" });
  }
};

//
export const listUniversidades = async (_req: Request, res: Response) => {
  try {
    const universidades = await CatalogoService.getUniversidades();
    res.json(universidades);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener universidades" });
  }
};

//
export const listGeneros = async (_req: Request, res: Response) => {
  try {
    const generos = await CatalogoService.getGeneros();
    res.json(generos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener generos" });
  }
};

//
export const listTallas = async (_req: Request, res: Response) => {
  try {
    const tallas = await CatalogoService.getTallas();
    res.json(tallas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener tallas" });
  }
};

//
export const listCarreras = async (_req: Request, res: Response) => {
  try {
    const carreras = await CatalogoService.getCarreras();
    res.json(carreras);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener carreras" });
  }
};

//
export const listSemestres = async (_req: Request, res: Response) => {
  try {
    const semestres = await CatalogoService.getSemestres();
    res.json(semestres);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener semestres" });
  }
};


