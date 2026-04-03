import { db } from "../config/db.js";
import type { EquipoData } from "src/types/EquipoData.js";

export const getEquipo = async (id: string) => {
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
    JOIN estatus_equipo est ON e.estatus_equipo_id = est.id
    WHERE e.id = $1;`;

    const { rows } = await db.query(query, [id]);
    return rows[0];
}

export const retosElegidos = async () => {
    const query = `
    SELECT r.titulo, COUNT(*) as total
    FROM dev.equipo e
    JOIN dev.reto r on e.opcion1_reto_id = r.id
    GROUP BY r.titulo;`;

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
//     JOIN dev.estatus_equipo est ON e.estatus_equipo_id = est.id
//     WHERE e.id = $1;`;