import type { Request, Response } from "express";
import * as AuthService from "../services/auth.js";
import type { UserCredentials } from "../types/UserCredentials.js";
import type { ParticipantRegisterData } from "../types/ParticipantData.js";

// 1. Definimos una interfaz local para el archivo de Multer
// Esto evita el error "Namespace 'global.Express' has no exported member 'Multer'"
interface LocalMulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

// 2. Extendemos Request usando nuestra interfaz local
interface MulterRequest extends Request {
  files?: { [fieldname: string]: LocalMulterFile[] } | any;
}

export const signUp = async (req: Request, res: Response) => {
  console.log("================ DEBUG ================");
  console.log("BODY RECIBIDO:", req.body);
  console.log("ARCHIVOS RECIBIDOS:", req.files);
  console.log("CONTENT-TYPE:", req.headers["content-type"]);
  console.log("=======================================");

  // Usamos el casting 'as any' intermedio para limpiar errores de compatibilidad
  const mReq = req as any as MulterRequest;

  try {
    // 3. Extracción de archivos
    const cvFile = mReq.files?.cv_file ? mReq.files.cv_file[0] : null;
    const permisoFile = mReq.files?.permiso_file
      ? mReq.files.permiso_file[0]
      : null;

    if (!cvFile) {
      return res.status(400).json({
        success: false,
        error: "El archivo del CV es obligatorio.",
      });
    }

    // 4. Extracción de credenciales y datos
    const { email, password, ...restOfData } = req.body;
    const credentials: UserCredentials = { email, password };

    // Casteamos los datos adicionales a la interfaz del participante
    const registerData = restOfData as ParticipantRegisterData;

    // 5. Llamada al servicio
    // Pasamos los archivos como 'any' para que el servicio los acepte sin importar
    // si espera tipos de Node o tipos de Web (Blob/File).
    const result = await AuthService.signUp(
      credentials,
      registerData,
      cvFile as any,
      permisoFile as any,
    );

    return res.status(201).json({
      success: true,
      message: "Usuario y perfil creados correctamente",
      data: result,
    });
  } catch (error: any) {
    console.error("[SignUp Controller Error]:", error.message);

    const status = error.message.includes("auth") ? 401 : 400;

    return res.status(status).json({
      success: false,
      error: error.message || "Error interno en el proceso de registro",
    });
  }
};

export const logIn = async (req: Request, res: Response) => {
  try {
    const session = await AuthService.logIn(req.body);
    res.status(200).json(session);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const logOut = async (req: Request, res: Response) => {
  try {
    await AuthService.logOut();
    res.status(200).json({ message: "Sesión cerrada correctamente" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  // TODO: Borrar todas las apariciones del usuario en otras tablas (participante, equipo, etc.) CREAR UN SERVICIO PARA ESTO
  try {
    await AuthService.deleteUser(req.body.userId);
    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
