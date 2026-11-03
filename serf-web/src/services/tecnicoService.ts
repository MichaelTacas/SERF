import type { Tecnico } from "../interfaces/Tecnico";
import { apiClient } from "./apiClient";

const API_URL = "/api/tecnicos";

export const tecnicoService = {

    listarDisponibles(): Promise<Tecnico[]> {
        return apiClient.get<Tecnico[]>(
            `${API_URL}/disponibles`
        );
    }

};