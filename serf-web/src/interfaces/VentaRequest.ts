import type { MetodoPago } from './Venta';

export interface VentaRequest {
    numeroFactura: string;
    fechaVenta: string;
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    clienteId: number;
    vendedorId: number;
    metodoPago: MetodoPago;
}