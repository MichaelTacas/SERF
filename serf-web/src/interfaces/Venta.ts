export type MetodoPago =
    | 'EFECTIVO'
    | 'TARJETA_CREDITO'
    | 'TARJETA_DEBITO'
    | 'TRANSFERENCIA_BANCARIA'
    | 'OTRO';

export interface Venta {
    id: number;
    numeroFactura: string;
    fechaVenta: string;

    productoId: number;
    productoNombre: string;

    cantidad: number;
    precioUnitario: number;
    total: number;

    clienteId: number;
    clienteNombre: string;

    vendedorId: number;
    vendedorEmail: string;

    filialId: number;
    filialNombre: string;

    metodoPago: MetodoPago;
}