import { db } from "../config/db.js";

export const getMetricaSeccion1 = async () => {
    const query = `
    SELECT 
    -- Estatus
    (
      SELECT json_agg(x)
      FROM (
        SELECT e.descripcion AS estatus, COUNT(*) AS total
        FROM participante p
        JOIN estatus_participante e ON p.estatus_participante_id = e.id
        GROUP BY e.descripcion
      ) x
    ) AS estatus,

    -- Veganas
    (
      SELECT json_agg(x)
      FROM (
        SELECT 
          CASE 
            WHEN p.vegana THEN 'Veganas'
            ELSE 'No veganas'
          END AS tipo,
          COUNT(*) AS total
        FROM participante p
        JOIN estatus_participante e ON p.estatus_participante_id = e.id
        WHERE e.descripcion = 'Aceptado'
        GROUP BY tipo
      ) x
    ) AS veganas,

    -- Tallas
    (
      SELECT json_agg(x)
      FROM (
        SELECT t.descripcion AS talla, COUNT(*) AS total
        FROM participante p
        JOIN estatus_participante e ON p.estatus_participante_id = e.id
        JOIN talla_playera t ON p.talla_playera_id = t.id
        WHERE e.descripcion = 'Aceptado'
        GROUP BY t.descripcion
      ) x
    ) AS tallas,

    -- Restricciones (sí/no)
    (
      SELECT json_agg(x)
      FROM (
        SELECT 
          CASE
            WHEN p.tiene_restriccion_alimentaria THEN 'Con restricción'
            ELSE 'Sin restricción'
          END AS restriccion,
          COUNT(*) AS total
        FROM participante p
        JOIN estatus_participante e ON p.estatus_participante_id = e.id
        WHERE e.descripcion = 'Aceptado'
        GROUP BY restriccion
      ) x
    ) AS restricciones,

    -- Detalle de restricciones
    (
      SELECT json_agg(p.detalle_restriccion_alimentaria)
      FROM participante p
      JOIN estatus_participante e ON p.estatus_participante_id = e.id
      WHERE e.descripcion = 'Aceptado'
        AND p.tiene_restriccion_alimentaria = true
    ) AS detalle_restricciones,

    -- Mexicanas aceptadas
    (
    SELECT json_agg(x)
      FROM (
        SELECT 
          CASE 
            WHEN p.pais_id = 141 THEN 'Mexicanas'
            ELSE 'Extranjeras'
          END AS tipo,
          COUNT(*) AS total
        FROM participante p
        JOIN estatus_participante e 
          ON p.estatus_participante_id = e.id
        WHERE e.descripcion = 'Aceptado'
        GROUP BY tipo
      ) x
    ) AS nacionalidad;`;
   
  const { rows } = await db.query(query);
  return rows[0];
} 