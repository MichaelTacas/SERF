import { authService } from './authService';

async function execute(
    url: string,
    options: RequestInit = {}
): Promise<Response> {

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
        headers,
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

    return response;
}

async function requestJson<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {

    const response = await execute(
        url,
        options
    );

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
}

async function requestText(
    url: string,
    options: RequestInit = {}
): Promise<string> {

    const response = await execute(
        url,
        options
    );

    return response.text();
}

export const apiClient = {

    get<T>(url: string): Promise<T> {
        return requestJson<T>(url);
    },

    post<T>(
        url: string,
        body: unknown
    ): Promise<T> {

        return requestJson<T>(url, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    },

    put<T>(
        url: string,
        body: unknown
    ): Promise<T> {

        return requestJson<T>(url, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    },

    delete<T = void>(
        url: string
    ): Promise<T> {

        return requestJson<T>(url, {
            method: 'DELETE',
        });
    },

    postText(
        url: string,
        body: unknown
    ): Promise<string> {

        return requestText(url, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    },

};