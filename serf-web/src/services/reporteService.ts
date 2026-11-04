import { apiClient } from './apiClient';

import type { ReporteRequest } from '../interfaces/ReporteRequest';
import type { ReporteAutomaticoRequest } from '../interfaces/ReporteAutomaticoRequest';

export const reporteService = {

    // Reporte mensual manual
    generarMensual(
        datos: ReporteRequest
    ): Promise<string> {

        return apiClient.postText(
            '/api/reportes/mensual',
            datos
        );
    },

    // Reporte trimestral manual
    generarTrimestral(
        datos: ReporteRequest
    ): Promise<string> {

        return apiClient.postText(
            '/api/reportes/trimestral',
            datos
        );
    },

    // Reporte anual manual
    generarAnual(
        datos: ReporteRequest
    ): Promise<string> {

        return apiClient.postText(
            '/api/reportes/anual',
            datos
        );
    },

    // Reporte mensual automático
    generarMensualAutomatico(
        datos: ReporteAutomaticoRequest
    ): Promise<string> {

        return apiClient.postText(
            '/api/reportes/mensual/automatico',
            datos
        );
    },

};