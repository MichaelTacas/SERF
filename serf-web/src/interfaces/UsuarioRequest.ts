import type { RolUsuario } from './Usuario';

export interface UsuarioRequest {
    email: string;
    password: string;
    rol: RolUsuario;
}