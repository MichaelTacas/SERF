import type { Solicitud } from "../interfaces/Solicitud";
import { authService } from "../services/authService";

interface SolicitudEstadoActionProps {
    solicitud: Solicitud;

    onCambiarEstado: (
        solicitud: Solicitud,
        nuevoEstado: Solicitud["estado"]
    ) => Promise<void>;
}

function SolicitudEstadoAction({
                                   solicitud,
                                   onCambiarEstado
                               }: SolicitudEstadoActionProps) {

    // =========================================
    // USUARIO AUTENTICADO
    // =========================================

    const usuario = authService.obtenerUsuario();

    const esAdministrador =
        usuario?.rol === "ADMINISTRADOR";

    const esTecnico =
        usuario?.rol === "TECNICO";

    // =========================================
    // SOLICITUD CERRADA
    // =========================================

    if (solicitud.estado === "CERRADA") {
        return (
            <span className="sin-accion">
                Finalizada
            </span>
        );
    }

    // =========================================
    // ACCIONES DEL TÉCNICO
    // =========================================

    if (esTecnico) {

        if (solicitud.estado === "PENDIENTE") {
            return (
                <button
                    className="btn-estado"
                    type="button"
                    onClick={() =>
                        onCambiarEstado(
                            solicitud,
                            "EN_PROCESO"
                        )
                    }
                >
                    Iniciar atención
                </button>
            );
        }

        if (solicitud.estado === "EN_PROCESO") {
            return (
                <button
                    className="btn-estado"
                    type="button"
                    onClick={() =>
                        onCambiarEstado(
                            solicitud,
                            "RESUELTA"
                        )
                    }
                >
                    Marcar resuelta
                </button>
            );
        }

        if (solicitud.estado === "RESUELTA") {
            return (
                <span className="sin-accion">
                    Pendiente de cierre
                </span>
            );
        }
    }

    // =========================================
    // ACCIONES DEL ADMINISTRADOR
    // =========================================

    if (esAdministrador) {

        if (solicitud.estado === "RESUELTA") {
            return (
                <button
                    className="btn-estado"
                    type="button"
                    onClick={() =>
                        onCambiarEstado(
                            solicitud,
                            "CERRADA"
                        )
                    }
                >
                    Cerrar solicitud
                </button>
            );
        }

        if (solicitud.estado === "PENDIENTE") {
            return (
                <span className="sin-accion">
                    Pendiente de atención
                </span>
            );
        }

        if (solicitud.estado === "EN_PROCESO") {
            return (
                <span className="sin-accion">
                    En atención
                </span>
            );
        }
    }

    return (
        <span className="sin-accion">
            Sin acciones
        </span>
    );
}

export default SolicitudEstadoAction;