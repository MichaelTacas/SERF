import type { AuthResponse } from '../interfaces/AuthResponse';
import type { LoginRequest } from '../interfaces/LoginRequest';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

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
            throw new Error('Correo o contraseña incorrectos');
        }

        throw new Error('No se pudo iniciar sesión');
    }

    const data: AuthResponse = await response.json();

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

    const usuario = localStorage.getItem(USER_KEY);

    if (!usuario) {
        return null;
    }

    try {
        return JSON.parse(usuario) as AuthResponse;
    } catch {
        return null;
    }
};

const estaAutenticado = (): boolean => {
    return obtenerToken() !== null;
};

const cerrarSesion = (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

export const authService = {
    login,
    obtenerToken,
    obtenerUsuario,
    estaAutenticado,
    cerrarSesion,
};