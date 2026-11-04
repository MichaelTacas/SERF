import {
    useCallback,
    useEffect,
    useState,
} from 'react';

import type {
    ChangeEvent,
    FormEvent,
} from 'react';

import type { Cliente } from '../interfaces/Cliente';
import type { ReporteRequest } from '../interfaces/ReporteRequest';
import type { ReporteAutomaticoRequest } from '../interfaces/ReporteAutomaticoRequest';

import { reporteService } from '../services/reporteService';
import { clienteService } from '../services/clienteService';
import { authService } from '../services/authService';

import '../styles/ReportesPage.css';

type TipoReporte =
    | 'automatico'
    | 'manual';

type PeriodoReporte =
    | 'mensual'
    | 'trimestral'
    | 'anual';

type PeriodoAutomatico =
    ReporteAutomaticoRequest['periodo'];

const reporteManualInicial: ReporteRequest = {
    pais: '',
    ingresos: '',
    gastos: '',
    responsable: '',
};

const reporteAutomaticoInicial: ReporteAutomaticoRequest = {
    pais: '',
    clienteId: 0,
    periodo: 'MENSUAL',
};

function esPeriodoManual(
    valor: string
): valor is PeriodoReporte {

    return valor === 'mensual'
        || valor === 'trimestral'
        || valor === 'anual';
}

function esPeriodoAutomatico(
    valor: string
): valor is PeriodoAutomatico {

    return valor === 'MENSUAL'
        || valor === 'TRIMESTRAL'
        || valor === 'ANUAL';
}

export function ReportesPage() {

    const [tipoReporte, setTipoReporte] =
        useState<TipoReporte>('automatico');

    const [periodoReporte, setPeriodoReporte] =
        useState<PeriodoReporte>('mensual');

    const [reporteManual, setReporteManual] =
        useState<ReporteRequest>(
            reporteManualInicial
        );

    const [
        reporteAutomatico,
        setReporteAutomatico,
    ] = useState<ReporteAutomaticoRequest>(
        reporteAutomaticoInicial
    );

    const [clientes, setClientes] =
        useState<Cliente[]>([]);

    const [cargandoClientes, setCargandoClientes] =
        useState(false);

    const [contenido, setContenido] =
        useState('');

    const [generando, setGenerando] =
        useState(false);

    const [error, setError] =
        useState('');

    // =====================================================
    // USUARIO AUTENTICADO
    // =====================================================

    const usuarioAutenticado =
        authService.obtenerUsuario();

    const responsable =
        usuarioAutenticado?.email ?? '';

    // =====================================================
    // CARGAR CLIENTES
    // =====================================================

    const cargarClientes = useCallback(
        async () => {

            try {

                setCargandoClientes(true);
                setError('');

                const datos =
                    await clienteService.listar();

                setClientes(datos);

            } catch (err) {

                setError(
                    err instanceof Error
                        ? err.message
                        : 'No se pudieron cargar los clientes.'
                );

            } finally {

                setCargandoClientes(false);
            }
        },
        []
    );

    useEffect(() => {

        void cargarClientes();

    }, [cargarClientes]);

    // =====================================================
    // FORMULARIO MANUAL
    // =====================================================

    const manejarManual = (
        evento: ChangeEvent<HTMLInputElement>
    ) => {

        const { name, value } =
            evento.target;

        setReporteManual(
            (actual) => ({
                ...actual,
                [name]: value,
            })
        );
    };

    // =====================================================
    // PAÍS AUTOMÁTICO
    // =====================================================

    const manejarPaisAutomatico = (
        evento: ChangeEvent<HTMLInputElement>
    ) => {

        const valor =
            evento.target.value;

        setReporteAutomatico(
            (actual) => ({
                ...actual,
                pais: valor,
            })
        );
    };

    // =====================================================
    // CLIENTE AUTOMÁTICO
    // =====================================================

    const manejarClienteAutomatico = (
        evento: ChangeEvent<HTMLSelectElement>
    ) => {

        const clienteId =
            Number(
                evento.target.value
            );

        setReporteAutomatico(
            (actual) => ({
                ...actual,
                clienteId,
            })
        );
    };

    // =====================================================
    // PERIODO AUTOMÁTICO
    // =====================================================

    const manejarPeriodoAutomatico = (
        evento: ChangeEvent<HTMLSelectElement>
    ) => {

        const valor =
            evento.target.value;

        if (!esPeriodoAutomatico(valor)) {
            return;
        }

        setReporteAutomatico(
            (actual) => ({
                ...actual,
                periodo: valor,
            })
        );
    };

    // =====================================================
    // PERIODO MANUAL
    // =====================================================

    const manejarPeriodoManual = (
        evento: ChangeEvent<HTMLSelectElement>
    ) => {

        const valor =
            evento.target.value;

        if (!esPeriodoManual(valor)) {
            return;
        }

        setPeriodoReporte(
            valor
        );
    };

    // =====================================================
    // GENERAR REPORTE MANUAL
    // =====================================================

    const generarManual = async (
        evento: FormEvent<HTMLFormElement>
    ) => {

        evento.preventDefault();

        if (!responsable) {

            setError(
                'No se pudo identificar al administrador autenticado.'
            );

            return;
        }

        try {

            setGenerando(true);
            setError('');
            setContenido('');

            const datos: ReporteRequest = {
                ...reporteManual,
                responsable,
            };

            let resultado: string;

            switch (periodoReporte) {

                case 'trimestral':

                    resultado =
                        await reporteService
                            .generarTrimestral(
                                datos
                            );

                    break;

                case 'anual':

                    resultado =
                        await reporteService
                            .generarAnual(
                                datos
                            );

                    break;

                case 'mensual':
                default:

                    resultado =
                        await reporteService
                            .generarMensual(
                                datos
                            );

                    break;
            }

            setContenido(
                resultado
            );

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : 'No se pudo generar el reporte.'
            );

        } finally {

            setGenerando(false);
        }
    };

    // =====================================================
    // GENERAR REPORTE AUTOMÁTICO
    // =====================================================

    const generarAutomatico = async (
        evento: FormEvent<HTMLFormElement>
    ) => {

        evento.preventDefault();

        if (!responsable) {

            setError(
                'No se pudo identificar al administrador autenticado.'
            );

            return;
        }

        if (!reporteAutomatico.pais.trim()) {

            setError(
                'Debes ingresar un país.'
            );

            return;
        }

        if (reporteAutomatico.clienteId <= 0) {

            setError(
                'Debes seleccionar un cliente.'
            );

            return;
        }

        try {

            setGenerando(true);
            setError('');
            setContenido('');

            const resultado =
                await reporteService
                    .generarAutomatico(
                        reporteAutomatico
                    );

            setContenido(
                resultado
            );

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : 'No se pudo generar el reporte automático.'
            );

        } finally {

            setGenerando(false);
        }
    };

    // =====================================================
    // CAMBIAR TIPO DE REPORTE
    // =====================================================

    const cambiarTipo = (
        tipo: TipoReporte
    ) => {

        setTipoReporte(
            tipo
        );

        setError('');
        setContenido('');
    };

    // =====================================================
    // NOMBRE PERIODO MANUAL
    // =====================================================

    const obtenerNombrePeriodoManual = () => {

        switch (periodoReporte) {

            case 'trimestral':
                return 'trimestral';

            case 'anual':
                return 'anual';

            case 'mensual':
            default:
                return 'mensual';
        }
    };

    // =====================================================
    // NOMBRE PERIODO AUTOMÁTICO
    // =====================================================

    const obtenerNombrePeriodoAutomatico = () => {

        switch (reporteAutomatico.periodo) {

            case 'TRIMESTRAL':
                return 'trimestral';

            case 'ANUAL':
                return 'anual';

            case 'MENSUAL':
            default:
                return 'mensual';
        }
    };

    return (

        <main className="reportes-page">

            {/* ENCABEZADO */}

            <section className="reportes-header">

                <div>

                    <span>
                        SERF
                    </span>

                    <h2>
                        Reportes financieros
                    </h2>

                    <p>
                        Genera reportes financieros
                        manuales o automáticos.
                    </p>

                </div>

            </section>

            {/* SELECTOR */}

            <section className="reportes-selector">

                <button
                    type="button"
                    className={
                        tipoReporte === 'automatico'
                            ? 'reporte-tab active'
                            : 'reporte-tab'
                    }
                    onClick={() =>
                        cambiarTipo(
                            'automatico'
                        )
                    }
                >
                    Reporte automático
                </button>

                <button
                    type="button"
                    className={
                        tipoReporte === 'manual'
                            ? 'reporte-tab active'
                            : 'reporte-tab'
                    }
                    onClick={() =>
                        cambiarTipo(
                            'manual'
                        )
                    }
                >
                    Reporte manual
                </button>

            </section>

            {/* ERROR */}

            {error && (

                <div className="reportes-error">
                    {error}
                </div>

            )}

            {/* =============================================
                REPORTE AUTOMÁTICO
            ============================================= */}

            {tipoReporte === 'automatico' ? (

                <section className="reporte-form-container">

                    <div className="reporte-form-title">

                        <h3>
                            Reporte {
                            obtenerNombrePeriodoAutomatico()
                        } automático
                        </h3>

                        <p>
                            Selecciona el país, cliente y periodo.
                            SERF calculará automáticamente los
                            valores financieros utilizando las
                            compras registradas.
                        </p>

                    </div>

                    <form
                        className="reporte-form"
                        onSubmit={
                            generarAutomatico
                        }
                    >

                        {/* PAÍS */}

                        <div className="reporte-field">

                            <label
                                htmlFor="paisAutomatico"
                            >
                                País
                            </label>

                            <input
                                id="paisAutomatico"
                                name="pais"
                                value={
                                    reporteAutomatico.pais
                                }
                                onChange={
                                    manejarPaisAutomatico
                                }
                                placeholder="Ejemplo: Perú"
                                required
                            />

                        </div>

                        {/* CLIENTE */}

                        <div className="reporte-field">

                            <label
                                htmlFor="clienteAutomatico"
                            >
                                Cliente
                            </label>

                            <select
                                id="clienteAutomatico"
                                value={
                                    reporteAutomatico.clienteId
                                }
                                onChange={
                                    manejarClienteAutomatico
                                }
                                disabled={
                                    cargandoClientes
                                }
                                required
                            >

                                <option value={0}>

                                    {cargandoClientes
                                        ? 'Cargando clientes...'
                                        : 'Selecciona un cliente'}

                                </option>

                                {clientes.map(
                                    (cliente) => (

                                        <option
                                            key={
                                                cliente.id
                                            }
                                            value={
                                                cliente.id
                                            }
                                        >
                                            {cliente.nombre}
                                            {' - '}
                                            {cliente.empresa}
                                        </option>
                                    )
                                )}

                            </select>

                        </div>

                        {/* PERIODO */}

                        <div className="reporte-field">

                            <label
                                htmlFor="periodoAutomatico"
                            >
                                Tipo de reporte
                            </label>

                            <select
                                id="periodoAutomatico"
                                value={
                                    reporteAutomatico.periodo
                                }
                                onChange={
                                    manejarPeriodoAutomatico
                                }
                            >

                                <option value="MENSUAL">
                                    Mensual
                                </option>

                                <option value="TRIMESTRAL">
                                    Trimestral
                                </option>

                                <option value="ANUAL">
                                    Anual
                                </option>

                            </select>

                        </div>

                        {/* RESPONSABLE */}

                        <div className="reporte-field">

                            <label
                                htmlFor="responsableAutomatico"
                            >
                                Responsable
                            </label>

                            <input
                                id="responsableAutomatico"
                                type="text"
                                value={
                                    responsable
                                }
                                readOnly
                            />

                        </div>

                        {/* BOTÓN */}

                        <div className="reporte-form-actions">

                            <button
                                type="submit"
                                disabled={
                                    generando
                                    || cargandoClientes
                                }
                            >
                                {generando
                                    ? 'Generando...'
                                    : `Generar reporte ${
                                        obtenerNombrePeriodoAutomatico()
                                    }`}
                            </button>

                        </div>

                    </form>

                </section>

            ) : (

                /* =============================================
                    REPORTE MANUAL
                ============================================= */

                <section className="reporte-form-container">

                    <div className="reporte-form-title">

                        <h3>
                            Reporte {
                            obtenerNombrePeriodoManual()
                        } manual
                        </h3>

                        <p>
                            Selecciona el periodo e ingresa
                            manualmente los valores financieros.
                        </p>

                    </div>

                    <form
                        className="reporte-form"
                        onSubmit={
                            generarManual
                        }
                    >

                        {/* PERIODO */}

                        <div className="reporte-field">

                            <label
                                htmlFor="periodoReporte"
                            >
                                Tipo de reporte
                            </label>

                            <select
                                id="periodoReporte"
                                value={
                                    periodoReporte
                                }
                                onChange={
                                    manejarPeriodoManual
                                }
                            >

                                <option value="mensual">
                                    Mensual
                                </option>

                                <option value="trimestral">
                                    Trimestral
                                </option>

                                <option value="anual">
                                    Anual
                                </option>

                            </select>

                        </div>

                        {/* PAÍS */}

                        <div className="reporte-field">

                            <label
                                htmlFor="paisManual"
                            >
                                País
                            </label>

                            <input
                                id="paisManual"
                                name="pais"
                                value={
                                    reporteManual.pais
                                }
                                onChange={
                                    manejarManual
                                }
                                placeholder="Ejemplo: Perú"
                                required
                            />

                        </div>

                        {/* RESPONSABLE */}

                        <div className="reporte-field">

                            <label
                                htmlFor="responsableManual"
                            >
                                Responsable
                            </label>

                            <input
                                id="responsableManual"
                                type="text"
                                value={
                                    responsable
                                }
                                readOnly
                            />

                        </div>

                        {/* INGRESOS */}

                        <div className="reporte-field">

                            <label
                                htmlFor="ingresos"
                            >
                                Ingresos
                            </label>

                            <input
                                id="ingresos"
                                name="ingresos"
                                type="number"
                                min="0"
                                step="0.01"
                                value={
                                    reporteManual.ingresos
                                }
                                onChange={
                                    manejarManual
                                }
                                placeholder="Ejemplo: 15000"
                                required
                            />

                        </div>

                        {/* GASTOS */}

                        <div className="reporte-field">

                            <label
                                htmlFor="gastos"
                            >
                                Gastos
                            </label>

                            <input
                                id="gastos"
                                name="gastos"
                                type="number"
                                min="0"
                                step="0.01"
                                value={
                                    reporteManual.gastos
                                }
                                onChange={
                                    manejarManual
                                }
                                placeholder="Ejemplo: 8000"
                                required
                            />

                        </div>

                        {/* BOTÓN */}

                        <div className="reporte-form-actions">

                            <button
                                type="submit"
                                disabled={
                                    generando
                                }
                            >
                                {generando
                                    ? 'Generando...'
                                    : `Generar reporte ${
                                        obtenerNombrePeriodoManual()
                                    }`}
                            </button>

                        </div>

                    </form>

                </section>

            )}

            {/* =============================================
                RESULTADO
            ============================================= */}

            {contenido && (

                <section className="reporte-resultado">

                    <div className="reporte-resultado-header">

                        <div>

                            <span>
                                REPORTE GENERADO
                            </span>

                            <h3>
                                Resultado
                            </h3>

                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setContenido('')
                            }
                        >
                            Limpiar
                        </button>

                    </div>

                    <pre>
                        {contenido}
                    </pre>

                </section>

            )}

        </main>
    );
}