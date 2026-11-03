import type { Solicitud } from "../interfaces/Solicitud";
import type { SolicitudRequest } from "../interfaces/SolicitudRequest";
import { apiClient } from "./apiClient";

const API_URL = "/api/solicitudes";

export const solicitudService = {

    listar(): Promise<Solicitud[]> {
        return apiClient.get<Solicitud[]>(API_URL);
    },

    registrar(
        solicitud: SolicitudRequest
    ): Promise<Solicitud> {

        return apiClient.post<Solicitud>(
            API_URL,
            solicitud
        );
    },

    actualizar(
        id: number,
        solicitud: SolicitudRequest
    ): Promise<Solicitud> {

        return apiClient.put<Solicitud>(
            `${API_URL}/${id}`,
            solicitud
        );
    }

};