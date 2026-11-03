import type { Cliente } from "../interfaces/Cliente";
import { apiClient } from "./apiClient";

const API_URL = "/api/clientes";

export const clienteService = {

    listar(): Promise<Cliente[]> {
        return apiClient.get<Cliente[]>(API_URL);
    }

};