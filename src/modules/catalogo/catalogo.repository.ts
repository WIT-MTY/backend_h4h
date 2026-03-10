import { db } from "../../config/db.js";

export const getSemestres = async () => {
  const query = `
    SELECT id, descripcion
    FROM semestre
    ORDER BY id
  `;

  const { rows } = await db.query(query);
  return rows;
};
