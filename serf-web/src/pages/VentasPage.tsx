import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

import type {
    ChangeEvent,
    FormEvent,
} from 'react';

import type { Venta } from '../interfaces/Venta';
import type { VentaRequest } from '../interfaces/VentaRequest';
import type { Producto } from '../interfaces/Producto';
import type { Cliente } from '../interfaces/Cliente';

import { ventaService } from '../services/ventaService';
import { productoService } from '../services/productoService';
import { clienteService } from '../services/clienteService';
import { authService } from '../services/authService';

import '../styles/VentasPage.css';


function obtenerFechaActual(): string {

    const ahora = new Date();

    const fechaLocal = new Date(
        ahora.getTime() -
        ahora.getTimezoneOffset() * 60000
    );

    return fechaLocal
        .toISOString()
        .slice(0, 16);
}


function crearFormularioInicial(): VentaRequest {

    return {
        numeroFactura: '',
        fechaVenta: obtenerFechaActual(),
        productoId: 0,
        cantidad: 1,
        precioUnitario: 0,
        clienteId: 0,
        vendedorId: 0,
        metodoPago: 'EFECTIVO',
    };
}


export function VentasPage() {

    const [ventas, setVentas] =
        useState<Venta[]>([]);

    const [productos, setProductos] =
        useState<Producto[]>([]);

    const [clientes, setClientes] =
        useState<Cliente[]>([]);

    const [formulario, setFormulario] =
        useState<VentaRequest>(
            crearFormularioInicial()
        );

    const [cargando, setCargando] =
        useState(true);

    const [guardando, setGuardando] =
        useState(false);

    const [error, setError] =
        useState('');

    const [mensaje, setMensaje] =
        useState('');

    const esVendedor =
        authService.esVendedor();


    /*
     * ADMINISTRADOR:
     * solo necesita consultar las ventas.
     *
     * VENDEDOR:
     * necesita ventas, productos y clientes
     * para registrar una operación.
     */
    const cargarDatos = useCallback(
        async () => {

            try {

                setCargando(true);
                setError('');

                if (esVendedor) {

                    const [
                        ventasRespuesta,
                        productosRespuesta,
                        clientesRespuesta,
                    ] = await Promise.all([
                        ventaService.listar(),
                        productoService.listar(),
                        clienteService.listar(),
                    ]);

                    setVentas(ventasRespuesta);
                    setProductos(productosRespuesta);
                    setClientes(clientesRespuesta);

                } else {

                    const ventasRespuesta =
                        await ventaService.listar();

                    setVentas(ventasRespuesta);

                    setProductos([]);
                    setClientes([]);

                }

            } catch (err) {

                setError(
                    err instanceof Error
                        ? err.message
                        : 'No se pudieron cargar los datos.'
                );

            } finally {

                setCargando(false);

            }

        },
        [esVendedor]
    );


    useEffect(() => {

        void cargarDatos();

    }, [cargarDatos]);


    const productoSeleccionado =
        useMemo(
            () =>
                productos.find(
                    (producto) =>
                        producto.id ===
                        formulario.productoId
                ),
            [
                productos,
                formulario.productoId,
            ]
        );


    const totalEstimado =
        formulario.cantidad *
        formulario.precioUnitario;


    const manejarCambio = (
        evento:
            ChangeEvent<HTMLInputElement> |
            ChangeEvent<HTMLSelectElement>
    ) => {

        const { name, value } =
            evento.target;

        const camposNumericos = [
            'cantidad',
            'precioUnitario',
            'clienteId',
        ];

        setFormulario((actual) => ({
            ...actual,

            [name]:
                camposNumericos.includes(name)
                    ? Number(value)
                    : value,
        }));
    };


    const manejarProducto = (
        evento: ChangeEvent<HTMLSelectElement>
    ) => {

        const productoId =
            Number(evento.target.value);

        const producto =
            productos.find(
                (item) =>
                    item.id === productoId
            );

        setFormulario((actual) => ({
            ...actual,

            productoId,

            precioUnitario:
                producto?.precioVenta ?? 0,
        }));
    };


    const limpiarFormulario = () => {

        setFormulario(
            crearFormularioInicial()
        );

        setError('');
        setMensaje('');
    };


    const registrarVenta = async (
        evento: FormEvent<HTMLFormElement>
    ) => {

        evento.preventDefault();

        setError('');
        setMensaje('');


        /*
         * Protección adicional del frontend.
         *
         * El backend también debe proteger
         * POST /api/ventas.
         */
        if (!esVendedor) {

            setError(
                'Solo los vendedores pueden registrar ventas.'
            );

            return;
        }


        const vendedorId =
            authService.obtenerUsuarioId();


        if (
            vendedorId === null ||
            vendedorId <= 0
        ) {

            setError(
                'No se pudo identificar al vendedor autenticado.'
            );

            return;
        }


        if (formulario.productoId <= 0) {

            setError(
                'Selecciona un producto.'
            );

            return;
        }


        if (formulario.clienteId <= 0) {

            setError(
                'Selecciona un cliente.'
            );

            return;
        }


        if (formulario.cantidad <= 0) {

            setError(
                'La cantidad debe ser mayor a cero.'
            );

            return;
        }


        if (
            formulario.precioUnitario <= 0
        ) {

            setError(
                'El precio unitario debe ser mayor a cero.'
            );

            return;
        }


        if (
            productoSeleccionado &&
            formulario.cantidad >
            productoSeleccionado.stock
        ) {

            setError(
                `Stock insuficiente. Disponible: ${productoSeleccionado.stock}.`
            );

            return;
        }


        try {

            setGuardando(true);


            /*
             * El vendedor NO se selecciona.
             *
             * Se obtiene automáticamente
             * desde la sesión JWT.
             */
            const ventaRequest: VentaRequest = {
                ...formulario,
                vendedorId,
            };


            await ventaService.registrar(
                ventaRequest
            );


            setFormulario(
                crearFormularioInicial()
            );


            await cargarDatos();


            setMensaje(
                'Venta registrada correctamente.'
            );

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : 'No se pudo registrar la venta.'
            );

        } finally {

            setGuardando(false);

        }
    };


    return (
        <main className="ventas-page">

            <section className="ventas-header">

                <div>

                    <span>SERF</span>

                    <h2>Ventas</h2>

                    <p>
                        {esVendedor
                            ? 'Registra ventas y controla automáticamente el stock.'
                            : 'Consulta el historial de ventas registradas en el sistema.'}
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

                <div className="ventas-error">
                    {error}
                </div>

            )}


            {mensaje && (

                <div className="ventas-success">
                    {mensaje}
                </div>

            )}


            {/*
       * El formulario solamente aparece
       * cuando inicia sesión un VENDEDOR.
       */}
            {esVendedor && (

                <section className="venta-form-container">

                    <div className="venta-form-title">

                        <h3>
                            Nueva venta
                        </h3>

                        <p>
                            Registra la información
                            de la operación comercial.
                        </p>

                    </div>


                    <form
                        className="venta-form"
                        onSubmit={registrarVenta}
                    >

                        <div className="venta-field">

                            <label htmlFor="numeroFactura">
                                Número de factura
                            </label>

                            <input
                                id="numeroFactura"
                                name="numeroFactura"
                                value={
                                    formulario.numeroFactura
                                }
                                onChange={manejarCambio}
                                placeholder="F001-000001"
                                required
                            />

                        </div>


                        <div className="venta-field">

                            <label htmlFor="fechaVenta">
                                Fecha de venta
                            </label>

                            <input
                                id="fechaVenta"
                                type="datetime-local"
                                name="fechaVenta"
                                value={
                                    formulario.fechaVenta
                                }
                                onChange={manejarCambio}
                                required
                            />

                        </div>


                        <div className="venta-field">

                            <label htmlFor="productoId">
                                Producto
                            </label>

                            <select
                                id="productoId"
                                name="productoId"
                                value={
                                    formulario.productoId
                                }
                                onChange={manejarProducto}
                                required
                            >

                                <option value={0}>
                                    Selecciona un producto
                                </option>


                                {productos.map(
                                    (producto) => (

                                        <option
                                            key={producto.id}
                                            value={producto.id}
                                        >
                                            {producto.codigo}
                                            {' - '}
                                            {producto.nombre}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        <div className="venta-field">

                            <label htmlFor="cantidad">
                                Cantidad
                            </label>

                            <input
                                id="cantidad"
                                type="number"
                                name="cantidad"
                                min="1"
                                value={
                                    formulario.cantidad
                                }
                                onChange={manejarCambio}
                                required
                            />

                        </div>


                        <div className="venta-field">

                            <label htmlFor="precioUnitario">
                                Precio unitario
                            </label>

                            <input
                                id="precioUnitario"
                                type="number"
                                name="precioUnitario"
                                min="0.01"
                                step="0.01"
                                value={
                                    formulario.precioUnitario
                                }
                                onChange={manejarCambio}
                                required
                            />

                        </div>


                        <div className="venta-field">

                            <label htmlFor="clienteId">
                                Cliente
                            </label>

                            <select
                                id="clienteId"
                                name="clienteId"
                                value={
                                    formulario.clienteId
                                }
                                onChange={manejarCambio}
                                required
                            >

                                <option value={0}>
                                    Selecciona un cliente
                                </option>


                                {clientes.map(
                                    (cliente) => (

                                        <option
                                            key={cliente.id}
                                            value={cliente.id}
                                        >
                                            {cliente.nombre}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        <div className="venta-field">

                            <label htmlFor="metodoPago">
                                Método de pago
                            </label>

                            <select
                                id="metodoPago"
                                name="metodoPago"
                                value={
                                    formulario.metodoPago
                                }
                                onChange={manejarCambio}
                                required
                            >

                                <option value="EFECTIVO">
                                    Efectivo
                                </option>

                                <option value="TARJETA_CREDITO">
                                    Tarjeta de crédito
                                </option>

                                <option value="TARJETA_DEBITO">
                                    Tarjeta de débito
                                </option>

                                <option value="TRANSFERENCIA_BANCARIA">
                                    Transferencia bancaria
                                </option>

                                <option value="OTRO">
                                    Otro
                                </option>

                            </select>

                        </div>


                        {productoSeleccionado && (

                            <div className="venta-product-info">

                                <div>

                  <span>
                    Stock disponible
                  </span>

                                    <strong>
                                        {productoSeleccionado.stock}
                                    </strong>

                                </div>


                                <div>

                  <span>
                    Filial
                  </span>

                                    <strong>
                                        {
                                            productoSeleccionado
                                                .filialNombre
                                        }
                                    </strong>

                                </div>


                                <div>

                  <span>
                    Total estimado
                  </span>

                                    <strong>
                                        {totalEstimado.toFixed(2)}
                                    </strong>

                                </div>

                            </div>

                        )}


                        <div className="venta-form-actions">

                            <button
                                type="button"
                                className="venta-clear"
                                onClick={limpiarFormulario}
                            >
                                Limpiar
                            </button>


                            <button
                                type="submit"
                                className="venta-save"
                                disabled={guardando}
                            >
                                {guardando
                                    ? 'Registrando...'
                                    : 'Registrar venta'}
                            </button>

                        </div>

                    </form>

                </section>

            )}


            <section className="ventas-table-container">

                <div className="ventas-table-title">

                    <h3>
                        Ventas registradas
                    </h3>

                    <p>
                        Total: {ventas.length}
                    </p>

                </div>


                {cargando ? (

                    <div className="ventas-message">
                        Cargando ventas...
                    </div>

                ) : ventas.length === 0 ? (

                    <div className="ventas-message">
                        No existen ventas registradas.
                    </div>

                ) : (

                    <div className="ventas-table-wrapper">

                        <table className="ventas-table">

                            <thead>

                            <tr>

                                <th>Factura</th>
                                <th>Fecha</th>
                                <th>Producto</th>
                                <th>Cliente</th>
                                <th>Vendedor</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>Total</th>
                                <th>Filial</th>
                                <th>Método</th>

                            </tr>

                            </thead>


                            <tbody>

                            {ventas.map(
                                (venta) => (

                                    <tr key={venta.id}>

                                        <td>
                                            {venta.numeroFactura}
                                        </td>

                                        <td>
                                            {new Date(
                                                venta.fechaVenta
                                            ).toLocaleString()}
                                        </td>

                                        <td>
                                            {venta.productoNombre}
                                        </td>

                                        <td>
                                            {venta.clienteNombre}
                                        </td>

                                        <td>
                                            {venta.vendedorEmail}
                                        </td>

                                        <td>
                                            {venta.cantidad}
                                        </td>

                                        <td>
                                            {Number(
                                                venta.precioUnitario
                                            ).toFixed(2)}
                                        </td>

                                        <td>
                                            {Number(
                                                venta.total
                                            ).toFixed(2)}
                                        </td>

                                        <td>
                                            {venta.filialNombre}
                                        </td>

                                        <td>
                                            {venta.metodoPago}
                                        </td>

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