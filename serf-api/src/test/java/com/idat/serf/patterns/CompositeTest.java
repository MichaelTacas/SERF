package com.idat.serf.patterns;

import com.idat.serf.patterns.composite.ElementoReporte;
import com.idat.serf.patterns.composite.SeccionReporte;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

class CompositeTest {

    @Test
    void debeConstruirEstructuraJerarquica() {

        SeccionReporte reporte =
                new SeccionReporte("Reporte Financiero");

        SeccionReporte ingresos =
                new SeccionReporte("Ingresos");

        ingresos.agregar(
                new ElementoReporte(
                        "Perú",
                        "8500 EUR"
                )
        );

        ingresos.agregar(
                new ElementoReporte(
                        "España",
                        "12000 EUR"
                )
        );

        reporte.agregar(ingresos);

        String contenido =
                reporte.generarContenido();

        assertTrue(
                contenido.contains("Reporte Financiero")
        );

        assertTrue(
                contenido.contains("Ingresos")
        );

        assertTrue(
                contenido.contains("Perú")
        );

        assertTrue(
                contenido.contains("8500 EUR")
        );

        assertTrue(
                contenido.contains("España")
        );
    }
}