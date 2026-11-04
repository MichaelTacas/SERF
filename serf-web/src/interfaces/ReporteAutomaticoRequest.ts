export interface ReporteAutomaticoRequest {
    pais: string;
    clienteId: number;
    periodo: 'MENSUAL' | 'TRIMESTRAL' | 'ANUAL';
}