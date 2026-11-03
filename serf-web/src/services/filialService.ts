import { apiClient } from './apiClient';
import type { Filial } from '../interfaces/Filial';
import type { FilialRequest } from '../interfaces/FilialRequest';

export const filialService = {

    listar(): Promise<Filial[]> {
        return apiClient.get<Filial[]>('/api/filiales');
    },

    crear(datos: FilialRequest): Promise<Filial> {
        return apiClient.post<Filial>(
            '/api/filiales',
            datos
        );
    },

    actualizar(
        id: number,
        datos: FilialRequest
    ): Promise<Filial> {
        return apiClient.put<Filial>(
            `/api/filiales/${id}`,
            datos
        );
    },

    eliminar(id: number): Promise<void> {
        return apiClient.delete<void>(
            `/api/filiales/${id}`
        );
    }

};