import { db } from "../config/db.js";

// Obtener todos los retos disponibles
export const getAllRetos = async () => {
  const query = `SELECT id, titulo, descripcion FROM reto`;
  const { rows } = await db.query(query);
  return rows;
};

// Verificar si un reto existe
export const retoExists = async (retoId: number) => {
  const query = `SELECT id FROM reto WHERE id = $1`;
  const { rows } = await db.query(query, [retoId]);
  return rows.length > 0;
};

// Obtener info del equipo usando solo usuarioBaseId
export const getMiEquipo = async (usuarioBaseId: string) => {
  const query = `
    SELECT 
      e.id as equipo_id,
      e.lider_id,
      (e.lider_id = $1) as es_lider,
      (e.opcion1_reto_id IS NOT NULL) as tiene_seleccion,
      e.opcion1_reto_id,
      e.opcion2_reto_id,
      r1.titulo as opcion1_titulo,
      r1.descripcion as opcion1_descripcion,
      r2.titulo as opcion2_titulo,
      r2.descripcion as opcion2_descripcion
    FROM equipo e
    LEFT JOIN reto r1 ON e.opcion1_reto_id = r1.id
    LEFT JOIN reto r2 ON e.opcion2_reto_id = r2.id
    WHERE e.lider_id = $1 
       OR e.participante2_id = $1 
       OR e.participante3_id = $1 
       OR e.participante4_id = $1
  `;
  const { rows } = await db.query(query, [usuarioBaseId]);
  return rows[0];
};

// Actualizar opciones de reto (solo líder)
export const updateRetosEquipo = async (
  equipoId: number,
  opcion1RetoId: number,
  opcion2RetoId: number
) => {
  const query = `
    UPDATE equipo 
    SET opcion1_reto_id = $2, opcion2_reto_id = $3
    WHERE id = $1
    RETURNING *
  `;
  const { rows } = await db.query(query, [equipoId, opcion1RetoId, opcion2RetoId]);
  return rows[0];
};