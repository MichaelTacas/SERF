import {
    useState,
} from 'react';

import type {
    ChangeEvent,
    FormEvent,
} from 'react';

import type { ReporteRequest } from '../interfaces/ReporteRequest';
import type { ReporteAutomaticoRequest } from '../interfaces/ReporteAutomaticoRequest';

import { reporteService } from '../services/reporteService';
import { authService } from '../services/authService';

import '../styles/ReportesPage.css';

type TipoReporte =
    | 'automatico'
    | 'manual';

type PeriodoReporte =
    | 'mensual'
    | 'trimestral'
    | 'anual';

const reporteManualInicial: ReporteRequest = {
    pais: '',
    ingresos: '',
    gastos: '',
    responsable: '',
};

const reporteAutomaticoInicial: ReporteAutomaticoRequest = {
    pais: '',
    responsable: '',
};

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
    ] =
        useState<ReporteAutomaticoRequest>(
            reporteAutomaticoInicial
        );

    const [contenido, setContenido] =
        useState('');

    const [generando, setGenerando] =
        useState(false);

    const [error, setError] =
        useState('');

    /*
     * El responsable se obtiene
     * automáticamente de la sesión.
     */
    const usuarioAutenticado =
        authService.obtenerUsuario();

    const responsable =
        usuarioAutenticado?.email ?? '';

    const manejarManual = (
        evento: ChangeEvent<HTMLInputElement>
    ) => {

        const { name, value } =
            evento.target;

        setReporteManual((actual) => ({
            ...actual,
            [name]: value,
        }));
    };

    const manejarAutomatico = (
        evento: ChangeEvent<HTMLInputElement>
    ) => {

        const { name, value } =
            evento.target;

        setReporteAutomatico((actual) => ({
            ...actual,
            [name]: value,
        }));
    };

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
                            .generarTrimestral(datos);

                    break;

                case 'anual':

                    resultado =
                        await reporteService
                            .generarAnual(datos);

                    break;

                case 'mensual':
                default:

                    resultado =
                        await reporteService
                            .generarMensual(datos);

                    break;
            }

            setContenido(resultado);

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

        try {

            setGenerando(true);
            setError('');
            setContenido('');

            const datos: ReporteAutomaticoRequest = {
                ...reporteAutomatico,
                responsable,
            };

            const resultado =
                await reporteService
                    .generarMensualAutomatico(
                        datos
                    );

            setContenido(resultado);

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

    const cambiarTipo = (
        tipo: TipoReporte
    ) => {

        setTipoReporte(tipo);
        setError('');
        setContenido('');
    };

    const obtenerNombrePeriodo = () => {

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

    return (
        <main className="reportes-page">

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

            <section className="reportes-selector">

                <button
                    type="button"
                    className={
                        tipoReporte === 'automatico'
                            ? 'reporte-tab active'
                            : 'reporte-tab'
                    }
                    onClick={() =>
                        cambiarTipo('automatico')
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
                        cambiarTipo('manual')
                    }
                >
                    Reporte manual
                </button>

            </section>

            {error && (

                <div className="reportes-error">
                    {error}
                </div>

            )}

            {tipoReporte === 'automatico' ? (

                <section className="reporte-form-container">

                    <div className="reporte-form-title">

                        <h3>
                            Reporte mensual automático
                        </h3>

                        <p>
                            Los ingresos y gastos se obtendrán
                            automáticamente desde la información
                            registrada en SERF.
                        </p>

                    </div>

                    <form
                        className="reporte-form"
                        onSubmit={generarAutomatico}
                    >

                        <div className="reporte-field">

                            <label htmlFor="paisAutomatico">
                                País
                            </label>

                            <input
                                id="paisAutomatico"
                                name="pais"
                                value={
                                    reporteAutomatico.pais
                                }
                                onChange={
                                    manejarAutomatico
                                }
                                placeholder="Ejemplo: Perú"
                                required
                            />

                        </div>

                        <div className="reporte-field">

                            <label htmlFor="responsableAutomatico">
                                Responsable
                            </label>

                            <input
                                id="responsableAutomatico"
                                type="text"
                                value={responsable}
                                readOnly
                            />

                        </div>

                        <div className="reporte-form-actions">

                            <button
                                type="submit"
                                disabled={generando}
                            >
                                {generando
                                    ? 'Generando...'
                                    : 'Generar reporte automático'}
                            </button>

                        </div>

                    </form>

                </section>

            ) : (

                <section className="reporte-form-container">

                    <div className="reporte-form-title">

                        <h3>
                            Reporte {obtenerNombrePeriodo()} manual
                        </h3>

                        <p>
                            Selecciona el periodo e ingresa
                            los valores financieros que formarán
                            parte del reporte.
                        </p>

                    </div>

                    <form
                        className="reporte-form"
                        onSubmit={generarManual}
                    >

                        <div className="reporte-field">

                            <label htmlFor="periodoReporte">
                                Tipo de reporte
                            </label>

                            <select
                                id="periodoReporte"
                                value={periodoReporte}
                                onChange={(evento) =>
                                    setPeriodoReporte(evento.target.value as PeriodoReporte)
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

                        <div className="reporte-field">

                            <label htmlFor="paisManual">
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

                        <div className="reporte-field">

                            <label htmlFor="responsableManual">
                                Responsable
                            </label>

                            <input
                                id="responsableManual"
                                type="text"
                                value={responsable}
                                readOnly
                            />

                        </div>

                        <div className="reporte-field">

                            <label htmlFor="ingresos">
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

                        <div className="reporte-field">

                            <label htmlFor="gastos">
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

                        <div className="reporte-form-actions">

                            <button
                                type="submit"
                                disabled={generando}
                            >
                                {generando
                                    ? 'Generando...'
                                    : `Generar reporte ${obtenerNombrePeriodo()}`}
                            </button>

                        </div>

                    </form>

                </section>

            )}

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