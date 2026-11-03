import { apiClient } from './apiClient';

import type { ReporteRequest } from '../interfaces/ReporteRequest';
import type { ReporteAutomaticoRequest } from '../interfaces/ReporteAutomaticoRequest';

export const reporteService = {

    generarMensual(
        datos: ReporteRequest
    ): Promise<string> {

        return apiClient.postText(
            '/api/reportes/mensual',
            datos
        );
    },

    generarMensualAutomatico(
        datos: ReporteAutomaticoRequest
    ): Promise<string> {

        return apiClient.postText(
            '/api/reportes/mensual/automatico',
            datos
        );
    },

};