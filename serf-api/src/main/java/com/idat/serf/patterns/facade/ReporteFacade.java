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

@Service
public class ReporteFacade {

    private final PlantillaReporte plantillaMensualBase;
    private final PlantillaReporte plantillaTrimestralBase;
    private final PlantillaReporte plantillaAnualBase;

    public ReporteFacade() {

        // PROTOTYPE - Plantillas base
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

    // =====================================================
    // REPORTE MENSUAL
    // =====================================================

    public String generarReporteMensual(
            String pais,
            String ingresos,
            String gastos,
            String responsable
    ) {

        return generarReporte(
                plantillaMensualBase,
                pais,
                ingresos,
                gastos,
                responsable,
                "MENSUAL"
        );
    }

    // =====================================================
    // REPORTE TRIMESTRAL
    // =====================================================

    public String generarReporteTrimestral(
            String pais,
            String ingresos,
            String gastos,
            String responsable
    ) {

        return generarReporte(
                plantillaTrimestralBase,
                pais,
                ingresos,
                gastos,
                responsable,
                "TRIMESTRAL"
        );
    }

    // =====================================================
    // REPORTE ANUAL
    // =====================================================

    public String generarReporteAnual(
            String pais,
            String ingresos,
            String gastos,
            String responsable
    ) {

        return generarReporte(
                plantillaAnualBase,
                pais,
                ingresos,
                gastos,
                responsable,
                "ANUAL"
        );
    }

    // =====================================================
    // GENERACIÓN GENERAL DEL REPORTE
    // =====================================================

    private String generarReporte(
            PlantillaReporte plantillaBase,
            String pais,
            String ingresos,
            String gastos,
            String responsable,
            String periodo
    ) {

        // 1. SINGLETON
        ConfiguracionGlobal configuracion =
                ConfiguracionGlobal.getInstancia();

        // 2. PROTOTYPE
        PlantillaReporte plantilla =
                plantillaBase.clonar();

        plantilla.setPais(pais);

        plantilla.setTitulo(
                plantilla.getTitulo() + " - " + pais
        );

        // 3. COMPOSITE
        SeccionReporte informacionFinanciera =
                new SeccionReporte(
                        "Información Financiera"
                );

        informacionFinanciera.agregar(
                new ElementoReporte(
                        "Ingresos",
                        ingresos + " "
                                + configuracion.getMonedaCorporativa()
                )
        );

        informacionFinanciera.agregar(
                new ElementoReporte(
                        "Gastos",
                        gastos + " "
                                + configuracion.getMonedaCorporativa()
                )
        );

        SeccionReporte reporteGeneral =
                new SeccionReporte(
                        plantilla.getTitulo()
                );

        reporteGeneral.agregar(
                informacionFinanciera
        );

        // 4. BUILDER
        ReporteFinanciero reporte =
                new ReporteFinancieroBuilder()
                        .titulo(
                                plantilla.getTitulo()
                        )
                        .encabezado(
                                "FinanCorp S.A. | País: "
                                        + pais
                                        + " | Moneda corporativa: "
                                        + configuracion.getMonedaCorporativa()
                        )
                        .agregarSeccion(
                                "Detalle",
                                informacionFinanciera.generarContenido()
                        )
                        .conclusion(
                                "Reporte generado automáticamente por SERF."
                        )
                        .construir();

        String contenido =
                convertirATexto(
                        reporte,
                        periodo
                );

        // 5. DECORATOR
        ReporteExportable reporteFinal =
                new ReporteBase(contenido);

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

        return reporteFinal.generar();
    }

    // =====================================================
    // CONVERSIÓN DEL REPORTE
    // =====================================================

    private String convertirATexto(
            ReporteFinanciero reporte,
            String periodo
    ) {

        StringBuilder contenido =
                new StringBuilder();

        contenido.append(
                "========================================\n"
        );

        contenido.append(
                "SERF - REPORTE FINANCIERO "
        );

        contenido.append(periodo);

        contenido.append(
                "\n========================================\n\n"
        );

        contenido.append(
                reporte.getEncabezado()
        ).append("\n\n");

        contenido.append(
                "1. INFORMACIÓN FINANCIERA\n"
        );

        contenido.append(
                "----------------------------------------\n"
        );

        for (String seccion : reporte.getSecciones()) {
            contenido.append(seccion)
                    .append("\n");
        }

        contenido.append("\n");

        contenido.append(
                "2. CONCLUSIÓN\n"
        );

        contenido.append(
                "----------------------------------------\n"
        );

        contenido.append(
                reporte.getConclusion()
        ).append("\n");

        return contenido.toString();
    }
}