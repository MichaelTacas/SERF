package com.idat.serf.patterns.decorator;

public class FirmaDigitalDecorator
        extends ReporteDecorator {

    private final String responsable;

    public FirmaDigitalDecorator(
            ReporteExportable reporte,
            String responsable
    ) {
        super(reporte);
        this.responsable = responsable;
    }

    @Override
    public String generar() {

        return super.generar()
                + "Firma digital: "
                + responsable
                + "\n"
                + "========================================================\n"
                + "          Generado automáticamente por SERF\n"
                + "========================================================";
    }
}