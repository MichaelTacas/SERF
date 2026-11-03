import type { CategoriaProducto } from './Producto';

export interface ProductoRequest {
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
}