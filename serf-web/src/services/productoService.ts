import { apiClient } from './apiClient';

import type { Producto } from '../interfaces/Producto';
import type { ProductoRequest } from '../interfaces/ProductoRequest';

export const productoService = {

    listar(): Promise<Producto[]> {
        return apiClient.get<Producto[]>(
            '/api/productos'
        );
    },

    crear(
        datos: ProductoRequest
    ): Promise<Producto> {

        return apiClient.post<Producto>(
            '/api/productos',
            datos
        );
    },

    actualizar(
        id: number,
        datos: ProductoRequest
    ): Promise<Producto> {

        return apiClient.put<Producto>(
            `/api/productos/${id}`,
            datos
        );
    },

    eliminar(
        id: number
    ): Promise<void> {

        return apiClient.delete<void>(
            `/api/productos/${id}`
        );
    }

};