import { apiClient } from './apiClient';
import type { Cliente } from '../interfaces/Cliente';
import type { ClienteRequest } from '../interfaces/ClienteRequest';

export const clienteService = {

    async listar(): Promise<Cliente[]> {
        return apiClient.get<Cliente[]>('/api/clientes');
    },

    async crear(datos: ClienteRequest): Promise<Cliente> {
        return apiClient.post<Cliente>('/api/clientes', datos);
    },

    async actualizar(
        id: number,
        datos: ClienteRequest
    ): Promise<Cliente> {
        return apiClient.put<Cliente>(
            `/api/clientes/${id}`,
            datos
        );
    },

    async eliminar(id: number): Promise<void> {
        await apiClient.delete(`/api/clientes/${id}`);
    },

};