import type { ParticipantData } from "src/types/ParticipantData.js";
import { db } from "../config/db.js";
//TODO: Implementar types para los perfiles de participante

export const getPerfilParticipante = async (id: string) => {
  const query = `
    SELECT 
        p.nombre,
        p.apellido,
        g.descripcion AS genero,
        t.descripcion AS talla_playera,
        p.fecha_nacimiento,
        p.telefono,
        --e.descripcion AS estatus,
        c.nom_pais AS pais,
        s.nom_estado AS estado,
        CASE 
            WHEN p.universidad_mexico_id IS NOT NULL THEN u.universidad_nombre
            ELSE p.universidad_extranjera
        END AS universidad,
        cr.carrera_nombre AS carrera,
        sm.descripcion AS semestre,
        p.vegana,
        p.tiene_restriccion_alimentaria,
        CASE WHEN p.tiene_restriccion_alimentaria THEN p.detalle_restriccion_alimentaria ELSE NULL END AS detalle_restriccion_alimentaria,
        p.cv_url,
        CASE WHEN p.linkedin_url IS NOT NULL THEN p.linkedin_url ELSE NULL END AS linkedin_url,
        CASE WHEN p.github_url IS NOT NULL THEN p.github_url ELSE NULL END AS github_url
    FROM public.participante p
    JOIN public.estatus_participante e ON p.estatus_participante_id = e.id
    JOIN public.pais c ON p.pais_id = c.id
    LEFT JOIN public.estado s ON p.estado_id = s.id
    JOIN public.genero g ON p.genero_id = g.id
    JOIN public.talla_playera t ON p.talla_playera_id = t.id
    JOIN public.carrera cr on p.carrera_id = cr.id
    LEFT JOIN public.semestre sm on p.semestre_id = sm.id
    LEFT JOIN public.universidad u ON p.universidad_mexico_id = u.id
    WHERE p.usuario_base_id = $1; `;

  const { rows } = await db.query(query, [id]);
  return rows[0];
};

export const getPerfilParticipantesByEstado = async (estadoId: number) => {
  const query = `
    SELECT 
        p.id,
        p.nombre,
        p.apellido,
        g.descripcion AS genero,
        t.descripcion AS talla_playera,
        p.fecha_nacimiento,
        p.telefono,
        --e.descripcion AS estatus,
        c.nom_pais AS pais,
        s.nom_estado AS estado,
        CASE 
            WHEN p.universidad_mexico_id IS NOT NULL THEN u.universidad_nombre
            ELSE p.universidad_extranjera
        END AS universidad,
        cr.carrera_nombre AS carrera,
        sm.descripcion AS semestre,
        p.vegana,
        p.tiene_restriccion_alimentaria,
        CASE WHEN p.tiene_restriccion_alimentaria THEN p.detalle_restriccion_alimentaria ELSE NULL END AS detalle_restriccion_alimentaria,
        p.cv_url,
        CASE WHEN p.linkedin_url IS NOT NULL THEN p.linkedin_url ELSE NULL END AS linkedin_url,
        CASE WHEN p.github_url IS NOT NULL THEN p.github_url ELSE NULL END AS github_url
    FROM public.participante p
    --JOIN public.estatus_participante e ON p.estatus_participante_id = e.id
    JOIN public.pais c ON p.pais_id = c.id
    LEFT JOIN public.estado s ON p.estado_id = s.id
    JOIN public.genero g ON p.genero_id = g.id
    JOIN public.talla_playera t ON p.talla_playera_id = t.id
    JOIN public.carrera cr on p.carrera_id = cr.id
    LEFT JOIN public.semestre sm on p.semestre_id = sm.id
    LEFT JOIN public.universidad u ON p.universidad_mexico_id = u.id
    WHERE p.estado_id = $1; `;

  const { rows } = await db.query(query, [estadoId]);
  return rows;
};

export const getParticipanteEstatus = async (id: string) => {
  const query = `
    SELECT e.descripcion AS estatus
    FROM public.participante p
    JOIN public.estatus_participante e ON p.estatus_participante_id = e.id
    WHERE p.usuario_base_id = $1;`;

  const { rows } = await db.query(query, [id]);
  return rows[0]?.estatus || null;
};

export const getParticiopantes = async () => {
  const query = `
  SELECT 
      p.id,
      p.usuario_base_id,
      p.nombre,
      p.apellido,
      u.email,
      p.fecha_nacimiento,
      p.telefono,
      p.linkedin_url,
      p.github_url,
      p.cv_url,
      p.vegana,
      p.tiene_restriccion_alimentaria,
      p.detalle_restriccion_alimentaria,
      p.universidad_extranjera,
      g.descripcion AS genero,
      pa.nom_pais AS pais,
      e.nom_estado AS estado,
      s.descripcion AS semestre,
      un.universidad_nombre  AS universidad_mexico,
      c.carrera_nombre AS carrera,
      ep.descripcion AS estatus,
      tp.descripcion AS talla_playera,
      CASE
        WHEN DATE_PART('year', AGE(p.fecha_nacimiento)) < 18
        THEN p.permiso_menoredad
        ELSE NULL
      END AS permiso_menor,
      p.fecha_validacion
  FROM 
      public.participante p
  JOIN auth.users u ON p.usuario_base_id = u.id
  LEFT JOIN public.genero g ON p.genero_id = g.id
  LEFT JOIN public.pais pa ON p.pais_id = pa.id
  LEFT JOIN public.estado e ON p.estado_id = e.id
  LEFT JOIN public.semestre s ON p.semestre_id = s.id
  LEFT JOIN public.universidad un ON p.universidad_mexico_id = un.id
  LEFT JOIN public.carrera c ON p.carrera_id = c.id
  LEFT JOIN public.estatus_participante ep ON p.estatus_participante_id = ep.id
  LEFT JOIN public.talla_playera tp ON p.talla_playera_id = tp.id;`;

  const { rows } = await db.query(query);
  return rows;
};
