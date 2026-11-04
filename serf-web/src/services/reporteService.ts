import { apiClient } from './apiClient';

import type { ReporteRequest } from '../interfaces/ReporteRequest';
import type { ReporteAutomaticoRequest } from '../interfaces/ReporteAutomaticoRequest';

export const reporteService = {

    // =====================================================
    // REPORTE MENSUAL MANUAL
    // =====================================================

    generarMensual(
        datos: ReporteRequest
    ): Promise<string> {

        return apiClient.postText(
            '/api/reportes/mensual',
            datos
        );
    },

    // =====================================================
    // REPORTE TRIMESTRAL MANUAL
    // =====================================================

    generarTrimestral(
        datos: ReporteRequest
    ): Promise<string> {

        return apiClient.postText(
            '/api/reportes/trimestral',
            datos
        );
    },

    // =====================================================
    // REPORTE ANUAL MANUAL
    // =====================================================

    generarAnual(
        datos: ReporteRequest
    ): Promise<string> {

        return apiClient.postText(
            '/api/reportes/anual',
            datos
        );
    },

    // =====================================================
    // REPORTE AUTOMÁTICO
    // CLIENTE + PERIODO
    // =====================================================

    generarAutomatico(
        datos: ReporteAutomaticoRequest
    ): Promise<string> {

        return apiClient.postText(
            '/api/reportes/automatico',
            datos
        );
    },

};