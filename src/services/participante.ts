import { db } from "../config/db.js";

export const updateEstatus = async (id: string, estatus: number) => {
  const query = `
    UPDATE public.participante
    SET
    estatus_participante_id = $1,
    fecha_validacion = NOW() AT TIME ZONE 'America/Mexico_City'
    WHERE usuario_base_id = $2
    RETURNING id, usuario_base_id, estatus_participante_id, fecha_validacion;
  `;

  const values = [estatus, id];

  const { rows } = await db.query(query, values);
  return rows[0];
};
