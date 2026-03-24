import { db } from "../config/db";
import type Catalog from "../types/Catalog";

export const getSemestres = async () => {
  const query = `
    SELECT id, descripcion
    FROM dev.semestre
    ORDER BY id
  `;

  const { rows } = await db.query(query);
  return rows as Catalog[];
};
