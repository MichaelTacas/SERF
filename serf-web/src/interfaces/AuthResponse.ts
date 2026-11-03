export type RolUsuario =
    | 'ADMINISTRADOR'
    | 'VENDEDOR';

export interface AuthResponse {
    token: string;
    email: string;
    rol: RolUsuario;
}