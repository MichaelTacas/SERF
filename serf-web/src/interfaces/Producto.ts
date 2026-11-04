export type CategoriaProducto =
    | 'LAPTOP'
    | 'SMARTPHONE'
    | 'ACCESORIO'
    | 'REDES'
    | 'OTRO';

export interface Producto {
    id: number;
    codigo: string;
    nombre: string;
    descripcion: string;
    categoria: CategoriaProducto;
    costoImportacion: number;
    precioVenta: number;
    proveedor: string;
    fechaImportacion: string;
    stock: number;
    filialId: number;
    filialNombre: string;
    costoImportacionEur: number;
}