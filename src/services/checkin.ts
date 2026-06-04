import { db } from "../config/db.js";

// Endpoint para obtener todos los participantes que hicieron check-in (nombre, apellido, hora de llegada)
export const getParticipantesCheckIns = async () => {
  const query = `
        SELECT p.nombre, p.apellido, p.hora_llegada FROM participante p WHERE p.registro_d1 = true;
    `;

  const { rows } = await db.query(query);
  return rows;
};

// Endpoint para obtener los equipos que ya tienen check-in junto con el número de personas que hicieron check-in por equipo
export const getEquiposCheckIn = async () => {
  const query = `
        SELECT 
            e.nombre,
            COUNT(*) AS personas_registradas
        FROM equipo e
        JOIN participante p
            ON p.usuario_base_id  IN (
                e.lider_id,
                e.participante2_id,
                e.participante3_id,
                e.participante4_id
            )
        WHERE p.registro_d1 = TRUE
        GROUP BY e.id, e.nombre
        HAVING COUNT(*) > 0
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

export const getTotalParticipantesCheckIn = async () => {
  const query = `
    SELECT COUNT(*) AS total_participantes_checkin
    FROM participante
    WHERE registro_d1 = TRUE;
  `;

  const { rows } = await db.query(query);
  return rows;
};

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
