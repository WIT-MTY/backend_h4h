export interface ParticipantRegisterData {
  nombre: string;
  apellido: string;
  fecha_nacimiento: Date;
  permiso_menor_url: string | null;
  telefono: string;
  pais_id: number;
  universidad_mexico_id: number | null;
  universidad_extranjera: string | null;
  estado_id: number | null;
  semestre_id: number;
  carrera_id: number;
  linkedin_url: string | null;
  github_url: string;
  cv_url: string;
  genero_id: number;
  vegana: boolean;
  tiene_restriccion_alimentaria: boolean;
  detalle_restriccion_alimentaria: string | null;
  talla_playera_id: number;
}

export interface ParticipantData extends ParticipantRegisterData {
  id: number;
  usuario_base_id: string;
  estatus_participante_id: number;
  opcion_reto_1_id: number;
  opcion_reto_2_id: number;
}
