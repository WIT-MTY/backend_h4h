import { db } from "../config/db.js";

export const updateEstatus = async (
  id: number,
  estatus: number
) => {
  const query = `
    UPDATE dev.participante
    SET estatus_participante_id = $1
    WHERE id = $2
    RETURNING id, estatus_participante_id;
  `;

  const values = [estatus, id];

  const { rows } = await db.query(query, values);
  return rows[0];
};