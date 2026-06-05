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
      r2.descripcion as opcion2_descripcion,
      p.acepto_clausula_arca as p_acepto_clausula
    FROM equipo e
    LEFT JOIN reto r1 ON e.opcion1_reto_id = r1.id
    LEFT JOIN reto r2 ON e.opcion2_reto_id = r2.id
    JOIN participante p ON p.usuario_base_id = $1 
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
  opcion2RetoId: number,
) => {
  const query = `
    UPDATE equipo 
    SET opcion1_reto_id = $2, opcion2_reto_id = $3
    WHERE id = $1
    RETURNING *
  `;
  const { rows } = await db.query(query, [
    equipoId,
    opcion1RetoId,
    opcion2RetoId,
  ]);
  return rows[0];
};

// Verificar si ya aceptó
export const getClausulaArca = async (usuarioBaseId: string) => {
  const query = `
    SELECT acepto_clausula_arca 
    FROM public.participante
    WHERE usuario_base_id = $1
  `;
  const { rows } = await db.query(query, [usuarioBaseId]);
  return rows[0];
};

// Guardar la aceptación
export const aceptarClausulaArca = async (
  usuarioBaseId: string,
  nombreAceptoClausula: string,
) => {
  const query = `
    UPDATE public.participante
    SET 
      acepto_clausula_arca = TRUE,
      nombre_acepto_clausula_arca = $2
    WHERE usuario_base_id = $1
    RETURNING *
  `;
  const { rows } = await db.query(query, [usuarioBaseId, nombreAceptoClausula]);
  return rows[0];
};

export const getEquiposPorReto = async () => {
  const query = `
    SELECT
        e.nombre,
        r1.titulo AS opcion1,
        r2.titulo AS opcion2
    FROM equipo e
    JOIN reto r1 ON e.opcion1_reto_id = r1.id
    JOIN reto r2 ON e.opcion2_reto_id = r2.id;`;

  const { rows } = await db.query(query);
  return rows;
};

export const getRetoParticipante = async (usuarioBaseId: string) => {
  const query = `
    SELECT
        r1.titulo AS opcion1,
        r2.titulo AS opcion2
    FROM equipo e
    JOIN reto r1 ON e.opcion1_reto_id = r1.id
    JOIN reto r2 ON e.opcion2_reto_id = r2.id
    WHERE e.lider_id = $1 OR e.participante2_id = $1 OR e.participante3_id = $1 OR e.participante4_id = $1;`;

  const { rows } = await db.query(query, [usuarioBaseId]);
  return rows[0];
};

export const defineRetoDefinitivo = async (
  equipoId: number,
  retoDefinitivoId: number,
) => {
  const query = `
    UPDATE equipo
    SET reto_asignado_id = $2
    WHERE id = $1
    RETURNING equipo_id, reto_asignado_id;
  `;
  const { rows } = await db.query(query, [equipoId, retoDefinitivoId]);
  return rows[0];
};

//regresa numero de equipos por reto definitivo
export const getEquiposPorRetoDefinitivo = async () => {
  const query = `
    SELECT
        r.titulo AS reto_definitivo,
        COUNT(e.id) AS numero_equipos
    FROM equipo e
    JOIN reto r ON e.reto_asignado_id = r.id
    WHERE e.reto_asignado_id IS NOT NULL
    GROUP BY r.titulo;`;

  const { rows } = await db.query(query);
  return rows;
};
