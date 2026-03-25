import type { UniversidadItem } from "@/types/UniversidadItem.js";
import { db } from "../config/db.js";
import type { Catalog } from "../types/Catalog.js";

//
export const getPaises = async () => {
  const query = `
    SELECT id AS value, nom_pais AS label
    FROM dev.pais
    ORDER BY nom_pais;
  `;

  const { rows } = await db.query(query);
  return rows as Catalog[];
};

//
export const getEstados = async () => {
  const query = `
    SELECT id AS value, nom_estado AS label
    FROM dev.estado
    ORDER BY nom_estado;
  `;

  const { rows } = await db.query(query);
  return rows as Catalog[];
};

//
export const getUniversidades = async () => {
  const query = `
    SELECT u.id AS value, u.universidad_nombre AS label, u.estado_id AS estado
FROM dev.universidad u
ORDER BY u.universidad_nombre;
  `;

  const { rows } = await db.query(query);
  return rows as UniversidadItem[];
};

//
export const getGeneros = async () => {
  const query = `
    SELECT id AS value, descripcion AS label
    FROM dev.genero
    ORDER BY descripcion;
  `;

  const { rows } = await db.query(query);
  return rows as Catalog[];
};

//
export const getTallas = async () => {
  const query = `
    SELECT id AS value, descripcion as label
    FROM dev.talla_playera
    ORDER BY id;
  `;

  const { rows } = await db.query(query);
  return rows as Catalog[];
};

//
export const getCarreras = async () => {
  const query = `
    SELECT id AS value, carrera_nombre AS label
    FROM dev.carrera
    ORDER BY carrera_nombre;
  `;

  const { rows } = await db.query(query);
  return rows as Catalog[];
};

//
export const getSemestres = async () => {
  const query = `
    SELECT id AS value, descripcion AS label
    FROM dev.semestre
    ORDER BY id;
  `;

  const { rows } = await db.query(query);
  return rows as Catalog[];
};