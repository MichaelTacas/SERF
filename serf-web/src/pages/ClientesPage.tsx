import {
    useCallback,
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from 'react';

import type { Cliente } from '../interfaces/Cliente';
import type { ClienteRequest } from '../interfaces/ClienteRequest';

import { clienteService } from '../services/clienteService';
import { authService } from '../services/authService';

import '../styles/ClientesPage.css';

const formularioInicial: ClienteRequest = {
    nombre: '',
    email: '',
    empresa: '',
};

export function ClientesPage() {

    const [clientes, setClientes] =
        useState<Cliente[]>([]);

    const [formulario, setFormulario] =
        useState<ClienteRequest>(formularioInicial);

    const [clienteEditando, setClienteEditando] =
        useState<number | null>(null);

    const [cargando, setCargando] =
        useState(true);

    const [guardando, setGuardando] =
        useState(false);

    const [error, setError] =
        useState('');

    const esAdministrador =
        authService.esAdministrador();

    const cargarClientes =
        useCallback(async () => {

            try {

                setCargando(true);
                setError('');

                const datos =
                    await clienteService.listar();

                setClientes(datos);

            } catch (error) {

                setError(
                    error instanceof Error
                        ? error.message
                        : 'No se pudieron cargar los clientes.'
                );

            } finally {

                setCargando(false);

            }

        }, []);

    useEffect(() => {
        void cargarClientes();
    }, [cargarClientes]);

    const manejarCambio = (
        evento: ChangeEvent<HTMLInputElement>
    ) => {

        const { name, value } =
            evento.target;

        setFormulario((actual) => ({
            ...actual,
            [name]: value,
        }));
    };

    const limpiarFormulario = () => {
        setFormulario(formularioInicial);
        setClienteEditando(null);
    };

    const guardarCliente = async (
        evento: FormEvent<HTMLFormElement>
    ) => {

        evento.preventDefault();

        try {

            setGuardando(true);
            setError('');

            if (clienteEditando !== null) {

                await clienteService.actualizar(
                    clienteEditando,
                    formulario
                );

            } else {

                await clienteService.crear(
                    formulario
                );

            }

            limpiarFormulario();

            await cargarClientes();

        } catch (error) {

            setError(
                error instanceof Error
                    ? error.message
                    : 'No se pudo guardar el cliente.'
            );

        } finally {

            setGuardando(false);

        }
    };

    const editarCliente = (
        cliente: Cliente
    ) => {

        setClienteEditando(cliente.id);

        setFormulario({
            nombre: cliente.nombre,
            email: cliente.email,
            empresa: cliente.empresa,
        });
    };

    const eliminarCliente = async (
        cliente: Cliente
    ) => {

        const confirmar =
            window.confirm(
                `¿Deseas eliminar al cliente ${cliente.nombre}?`
            );

        if (!confirmar) {
            return;
        }

        try {

            setError('');

            await clienteService.eliminar(
                cliente.id
            );

            if (
                clienteEditando === cliente.id
            ) {
                limpiarFormulario();
            }

            await cargarClientes();

        } catch (error) {

            setError(
                error instanceof Error
                    ? error.message
                    : 'No se pudo eliminar el cliente.'
            );

        }
    };

    return (
        <main className="clientes-page">

            <section className="clientes-header">

                <div>

          <span className="clientes-eyebrow">
            SERF
          </span>

                    <h2>Clientes</h2>

                    <p>
                        Registra y administra los clientes
                        del sistema.
                    </p>

                </div>

                <button
                    type="button"
                    className="clientes-refresh"
                    onClick={() =>
                        void cargarClientes()
                    }
                    disabled={cargando}
                >
                    {cargando
                        ? 'Actualizando...'
                        : 'Actualizar'}
                </button>

            </section>

            {error && (
                <div className="clientes-error">
                    {error}
                </div>
            )}

            <section className="cliente-form-container">

                <div className="cliente-form-title">

                    <h3>
                        {clienteEditando !== null
                            ? 'Editar cliente'
                            : 'Nuevo cliente'}
                    </h3>

                    <p>
                        Completa los datos requeridos.
                    </p>

                </div>

                <form
                    className="cliente-form"
                    onSubmit={guardarCliente}
                >

                    <div className="cliente-field">

                        <label htmlFor="nombre">
                            Nombre
                        </label>

                        <input
                            id="nombre"
                            name="nombre"
                            value={formulario.nombre}
                            onChange={manejarCambio}
                            required
                        />

                    </div>

                    <div className="cliente-field">

                        <label htmlFor="email">
                            Correo
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formulario.email}
                            onChange={manejarCambio}
                            required
                        />

                    </div>

                    <div className="cliente-field">

                        <label htmlFor="empresa">
                            Empresa
                        </label>

                        <input
                            id="empresa"
                            name="empresa"
                            value={formulario.empresa}
                            onChange={manejarCambio}
                            required
                        />

                    </div>

                    <div className="cliente-form-actions">

                        {clienteEditando !== null && (
                            <button
                                type="button"
                                className="cliente-cancel"
                                onClick={limpiarFormulario}
                            >
                                Cancelar
                            </button>
                        )}

                        <button
                            type="submit"
                            className="cliente-save"
                            disabled={guardando}
                        >
                            {guardando
                                ? 'Guardando...'
                                : clienteEditando !== null
                                    ? 'Actualizar cliente'
                                    : 'Registrar cliente'}
                        </button>

                    </div>

                </form>

            </section>

            {!cargando && (

                <section className="clientes-table-container">

                    <div className="clientes-table-header">

                        <div>
                            <h3>
                                Clientes registrados
                            </h3>

                            <p>
                                Total: {clientes.length}
                            </p>
                        </div>

                    </div>

                    {clientes.length === 0 ? (

                        <div className="clientes-message">
                            No existen clientes registrados.
                        </div>

                    ) : (

                        <div className="clientes-table-wrapper">

                            <table className="clientes-table">

                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>Empresa</th>
                                    <th>Acciones</th>
                                </tr>
                                </thead>

                                <tbody>

                                {clientes.map(
                                    (cliente) => (

                                        <tr key={cliente.id}>

                                            <td>
                                                #{cliente.id}
                                            </td>

                                            <td>
                                                {cliente.nombre}
                                            </td>

                                            <td>
                                                {cliente.email}
                                            </td>

                                            <td>
                                                {cliente.empresa}
                                            </td>

                                            <td>

                                                <div className="cliente-actions">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            editarCliente(cliente)
                                                        }
                                                    >
                                                        Editar
                                                    </button>

                                                    {esAdministrador && (
                                                        <button
                                                            type="button"
                                                            className="cliente-delete"
                                                            onClick={() =>
                                                                void eliminarCliente(
                                                                    cliente
                                                                )
                                                            }
                                                        >
                                                            Eliminar
                                                        </button>
                                                    )}

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            )}

        </main>
    );
}