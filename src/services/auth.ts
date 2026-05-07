import { supabase } from "../config/supabase.js";
import type { UserCredentials } from "../types/UserCredentials.js";
import type { ParticipantRegisterData } from "../types/ParticipantData.js";
import { uploadAndGetURL } from "./storage.js";
import { db } from "../config/db.js";

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
    const { data: permisoURLData, error: permisoError } = await uploadAndGetURL(
      permisoFile,
      "permisos_menores",
    );
    if (permisoError) {
      throw new Error("Error al subir el permiso de menor.");
    }
    permisoURL = permisoURLData;
  }

  const { data: cvURLData, error: cvError } = await uploadAndGetURL(
    cvFile,
    "cvs",
  );
  console.log("CVURLData:", cvURLData, "CVError:", cvError);
  if (cvError) {
    throw new Error("Error al subir el currículum.");
  }

  //* 3. Llamar al SP en Postgres vía RPC
  // IMPORTANTE que las llaves coincidan exactamente con los nombres de los parámetros del FN, el orden no importa pero los nombres sí.
  const { data: rpcData, error: rpcError } = await supabase.rpc(
    "fn_registro_participantes",
    {
      // Datos base
      p_usuario_base_id: authData.user.id,
      p_nombre: registerData.nombre,
      p_apellido: registerData.apellido,
      p_fecha_nacimiento: registerData.fecha_nacimiento,
      p_telefono: registerData.telefono,
      p_genero_id: registerData.genero_id || null,

      // Ubicación y Universidad
      p_pais_id: registerData.pais_id || null,
      p_estado_id: registerData.estado_id || null,
      p_universidad_mexico_id: registerData.universidad_mexico_id || null,
      p_universidad_extranjera: registerData.universidad_extranjera || null, // <--- Faltaba en el intento fallido

      // Académico
      p_carrera_id: registerData.carrera_id || null,
      p_semestre_id: registerData.semestre_id || null,

      // Social / Archivos
      p_linkedin_url: registerData.linkedin_url || null, // <--- Faltaba en el intento fallido
      p_github_url: registerData.github_url || null,
      p_cv_url: cvURLData,
      p_permisos_menores_url: permisoURL || null,
      
      // Alimentación y Talla
      p_talla_id: registerData.talla_playera_id || null,
      p_vegana: registerData.vegana ?? false, // <--- Faltaba en el intento fallido
      p_tiene_restriccion_alimentaria:
        registerData.tiene_restriccion_alimentaria ?? false, // <--- Faltaba en el intento fallido
      p_desc_restricciones_alimenticias:
        registerData.detalle_restriccion_alimentaria || null,
      p_autoriza_correos_mlh: registerData.autoriza_correos_mlh === true || (registerData.autoriza_correos_mlh as any) === 'true',
    },
  );

  console.log("******RPC Data:", rpcData);
  console.log("------RPC Error:", rpcError);

  if (rpcError) {
    //* rollback del usuario creado en Supabase Auth
    await supabase.auth.admin.deleteUser(authData.user.id);
    console.log(`Usuario ${authData.user.id} eliminado por error en RPC.`);

    //* eliminar CV subido si hay error en RPC para evitar archivos huérfanos
    if (cvURLData) {
      const cvFileToDelete = cvURLData.split("/").pop();
      if (cvFileToDelete) {
        await supabase.storage.from("docs").remove([`cvs/${cvFileToDelete}`]);
        console.log(`Archivo CV ${cvFileToDelete} eliminado por error en RPC.`);
      }
    }

    //* eliminar permiso menor de edad subido si hay error en RPC para evitar archivos huérfanos
    if (permisoURL) {
      const permisoFileToDelete = permisoURL.split("/").pop();
      if (permisoFileToDelete) {
        await supabase.storage
          .from("docs")
          .remove([`permisos_menores/${permisoFileToDelete}`]);
        console.log(
          `Archivo de permiso ${permisoFileToDelete} eliminado por error en RPC.`,
        );
      }
    }

    throw new Error(rpcError.message);
  }

  return rpcData;
};

export const logIn = async (credentials: UserCredentials) => {
  await supabase.auth.signOut();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) throw new Error(error.message);

  const { rows: adminRows } = await db.query(
    `SELECT id FROM public.administrador WHERE usuario_base_id = $1`,
    [data.session?.user.id],
  );

  const { rows: participanteRows } = await db.query(
    `SELECT usuario_base_id FROM public.participante WHERE usuario_base_id = $1`,
    [data.session?.user.id],
  );

  return {
    access_token: data.session?.access_token,
    is_admin: adminRows.length > 0,
    is_user: participanteRows.length > 0,
  };
};

export const logOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  } catch (error: any) {
    throw new Error("Error al cerrar sesión: " + error.message);
  }
};

export const deleteUser = async (userId: string) => {
  // TODO: Borrar todas las apariciones del usuario en otras tablas (participante, equipo, etc.) CREAR UN SERVICIO PARA ESTO
  try {
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) throw new Error(error.message);
  } catch (error: any) {
    throw new Error("Error al eliminar usuario: " + error.message);
  }
};
