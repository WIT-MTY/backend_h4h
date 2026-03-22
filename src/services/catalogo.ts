import { db } from "@/config/db.js";
import type Catalog from "@/types/Catalog.js";

export const getSemestres = async () => {
  const query = `
    SELECT id, descripcion
    FROM dev.semestre
    ORDER BY id
  `;

  const { rows } = await db.query(query);
  return rows as Catalog[];
};
