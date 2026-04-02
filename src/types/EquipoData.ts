export interface EquipoData {
    id: number;
    nombre: string;
    estatus_equipo_id: number;
    reto_asignado_id: number | null;
    opcion_reto_1_id: number;
    opcion_reto_2_id: number;
    lider_id: number;
    participante2_id: number | null;
    participante3_id: number | null;
    participante4_id: number | null;
    fecha_creacion: Date;
    fecha_validacion: Date | null;
}