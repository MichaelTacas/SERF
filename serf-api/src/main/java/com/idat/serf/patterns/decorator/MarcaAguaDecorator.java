package com.idat.serf.patterns.decorator;

public class MarcaAguaDecorator
        extends ReporteDecorator {

    private final String marcaAgua;

    public MarcaAguaDecorator(
            ReporteExportable reporte,
            String marcaAgua
    ) {
        super(reporte);
        this.marcaAgua = marcaAgua;
    }

    @Override
    public String generar() {

        return super.generar()
                + "\n"
                + "6. SEGURIDAD DOCUMENTAL\n"
                + "--------------------------------------------------------\n"
                + "Marca de agua: "
                + marcaAgua
                + "\n";
    }
}