import { db } from "../config/db.js";
import type Catalogo from "@/types/Catalogo.js";

export const getSemestres = async () => {
  const query = `
    SELECT id, descripcion
    FROM dev.semestre
    ORDER BY id
  `;

  const { rows } = await db.query(query);
  return rows as Catalogo[];
};
