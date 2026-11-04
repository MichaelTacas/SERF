package com.idat.serf.service.impl;

import com.idat.serf.exception.ReglaNegocioException;
import com.idat.serf.model.Cliente;
import com.idat.serf.model.Filial;
import com.idat.serf.model.Producto;
import com.idat.serf.model.Venta;
import com.idat.serf.patterns.facade.ReporteFacade;
import com.idat.serf.patterns.singleton.ConfiguracionGlobal;
import com.idat.serf.repository.ClienteRepository;
import com.idat.serf.repository.FilialRepository;
import com.idat.serf.repository.VentaRepository;
import com.idat.serf.service.ReporteService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
public class ReporteServiceImpl
        implements ReporteService {

    private final FilialRepository filialRepository;
    private final VentaRepository ventaRepository;
    private final ClienteRepository clienteRepository;
    private final ReporteFacade reporteFacade;

    public ReporteServiceImpl(
            FilialRepository filialRepository,
            VentaRepository ventaRepository,
            ClienteRepository clienteRepository,
            ReporteFacade reporteFacade
    ) {
        this.filialRepository = filialRepository;
        this.ventaRepository = ventaRepository;
        this.clienteRepository = clienteRepository;
        this.reporteFacade = reporteFacade;
    }

    @Override
    @Transactional(readOnly = true)
    public String generarAutomatico(
            String pais,
            Long clienteId,
            String periodo,
            String responsable
    ) {

        String periodoNormalizado =
                validarPeriodo(periodo);

        Cliente cliente =
                obtenerCliente(clienteId);

        List<Filial> filiales =
                filialRepository
                        .findByPaisIgnoreCase(pais);

        if (filiales.isEmpty()) {

            throw new ReglaNegocioException(
                    "No existen filiales registradas para: "
                            + pais
            );
        }

        ConfiguracionGlobal configuracion =
                ConfiguracionGlobal.getInstancia();

        BigDecimal ingresos =
                BigDecimal.ZERO;

        BigDecimal gastosImportacion =
                BigDecimal.ZERO;

        StringBuilder detalleVentas =
                new StringBuilder();

        detalleVentas.append(
                "Factura | Producto | Cantidad | Precio Unit. EUR | Total EUR\n"
        );

        detalleVentas.append(
                "--------------------------------------------------------------------------\n"
        );

        boolean existenVentas =
                false;

        LocalDateTime fechaActual =
                LocalDateTime.now();

        for (Filial filial : filiales) {

            validarMonedaFilial(
                    filial
            );

            /*
             * El Repository obtiene directamente
             * las ventas de la filial y del cliente.
             */
            List<Venta> ventas =
                    obtenerVentasCliente(
                            filial,
                            clienteId,
                            periodoNormalizado,
                            fechaActual
                    );

            for (Venta venta : ventas) {

                existenVentas = true;

                // ==============================================
                // INGRESOS
                // ==============================================

                BigDecimal totalLocal =
                        venta.calcularTotal();

                BigDecimal totalEur =
                        configuracion.convertirAEur(
                                totalLocal,
                                filial.getMonedaLocal()
                        );

                BigDecimal precioUnitarioEur =
                        configuracion.convertirAEur(
                                venta.getPrecioUnitario(),
                                filial.getMonedaLocal()
                        );

                ingresos =
                        ingresos.add(
                                totalEur
                        );

                // ==============================================
                // GASTOS DE IMPORTACIÓN
                // ==============================================

                Producto producto =
                        venta.getProducto();

                validarCostoImportacionEur(
                        producto
                );

                BigDecimal costoVenta =
                        producto
                                .getCostoImportacionEur()
                                .multiply(
                                        BigDecimal.valueOf(
                                                venta.getCantidad()
                                        )
                                );

                gastosImportacion =
                        gastosImportacion.add(
                                costoVenta
                        );

                // ==============================================
                // DETALLE DE LA COMPRA
                // ==============================================

                agregarDetalleVenta(
                        detalleVentas,
                        venta,
                        precioUnitarioEur,
                        totalEur
                );
            }
        }

        // =====================================================
        // SIN VENTAS
        // =====================================================

        if (!existenVentas) {

            detalleVentas.setLength(
                    0
            );

            detalleVentas
                    .append("El cliente ")
                    .append(cliente.getNombre())
                    .append(
                            " no registra compras durante el periodo "
                    )
                    .append(
                            periodoNormalizado
                                    .toLowerCase(
                                            Locale.ROOT
                                    )
                    )
                    .append(".");
        }

        // =====================================================
        // FACADE
        // =====================================================

        return reporteFacade.generarReporteAutomatico(
                pais,
                cliente.getNombre(),
                periodoNormalizado,
                ingresos.toPlainString(),
                gastosImportacion.toPlainString(),
                detalleVentas.toString(),
                responsable
        );
    }

    // =========================================================
    // OBTENER CLIENTE
    // =========================================================

    private Cliente obtenerCliente(
            Long clienteId
    ) {

        if (clienteId == null
                || clienteId <= 0) {

            throw new ReglaNegocioException(
                    "El cliente es obligatorio"
            );
        }

        return clienteRepository
                .findById(
                        clienteId
                )
                .orElseThrow(
                        () ->
                                new ReglaNegocioException(
                                        "No existe el cliente con ID: "
                                                + clienteId
                                )
                );
    }

    // =========================================================
    // OBTENER VENTAS DEL CLIENTE
    // =========================================================

    private List<Venta> obtenerVentasCliente(
            Filial filial,
            Long clienteId,
            String periodo,
            LocalDateTime fechaActual
    ) {

        return ventaRepository
                .findByFilialIdAndClienteId(
                        filial.getId(),
                        clienteId
                )
                .stream()
                .filter(
                        venta ->
                                perteneceAlPeriodo(
                                        venta,
                                        periodo,
                                        fechaActual
                                )
                )
                .toList();
    }

    // =========================================================
    // VALIDAR PERIODO DE LA VENTA
    // =========================================================

    private boolean perteneceAlPeriodo(
            Venta venta,
            String periodo,
            LocalDateTime fechaActual
    ) {

        if (venta.getFechaVenta() == null) {
            return false;
        }

        LocalDateTime fechaVenta =
                venta.getFechaVenta();

        return switch (periodo) {

            case "MENSUAL" ->
                    fechaVenta.getYear()
                            == fechaActual.getYear()
                            && fechaVenta.getMonthValue()
                            == fechaActual.getMonthValue();

            case "TRIMESTRAL" ->
                    fechaVenta.getYear()
                            == fechaActual.getYear()
                            && obtenerTrimestre(
                            fechaVenta.getMonthValue()
                    )
                            == obtenerTrimestre(
                            fechaActual.getMonthValue()
                    );

            case "ANUAL" ->
                    fechaVenta.getYear()
                            == fechaActual.getYear();

            default ->
                    false;
        };
    }

    // =========================================================
    // OBTENER TRIMESTRE
    // =========================================================

    private int obtenerTrimestre(
            int mes
    ) {

        return ((mes - 1) / 3) + 1;
    }

    // =========================================================
    // VALIDAR PERIODO
    // =========================================================

    private String validarPeriodo(
            String periodo
    ) {

        if (periodo == null
                || periodo.isBlank()) {

            throw new ReglaNegocioException(
                    "El periodo es obligatorio"
            );
        }

        String periodoNormalizado =
                periodo
                        .trim()
                        .toUpperCase(
                                Locale.ROOT
                        );

        if (!periodoNormalizado.equals("MENSUAL")
                && !periodoNormalizado.equals("TRIMESTRAL")
                && !periodoNormalizado.equals("ANUAL")) {

            throw new ReglaNegocioException(
                    "Periodo no válido. "
                            + "Debe ser MENSUAL, TRIMESTRAL o ANUAL"
            );
        }

        return periodoNormalizado;
    }

    // =========================================================
    // VALIDAR MONEDA DE LA FILIAL
    // =========================================================

    private void validarMonedaFilial(
            Filial filial
    ) {

        if (filial.getMonedaLocal() == null) {

            throw new ReglaNegocioException(
                    "La filial "
                            + filial.getNombre()
                            + " no tiene una moneda local configurada"
            );
        }
    }

    // =========================================================
    // VALIDAR COSTO DE IMPORTACIÓN
    // =========================================================

    private void validarCostoImportacionEur(
            Producto producto
    ) {

        if (producto == null) {

            throw new ReglaNegocioException(
                    "La venta no tiene un producto asociado"
            );
        }

        if (producto.getCostoImportacionEur() == null) {

            throw new ReglaNegocioException(
                    "El producto "
                            + producto.getNombre()
                            + " no tiene costo de importación "
                            + "convertido a EUR"
            );
        }
    }

    // =========================================================
    // CONSTRUIR DETALLE DE LA VENTA
    // =========================================================

    private void agregarDetalleVenta(
            StringBuilder detalleVentas,
            Venta venta,
            BigDecimal precioUnitarioEur,
            BigDecimal totalEur
    ) {

        String producto =
                venta.getProducto() != null
                        ? venta.getProducto().getNombre()
                        : "Producto no disponible";

        detalleVentas
                .append(
                        venta.getNumeroFactura()
                )
                .append(" | ")
                .append(
                        producto
                )
                .append(" | ")
                .append(
                        venta.getCantidad()
                )
                .append(" | ")
                .append(
                        precioUnitarioEur.toPlainString()
                )
                .append(" EUR | ")
                .append(
                        totalEur.toPlainString()
                )
                .append(" EUR\n");
    }
}