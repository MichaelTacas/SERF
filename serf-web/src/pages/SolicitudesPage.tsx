
import { useEffect, useState } from "react";

import SolicitudForm from "../components/SolicitudForm";
import SolicitudEstadoAction from "../components/SolicitudEstadoAction";

import type { Solicitud } from "../interfaces/Solicitud";
import type { SolicitudRequest } from "../interfaces/SolicitudRequest";

import { solicitudService } from "../services/solicitudService";
import { authService } from "../services/authService";

import "../styles/Solicitudes.css";

export default function SolicitudesPage() {

    const [solicitudes, setSolicitudes] =
        useState<Solicitud[]>([]);

    const [cargando, setCargando] =
        useState(true);

    const [error, setError] =
        useState("");

    // =========================================
    // USUARIO AUTENTICADO Y ROL
    // =========================================

    const usuario = authService.obtenerUsuario();

    const esAdministrador =
        usuario?.rol === "ADMINISTRADOR";

    // =========================================
    // CARGAR SOLICITUDES
    // =========================================

    useEffect(() => {

        const cargarSolicitudes = async () => {

            try {

                const datos =
                    await solicitudService.listar();

                setSolicitudes(datos);

            } catch {

                setError(
                    "No se pudieron cargar las solicitudes"
                );

            } finally {

                setCargando(false);
            }
        };

        cargarSolicitudes();

    }, []);

    // =========================================
    // REGISTRAR SOLICITUD
    // =========================================

    const registrarSolicitud = async (
        solicitudRequest: SolicitudRequest
    ) => {

        const nuevaSolicitud =
            await solicitudService.registrar(
                solicitudRequest
            );

        setSolicitudes(
            (solicitudesActuales) => [
                ...solicitudesActuales,
                nuevaSolicitud
            ]
        );
    };

    // =========================================
    // CAMBIAR ESTADO DE SOLICITUD
    // =========================================

    const cambiarEstado = async (
        solicitud: Solicitud,
        nuevoEstado: Solicitud["estado"]
    ) => {

        try {

            setError("");

            const solicitudActualizada =
                await solicitudService.actualizar(
                    solicitud.id,
                    {
                        titulo: solicitud.titulo,
                        descripcion: solicitud.descripcion,
                        prioridad: solicitud.prioridad,
                        clienteId: solicitud.clienteId,
                        tecnicoId: solicitud.tecnicoId,
                        estado: nuevoEstado
                    }
                );

            setSolicitudes(
                (solicitudesActuales) =>
                    solicitudesActuales.map(
                        (item) =>
                            item.id ===
                            solicitudActualizada.id
                                ? solicitudActualizada
                                : item
                    )
            );

        } catch (error) {

            if (error instanceof Error) {

                setError(error.message);

            } else {

                setError(
                    "No se pudo actualizar el estado"
                );
            }
        }
    };

    // =========================================
    // VISTA
    // =========================================

    return (
        <main className="solicitudes-page">

            <header className="page-header">

                <h1>
                    Sistema de Soporte Técnico
                </h1>

                <p>
                    {esAdministrador
                        ? "Gestión y seguimiento de solicitudes de soporte"
                        : "Solicitudes asignadas y seguimiento técnico"}
                </p>

            </header>

            {/* Solo el administrador registra solicitudes */}
            {esAdministrador && (
                <SolicitudForm
                    onRegistrar={registrarSolicitud}
                />
            )}

            <section className="table-card">

                <h2>
                    {esAdministrador
                        ? "Solicitudes registradas"
                        : "Solicitudes de soporte"}
                </h2>

                {cargando && (
                    <p>
                        Cargando solicitudes...
                    </p>
                )}

                {error && (
                    <p>
                        {error}
                    </p>
                )}

                {!cargando && !error && (

                    <div className="table-container">

                        <table className="solicitudes-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Título</th>
                                    <th>Prioridad</th>
                                    <th>Estado</th>
                                    <th>Cliente</th>
                                    <th>Técnico</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>

                                {solicitudes.map(
                                    (solicitud) => (

                                        <tr key={solicitud.id}>

                                            <td>
                                                {solicitud.id}
                                            </td>

                                            <td>
                                                {solicitud.titulo}
                                            </td>

                                            <td>
                                                <span className="prioridad">
                                                    {solicitud.prioridad}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="estado">
                                                    {solicitud.estado}
                                                </span>
                                            </td>

                                            <td>
                                                {solicitud.clienteNombre}
                                            </td>

                                            <td>
                                                {solicitud.tecnicoNombre ??
                                                    "Sin asignar"}
                                            </td>

                                            <td>
                                                <SolicitudEstadoAction
                                                    solicitud={solicitud}
                                                    onCambiarEstado={
                                                        cambiarEstado
                                                    }
                                                />
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
