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

export const getMetricaSeccion2 = async () => {
  const query = `
  SELECT 

  -- Universidades extranjeras
  (
    SELECT json_agg(x)
    FROM (
      SELECT
        p.universidad_extranjera AS universidad,
        COUNT(*) AS total
      FROM participante p
      WHERE p.universidad_extranjera IS NOT NULL
        AND p.estatus_participante_id = 1
      GROUP BY p.universidad_extranjera
    ) x
  ) AS universidades_extranjeras,

  -- Universidades México
  (
    SELECT json_agg(x)
    FROM (
      SELECT
        u.universidad_nombre AS universidad,
        COUNT(*) AS total
      FROM participante p
      JOIN universidad u ON p.universidad_mexico_id = u.id
      WHERE p.estatus_participante_id = 1
      GROUP BY u.universidad_nombre
      ORDER BY total DESC
    ) x
  ) AS universidades_mexico,

  -- Carreras
  (
    SELECT json_agg(x)
    FROM (
      SELECT
        c.carrera_nombre AS carrera,
        COUNT(*) AS total
      FROM participante p
      JOIN carrera c ON p.carrera_id = c.id
      WHERE p.estatus_participante_id = 1
      GROUP BY c.carrera_nombre
      ORDER BY total DESC
    ) x
  ) AS carreras,

  -- Semestres
  (
    SELECT json_agg(x)
    FROM (
      SELECT
        s.descripcion AS semestre,
        COUNT(*) AS total
      FROM participante p
      JOIN semestre s ON p.semestre_id = s.id
      WHERE p.estatus_participante_id = 1
      GROUP BY s.descripcion
      ORDER BY s.descripcion ASC
    ) x
  ) AS semestres;`;

  const { rows } = await db.query(query);
  return rows[0];
}

export const getMetricaSeccion3 = async () => {
  const query = `
  SELECT
    e.nom_estado AS estado,
    COUNT(*) AS total
  FROM participante p
  JOIN estado e ON p.estado_id = e.id
  WHERE p.estatus_participante_id = 1
  GROUP BY estado;`;

  const { rows } = await db.query(query);
  return rows;
}