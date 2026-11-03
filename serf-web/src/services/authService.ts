import type { AuthResponse } from '../interfaces/AuthResponse';
import type { LoginRequest } from '../interfaces/LoginRequest';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

interface JwtPayload {
    usuarioId?: number;
    sub?: string;
    roles?: string[];
    exp?: number;
}

const cerrarSesion = (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

const login = async (
    credenciales: LoginRequest
): Promise<AuthResponse> => {

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credenciales),
    });

    if (!response.ok) {

        if (response.status === 401) {
            throw new Error(
                'Correo o contraseña incorrectos'
            );
        }

        throw new Error(
            'No se pudo iniciar sesión'
        );
    }

    const data: AuthResponse =
        await response.json();

    localStorage.setItem(
        TOKEN_KEY,
        data.token
    );

    localStorage.setItem(
        USER_KEY,
        JSON.stringify(data)
    );

    return data;
};

const obtenerToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

const obtenerUsuario = (): AuthResponse | null => {

    const usuario =
        localStorage.getItem(USER_KEY);

    if (!usuario) {
        return null;
    }

    try {

        return JSON.parse(
            usuario
        ) as AuthResponse;

    } catch {

        cerrarSesion();
        return null;
    }
};

const estaAutenticado = (): boolean => {
    return (
        obtenerToken() !== null &&
        obtenerUsuario() !== null
    );
};

const obtenerRol = (): AuthResponse['rol'] | null => {
    return obtenerUsuario()?.rol ?? null;
};

const esAdministrador = (): boolean => {
    return obtenerRol() === 'ADMINISTRADOR';
};

const esVendedor = (): boolean => {
    return obtenerRol() === 'VENDEDOR';
};

const obtenerUsuarioId = (): number | null => {

    const token = obtenerToken();

    if (!token) {
        return null;
    }

    try {

        const partes = token.split('.');

        if (partes.length !== 3) {
            return null;
        }

        const payloadBase64 = partes[1]
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const payloadConPadding =
            payloadBase64.padEnd(
                Math.ceil(payloadBase64.length / 4) * 4,
                '='
            );

        const payload = JSON.parse(
            atob(payloadConPadding)
        ) as JwtPayload;

        return typeof payload.usuarioId === 'number'
            ? payload.usuarioId
            : null;

    } catch {

        return null;
    }
};

export const authService = {
    login,
    obtenerToken,
    obtenerUsuario,
    obtenerUsuarioId,
    obtenerRol,
    estaAutenticado,
    esAdministrador,
    esVendedor,
    cerrarSesion,
};