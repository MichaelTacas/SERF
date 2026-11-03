export type RolUsuario =
    | 'ADMINISTRADOR'
    | 'VENDEDOR';

export interface Usuario {
    id: number;
    email: string;
    rol: RolUsuario;
    activo: boolean;
}