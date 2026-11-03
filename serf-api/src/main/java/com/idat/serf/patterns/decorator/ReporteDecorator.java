package com.idat.serf.patterns.decorator;

public abstract class ReporteDecorator
        implements ReporteExportable {

    protected final ReporteExportable reporte;

    protected ReporteDecorator(
            ReporteExportable reporte
    ) {
        this.reporte = reporte;
    }

    @Override
    public String generar() {
        return reporte.generar();
    }
}