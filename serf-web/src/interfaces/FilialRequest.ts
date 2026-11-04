export interface FilialRequest {
    codigo: string;
    nombre: string;
    pais: string;
    monedaLocal: 'PEN' | 'USD' | 'EUR' | 'CNY';
    ciudad: string;
    activa: boolean;
}