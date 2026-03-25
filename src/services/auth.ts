import { supabase } from "../config/supabase.js";
import type UserCredentials from "../types/UserCredentials.js";
import type { ParticipantRegisterData } from "../types/ParticipantData.js";
import { uploadAndGetURL } from "./storage.js";

export const signUp = async (
  credentials: UserCredentials,
  registerData: ParticipantRegisterData,
  cvFile: File,
  permisoFile: File | null,
) => {
  //* 0. Validar que se recibieron todos los datos necesarios
  const p_mexico = 141; // ID de México en la tabla de países, ajustar si es diferente
  if (
    !registerData.universidad_mexico_id &&
    (!registerData.universidad_extranjera ||
      registerData.universidad_extranjera.trim() === "")
  ) {
    throw new Error("Debe proporcionar una universidad.");
  }

  if (
    !credentials.email ||
    !credentials.password ||
    !registerData.nombre ||
    !registerData.apellido ||
    !registerData.fecha_nacimiento ||
    !registerData.telefono ||
    registerData.pais_id == null ||
    registerData.semestre_id == null ||
    registerData.carrera_id == null ||
    registerData.genero_id == null ||
    registerData.talla_playera_id == null ||
    !cvFile ||
    (registerData.pais_id == p_mexico && registerData.estado_id == null)
  ) {
    throw new Error("Faltan datos obligatorios para el registro.");
  }

  //* 1. Crear usuario en Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
  });

  if (authError) throw new Error(authError.message);
  if (!authData.user)
    throw new Error("No se pudo crear el usuario de autenticación.");

  //* 2. Manejo de archivos y validación de edad
  let permisoURL: string | null = null;
  const hoy = new Date();
  const fechaNac = new Date(registerData.fecha_nacimiento);
  const edad =
    hoy.getFullYear() -
    fechaNac.getFullYear() -
    (hoy < new Date(hoy.getFullYear(), fechaNac.getMonth(), fechaNac.getDate())
      ? 1
      : 0);

  if (edad < 18) {
    if (!permisoFile) {
      throw new Error(
        "Se requiere permiso de menor para participantes menores de edad",
      );
    }
    const { data: permisoURLData, error: permisoError } =
      await uploadAndGetURL(permisoFile);
    if (permisoError) {
      throw new Error("Error al subir el permiso de menor.");
    }
    permisoURL = permisoURLData;
  }

  const { data: cvURLData, error: cvError } = await uploadAndGetURL(cvFile);
  if (cvError) {
    throw new Error("Error al subir el currículum.");
  }
  const cvURL = cvURLData;

  //* 3. Llamar al SP en Postgres vía RPC
  // Nota: Asegúrarse de que las llaves coincidan exactamente con los nombres de los parámetros del SP
  const { data: rpcData, error: rpcError } = await supabase.rpc(
    "fn_registro_participantes",
    {
      p_usuario_base_id: authData.user.id,
      p_nombre: registerData.nombre,
      p_apellido: registerData.apellido,
      p_fecha_nacimiento: registerData.fecha_nacimiento,
      p_permisos_menores_url: permisoURL,
      p_telefono: registerData.telefono,
      p_pais_id: registerData.pais_id,
      p_universidad_mexico_id: registerData.universidad_mexico_id,
      p_universidad_extranjera: registerData.universidad_extranjera,
      p_estado_id: registerData.estado_id,
      p_semestre_id: registerData.semestre_id,
      p_carrera_id: registerData.carrera_id,
      p_linkedin_url: registerData.linkedin_url,
      p_github_url: registerData.github_url,
      p_cv_url: cvURL,
      p_genero_id: registerData.genero_id,
      p_vegana: registerData.vegana,
      p_tiene_restriccion_alimentaria:
        registerData.tiene_restriccion_alimentaria,
      p_desc_restricciones_alimenticias:
        registerData.detalle_restriccion_alimentaria,
      p_talla_id: registerData.talla_playera_id,
    },
  );

  if (rpcError) {
    await supabase.auth.admin.deleteUser(authData.user.id); // rollback del usuario creado en Supabase Auth
    await supabase.storage.from("docs").remove([cvFile.name]); // eliminar CV subido
    throw new Error(rpcError.message);
  }

  return rpcData;
};

export const logIn = async (credentials: UserCredentials) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });
  if (error) throw new Error(error.message);
  return data.session;
};
