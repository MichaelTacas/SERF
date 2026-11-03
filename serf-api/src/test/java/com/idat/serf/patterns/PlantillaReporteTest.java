package com.idat.serf.patterns;

import com.idat.serf.model.TipoReporte;
import com.idat.serf.patterns.prototype.PlantillaReporte;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PlantillaReporteTest {

    @Test
    void debeClonarPlantillaDeFormaIndependiente() {

        PlantillaReporte original =
                new PlantillaReporte(
                        "Reporte Financiero",
                        "Corporativo",
                        TipoReporte.FINANCIERO
                );

        original.agregarSeccionBase("Ingresos");
        original.agregarSeccionBase("Gastos");

        PlantillaReporte copia = original.clonar();

        copia.setPais("Perú");
        copia.agregarSeccionBase("Inventario");

        assertNotSame(original, copia);

        assertEquals(
                "Corporativo",
                original.getPais()
        );

        assertEquals(
                "Perú",
                copia.getPais()
        );

        assertEquals(
                2,
                original.getSeccionesBase().size()
        );

        assertEquals(
                3,
                copia.getSeccionesBase().size()
        );
    }
}