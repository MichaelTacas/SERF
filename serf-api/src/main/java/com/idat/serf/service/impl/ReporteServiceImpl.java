package com.idat.serf.service.impl;

import com.idat.serf.exception.ReglaNegocioException;
import com.idat.serf.model.Filial;
import com.idat.serf.model.Producto;
import com.idat.serf.model.Venta;
import com.idat.serf.patterns.facade.ReporteFacade;
import com.idat.serf.repository.FilialRepository;
import com.idat.serf.repository.ProductoRepository;
import com.idat.serf.repository.VentaRepository;
import com.idat.serf.service.ReporteService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ReporteServiceImpl
        implements ReporteService {

    private final FilialRepository filialRepository;
    private final ProductoRepository productoRepository;
    private final VentaRepository ventaRepository;
    private final ReporteFacade reporteFacade;

    public ReporteServiceImpl(
            FilialRepository filialRepository,
            ProductoRepository productoRepository,
            VentaRepository ventaRepository,
            ReporteFacade reporteFacade
    ) {
        this.filialRepository = filialRepository;
        this.productoRepository = productoRepository;
        this.ventaRepository = ventaRepository;
        this.reporteFacade = reporteFacade;
    }

    @Override
    @Transactional(readOnly = true)
    public String generarMensualAutomatico(
            String pais,
            String responsable
    ) {

        List<Filial> filiales =
                filialRepository.findByPaisIgnoreCase(pais);

        if (filiales.isEmpty()) {
            throw new ReglaNegocioException(
                    "No existen filiales registradas para: " + pais
            );
        }

        BigDecimal ingresos = BigDecimal.ZERO;
        BigDecimal gastosImportacion = BigDecimal.ZERO;

        for (Filial filial : filiales) {

            List<Venta> ventas =
                    ventaRepository.findByFilialId(
                            filial.getId()
                    );

            for (Venta venta : ventas) {
                ingresos = ingresos.add(
                        venta.calcularTotal()
                );
            }

            List<Producto> productos =
                    productoRepository.findByFilialId(
                            filial.getId()
                    );

            for (Producto producto : productos) {

                int unidadesVendidas = ventas.stream()
                        .filter(venta ->
                                venta.getProducto() != null
                                        && venta.getProducto()
                                        .getId()
                                        .equals(producto.getId())
                        )
                        .mapToInt(Venta::getCantidad)
                        .sum();

                BigDecimal costoProducto =
                        producto.getCostoImportacion()
                                .multiply(
                                        BigDecimal.valueOf(
                                                unidadesVendidas
                                        )
                                );

                gastosImportacion =
                        gastosImportacion.add(
                                costoProducto
                        );

            }
        }

        return reporteFacade.generarReporteMensual(
                pais,
                ingresos.toPlainString(),
                gastosImportacion.toPlainString(),
                responsable
        );
    }
}