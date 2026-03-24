import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

/* 
 * Aquí tenemos 2 opciones
 * Usar solo PostgreSQL con pg : db.query('SELECT * FROM tabla')
 * Usar Supabase : supabase.from('tabla').select()
 
 * Por el momento se usa de forma híbrida para manejar el auth y almacenamiento de archivos con Supabase, mientras que las consultas SQL directas se manejan con pg. Esto permite aprovechar lo mejor de ambos mundos según las necesidades específicas de cada caso.
*/

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);
