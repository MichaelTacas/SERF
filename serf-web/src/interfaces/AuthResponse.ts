export interface AuthResponse {
    token: string;
    tipo: string;
    expiraEnSegundos: number;
    usuarioId: number;
    email: string;
    rol: 'ADMINISTRADOR' | 'TECNICO';
}