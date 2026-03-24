import { supabase } from "../config/supabase.js";

export async function uploadAndGetURL(file: File) {
  // 1. Validar extensión y tipo MIME
  const isPDF = file.type === "application/pdf" || file.name.endsWith(".pdf");

  if (!isPDF) {
    alert("Solo se permiten archivos PDF");
    return;
  }

  // 2. Subir el archivo
  const filePath = `pdfs/${Date.now()}_${file.name}`; //nombre único para evitar colisiones

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("docs")
    .upload(filePath, file);

  if (uploadError) return console.error(uploadError);
  else console.log("PDF subido:", uploadData);

  // 3. Obtener la URL del archivo subido
  const { data: urlData } = supabase.storage
    .from("docs")
    .getPublicUrl(filePath);

  console.log("URL del archivo:", urlData.publicUrl);
  return urlData.publicUrl;
}
