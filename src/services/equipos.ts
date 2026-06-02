import { db } from "../config/db.js";
import type { EquipoData, CrearEquipoData } from "src/types/EquipoData.js";
import { generarCodigoEntrada } from "../utils/codigoEntrada.js";

export const getEquipos = async () => {
  const query = `
    SELECT
        e.id,
        e.nombre,
        CONCAT(l.nombre, ' ', l.apellido) AS lider,
        CONCAT(p2.nombre, ' ', p2.apellido) AS participante2,
        CONCAT(p3.nombre, ' ', p3.apellido) AS participante3,
        CONCAT(p4.nombre, ' ', p4.apellido) AS participante4,
        e.fecha_creacion,
        e.fecha_validacion,
        est.descripcion AS estatus
    FROM equipo e
    LEFT JOIN participante l ON e.lider_id = l.usuario_base_id
    LEFT JOIN participante p2 ON e.participante2_id = p2.usuario_base_id
    LEFT JOIN participante p3 ON e.participante3_id = p3.usuario_base_id
    LEFT JOIN participante p4 ON e.participante4_id = p4.usuario_base_id
    JOIN estatus_equipo est ON e.estatus_equipo_id = est.id;`;

  const { rows } = await db.query(query);
  return rows;
};

export const retosElegidos = async () => {
  const query = `
    SELECT r.titulo, COUNT(*) as total
    FROM equipo e
    JOIN reto r on e.opcion1_reto_id = r.id
    GROUP BY r.titulo;`;

  const { rows } = await db.query(query);
  return rows;
};

export const retosElegidosPorEquipo = async () => {
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

// -------------------------------------------------------------------
// QUERY PARA DEV SCHEME
// -------------------------------------------------------------------
// `
//     SELECT
//         e.id,
//         e.nombre,
//         CONCAT(l.nombre, ' ', l.apellido) AS lider,
//         CONCAT(p2.nombre, ' ', p2.apellido) AS participante2,
//         CONCAT(p3.nombre, ' ', p3.apellido) AS participante3,
//         CONCAT(p4.nombre, ' ', p4.apellido) AS participante4,
//         e.fecha_creacion,
//         e.fecha_validacion,
//         est.descripcion AS estatus
//     FROM dev.equipo e
//     LEFT JOIN dev.participante l ON e.lider_id = l.id
//     LEFT JOIN dev.participante p2 ON e.participante2_id = p2.id
//     LEFT JOIN dev.participante p3 ON e.participante3_id = p3.id
//     LEFT JOIN dev.participante p4 ON e.participante4_id = p4.id
//     JOIN dev.estatus_equipo est ON e.estatus_equipo_id = est.id`;

export const getMyTeam = async (userId: string) => {
  const query = `
    SELECT
        e.id,
        e.nombre,
        CONCAT(l.nombre, ' ', l.apellido) AS lider,
        CONCAT(p2.nombre, ' ', p2.apellido) AS participante2,
        CONCAT(p3.nombre, ' ', p3.apellido) AS participante3,
        CONCAT(p4.nombre, ' ', p4.apellido) AS participante4,
        l.acepto_clausula_arca AS lider_acepto_terminos,
        p2.acepto_clausula_arca AS participante_2_acepto_terminos,
        p3.acepto_clausula_arca AS participante_3_acepto_terminos,
        p4.acepto_clausula_arca AS participante_4_acepto_terminos,
        e.fecha_creacion,
        e.fecha_validacion,
        e.codigo,
        est.descripcion AS estatus
    FROM public.equipo e
    LEFT JOIN public.participante l ON e.lider_id = l.usuario_base_id
    LEFT JOIN public.participante p2 ON e.participante2_id = p2.usuario_base_id
    LEFT JOIN public.participante p3 ON e.participante3_id = p3.usuario_base_id
    LEFT JOIN public.participante p4 ON e.participante4_id = p4.usuario_base_id
    JOIN public.estatus_equipo est ON e.estatus_equipo_id = est.id
    WHERE e.lider_id = $1 OR e.participante2_id = $1 OR e.participante3_id = $1 OR e.participante4_id = $1;`;

  const { rows } = await db.query(query, [userId]);
  return (rows[0] as EquipoData) || null; // Retorna el equipo o null si no pertenece a ningún equipo
};

export const createTeam = async (equipo_data: CrearEquipoData) => {
  let insertado = false;
  let nuevoEquipo = null;

  while (!insertado) {
    const codigo = generarCodigoEntrada();

    try {
      const query = `
        WITH nuevo_equipo AS (
          INSERT INTO equipo (lider_id, nombre, codigo)
          VALUES ($1, $2, $3)
          RETURNING *
        )
        SELECT 
          ne.id, 
          ne.nombre, 
          ne.lider_id, 
          ne.fecha_creacion, 
          ne.fecha_validacion, 
          ne.codigo,
          ee.descripcion AS estatus
        FROM nuevo_equipo ne
        JOIN estatus_equipo ee ON ne.estatus_equipo_id = ee.id;
      `;

      const values = [equipo_data.lider_id, equipo_data.nombre, codigo];
      const { rows } = await db.query(query, values);

      nuevoEquipo = rows[0];
      insertado = true; // Cerrar bucle si la inserción fue exitosa
    } catch (error: any) {
      if (error.code === "23505") {
        // El código de error '23505' es el estándar de PostgreSQL para "unique_violation"
        console.log(`Código ${codigo} repetido, generando uno nuevo...`);
        continue;
      }
      throw error;
    }
  }
  return nuevoEquipo;
};

export const joinTeam = async (equipo_codigo_entrada: string,userId: string,) => {
  // 1. Verificar si el equipo existe
  const checkQuery = `SELECT id, participante2_id, participante3_id, participante4_id FROM equipo WHERE codigo = $1`;
  const { rows: equipoRows } = await db.query(checkQuery, [
    equipo_codigo_entrada,
  ]);

  if (equipoRows.length === 0) {
    throw new Error("NOT_FOUND"); // El código no coincide con ningún equipo
  }

  const equipo = equipoRows[0];

  // 2. Verificar si hay espacio libre
  if (
    equipo.participante2_id &&
    equipo.participante3_id &&
    equipo.participante4_id
  ) {
    throw new Error("TEAM_FULL"); // Todos los lugares están ocupados
  }

  // 2.5 Verificar restricción de género solo cuando va a entrar el cuarto participante
  if (equipo.participante2_id && equipo.participante3_id && !equipo.participante4_id) {
    const genderQuery = `
      SELECT 
        g1.descripcion AS genero_lider,
        g2.descripcion AS genero_p2,
        g3.descripcion AS genero_p3,
        gn.descripcion AS genero_nuevo
      FROM equipo e
      LEFT JOIN participante l ON e.lider_id = l.usuario_base_id
      LEFT JOIN genero g1 ON l.genero_id = g1.id
      LEFT JOIN participante p2 ON e.participante2_id = p2.usuario_base_id
      LEFT JOIN genero g2 ON p2.genero_id = g2.id
      LEFT JOIN participante p3 ON e.participante3_id = p3.usuario_base_id
      LEFT JOIN genero g3 ON p3.genero_id = g3.id
      LEFT JOIN participante pn ON pn.usuario_base_id = $1
      LEFT JOIN genero gn ON pn.genero_id = gn.id
      WHERE e.codigo = $2;
    `;

    const { rows: genderRows } = await db.query(genderQuery, [userId, equipo_codigo_entrada]);
    const generos = genderRows[0];

    const generosActuales = [generos.genero_lider, generos.genero_p2, generos.genero_p3];
    const todosHombres = generosActuales.every(g => g === "Masculino");
    const nuevoEsHombre = generos.genero_nuevo === "Masculino";

    if (todosHombres && nuevoEsHombre) {
      throw new Error("GENDER_RESTRICTION");
    }
  }

  // 3. Ejecutar la actualización (misma lógica de CASE anterior)
  const updateQuery = `
    UPDATE equipo
    SET
      participante2_id = CASE WHEN participante2_id IS NULL THEN $1 ELSE participante2_id END,
      participante3_id = CASE 
        WHEN participante2_id IS NOT NULL AND participante3_id IS NULL THEN $1
        ELSE participante3_id 
      END,
      participante4_id = CASE 
        WHEN participante2_id IS NOT NULL AND participante3_id IS NOT NULL AND participante4_id IS NULL THEN $1
        ELSE participante4_id 
      END
    WHERE codigo = $2
    RETURNING *;
  `;

  const { rows } = await db.query(updateQuery, [userId, equipo_codigo_entrada]);
  return rows[0];
};

export const getTeamLeader = async (equipoId: number) => {
  const query = `SELECT lider_id FROM equipo WHERE id = $1`;
  const { rows } = await db.query(query, [equipoId]);
  return rows[0]?.lider_id;
};
