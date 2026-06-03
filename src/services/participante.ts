import { supabase } from "src/config/supabase.js";
import { db } from "../config/db.js";
import { uploadAndGetURL } from "./storage.js";

export const updateEstatus = async (id: string, estatus: number) => {
  const query = `
    UPDATE public.participante
    SET
    estatus_participante_id = $1,
    fecha_validacion = NOW() AT TIME ZONE 'America/Mexico_City'
    WHERE usuario_base_id = $2
    RETURNING usuario_base_id, estatus_participante_id, fecha_validacion;
  `;

  const values = [estatus, id];

  const { rows } = await db.query(query, values);
  return rows[0];
};

export const uploadCV = async (cvFile: File) => {
  const { data: cvURLData, error: cvError } = await uploadAndGetURL(
    cvFile,
    "cvs",
  );
  console.log("CVURLData:", cvURLData, "CVError:", cvError);
  if (cvError) {
    throw new Error("Error al subir el currículum.");
  }
  return cvURLData;
};
