import {
    useCallback,
    useEffect,
    useState,
} from 'react';

import type {
    ChangeEvent,
    FormEvent,
} from 'react';

import type { Filial } from '../interfaces/Filial';
import type { FilialRequest } from '../interfaces/FilialRequest';

import { filialService } from '../services/filialService';

import '../styles/FilialesPage.css';

const formularioInicial: FilialRequest = {
    codigo: '',
    nombre: '',
    pais: '',
    monedaLocal: 'PEN',
    ciudad: '',
    activa: true,
};

export function FilialesPage() {

    const [filiales, setFiliales] = useState<Filial[]>([]);

    const [formulario, setFormulario] =
        useState<FilialRequest>(formularioInicial);

    const [filialEditando, setFilialEditando] =
        useState<number | null>(null);

    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');

    const cargarFiliales = useCallback(async () => {
        try {
            setCargando(true);
            setError('');

            const datos = await filialService.listar();

            setFiliales(datos);

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : 'No se pudieron cargar las filiales.'
            );

        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        void cargarFiliales();
    }, [cargarFiliales]);

    const manejarCambio = (
        evento: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {

        const { name, value } = evento.target;

        const nuevoValor =
            evento.target instanceof HTMLInputElement &&
            evento.target.type === 'checkbox'
                ? evento.target.checked
                : value;

        setFormulario((actual) => ({
            ...actual,
            [name]: nuevoValor,
        }));
    };

    const limpiarFormulario = () => {
        setFormulario(formularioInicial);
        setFilialEditando(null);
    };

    const guardarFilial = async (
        evento: FormEvent<HTMLFormElement>
    ) => {

        evento.preventDefault();

        try {

            setGuardando(true);
            setError('');

            if (filialEditando !== null) {

                await filialService.actualizar(
                    filialEditando,
                    formulario
                );

            } else {

                await filialService.crear(formulario);
            }

            limpiarFormulario();

            await cargarFiliales();

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : 'No se pudo guardar la filial.'
            );

        } finally {

            setGuardando(false);
        }
    };

    const editarFilial = (filial: Filial) => {

        setFilialEditando(filial.id);

        setFormulario({
            codigo: filial.codigo,
            nombre: filial.nombre,
            pais: filial.pais,
            monedaLocal: filial.monedaLocal,
            ciudad: filial.ciudad,
            activa: filial.activa,
        });
    };

    const eliminarFilial = async (
        filial: Filial
    ) => {

        const confirmar = window.confirm(
            `¿Deseas eliminar la filial ${filial.nombre}?`
        );

        if (!confirmar) {
            return;
        }

        try {

            setError('');

            await filialService.eliminar(filial.id);

            if (filialEditando === filial.id) {
                limpiarFormulario();
            }

            await cargarFiliales();

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : 'No se pudo eliminar la filial.'
            );
        }
    };

    return (

        <main className="filiales-page">

            <section className="filiales-header">

                <div>

                    <span>SERF</span>

                    <h2>Filiales</h2>

                    <p>
                        Administra las filiales registradas en el sistema.
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() => void cargarFiliales()}
                    disabled={cargando}
                >
                    {cargando
                        ? 'Actualizando...'
                        : 'Actualizar'}
                </button>

            </section>

            {error && (
                <div className="filiales-error">
                    {error}
                </div>
            )}

            <section className="filial-form-container">

                <h3>
                    {filialEditando !== null
                        ? 'Editar filial'
                        : 'Nueva filial'}
                </h3>

                <form
                    className="filial-form"
                    onSubmit={guardarFilial}
                >

                    <input
                        name="codigo"
                        placeholder="Código"
                        value={formulario.codigo}
                        onChange={manejarCambio}
                        required
                    />

                    <input
                        name="nombre"
                        placeholder="Nombre"
                        value={formulario.nombre}
                        onChange={manejarCambio}
                        required
                    />

                    <input
                        name="pais"
                        placeholder="País"
                        value={formulario.pais}
                        onChange={manejarCambio}
                        required
                    />

                    <select
                        name="monedaLocal"
                        value={formulario.monedaLocal}
                        onChange={manejarCambio}
                        required
                    >
                        <option value="PEN">
                            PEN - Sol peruano
                        </option>

                        <option value="USD">
                            USD - Dólar estadounidense
                        </option>

                        <option value="EUR">
                            EUR - Euro
                        </option>

                        <option value="CNY">
                            CNY - Yuan chino
                        </option>
                    </select>

                    <input
                        name="ciudad"
                        placeholder="Ciudad"
                        value={formulario.ciudad}
                        onChange={manejarCambio}
                        required
                    />

                    <label className="filial-checkbox">

                        <input
                            type="checkbox"
                            name="activa"
                            checked={formulario.activa}
                            onChange={manejarCambio}
                        />

                        Filial activa

                    </label>

                    <div className="filial-form-actions">

                        {filialEditando !== null && (

                            <button
                                type="button"
                                onClick={limpiarFormulario}
                            >
                                Cancelar
                            </button>

                        )}

                        <button
                            type="submit"
                            disabled={guardando}
                        >
                            {guardando
                                ? 'Guardando...'
                                : filialEditando !== null
                                    ? 'Actualizar filial'
                                    : 'Registrar filial'}
                        </button>

                    </div>

                </form>

            </section>

            {cargando ? (

                <div className="filiales-table-container">
                    Cargando filiales...
                </div>

            ) : (

                <section className="filiales-table-container">

                    <h3>
                        Filiales registradas ({filiales.length})
                    </h3>

                    {filiales.length === 0 ? (

                        <p>
                            No existen filiales registradas.
                        </p>

                    ) : (

                        <table className="filiales-table">

                            <thead>

                            <tr>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>País</th>
                                <th>Moneda</th>
                                <th>Ciudad</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>

                            </thead>

                            <tbody>

                            {filiales.map((filial) => (

                                <tr key={filial.id}>

                                    <td>
                                        {filial.codigo}
                                    </td>

                                    <td>
                                        {filial.nombre}
                                    </td>

                                    <td>
                                        {filial.pais}
                                    </td>

                                    <td>
                                        {filial.monedaLocal}
                                    </td>

                                    <td>
                                        {filial.ciudad}
                                    </td>

                                    <td>
                                        {filial.activa
                                            ? 'Activa'
                                            : 'Inactiva'}
                                    </td>

                                    <td className="filial-actions">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                editarFilial(filial)
                                            }
                                        >
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            className="filial-delete"
                                            onClick={() =>
                                                void eliminarFilial(filial)
                                            }
                                        >
                                            Eliminar
                                        </button>

                                    </td>

                                </tr>
                            ))}

                            </tbody>

                        </table>
                    )}

                </section>
            )}

        </main>
    );
}