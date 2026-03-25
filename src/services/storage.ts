import { supabase } from "../config/supabase.js";

export async function uploadAndGetURL(
  file: File,
): Promise<{ data: string | null; error: any }> {
  try {
    //* 1. Validar extensión y tipo MIME
    const isPDF = file.type === "application/pdf" || file.name.endsWith(".pdf");

    if (!isPDF) {
      return {
        data: null,
        error: new Error("Solo se permiten archivos PDF"),
      };
    }

    //* 2. Subir el archivo
    const fileExt = file.name.split(".").pop(); // Nombre único y sanitizado para evitar colisiones
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `pdfs/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("docs")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) return { data: null, error: uploadError };
    else console.log("PDF subido:", uploadData);

    //* 3. Obtener la URL del archivo subido
    const { data: urlData } = supabase.storage
      .from("docs")
      .getPublicUrl(filePath);

    console.log("URL del archivo:", urlData.publicUrl);
    return { data: urlData.publicUrl, error: null };
  } catch (err) {
    // Capturar errores inesperados (ej. fallos de red)
    return {
      data: null,
      error:
        err instanceof Error
          ? err
          : new Error("Error desconocido al subir archivo"),
    };
  }
}
