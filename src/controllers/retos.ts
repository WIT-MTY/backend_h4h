import type { Request, Response } from "express";
import * as RetosService from "../services/retos.js";
import { getMyTeam, getTeamLeader } from "../services/equipos.js";

export const getAllRetos = async (req: Request, res: Response) => {
  try {
    const retos = await RetosService.getAllRetos();
    const retos_disponibles = retos.length > 0;

    res.status(200).json({
      retos_disponibles,
      retos,
      ...(retos_disponibles ? {} : { mensaje: "Aún no hay retos disponibles" }),
    });
  } catch (error) {
    console.error("Error getting retos:", error);
    res.status(500).json({ error: "Error al obtener los retos" });
  }
};

 export const getMiEquipo = async (req: Request, res: Response) => {
   try {
     const usuarioBaseId = req.query.usuarioBaseId as string;

     if (!usuarioBaseId) {
       return res.status(400).json({ error: "usuarioBaseId es requerido" });
     }

     const equipoData = await RetosService.getMiEquipo(usuarioBaseId);

     // Si no tiene equipo
     if (!equipoData || !equipoData.equipo_id) {
       return res.status(200).json({ tiene_equipo: false });
     }

     // Obtener todos los retos disponibles
     const retos = await RetosService.getAllRetos();

     res.status(200).json({
       tiene_equipo: true,
       equipo_id: equipoData.equipo_id,
       es_lider: equipoData.es_lider,
       tiene_seleccion: equipoData.tiene_seleccion,
       retos_disponibles: retos.length > 0,
       retos,
       opcion1_reto_id: equipoData.opcion1_reto_id,
       opcion1_titulo: equipoData.opcion1_titulo,
       opcion1_descripcion: equipoData.opcion1_descripcion,
       opcion2_reto_id: equipoData.opcion2_reto_id,
       opcion2_titulo: equipoData.opcion2_titulo,
       opcion2_descripcion: equipoData.opcion2_descripcion,
       p_acepto_clausula: equipoData.p_acepto_clausula,
     });
   } catch (error) {
     console.error("Error getting mi equipo:", error);
     res.status(500).json({ error: "Error al obtener info del equipo" });
   }
 };

export const updateRetosEquipo = async (req: Request, res: Response) => {
  try {
    const { opcion1_reto_id, opcion2_reto_id } = req.body;
    if (!opcion1_reto_id || !opcion2_reto_id) {
      return res.status(400).json({
        error:
          "ID de la opción de reto 1 y ID de la opción de reto 2 son requeridos",
      });
    }

    const reto1Exists = await RetosService.retoExists(opcion1_reto_id);
    const reto2Exists = await RetosService.retoExists(opcion2_reto_id);

    if (!reto1Exists || !reto2Exists) {
      return res
        .status(400)
        .json({ error: "Uno o más retos seleccionados no existen" });
    }

    if (opcion1_reto_id == opcion2_reto_id) {
      return res
        .status(400)
        .json({ error: "Deben elegirse dos retos diferentes" });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const userTeam = await getMyTeam(userId);
    if (!userTeam) {
      return res
        .status(400)
        .json({ error: "No se encontró el equipo del usuario" });
    }

    const teamLeaderId = await getTeamLeader(userTeam.id);
    if (userId !== teamLeaderId) {
      return res
        .status(403)
        .json({ error: "Solo el líder del equipo puede actualizar los retos" });
    }

    const updated = await RetosService.updateRetosEquipo(
      userTeam.id,
      opcion1_reto_id,
      opcion2_reto_id,
    );

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating retos:", error);
    res.status(500).json({ error: "Error al actualizar retos" });
  }
};


export const aceptarClausulaArca = async (req: Request, res: Response) => {
  try {
    const usuarioBaseId = req.user?.id;

    if (!usuarioBaseId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { acepto_clausula_arca, nombre_acepto_clausula_arca } = req.body;

    // Verificar que ambos parámetros estén presentes
    if (acepto_clausula_arca === undefined || !nombre_acepto_clausula_arca) {
      return res.status(400).json({ 
        error: "Se requiere aceptar la cláusula e ingresar tu nombre completo" 
      });
    }

    // Verificar que acepto_clausula_arca sea true
    if (acepto_clausula_arca !== true) {
      return res.status(400).json({ 
        error: "Debes aceptar los términos y condiciones para continuar" 
      });
    }

    // Verificar si ya aceptó anteriormente
    const yaAcepto = await RetosService.getClausulaArca(usuarioBaseId);

    if (yaAcepto?.acepto_clausula_arca === true) {
      return res.status(200).json({ 
        message: "Ya habías aceptado los términos y condiciones anteriormente",
        ya_acepto: true
      });
    }

    // Guardar la aceptación
    const resultado = await RetosService.aceptarClausulaArca(
      usuarioBaseId,
      nombre_acepto_clausula_arca
    );

    return res.status(200).json({
      message: "Términos y condiciones aceptados correctamente",
      ya_acepto: false,
      data: resultado
    });

  } catch (error) {
    console.error("Error al aceptar cláusula Arca:", error);
    res.status(500).json({ error: "Error al procesar la aceptación" });
  }
};
