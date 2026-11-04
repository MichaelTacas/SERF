package com.idat.serf.patterns.facade;

import com.idat.serf.patterns.builder.ReporteFinanciero;
import com.idat.serf.patterns.builder.ReporteFinancieroBuilder;
import com.idat.serf.patterns.composite.ElementoReporte;
import com.idat.serf.patterns.composite.SeccionReporte;
import com.idat.serf.patterns.decorator.FirmaDigitalDecorator;
import com.idat.serf.patterns.decorator.MarcaAguaDecorator;
import com.idat.serf.patterns.decorator.ReporteBase;
import com.idat.serf.patterns.decorator.ReporteExportable;
import com.idat.serf.patterns.prototype.PlantillaReporte;
import com.idat.serf.patterns.singleton.ConfiguracionGlobal;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Locale;

@Service
public class ReporteFacade {

    private final PlantillaReporte plantillaMensualBase;
    private final PlantillaReporte plantillaTrimestralBase;
    private final PlantillaReporte plantillaAnualBase;

    public ReporteFacade() {

        // =====================================================
        // PROTOTYPE - PLANTILLAS BASE
        // =====================================================

        this.plantillaMensualBase =
                PlantillaReporte.crearPlantillaMensualIngresos(
                        "Corporativo"
                );

        this.plantillaTrimestralBase =
                PlantillaReporte.crearPlantillaTrimestral(
                        "Corporativo"
                );

        this.plantillaAnualBase =
                PlantillaReporte.crearPlantillaAnualConsolidado(
                        "Corporativo"
                );
    }

    // =========================================================
    // REPORTE MENSUAL MANUAL
    // =========================================================

    public String generarReporteMensual(
            String pais,
            String ingresos,
            String gastos,
            String responsable
    ) {

        return generarReporte(
                plantillaMensualBase,
                pais,
                null,
                ingresos,
                gastos,
                "",
                responsable,
                "MENSUAL"
        );
    }

    // =========================================================
    // REPORTE TRIMESTRAL MANUAL
    // =========================================================

    public String generarReporteTrimestral(
            String pais,
            String ingresos,
            String gastos,
            String responsable
    ) {

        return generarReporte(
                plantillaTrimestralBase,
                pais,
                null,
                ingresos,
                gastos,
                "",
                responsable,
                "TRIMESTRAL"
        );
    }

    // =========================================================
    // REPORTE ANUAL MANUAL
    // =========================================================

    public String generarReporteAnual(
            String pais,
            String ingresos,
            String gastos,
            String responsable
    ) {

        return generarReporte(
                plantillaAnualBase,
                pais,
                null,
                ingresos,
                gastos,
                "",
                responsable,
                "ANUAL"
        );
    }

    // =========================================================
    // REPORTE AUTOMÁTICO POR CLIENTE Y PERIODO
    // =========================================================

    public String generarReporteAutomatico(
            String pais,
            String cliente,
            String periodo,
            String ingresos,
            String gastos,
            String detalleVentas,
            String responsable
    ) {

        String periodoNormalizado =
                validarPeriodo(periodo);

        PlantillaReporte plantillaBase =
                obtenerPlantilla(
                        periodoNormalizado
                );

        return generarReporte(
                plantillaBase,
                pais,
                cliente,
                ingresos,
                gastos,
                detalleVentas,
                responsable,
                periodoNormalizado
        );
    }

    // =========================================================
    // SELECCIONAR PLANTILLA PROTOTYPE
    // =========================================================

    private PlantillaReporte obtenerPlantilla(
            String periodo
    ) {

        return switch (periodo) {

            case "MENSUAL" ->
                    plantillaMensualBase;

            case "TRIMESTRAL" ->
                    plantillaTrimestralBase;

            case "ANUAL" ->
                    plantillaAnualBase;

            default ->
                    throw new IllegalArgumentException(
                            "Periodo no válido: " + periodo
                    );
        };
    }

    // =========================================================
    // VALIDAR PERIODO
    // =========================================================

    private String validarPeriodo(
            String periodo
    ) {

        if (periodo == null
                || periodo.isBlank()) {

            throw new IllegalArgumentException(
                    "El periodo es obligatorio"
            );
        }

        String periodoNormalizado =
                periodo.trim()
                        .toUpperCase(
                                Locale.ROOT
                        );

        if (!periodoNormalizado.equals("MENSUAL")
                && !periodoNormalizado.equals("TRIMESTRAL")
                && !periodoNormalizado.equals("ANUAL")) {

            throw new IllegalArgumentException(
                    "Periodo no válido. "
                            + "Debe ser MENSUAL, TRIMESTRAL o ANUAL"
            );
        }

        return periodoNormalizado;
    }

    // =========================================================
    // GENERACIÓN GENERAL
    // =========================================================

    private String generarReporte(
            PlantillaReporte plantillaBase,
            String pais,
            String cliente,
            String ingresos,
            String gastos,
            String detalleVentas,
            String responsable,
            String periodo
    ) {

        // =====================================================
        // 1. SINGLETON
        // =====================================================

        ConfiguracionGlobal configuracion =
                ConfiguracionGlobal.getInstancia();

        // =====================================================
        // 2. PROTOTYPE
        // =====================================================

        PlantillaReporte plantilla =
                plantillaBase.clonar();

        plantilla.setPais(
                pais
        );

        plantilla.setTitulo(
                plantilla.getTitulo()
                        + " - "
                        + pais
        );

        // =====================================================
        // CÁLCULOS FINANCIEROS
        // =====================================================

        BigDecimal ingresosValor =
                convertirDecimal(
                        ingresos
                );

        BigDecimal gastosValor =
                convertirDecimal(
                        gastos
                );

        BigDecimal resultado =
                ingresosValor.subtract(
                        gastosValor
                );

        String moneda =
                configuracion
                        .getMonedaCorporativa()
                        .toString();

        // =====================================================
        // 3. COMPOSITE
        // =====================================================

        SeccionReporte informacionFinanciera =
                new SeccionReporte("");

        informacionFinanciera.agregar(
                new ElementoReporte(
                        "Ingresos",
                        formatearMonto(
                                ingresosValor
                        )
                                + " "
                                + moneda
                )
        );

        informacionFinanciera.agregar(
                new ElementoReporte(
                        "Gastos",
                        formatearMonto(
                                gastosValor
                        )
                                + " "
                                + moneda
                )
        );

        informacionFinanciera.agregar(
                new ElementoReporte(
                        "Resultado",
                        formatearMonto(
                                resultado
                        )
                                + " "
                                + moneda
                                + " | "
                                + obtenerEstado(
                                resultado
                        )
                )
        );

        // =====================================================
        // DETALLE DE VENTAS
        // =====================================================

        String ventasContenido;

        if (detalleVentas == null
                || detalleVentas.isBlank()) {

            ventasContenido =
                    "No se incluyó detalle de ventas "
                            + "para este reporte.";

        } else {

            ventasContenido =
                    detalleVentas.trim();
        }

        // =====================================================
        // GASTOS DE IMPORTACIÓN
        // =====================================================

        String gastosContenido =
                "Costo total asociado a las compras "
                        + "del cliente durante el periodo: "
                        + formatearMonto(
                        gastosValor
                )
                        + " "
                        + moneda;

        // =====================================================
        // COMPARATIVO
        // =====================================================

        String comparativo =
                generarComparativo(
                        ingresosValor,
                        gastosValor,
                        resultado,
                        moneda
                );

        // =====================================================
        // CONCLUSIÓN
        // =====================================================

        String conclusion =
                generarConclusion(
                        cliente,
                        ingresosValor,
                        gastosValor,
                        resultado,
                        moneda,
                        periodo
                );

        // =====================================================
        // ENCABEZADO
        // =====================================================

        StringBuilder encabezado =
                new StringBuilder();

        encabezado
                .append("País: ")
                .append(pais);

        if (cliente != null
                && !cliente.isBlank()) {

            encabezado
                    .append(" | Cliente: ")
                    .append(cliente);
        }

        encabezado
                .append(" | Periodo: ")
                .append(periodo)
                .append(" | Moneda: ")
                .append(moneda)
                .append(" | Responsable: ")
                .append(responsable);

        // =====================================================
        // 4. BUILDER
        // =====================================================

        ReporteFinanciero reporte =
                new ReporteFinancieroBuilder()
                        .titulo(
                                plantilla.getTitulo()
                        )
                        .encabezado(
                                encabezado.toString()
                        )
                        .agregarSeccion(
                                "RESUMEN FINANCIERO",
                                informacionFinanciera
                                        .generarContenido()
                                        .trim()
                        )
                        .agregarSeccion(
                                "DETALLE DE COMPRAS",
                                ventasContenido
                        )
                        .agregarSeccion(
                                "GASTOS DE IMPORTACIÓN",
                                gastosContenido
                        )
                        .agregarSeccion(
                                "COMPARATIVO FINANCIERO",
                                comparativo
                        )
                        .conclusion(
                                conclusion
                        )
                        .construir();

        // =====================================================
        // CONVERSIÓN A TEXTO
        // =====================================================

        String contenido =
                convertirATexto(
                        reporte,
                        periodo
                );

        // =====================================================
        // 5. DECORATOR
        // =====================================================

        ReporteExportable reporteFinal =
                new ReporteBase(
                        contenido
                );

        reporteFinal =
                new MarcaAguaDecorator(
                        reporteFinal,
                        "FINANCORP - CONFIDENCIAL"
                );

        reporteFinal =
                new FirmaDigitalDecorator(
                        reporteFinal,
                        responsable
                );

        // =====================================================
        // FACADE
        // =====================================================

        return reporteFinal.generar();
    }

    // =========================================================
    // COMPARATIVO FINANCIERO
    // =========================================================

    private String generarComparativo(
            BigDecimal ingresos,
            BigDecimal gastos,
            BigDecimal resultado,
            String moneda
    ) {

        BigDecimal maximo =
                ingresos.abs()
                        .max(
                                gastos.abs()
                        );

        String barraIngresos =
                crearBarra(
                        ingresos.abs(),
                        maximo
                );

        String barraGastos =
                crearBarra(
                        gastos.abs(),
                        maximo
                );

        return String.format(
                Locale.US,
                "%-10s %-24s %12s %s%n"
                        + "%-10s %-24s %12s %s%n"
                        + "%-10s %-24s %12s %s",
                "Ingresos",
                barraIngresos,
                formatearMonto(
                        ingresos
                ),
                moneda,
                "Gastos",
                barraGastos,
                formatearMonto(
                        gastos
                ),
                moneda,
                "Diferencia",
                "",
                formatearMonto(
                        resultado
                ),
                moneda
        );
    }

    // =========================================================
    // BARRA DEL COMPARATIVO
    // =========================================================

    private String crearBarra(
            BigDecimal valor,
            BigDecimal maximo
    ) {

        if (valor.compareTo(
                BigDecimal.ZERO
        ) <= 0
                || maximo.compareTo(
                BigDecimal.ZERO
        ) <= 0) {

            return "";
        }

        BigDecimal proporcion =
                valor.divide(
                        maximo,
                        4,
                        RoundingMode.HALF_UP
                );

        int bloques =
                (int) Math.round(
                        proporcion.doubleValue()
                                * 20
                );

        bloques =
                Math.max(
                        1,
                        Math.min(
                                bloques,
                                20
                        )
                );

        return "█".repeat(
                bloques
        );
    }

    // =========================================================
    // CONCLUSIÓN
    // =========================================================

    private String generarConclusion(
            String cliente,
            BigDecimal ingresos,
            BigDecimal gastos,
            BigDecimal resultado,
            String moneda,
            String periodo
    ) {

        String estado =
                obtenerEstado(
                        resultado
                ).toLowerCase(
                        Locale.ROOT
                );

        StringBuilder conclusion =
                new StringBuilder();

        if (cliente != null
                && !cliente.isBlank()) {

            conclusion
                    .append("El cliente ")
                    .append(cliente)
                    .append(" registró durante el periodo ")
                    .append(
                            periodo.toLowerCase(
                                    Locale.ROOT
                            )
                    )
                    .append(" ingresos por ");
        } else {

            conclusion.append(
                    "Ingresos del periodo: "
            );
        }

        conclusion
                .append(
                        formatearMonto(
                                ingresos
                        )
                )
                .append(" ")
                .append(moneda)
                .append(". Gastos de importación: ")
                .append(
                        formatearMonto(
                                gastos
                        )
                )
                .append(" ")
                .append(moneda)
                .append(". Resultado financiero: ")
                .append(
                        formatearMonto(
                                resultado
                        )
                )
                .append(" ")
                .append(moneda)
                .append(" (")
                .append(estado)
                .append(").");

        return conclusion.toString();
    }

    // =========================================================
    // ESTADO DEL RESULTADO
    // =========================================================

    private String obtenerEstado(
            BigDecimal resultado
    ) {

        int comparacion =
                resultado.compareTo(
                        BigDecimal.ZERO
                );

        if (comparacion > 0) {
            return "GANANCIA";
        }

        if (comparacion < 0) {
            return "PÉRDIDA";
        }

        return "EQUILIBRIO";
    }

    // =========================================================
    // FORMATEAR MONTO
    // =========================================================

    private String formatearMonto(
            BigDecimal valor
    ) {

        return String.format(
                Locale.US,
                "%,.2f",
                valor
        );
    }

    // =========================================================
    // CONVERSIÓN SEGURA
    // =========================================================

    private BigDecimal convertirDecimal(
            String valor
    ) {

        if (valor == null
                || valor.isBlank()) {

            return BigDecimal.ZERO;
        }

        try {

            return new BigDecimal(
                    valor
            );

        } catch (NumberFormatException exception) {

            throw new IllegalArgumentException(
                    "El valor financiero no tiene "
                            + "un formato numérico válido: "
                            + valor
            );
        }
    }

    // =========================================================
    // SALIDA FINAL
    // =========================================================

    private String convertirATexto(
            ReporteFinanciero reporte,
            String periodo
    ) {

        StringBuilder contenido =
                new StringBuilder();

        contenido.append(
                "========================================================\n"
        );

        contenido.append(
                "              FINANCORP S.A.\n"
        );

        contenido.append(
                "         REPORTE FINANCIERO "
        );

        contenido.append(
                periodo
        );

        contenido.append(
                "\n========================================================\n"
        );

        contenido.append(
                reporte.getEncabezado()
        );

        contenido.append(
                "\n\n"
        );

        int numero =
                1;

        for (String seccion :
                reporte.getSecciones()) {

            contenido.append(
                    numero
            );

            contenido.append(
                    ". "
            );

            contenido.append(
                    seccion
            );

            contenido.append(
                    "\n\n"
            );

            numero++;
        }

        contenido.append(
                numero
        );

        contenido.append(
                ". CONCLUSIÓN\n"
        );

        contenido.append(
                "--------------------------------------------------------\n"
        );

        contenido.append(
                reporte.getConclusion()
        );

        contenido.append(
                "\n"
        );

        return contenido.toString();
    }
}