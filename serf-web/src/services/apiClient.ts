import { authService } from './authService';

async function request<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {

    const token = authService.obtenerToken();

    const headers = new Headers(options.headers);

    headers.set(
        'Content-Type',
        'application/json'
    );

    if (token) {
        headers.set(
            'Authorization',
            `Bearer ${token}`
        );
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (!response.ok) {

        if (response.status === 401) {
            authService.cerrarSesion();

            throw new Error(
                'Tu sesión ha expirado. Inicia sesión nuevamente.'
            );
        }

        if (response.status === 403) {
            throw new Error(
                'No tienes permisos para realizar esta acción.'
            );
        }

        const error = await response
            .json()
            .catch(() => null);

        throw new Error(
            error?.mensaje ??
            `Error HTTP ${response.status}`
        );
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
}

export const apiClient = {

    get<T>(url: string): Promise<T> {
        return request<T>(url);
    },

    post<T>(
        url: string,
        body: unknown
    ): Promise<T> {

        return request<T>(url, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    },

    put<T>(
        url: string,
        body: unknown
    ): Promise<T> {

        return request<T>(url, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }

};