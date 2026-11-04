package com.idat.serf.patterns.decorator;

import java.util.Objects;

public abstract class ReporteDecorator
        implements ReporteExportable {

    protected final ReporteExportable reporte;

    protected ReporteDecorator(
            ReporteExportable reporte
    ) {

        this.reporte = Objects.requireNonNull(
                reporte,
                "El reporte a decorar no puede ser nulo"
        );
    }

    @Override
    public String generar() {
        return reporte.generar();
    }
}