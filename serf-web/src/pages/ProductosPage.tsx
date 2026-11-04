import {
    useCallback,
    useEffect,
    useState,
} from 'react';

import type {
    ChangeEvent,
    FormEvent,
} from 'react';

import type {
    Producto,
    CategoriaProducto,
} from '../interfaces/Producto';

import type { ProductoRequest } from '../interfaces/ProductoRequest';
import type { Filial } from '../interfaces/Filial';

import { productoService } from '../services/productoService';
import { filialService } from '../services/filialService';
import { authService } from '../services/authService';

import '../styles/ProductosPage.css';

const formularioInicial: ProductoRequest = {
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria: 'LAPTOP',
    costoImportacion: 0,
    precioVenta: 0,
    proveedor: '',
    fechaImportacion: '',
    stock: 0,
    filialId: 0,
};

const categorias: CategoriaProducto[] = [
    'LAPTOP',
    'SMARTPHONE',
    'ACCESORIO',
    'REDES',
    'OTRO',
];

export function ProductosPage() {

    const [productos, setProductos] =
        useState<Producto[]>([]);

    const [filiales, setFiliales] =
        useState<Filial[]>([]);

    const [formulario, setFormulario] =
        useState<ProductoRequest>(formularioInicial);

    const [productoEditando, setProductoEditando] =
        useState<number | null>(null);

    const [cargando, setCargando] =
        useState(true);

    const [guardando, setGuardando] =
        useState(false);

    const [error, setError] =
        useState('');

    const esAdministrador =
        authService.esAdministrador();

    const cargarDatos = useCallback(async () => {

        try {

            setCargando(true);
            setError('');

            /*
             * El administrador necesita productos
             * y filiales porque puede crear y editar.
             *
             * El vendedor solamente necesita consultar
             * los productos.
             */
            if (esAdministrador) {

                const [
                    productosRespuesta,
                    filialesRespuesta,
                ] = await Promise.all([
                    productoService.listar(),
                    filialService.listar(),
                ]);

                setProductos(productosRespuesta);
                setFiliales(filialesRespuesta);

            } else {

                const productosRespuesta =
                    await productoService.listar();

                setProductos(productosRespuesta);
                setFiliales([]);

            }

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : 'No se pudieron cargar los productos.'
            );

        } finally {

            setCargando(false);

        }

    }, [esAdministrador]);

    useEffect(() => {
        void cargarDatos();
    }, [cargarDatos]);

    const manejarCambio = (
        evento:
            ChangeEvent<HTMLInputElement> |
            ChangeEvent<HTMLSelectElement> |
            ChangeEvent<HTMLTextAreaElement>
    ) => {

        const { name, value } =
            evento.target;

        const camposNumericos = [
            'costoImportacion',
            'precioVenta',
            'stock',
            'filialId',
        ];

        setFormulario((actual) => ({
            ...actual,
            [name]:
                camposNumericos.includes(name)
                    ? Number(value)
                    : value,
        }));
    };

    const limpiarFormulario = () => {

        setFormulario(formularioInicial);
        setProductoEditando(null);

    };

    const guardarProducto = async (
        evento: FormEvent<HTMLFormElement>
    ) => {

        evento.preventDefault();

        if (!esAdministrador) {

            setError(
                'No tienes permisos para modificar productos.'
            );

            return;
        }

        if (formulario.filialId <= 0) {

            setError(
                'Debes seleccionar una filial.'
            );

            return;
        }

        try {

            setGuardando(true);
            setError('');

            if (productoEditando !== null) {

                await productoService.actualizar(
                    productoEditando,
                    formulario
                );

            } else {

                await productoService.crear(
                    formulario
                );

            }

            limpiarFormulario();

            await cargarDatos();

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : 'No se pudo guardar el producto.'
            );

        } finally {

            setGuardando(false);

        }
    };

    const editarProducto = (
        producto: Producto
    ) => {

        if (!esAdministrador) {
            return;
        }

        setProductoEditando(producto.id);

        setFormulario({
            codigo: producto.codigo,
            nombre: producto.nombre,
            descripcion: producto.descripcion ?? '',
            categoria: producto.categoria,
            costoImportacion: producto.costoImportacion,
            precioVenta: producto.precioVenta,
            proveedor: producto.proveedor,
            fechaImportacion: producto.fechaImportacion,
            stock: producto.stock,
            filialId: producto.filialId,
        });
    };

    const eliminarProducto = async (
        producto: Producto
    ) => {

        if (!esAdministrador) {
            return;
        }

        const confirmar =
            window.confirm(
                `¿Deseas eliminar el producto ${producto.nombre}?`
            );

        if (!confirmar) {
            return;
        }

        try {

            setError('');

            await productoService.eliminar(
                producto.id
            );

            if (
                productoEditando === producto.id
            ) {

                limpiarFormulario();

            }

            await cargarDatos();

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : 'No se pudo eliminar el producto.'
            );

        }
    };

    return (
        <main className="productos-page">

            <section className="productos-header">

                <div>

                    <span>SERF</span>

                    <h2>Productos</h2>

                    <p>
                        {esAdministrador
                            ? 'Gestiona los productos e inventario de las filiales.'
                            : 'Consulta productos, precios y disponibilidad de stock.'}
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() =>
                        void cargarDatos()
                    }
                    disabled={cargando}
                >
                    {cargando
                        ? 'Actualizando...'
                        : 'Actualizar'}
                </button>

            </section>

            {error && (
                <div className="productos-error">
                    {error}
                </div>
            )}

            {/*
        Solo el administrador puede registrar
        o modificar productos.
      */}
            {esAdministrador && (

                <section className="producto-form-container">

                    <div className="producto-form-title">

                        <h3>
                            {productoEditando !== null
                                ? 'Editar producto'
                                : 'Nuevo producto'}
                        </h3>

                        <p>
                            Completa la información del producto.
                        </p>

                    </div>

                    <form
                        className="producto-form"
                        onSubmit={guardarProducto}
                    >

                        <div className="producto-field">

                            <label htmlFor="codigo">
                                Código
                            </label>

                            <input
                                id="codigo"
                                name="codigo"
                                value={formulario.codigo}
                                onChange={manejarCambio}
                                required
                            />

                        </div>

                        <div className="producto-field">

                            <label htmlFor="nombre">
                                Nombre
                            </label>

                            <input
                                id="nombre"
                                name="nombre"
                                value={formulario.nombre}
                                onChange={manejarCambio}
                                required
                            />

                        </div>

                        <div className="producto-field">

                            <label htmlFor="categoria">
                                Categoría
                            </label>

                            <select
                                id="categoria"
                                name="categoria"
                                value={formulario.categoria}
                                onChange={manejarCambio}
                                required
                            >

                                {categorias.map(
                                    (categoria) => (

                                        <option
                                            key={categoria}
                                            value={categoria}
                                        >
                                            {categoria}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                        <div className="producto-field">

                            <label htmlFor="filialId">
                                Filial
                            </label>

                            <select
                                id="filialId"
                                name="filialId"
                                value={formulario.filialId}
                                onChange={manejarCambio}
                                required
                            >

                                <option value={0}>
                                    Selecciona una filial
                                </option>

                                {filiales.map(
                                    (filial) => (

                                        <option
                                            key={filial.id}
                                            value={filial.id}
                                        >
                                            {filial.nombre}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                        <div className="producto-field">

                            <label htmlFor="costoImportacion">
                                Costo de importación (CNY)
                            </label>

                            <input
                                id="costoImportacion"
                                name="costoImportacion"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formulario.costoImportacion}
                                onChange={manejarCambio}
                                required
                            />

                        </div>

                        <div className="producto-field">

                            <label htmlFor="precioVenta">
                                Precio de venta
                            </label>

                            <input
                                id="precioVenta"
                                name="precioVenta"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formulario.precioVenta}
                                onChange={manejarCambio}
                                required
                            />

                        </div>

                        <div className="producto-field">

                            <label htmlFor="stock">
                                Stock
                            </label>

                            <input
                                id="stock"
                                name="stock"
                                type="number"
                                min="0"
                                value={formulario.stock}
                                onChange={manejarCambio}
                                required
                            />

                        </div>

                        <div className="producto-field">

                            <label htmlFor="proveedor">
                                Proveedor
                            </label>

                            <input
                                id="proveedor"
                                name="proveedor"
                                value={formulario.proveedor}
                                onChange={manejarCambio}
                                required
                            />

                        </div>

                        <div className="producto-field">

                            <label htmlFor="fechaImportacion">
                                Fecha de importación
                            </label>

                            <input
                                id="fechaImportacion"
                                name="fechaImportacion"
                                type="date"
                                value={formulario.fechaImportacion}
                                onChange={manejarCambio}
                                required
                            />

                        </div>

                        <div className="producto-field producto-description">

                            <label htmlFor="descripcion">
                                Descripción
                            </label>

                            <textarea
                                id="descripcion"
                                name="descripcion"
                                value={formulario.descripcion}
                                onChange={manejarCambio}
                                rows={3}
                            />

                        </div>

                        <div className="producto-form-actions">

                            {productoEditando !== null && (

                                <button
                                    type="button"
                                    className="producto-cancel"
                                    onClick={limpiarFormulario}
                                >
                                    Cancelar
                                </button>

                            )}

                            <button
                                type="submit"
                                className="producto-save"
                                disabled={guardando}
                            >
                                {guardando
                                    ? 'Guardando...'
                                    : productoEditando !== null
                                        ? 'Actualizar producto'
                                        : 'Registrar producto'}
                            </button>

                        </div>

                    </form>

                </section>

            )}

            <section className="productos-table-container">

                <div className="productos-table-title">

                    <h3>
                        Productos registrados
                    </h3>

                    <p>
                        Total: {productos.length}
                    </p>

                </div>

                {cargando ? (

                    <div className="productos-message">
                        Cargando productos...
                    </div>

                ) : productos.length === 0 ? (

                    <div className="productos-message">
                        No existen productos registrados.
                    </div>

                ) : (

                    <div className="productos-table-wrapper">

                        <table className="productos-table">

                            <thead>

                            <tr>
                                <th>Código</th>
                                <th>Producto</th>
                                <th>Categoría</th>
                                <th>Filial</th>

                                {esAdministrador && (
                                    <>
                                        <th>Costo CNY</th>
                                        <th>Costo EUR</th>
                                    </>
                                )}

                                <th>Precio</th>
                                <th>Stock</th>

                                {esAdministrador && (
                                    <th>Acciones</th>
                                )}
                            </tr>

                            </thead>

                            <tbody>

                            {productos.map(
                                (producto) => (

                                    <tr key={producto.id}>

                                        <td>
                                            {producto.codigo}
                                        </td>

                                        <td>
                                            {producto.nombre}
                                        </td>

                                        <td>
                                            {producto.categoria}
                                        </td>

                                        <td>
                                            {producto.filialNombre}
                                        </td>

                                        {esAdministrador && (
                                            <>
                                                <td>
                                                    {Number(
                                                        producto.costoImportacion
                                                    ).toFixed(2)} CNY
                                                </td>

                                                <td>
                                                    {Number(
                                                        producto.costoImportacionEur
                                                    ).toFixed(2)} EUR
                                                </td>
                                            </>
                                        )}

                                        <td>
                                            {Number(
                                                producto.precioVenta
                                            ).toFixed(2)}
                                        </td>

                                        <td>
                                            {producto.stock}
                                        </td>

                                        {esAdministrador && (

                                            <td>

                                                <div className="producto-actions">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            editarProducto(producto)
                                                        }
                                                    >
                                                        Editar
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="producto-delete"
                                                        onClick={() =>
                                                            void eliminarProducto(
                                                                producto
                                                            )
                                                        }
                                                    >
                                                        Eliminar
                                                    </button>

                                                </div>

                                            </td>

                                        )}

                                    </tr>

                                )
                            )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

        </main>
    );
}