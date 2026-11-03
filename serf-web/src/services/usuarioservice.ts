import { apiClient } from './apiClient';

import type { Usuario } from '../interfaces/Usuario';
import type { UsuarioRequest } from '../interfaces/UsuarioRequest';

export const usuarioservice = {

    listar(): Promise<Usuario[]> {
        return apiClient.get<Usuario[]>(
            '/api/usuarios'
        );
    },

    crear(
        datos: UsuarioRequest
    ): Promise<Usuario> {

        return apiClient.post<Usuario>(
            '/api/usuarios',
            datos
        );
    },

};