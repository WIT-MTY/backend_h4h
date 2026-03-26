import { supabase } from "../config/supabase.js";

export async function uploadAndGetURL(
  file: any, // Usamos any porque el tipo de Multer difiere del File del DOM
  folder: string,
): Promise<{ data: string | null; error: any }> {
  try {
    // 1. Extraer propiedades correctas de Multer
    const fileNameOriginal = file.originalname;
    const fileMimeType = file.mimetype;
    const fileBuffer = file.buffer;

    console.log(
      "Iniciando proceso de subida para archivo:",
      fileNameOriginal,
      fileMimeType,
    );

    //* 2. Validar extensión y tipo MIME (Usando propiedades de Multer)
    const isPDF =
      fileMimeType === "application/pdf" ||
      fileNameOriginal.toLowerCase().endsWith(".pdf");

    if (!isPDF) {
      console.log("Archivo rechazado por no ser PDF:", fileNameOriginal);
      return {
        data: null,
        error: new Error("Solo se permiten archivos PDF"),
      };
    }

    //* 3. Generar nombre único
    const fileExt = fileNameOriginal.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    //* 4. Subir el archivo (PASANDO EL BUFFER)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("docs")
      .upload(filePath, fileBuffer, {
        contentType: fileMimeType,
        upsert: false,
      });

    if (uploadError) {
      console.error("Error de Supabase Storage:", uploadError);
      return { data: null, error: uploadError };
    }

    console.log("PDF subido con éxito:", uploadData.path);

    //* 5. Obtener la URL pública
    const { data: urlData } = supabase.storage
      .from("docs")
      .getPublicUrl(filePath);

    return { data: urlData.publicUrl, error: null };
  } catch (err) {
    console.error("Error inesperado en uploadAndGetURL:", err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error("Error desconocido"),
    };
  }
}
