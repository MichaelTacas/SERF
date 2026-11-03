export interface SolicitudRequest {
    titulo: string;
    descripcion: string;
    prioridad: "BAJA" | "MEDIA" | "ALTA";
    clienteId: number;
    tecnicoId: number | null;
    estado?: "PENDIENTE" | "EN_PROCESO" | "RESUELTA" | "CERRADA";
}