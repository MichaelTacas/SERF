export interface Solicitud {
    id: number;
    titulo: string;
    descripcion: string;
    prioridad: "BAJA" | "MEDIA" | "ALTA";
    estado: "PENDIENTE" | "EN_PROCESO" | "RESUELTA" | "CERRADA";
    clienteId: number;
    clienteNombre: string;
    tecnicoId: number | null;
    tecnicoNombre: string | null;
}