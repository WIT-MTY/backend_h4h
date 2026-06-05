import { db } from "../config/db.js";

// Endpoint para obtener todos los participantes que hicieron check-in (nombre, apellido, hora de llegada)
export const getParticipantesCheckIns = async () => {
  const query = `
    SELECT 
      p.nombre, 
      p.apellido, 
      e.nombre AS equipo,
      p.hora_llegada
    FROM participante p
    LEFT JOIN equipo e ON (
      e.lider_id = p.usuario_base_id OR
      e.participante2_id = p.usuario_base_id OR
      e.participante3_id = p.usuario_base_id OR
      e.participante4_id = p.usuario_base_id)
      WHERE p.registro_d1 = true;;
    `;

  const { rows } = await db.query(query);
  return rows;
};

// Endpoint para obtener los equipos que ya tienen check-in junto con el número de personas que hicieron check-in por equipo
export const getEquiposCheckIn = async () => {
  const query = `
  SELECT 
      e.nombre,
      COUNT(CASE WHEN p.registro_d1 = TRUE THEN 1 END) AS personas_registradas,
      CASE
          WHEN COUNT(*) = COUNT(CASE WHEN p.registro_d1 = TRUE THEN 1 END)
          THEN 'Completo'
          ELSE 'Incompleto'
      END AS equipo_completo_checkin,
      r1.titulo AS reto_1,
      r2.titulo AS reto_2
  FROM equipo e
  JOIN participante p
      ON p.usuario_base_id IN (
          e.lider_id,
          e.participante2_id,
          e.participante3_id,
          e.participante4_id
      )
  LEFT JOIN reto r1
      ON r1.id = e.opcion1_reto_id
  LEFT JOIN reto r2
      ON r2.id = e.opcion2_reto_id
  GROUP BY
      e.id,
      e.nombre,
      r1.titulo,
      r2.titulo
  HAVING COUNT(CASE WHEN p.registro_d1 = TRUE THEN 1 END) > 0
  ORDER BY personas_registradas DESC, e.nombre;
  `;

  const { rows } = await db.query(query);
  return rows;
};

// Endpoint para registrar el check-in de un participante (actualizar registro_d1 a true y hora_llegada a la hora actual), regresa nombre, apellido y hora de llegada del participante
export const createCheckIn = async (userId: string) => {
  const query = `
        UPDATE participante
        SET 
            registro_d1 = TRUE,
            hora_llegada = CURRENT_TIMESTAMP
        WHERE usuario_base_id = $1
        RETURNING nombre, apellido, hora_llegada;
    `;

  const { rows } = await db.query(query, [userId]);
  return rows[0];
};

// Endpoint para obtener el código de check-in (que es el userId) solo si el participante ya hizo check-in, de lo contrario regresa null
export const getCheckInCode = async (userId: string) => {
  const query = `
    SELECT 
      CASE 
        WHEN p.estatus_participante_id = 1 THEN p.usuario_base_id 
        ELSE NULL
      END AS checkin_code
    FROM participante p
    WHERE p.usuario_base_id = $1;
  `;

  const { rows } = await db.query(query, [userId]);
  return rows[0]?.checkin_code || null;
};

// Endpoint para obtener el número total de participantes que hicieron check-in
export const getTotalParticipantesCheckIn = async () => {
  const query = `
    SELECT COUNT(*) AS total_participantes_checkin
    FROM participante
    WHERE registro_d1 = TRUE;
  `;

  const { rows } = await db.query(query);
  return rows;
};

// Endpoint para obtener el número total de equipos que hicieron check-in (al menos un miembro hizo check-in), el número de equipos completos (todos los miembros hicieron check-in) y el número de equipos incompletos (al menos un miembro hizo check-in pero no todos)
export const getTotalEquiposCheckIn = async () => {
  const query = `
    SELECT
        COUNT(DISTINCT CASE WHEN p.registro_d1 = TRUE THEN e.id END) AS total_equipos_checkin,
        COUNT(DISTINCT CASE WHEN t.equipo_completo = 1 THEN e.id END) AS equipos_completos,
        COUNT(DISTINCT CASE WHEN p.registro_d1 = TRUE THEN e.id END)
        - COUNT(DISTINCT CASE WHEN t.equipo_completo = 1 THEN e.id END) AS equipos_incompletos
    FROM (
        SELECT
            e.id,
            CASE
                WHEN COUNT(*) = COUNT(CASE WHEN p.registro_d1 = TRUE THEN 1 END)
                THEN 1
                ELSE 0
            END AS equipo_completo
        FROM equipo e
        JOIN participante p
            ON p.usuario_base_id IN (
                e.lider_id,
                e.participante2_id,
                e.participante3_id,
                e.participante4_id
            )
        GROUP BY e.id
    ) t
    JOIN equipo e ON e.id = t.id
    JOIN participante p
        ON p.usuario_base_id IN (
            e.lider_id,
            e.participante2_id,
            e.participante3_id,
            e.participante4_id
        );
  `;

  const { rows } = await db.query(query);
  return rows;
};

// Endpoint para obtener el estatus de check-in de un participante específico (registro_d1)
export const getMyCheckInStatus = async (userId: string) => {
  const query = `
    SELECT p.registro_d1 FROM participante p WHERE p.usuario_base_id = $1;
    `;

  const { rows } = await db.query(query, [userId]);
  return rows[0]?.registro_d1;
};
