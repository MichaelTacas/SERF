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
     * El responsable ya no se escribe manualmente.
     * Se obtiene de la sesión actual.
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

            const resultado =
                await reporteService.generarMensual(
                    datos
                );

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
                        Genera reportes mensuales
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
                            Reporte mensual manual
                        </h3>

                        <p>
                            Ingresa manualmente los valores
                            financieros que formarán parte
                            del reporte.
                        </p>

                    </div>


                    <form
                        className="reporte-form"
                        onSubmit={generarManual}
                    >

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
                                    : 'Generar reporte manual'}
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