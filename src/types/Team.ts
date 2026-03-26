import type { UUID } from "node:crypto";

export interface Team {
  id: number;
  nombre: string;
  estatus_equipo: string;
  reto_asignado: string | null;
  opcion_reto_1_id: number | null;
  opcion_reto_2_id: number | null;
  lider_id: number;
  participante_2_id: number | null;
  participante_3_id: number | null;
  participante_4_id: number | null;
  fechaCreacion: Date;
  fechaValidacion: Date;
}
