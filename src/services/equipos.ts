import { db } from "../config/db.js";
import type { EquipoData } from "src/types/EquipoData.js";

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
    LEFT JOIN participante l ON e.lider_id = l.id
    LEFT JOIN participante p2 ON e.participante2_id = p2.id
    LEFT JOIN participante p3 ON e.participante3_id = p3.id
    LEFT JOIN participante p4 ON e.participante4_id = p4.id
    JOIN estatus_equipo est ON e.estatus_equipo_id = est.id;`;

    const { rows } = await db.query(query);
    return rows;
}

export const retosElegidos = async () => {
    const query = `
    SELECT r.titulo, COUNT(*) as total
    FROM equipo e
    JOIN reto r on e.opcion1_reto_id = r.id
    GROUP BY r.titulo;`;

    const { rows } = await db.query(query);
    return rows;
}

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
}


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