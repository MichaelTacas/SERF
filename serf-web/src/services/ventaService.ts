import { apiClient } from './apiClient';

import type { Venta } from '../interfaces/Venta';
import type { VentaRequest } from '../interfaces/VentaRequest';

export const ventaService = {

    listar(): Promise<Venta[]> {
        return apiClient.get<Venta[]>(
            '/api/ventas'
        );
    },

    buscarPorId(id: number): Promise<Venta> {
        return apiClient.get<Venta>(
            `/api/ventas/${id}`
        );
    },

    listarPorFilial(
        filialId: number
    ): Promise<Venta[]> {
        return apiClient.get<Venta[]>(
            `/api/ventas/filial/${filialId}`
        );
    },

    registrar(
        datos: VentaRequest
    ): Promise<Venta> {
        return apiClient.post<Venta>(
            '/api/ventas',
            datos
        );
    }

};