package com.idat.serf.patterns;

import com.idat.serf.patterns.facade.ReporteFacade;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

class ReporteFacadeTest {

    @Test
    void debeGenerarReporteCompleto() {

        ReporteFacade facade =
                new ReporteFacade();

        String resultado =
                facade.generarReporteMensual(
                        "Perú",
                        "8500",
                        "5000",
                        "Gerencia Financiera"
                );

        assertTrue(
                resultado.contains(
                        "SERF - REPORTE FINANCIERO MENSUAL"
                )
        );

        assertTrue(
                resultado.contains("Perú")
        );

        assertTrue(
                resultado.contains("8500")
        );

        assertTrue(
                resultado.contains("5000")
        );

        assertTrue(
                resultado.contains(
                        "FINANCORP - CONFIDENCIAL"
                )
        );

        assertTrue(
                resultado.contains(
                        "Gerencia Financiera"
                )
        );
    }
}