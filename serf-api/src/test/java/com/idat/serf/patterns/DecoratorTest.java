package com.idat.serf.patterns;

import com.idat.serf.patterns.decorator.FirmaDigitalDecorator;
import com.idat.serf.patterns.decorator.MarcaAguaDecorator;
import com.idat.serf.patterns.decorator.ReporteBase;
import com.idat.serf.patterns.decorator.ReporteExportable;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

class DecoratorTest {

    @Test
    void debeAgregarMarcaAguaYFirmaDigital() {

        ReporteExportable reporte =
                new ReporteBase(
                        "Reporte financiero mensual"
                );

        reporte =
                new MarcaAguaDecorator(
                        reporte,
                        "FINANCORP - CONFIDENCIAL"
                );

        reporte =
                new FirmaDigitalDecorator(
                        reporte,
                        "Gerencia Financiera"
                );

        String resultado =
                reporte.generar();

        assertTrue(
                resultado.contains(
                        "Reporte financiero mensual"
                )
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