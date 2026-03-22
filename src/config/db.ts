import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

/* 
 * Aquí tenemos 2 opciones
 * Usar solo PostgreSQL con pg : db.query('SELECT * FROM tabla')
 * Usar Supabase : supabase.from('tabla').select()
 
 * Por el momento se usa de forma híbrida para manejar el auth y almacenamiento de archivos con Supabase, mientras que las consultas SQL directas se manejan con pg. Esto permite aprovechar lo mejor de ambos mundos según las necesidades específicas de cada caso.
*/
export const db = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});
