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
