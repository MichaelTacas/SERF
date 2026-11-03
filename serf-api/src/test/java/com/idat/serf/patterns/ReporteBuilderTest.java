package com.idat.serf.patterns;

import com.idat.serf.patterns.builder.ReporteFinanciero;
import com.idat.serf.patterns.builder.ReporteFinancieroBuilder;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ReporteBuilderTest {

    @Test
    void debeConstruirReportePasoAPaso() {

        ReporteFinanciero reporte =
                new ReporteFinancieroBuilder()
                        .titulo("Reporte Mensual")
                        .encabezado("FinanCorp S.A.")
                        .agregarSeccion(
                                "Ingresos",
                                "8500 EUR"
                        )
                        .agregarSeccion(
                                "Gastos",
                                "5000 EUR"
                        )
                        .conclusion(
                                "Reporte generado correctamente."
                        )
                        .construir();

        assertEquals(
                "Reporte Mensual",
                reporte.getTitulo()
        );

        assertEquals(
                "FinanCorp S.A.",
                reporte.getEncabezado()
        );

        assertEquals(
                2,
                reporte.getSecciones().size()
        );

        assertEquals(
                "Reporte generado correctamente.",
                reporte.getConclusion()
        );
    }
}