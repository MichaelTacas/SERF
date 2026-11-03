import {
    useCallback,
    useEffect,
    useState,
} from 'react';

import type {
    ChangeEvent,
    FormEvent,
} from 'react';

import type { Usuario } from '../interfaces/Usuario';
import type { UsuarioRequest } from '../interfaces/UsuarioRequest';

import { usuarioservice } from '../services/usuarioservice.ts';

import '../styles/UsuariosPage.css';

const formularioInicial: UsuarioRequest = {
    email: '',
    password: '',
    rol: 'VENDEDOR',
};

export function UsuariosPage() {

    const [usuarios, setUsuarios] =
        useState<Usuario[]>([]);

    const [formulario, setFormulario] =
        useState<UsuarioRequest>(
            formularioInicial
        );

    const [cargando, setCargando] =
        useState(true);

    const [guardando, setGuardando] =
        useState(false);

    const [error, setError] =
        useState('');

    const [mensaje, setMensaje] =
        useState('');

    const cargarUsuarios = useCallback(
        async () => {

            try {

                setCargando(true);
                setError('');

                const datos =
                    await usuarioservice.listar();

                setUsuarios(datos);

            } catch (err) {

                setError(
                    err instanceof Error
                        ? err.message
                        : 'No se pudieron cargar los usuarios.'
                );

            } finally {

                setCargando(false);

            }
        },
        []
    );

    useEffect(() => {
        void cargarUsuarios();
    }, [cargarUsuarios]);

    const manejarCambio = (
        evento:
            ChangeEvent<HTMLInputElement> |
            ChangeEvent<HTMLSelectElement>
    ) => {

        const { name, value } =
            evento.target;

        setFormulario((actual) => ({
            ...actual,
            [name]: value,
        }));
    };

    const registrarUsuario = async (
        evento: FormEvent<HTMLFormElement>
    ) => {

        evento.preventDefault();

        setError('');
        setMensaje('');

        if (
            formulario.password.length < 8
        ) {

            setError(
                'La contraseña debe tener al menos 8 caracteres.'
            );

            return;
        }

        try {

            setGuardando(true);

            await usuarioservice.crear(
                formulario
            );

            setFormulario(
                formularioInicial
            );

            await cargarUsuarios();

            setMensaje(
                'Usuario registrado correctamente.'
            );

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : 'No se pudo registrar el usuario.'
            );

        } finally {

            setGuardando(false);

        }
    };

    return (
        <main className="usuarios-page">

            <section className="usuarios-header">

                <div>

                    <span>SERF</span>

                    <h2>
                        Usuarios
                    </h2>

                    <p>
                        Administra los usuarios que
                        tendrán acceso al sistema.
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() =>
                        void cargarUsuarios()
                    }
                    disabled={cargando}
                >
                    {cargando
                        ? 'Actualizando...'
                        : 'Actualizar'}
                </button>

            </section>

            {error && (
                <div className="usuarios-error">
                    {error}
                </div>
            )}

            {mensaje && (
                <div className="usuarios-success">
                    {mensaje}
                </div>
            )}

            <section className="usuario-form-container">

                <div className="usuario-form-title">

                    <h3>
                        Nuevo usuario
                    </h3>

                    <p>
                        Registra un administrador
                        o vendedor.
                    </p>

                </div>

                <form
                    className="usuario-form"
                    onSubmit={registrarUsuario}
                >

                    <div className="usuario-field">

                        <label htmlFor="email">
                            Correo electrónico
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formulario.email}
                            onChange={manejarCambio}
                            placeholder="usuario@empresa.com"
                            required
                        />

                    </div>

                    <div className="usuario-field">

                        <label htmlFor="password">
                            Contraseña
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formulario.password}
                            onChange={manejarCambio}
                            minLength={8}
                            maxLength={64}
                            placeholder="Mínimo 8 caracteres"
                            required
                        />

                    </div>

                    <div className="usuario-field">

                        <label htmlFor="rol">
                            Rol
                        </label>

                        <select
                            id="rol"
                            name="rol"
                            value={formulario.rol}
                            onChange={manejarCambio}
                            required
                        >

                            <option value="VENDEDOR">
                                Vendedor
                            </option>

                            <option value="ADMINISTRADOR">
                                Administrador
                            </option>

                        </select>

                    </div>

                    <div className="usuario-form-actions">

                        <button
                            type="submit"
                            disabled={guardando}
                        >
                            {guardando
                                ? 'Registrando...'
                                : 'Registrar usuario'}
                        </button>

                    </div>

                </form>

            </section>

            <section className="usuarios-table-container">

                <div className="usuarios-table-title">

                    <h3>
                        Usuarios registrados
                    </h3>

                    <p>
                        Total: {usuarios.length}
                    </p>

                </div>

                {cargando ? (

                    <p className="usuarios-message">
                        Cargando usuarios...
                    </p>

                ) : usuarios.length === 0 ? (

                    <p className="usuarios-message">
                        No existen usuarios registrados.
                    </p>

                ) : (

                    <div className="usuarios-table-wrapper">

                        <table className="usuarios-table">

                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th>Estado</th>
                            </tr>
                            </thead>

                            <tbody>

                            {usuarios.map(
                                (usuario) => (

                                    <tr key={usuario.id}>

                                        <td>
                                            {usuario.id}
                                        </td>

                                        <td>
                                            {usuario.email}
                                        </td>

                                        <td>
                                            {usuario.rol ===
                                            'ADMINISTRADOR'
                                                ? 'Administrador'
                                                : 'Vendedor'}
                                        </td>

                                        <td>
                        <span
                            className={
                                usuario.activo
                                    ? 'usuario-estado activo'
                                    : 'usuario-estado inactivo'
                            }
                        >
                          {usuario.activo
                              ? 'Activo'
                              : 'Inactivo'}
                        </span>
                                        </td>

                                    </tr>

                                )
                            )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

        </main>
    );
}